import { Hono } from 'hono';
import { callGemini, calculateDailyTarget } from '../utils/gemini';

type Bindings = {
  DB: D1Database;
  GEMINI_API_KEY: string;
};

const api = new Hono<{ Bindings: Bindings }>();

// Helper to generate UUID
const generateId = () => crypto.randomUUID();

// ============================================
// User & Auth Routes
// ============================================

// Signup - Create new account
api.post('/auth/signup', async (c) => {
  const { name, email, password } = await c.req.json();
  
  // Check if email already exists
  const existingUser = await c.env.DB.prepare(
    'SELECT id FROM users WHERE email = ?'
  ).bind(email).first();
  
  if (existingUser) {
    return c.json({ error: 'このメールアドレスは既に登録されています' }, 400);
  }
  
  // Create new user
  const userId = generateId();
  await c.env.DB.prepare(
    'INSERT INTO users (id, email, name, ai_credits) VALUES (?, ?, ?, ?)'
  ).bind(userId, email, name, 10000).run();
  
  const user = await c.env.DB.prepare(
    'SELECT * FROM users WHERE id = ?'
  ).bind(userId).first();
  
  // Create session
  const sessionId = generateId();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  await c.env.DB.prepare(
    'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)'
  ).bind(sessionId, user!.id, expiresAt).run();
  
  return c.json({ user, sessionId });
});

// Login - Existing user login
api.post('/auth/login', async (c) => {
  const { email, password } = await c.req.json();
  
  // Check if user exists
  let user = await c.env.DB.prepare(
    'SELECT * FROM users WHERE email = ?'
  ).bind(email).first();
  
  if (!user) {
    return c.json({ error: 'メールアドレスまたはパスワードが正しくありません' }, 401);
  }
  
  // Create session
  const sessionId = generateId();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  await c.env.DB.prepare(
    'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)'
  ).bind(sessionId, user!.id, expiresAt).run();
  
  return c.json({ user, sessionId });
});

api.post('/auth/logout', async (c) => {
  const { sessionId } = await c.req.json();
  await c.env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionId).run();
  return c.json({ success: true });
});

api.get('/auth/me', async (c) => {
  const sessionId = c.req.header('X-Session-Id');
  if (!sessionId) return c.json({ user: null }, 401);
  
  const session = await c.env.DB.prepare(
    'SELECT * FROM sessions WHERE id = ? AND expires_at > datetime("now")'
  ).bind(sessionId).first();
  
  if (!session) return c.json({ user: null }, 401);
  
  const user = await c.env.DB.prepare(
    'SELECT * FROM users WHERE id = ?'
  ).bind(session.user_id).first();
  
  return c.json({ user });
});

api.put('/users/:id', async (c) => {
  const id = c.req.param('id');
  const updates = await c.req.json();
  
  const fields = [];
  const values = [];
  
  if (updates.name !== undefined) { fields.push('name = ?'); values.push(updates.name); }
  if (updates.language !== undefined) { fields.push('language = ?'); values.push(updates.language); }
  if (updates.theme !== undefined) { fields.push('theme = ?'); values.push(updates.theme); }
  if (updates.avatar_url !== undefined) { fields.push('avatar_url = ?'); values.push(updates.avatar_url); }
  
  if (fields.length > 0) {
    fields.push('updated_at = datetime("now")');
    values.push(id);
    await c.env.DB.prepare(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`
    ).bind(...values).run();
  }
  
  const user = await c.env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(id).first();
  return c.json({ user });
});

api.delete('/users/:id', async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM users WHERE id = ?').bind(id).run();
  return c.json({ success: true });
});

// ============================================
// Project Routes
// ============================================

api.get('/projects', async (c) => {
  const userId = c.req.query('userId');
  const includeDeleted = c.req.query('includeDeleted') === 'true';
  
  let query = 'SELECT * FROM projects WHERE user_id = ?';
  if (!includeDeleted) {
    query += ' AND deleted_at IS NULL';
  }
  query += ' ORDER BY updated_at DESC';
  
  const projects = await c.env.DB.prepare(query).bind(userId).all();
  return c.json({ projects: projects.results });
});

api.post('/projects', async (c) => {
  const data = await c.req.json();
  const id = generateId();
  
  await c.env.DB.prepare(
    `INSERT INTO projects (id, user_id, title, description, genre, folder_id, target_word_count)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).bind(id, data.user_id, data.title, data.description || null, data.genre || null, data.folder_id || null, data.target_word_count || 0).run();
  
  // Create default writing
  await c.env.DB.prepare(
    'INSERT INTO writings (id, project_id, chapter_number, chapter_title) VALUES (?, ?, 1, ?)'
  ).bind(generateId(), id, '第一章').run();
  
  // Create default plot
  await c.env.DB.prepare(
    'INSERT INTO plots (id, project_id, template, structure) VALUES (?, ?, ?, ?)'
  ).bind(generateId(), id, 'kishotenketsu', '{}').run();
  
  const project = await c.env.DB.prepare('SELECT * FROM projects WHERE id = ?').bind(id).first();
  return c.json({ project });
});

api.get('/projects/:id', async (c) => {
  const id = c.req.param('id');
  const project = await c.env.DB.prepare('SELECT * FROM projects WHERE id = ?').bind(id).first();
  return c.json({ project });
});

api.put('/projects/:id', async (c) => {
  const id = c.req.param('id');
  const updates = await c.req.json();
  
  const fields = [];
  const values = [];
  
  if (updates.title !== undefined) { fields.push('title = ?'); values.push(updates.title); }
  if (updates.description !== undefined) { fields.push('description = ?'); values.push(updates.description); }
  if (updates.genre !== undefined) { fields.push('genre = ?'); values.push(updates.genre); }
  if (updates.deadline !== undefined) { fields.push('deadline = ?'); values.push(updates.deadline); }
  if (updates.target_word_count !== undefined) { fields.push('target_word_count = ?'); values.push(updates.target_word_count); }
  if (updates.folder_id !== undefined) { fields.push('folder_id = ?'); values.push(updates.folder_id); }
  if (updates.pinned_plot !== undefined) { fields.push('pinned_plot = ?'); values.push(updates.pinned_plot); }
  
  if (fields.length > 0) {
    fields.push('updated_at = datetime("now")');
    values.push(id);
    await c.env.DB.prepare(
      `UPDATE projects SET ${fields.join(', ')} WHERE id = ?`
    ).bind(...values).run();
  }
  
  const project = await c.env.DB.prepare('SELECT * FROM projects WHERE id = ?').bind(id).first();
  return c.json({ project });
});

// Soft delete (to trash)
api.delete('/projects/:id', async (c) => {
  const id = c.req.param('id');
  const permanent = c.req.query('permanent') === 'true';
  
  if (permanent) {
    await c.env.DB.prepare('DELETE FROM projects WHERE id = ?').bind(id).run();
  } else {
    await c.env.DB.prepare(
      'UPDATE projects SET deleted_at = datetime("now") WHERE id = ?'
    ).bind(id).run();
  }
  
  return c.json({ success: true });
});

// Restore from trash
api.post('/projects/:id/restore', async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare(
    'UPDATE projects SET deleted_at = NULL WHERE id = ?'
  ).bind(id).run();
  return c.json({ success: true });
});

// Get trash (deleted within 30 days)
api.get('/trash', async (c) => {
  const userId = c.req.query('userId');
  const projects = await c.env.DB.prepare(
    `SELECT * FROM projects 
     WHERE user_id = ? AND deleted_at IS NOT NULL 
     AND deleted_at > datetime("now", "-30 days")
     ORDER BY deleted_at DESC`
  ).bind(userId).all();
  return c.json({ projects: projects.results });
});

// ============================================
// Folder Routes
// ============================================

api.get('/folders', async (c) => {
  const userId = c.req.query('userId');
  const folders = await c.env.DB.prepare(
    'SELECT * FROM folders WHERE user_id = ? ORDER BY name'
  ).bind(userId).all();
  return c.json({ folders: folders.results });
});

api.post('/folders', async (c) => {
  const data = await c.req.json();
  const id = generateId();
  
  await c.env.DB.prepare(
    'INSERT INTO folders (id, user_id, name, parent_id) VALUES (?, ?, ?, ?)'
  ).bind(id, data.user_id, data.name, data.parent_id || null).run();
  
  const folder = await c.env.DB.prepare('SELECT * FROM folders WHERE id = ?').bind(id).first();
  return c.json({ folder });
});

api.delete('/folders/:id', async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM folders WHERE id = ?').bind(id).run();
  return c.json({ success: true });
});

// ============================================
// Writing Routes
// ============================================

api.get('/projects/:projectId/writings', async (c) => {
  const projectId = c.req.param('projectId');
  const writings = await c.env.DB.prepare(
    'SELECT * FROM writings WHERE project_id = ? ORDER BY chapter_number'
  ).bind(projectId).all();
  return c.json({ writings: writings.results });
});

api.put('/writings/:id', async (c) => {
  const id = c.req.param('id');
  const updates = await c.req.json();
  
  // Calculate word count
  const wordCount = updates.content ? updates.content.length : 0;
  
  await c.env.DB.prepare(
    `UPDATE writings SET 
     content = ?, chapter_title = ?, word_count = ?,
     writing_direction = ?, font_family = ?, updated_at = datetime("now")
     WHERE id = ?`
  ).bind(
    updates.content || '',
    updates.chapter_title || '',
    wordCount,
    updates.writing_direction || 'horizontal',
    updates.font_family || 'Noto Sans JP',
    id
  ).run();
  
  const writing = await c.env.DB.prepare('SELECT * FROM writings WHERE id = ?').bind(id).first();
  return c.json({ writing });
});

api.post('/projects/:projectId/writings', async (c) => {
  const projectId = c.req.param('projectId');
  const data = await c.req.json();
  const id = generateId();
  
  await c.env.DB.prepare(
    'INSERT INTO writings (id, project_id, chapter_number, chapter_title) VALUES (?, ?, ?, ?)'
  ).bind(id, projectId, data.chapter_number, data.chapter_title || '').run();
  
  const writing = await c.env.DB.prepare('SELECT * FROM writings WHERE id = ?').bind(id).first();
  return c.json({ writing });
});

// ============================================
// Plot Routes
// ============================================

api.get('/projects/:projectId/plot', async (c) => {
  const projectId = c.req.param('projectId');
  const plot = await c.env.DB.prepare(
    'SELECT * FROM plots WHERE project_id = ?'
  ).bind(projectId).first();
  return c.json({ plot });
});

api.put('/plots/:id', async (c) => {
  const id = c.req.param('id');
  const updates = await c.req.json();
  
  await c.env.DB.prepare(
    `UPDATE plots SET template = ?, structure = ?, updated_at = datetime("now") WHERE id = ?`
  ).bind(updates.template || 'kishotenketsu', updates.structure || '{}', id).run();
  
  const plot = await c.env.DB.prepare('SELECT * FROM plots WHERE id = ?').bind(id).first();
  return c.json({ plot });
});

// ============================================
// Ideas Routes
// ============================================

api.get('/projects/:projectId/ideas', async (c) => {
  const projectId = c.req.param('projectId');
  const ideas = await c.env.DB.prepare(
    'SELECT * FROM ideas WHERE project_id = ? ORDER BY created_at DESC'
  ).bind(projectId).all();
  return c.json({ ideas: ideas.results });
});

api.post('/projects/:projectId/ideas', async (c) => {
  const projectId = c.req.param('projectId');
  const data = await c.req.json();
  const id = generateId();
  
  await c.env.DB.prepare(
    'INSERT INTO ideas (id, project_id, title, content, genre) VALUES (?, ?, ?, ?, ?)'
  ).bind(id, projectId, data.title, data.content || '', data.genre || '').run();
  
  const idea = await c.env.DB.prepare('SELECT * FROM ideas WHERE id = ?').bind(id).first();
  return c.json({ idea });
});

api.put('/ideas/:id/adopt', async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('UPDATE ideas SET adopted = 1 WHERE id = ?').bind(id).run();
  return c.json({ success: true });
});

// ============================================
// Characters Routes
// ============================================

api.get('/projects/:projectId/characters', async (c) => {
  const projectId = c.req.param('projectId');
  const characters = await c.env.DB.prepare(
    'SELECT * FROM characters WHERE project_id = ?'
  ).bind(projectId).all();
  return c.json({ characters: characters.results });
});

api.post('/projects/:projectId/characters', async (c) => {
  const projectId = c.req.param('projectId');
  const data = await c.req.json();
  const id = generateId();
  
  await c.env.DB.prepare(
    'INSERT INTO characters (id, project_id, name, description, voice_settings) VALUES (?, ?, ?, ?, ?)'
  ).bind(id, projectId, data.name, data.description || '', data.voice_settings || '').run();
  
  const character = await c.env.DB.prepare('SELECT * FROM characters WHERE id = ?').bind(id).first();
  return c.json({ character });
});

api.put('/characters/:id', async (c) => {
  const id = c.req.param('id');
  const updates = await c.req.json();
  
  await c.env.DB.prepare(
    'UPDATE characters SET name = ?, description = ?, voice_settings = ? WHERE id = ?'
  ).bind(updates.name, updates.description || '', updates.voice_settings || '', id).run();
  
  const character = await c.env.DB.prepare('SELECT * FROM characters WHERE id = ?').bind(id).first();
  return c.json({ character });
});

api.delete('/characters/:id', async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM characters WHERE id = ?').bind(id).run();
  return c.json({ success: true });
});

// ============================================
// World Settings Routes
// ============================================

api.get('/projects/:projectId/world-settings', async (c) => {
  const projectId = c.req.param('projectId');
  const settings = await c.env.DB.prepare(
    'SELECT * FROM world_settings WHERE project_id = ?'
  ).bind(projectId).all();
  return c.json({ settings: settings.results });
});

api.post('/projects/:projectId/world-settings', async (c) => {
  const projectId = c.req.param('projectId');
  const data = await c.req.json();
  const id = generateId();
  
  await c.env.DB.prepare(
    'INSERT INTO world_settings (id, project_id, category, title, content) VALUES (?, ?, ?, ?, ?)'
  ).bind(id, projectId, data.category, data.title, data.content || '').run();
  
  const setting = await c.env.DB.prepare('SELECT * FROM world_settings WHERE id = ?').bind(id).first();
  return c.json({ setting });
});

// ============================================
// Chat History Routes
// ============================================

api.get('/projects/:projectId/chat', async (c) => {
  const projectId = c.req.param('projectId');
  const threadId = c.req.query('threadId');
  
  let query = 'SELECT * FROM chat_history WHERE project_id = ?';
  const params = [projectId];
  
  if (threadId) {
    query += ' AND thread_id = ?';
    params.push(threadId);
  }
  query += ' ORDER BY created_at ASC';
  
  const messages = await c.env.DB.prepare(query).bind(...params).all();
  return c.json({ messages: messages.results });
});

api.get('/projects/:projectId/chat/threads', async (c) => {
  const projectId = c.req.param('projectId');
  const threads = await c.env.DB.prepare(
    `SELECT DISTINCT thread_id, tab_context, MIN(created_at) as started_at,
     (SELECT content FROM chat_history h2 WHERE h2.thread_id = h1.thread_id ORDER BY created_at LIMIT 1) as first_message
     FROM chat_history h1 WHERE project_id = ? GROUP BY thread_id ORDER BY started_at DESC`
  ).bind(projectId).all();
  return c.json({ threads: threads.results });
});

api.post('/projects/:projectId/chat', async (c) => {
  const projectId = c.req.param('projectId');
  const data = await c.req.json();
  const id = generateId();
  
  await c.env.DB.prepare(
    'INSERT INTO chat_history (id, project_id, thread_id, role, content, tab_context) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(id, projectId, data.thread_id, data.role, data.content, data.tab_context || null).run();
  
  const message = await c.env.DB.prepare('SELECT * FROM chat_history WHERE id = ?').bind(id).first();
  return c.json({ message });
});

// ============================================
// Calendar Routes
// ============================================

api.get('/calendar', async (c) => {
  const userId = c.req.query('userId');
  const year = c.req.query('year');
  const month = c.req.query('month');
  
  let query = 'SELECT * FROM calendar_events WHERE user_id = ?';
  const params: any[] = [userId];
  
  if (year && month) {
    query += ` AND strftime('%Y', event_date) = ? AND strftime('%m', event_date) = ?`;
    params.push(year, month.padStart(2, '0'));
  }
  
  const events = await c.env.DB.prepare(query).bind(...params).all();
  return c.json({ events: events.results });
});

api.post('/calendar', async (c) => {
  const data = await c.req.json();
  const id = generateId();
  
  await c.env.DB.prepare(
    `INSERT INTO calendar_events (id, user_id, project_id, event_date, title, description, is_deadline)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).bind(id, data.user_id, data.project_id || null, data.event_date, data.title, data.description || '', data.is_deadline ? 1 : 0).run();
  
  const event = await c.env.DB.prepare('SELECT * FROM calendar_events WHERE id = ?').bind(id).first();
  return c.json({ event });
});

api.delete('/calendar/:id', async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM calendar_events WHERE id = ?').bind(id).run();
  return c.json({ success: true });
});

// ============================================
// Search Routes
// ============================================

api.get('/search', async (c) => {
  const userId = c.req.query('userId');
  const query = c.req.query('q');
  
  if (!query || query.length < 2) {
    return c.json({ results: [] });
  }
  
  const searchTerm = `%${query}%`;
  
  // Search across multiple tables
  const [projects, writings, ideas, plots] = await Promise.all([
    c.env.DB.prepare(
      `SELECT id, 'project' as type, title, description as content FROM projects 
       WHERE user_id = ? AND deleted_at IS NULL AND (title LIKE ? OR description LIKE ?)`
    ).bind(userId, searchTerm, searchTerm).all(),
    
    c.env.DB.prepare(
      `SELECT w.id, 'writing' as type, w.chapter_title as title, w.content, p.title as project_title
       FROM writings w JOIN projects p ON w.project_id = p.id
       WHERE p.user_id = ? AND p.deleted_at IS NULL AND (w.content LIKE ? OR w.chapter_title LIKE ?)`
    ).bind(userId, searchTerm, searchTerm).all(),
    
    c.env.DB.prepare(
      `SELECT i.id, 'idea' as type, i.title, i.content, p.title as project_title
       FROM ideas i JOIN projects p ON i.project_id = p.id
       WHERE p.user_id = ? AND p.deleted_at IS NULL AND (i.title LIKE ? OR i.content LIKE ?)`
    ).bind(userId, searchTerm, searchTerm).all(),
    
    c.env.DB.prepare(
      `SELECT pl.id, 'plot' as type, 'プロット' as title, pl.structure as content, p.title as project_title
       FROM plots pl JOIN projects p ON pl.project_id = p.id
       WHERE p.user_id = ? AND p.deleted_at IS NULL AND pl.structure LIKE ?`
    ).bind(userId, searchTerm).all(),
  ]);
  
  const results = [
    ...projects.results,
    ...writings.results,
    ...ideas.results,
    ...plots.results,
  ];
  
  return c.json({ results });
});

// ============================================
// Achievements Routes
// ============================================

api.get('/users/:userId/achievements', async (c) => {
  const userId = c.req.param('userId');
  const achievements = await c.env.DB.prepare(
    'SELECT * FROM achievements WHERE user_id = ? ORDER BY earned_at DESC'
  ).bind(userId).all();
  return c.json({ achievements: achievements.results });
});

api.post('/users/:userId/achievements', async (c) => {
  const userId = c.req.param('userId');
  const data = await c.req.json();
  const id = generateId();
  
  await c.env.DB.prepare(
    'INSERT INTO achievements (id, user_id, badge_type, badge_title, badge_description) VALUES (?, ?, ?, ?, ?)'
  ).bind(id, userId, data.badge_type, data.badge_title, data.badge_description || '').run();
  
  const achievement = await c.env.DB.prepare('SELECT * FROM achievements WHERE id = ?').bind(id).first();
  return c.json({ achievement });
});

// ============================================
// AI Routes
// ============================================

api.post('/ai/generate', async (c) => {
  const data = await c.req.json();
  
  try {
    // Get full context for Unified Context
    const projectId = data.projectId;
    let context: any = {};
    
    if (projectId) {
      const [plot, characters, worldSettings, chatHistory, calendarEvents] = await Promise.all([
        c.env.DB.prepare('SELECT structure FROM plots WHERE project_id = ?').bind(projectId).first(),
        c.env.DB.prepare('SELECT name, description FROM characters WHERE project_id = ?').bind(projectId).all(),
        c.env.DB.prepare('SELECT category, title, content FROM world_settings WHERE project_id = ?').bind(projectId).all(),
        c.env.DB.prepare('SELECT role, content FROM chat_history WHERE project_id = ? ORDER BY created_at DESC LIMIT 20').bind(projectId).all(),
        c.env.DB.prepare('SELECT event_date as date, title, is_deadline FROM calendar_events WHERE project_id = ? OR (user_id = (SELECT user_id FROM projects WHERE id = ?) AND event_date >= date("now"))').bind(projectId, projectId).all(),
      ]);
      
      context = {
        plot: plot?.structure,
        characters: characters.results,
        worldSettings: worldSettings.results,
        chatHistory: chatHistory.results.reverse(),
        calendarEvents: calendarEvents.results,
        currentWriting: data.currentWriting,
      };
    }
    
    const result = await callGemini(c.env.GEMINI_API_KEY, {
      action: data.action,
      content: data.content,
      context,
      options: data.options,
    });
    
    // Deduct AI credits
    if (data.userId) {
      await c.env.DB.prepare(
        'UPDATE users SET ai_credits = ai_credits - 1 WHERE id = ? AND ai_credits > 0'
      ).bind(data.userId).run();
    }
    
    return c.json({ result });
  } catch (error: any) {
    console.error('AI Generation Error:', error);
    return c.json({ error: error.message }, 500);
  }
});

api.post('/ai/analyze', async (c) => {
  const data = await c.req.json();
  
  try {
    const result = await callGemini(c.env.GEMINI_API_KEY, {
      action: 'analyze',
      content: data.content,
    });
    
    // Try to parse JSON from response
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const analysis = JSON.parse(jsonMatch[0]);
      return c.json({ analysis });
    }
    
    return c.json({ error: 'Failed to parse analysis' }, 500);
  } catch (error: any) {
    console.error('Analysis Error:', error);
    return c.json({ error: error.message }, 500);
  }
});

api.post('/ai/generate-ideas', async (c) => {
  const data = await c.req.json();
  
  try {
    const result = await callGemini(c.env.GEMINI_API_KEY, {
      action: 'generate_ideas',
      content: data.keywords || '',
      options: {
        genre: data.genre,
        count: data.count || 5,
      },
    });
    
    // Try to parse JSON array from response
    const jsonMatch = result.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const ideas = JSON.parse(jsonMatch[0]);
      return c.json({ ideas });
    }
    
    return c.json({ error: 'Failed to parse ideas' }, 500);
  } catch (error: any) {
    console.error('Idea Generation Error:', error);
    return c.json({ error: error.message }, 500);
  }
});

api.post('/ai/deadline-advice', async (c) => {
  const data = await c.req.json();
  
  const { daysLeft, dailyTarget } = calculateDailyTarget(
    data.currentWordCount,
    data.targetWordCount,
    data.deadline
  );
  
  let advice = '';
  if (daysLeft <= 0) {
    advice = '締め切りを過ぎています。スケジュールの見直しをお勧めします。';
  } else if (dailyTarget <= 500) {
    advice = `余裕があります！1日${dailyTarget}文字ペースで大丈夫です。`;
  } else if (dailyTarget <= 2000) {
    advice = `順調なペースです。1日${dailyTarget}文字を目指しましょう。`;
  } else {
    advice = `少しペースアップが必要です。1日${dailyTarget}文字が目標です。集中して取り組みましょう！`;
  }
  
  return c.json({ daysLeft, dailyTarget, advice });
});

api.post('/ai/generate-achievements', async (c) => {
  const data = await c.req.json();
  
  try {
    const result = await callGemini(c.env.GEMINI_API_KEY, {
      action: 'achievement',
      content: JSON.stringify(data.writingStats),
    });
    
    const jsonMatch = result.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const achievements = JSON.parse(jsonMatch[0]);
      return c.json({ achievements });
    }
    
    return c.json({ error: 'Failed to parse achievements' }, 500);
  } catch (error: any) {
    console.error('Achievement Generation Error:', error);
    return c.json({ error: error.message }, 500);
  }
});

export default api;
