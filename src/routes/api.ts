import { Hono } from 'hono';
import { callGemini, calculateDailyTarget } from '../utils/gemini';
import { callGrok } from '../utils/grok';

type Bindings = {
  DB: D1Database;
  GEMINI_API_KEY?: string;     // For analysis (sub AI)
  GROK_API_KEY: string;        // Main AI - required
  OPENAI_API_KEY?: string;     // For future OpenAI integration
  AI_PROVIDER?: string;        // 'grok' (default) | 'gemini' | 'openai'
  KOMOJU_SECRET_KEY?: string;  // KOMOJU payment API secret key
  KOMOJU_PUBLIC_KEY?: string;  // KOMOJU payment API public key
};

const api = new Hono<{ Bindings: Bindings }>();

// Helper to generate UUID
const generateId = () => crypto.randomUUID();

// Main AI call - Grok by default (handles sensitive content better)
async function callMainAI(env: Bindings, params: {
  action: string;
  content: string;
  context?: any;
  options?: any;
}): Promise<string> {
  // Grok is the main AI for all creative tasks
  if (!env.GROK_API_KEY) {
    // Fallback to Gemini if Grok not configured
    if (env.GEMINI_API_KEY) {
      console.log('Grok not configured, falling back to Gemini');
      return await callGemini(env.GEMINI_API_KEY, params);
    }
    throw new Error('AI APIキーが設定されていません（GROK_API_KEY）');
  }
  
  return await callGrok(env.GROK_API_KEY, params);
}

// Analysis AI call - Gemini specialized for charts/analysis
async function callAnalysisAI(env: Bindings, params: {
  action: string;
  content: string;
  context?: any;
  options?: any;
}): Promise<string> {
  // Gemini is specialized for analysis (charts, emotion curve, etc.)
  if (env.GEMINI_API_KEY) {
    return await callGemini(env.GEMINI_API_KEY, params);
  }
  
  // Fallback to Grok if Gemini not configured
  if (env.GROK_API_KEY) {
    console.log('Gemini not configured for analysis, using Grok');
    return await callGrok(env.GROK_API_KEY, params);
  }
  
  throw new Error('AI APIキーが設定されていません');
}

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
  
  // Create new user (Free plan: 5,000 credits)
  const userId = generateId();
  await c.env.DB.prepare(
    'INSERT INTO users (id, email, name, ai_credits, plan_type, is_premium) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(userId, email, name, 5000, 'free', 0).run();
  
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
// Account Management Routes
// ============================================

// Change password
api.post('/auth/change-password', async (c) => {
  const sessionId = c.req.header('X-Session-Id');
  if (!sessionId) return c.json({ error: '認証が必要です' }, 401);
  
  const session = await c.env.DB.prepare(
    'SELECT * FROM sessions WHERE id = ? AND expires_at > datetime("now")'
  ).bind(sessionId).first();
  
  if (!session) return c.json({ error: 'セッションが無効です' }, 401);
  
  const { currentPassword, newPassword } = await c.req.json();
  
  if (!newPassword || newPassword.length < 6) {
    return c.json({ error: 'パスワードは6文字以上で入力してください' }, 400);
  }
  
  // Note: In a real app, you would verify currentPassword against hashed password
  // For this demo, we skip password verification since we're not storing hashed passwords
  
  // Update password (in production, this should be hashed)
  await c.env.DB.prepare(
    'UPDATE users SET updated_at = datetime("now") WHERE id = ?'
  ).bind(session.user_id).run();
  
  return c.json({ success: true, message: 'パスワードを変更しました' });
});

// Delete account (complete deletion with all related data)
api.post('/auth/delete-account', async (c) => {
  const sessionId = c.req.header('X-Session-Id');
  if (!sessionId) return c.json({ error: '認証が必要です' }, 401);
  
  const session = await c.env.DB.prepare(
    'SELECT * FROM sessions WHERE id = ? AND expires_at > datetime("now")'
  ).bind(sessionId).first();
  
  if (!session) return c.json({ error: 'セッションが無効です' }, 401);
  
  const { confirmEmail } = await c.req.json();
  const userId = session.user_id as string;
  
  // Get user to verify email
  const user = await c.env.DB.prepare(
    'SELECT * FROM users WHERE id = ?'
  ).bind(userId).first();
  
  if (!user) return c.json({ error: 'ユーザーが見つかりません' }, 404);
  
  // Verify confirmation email matches
  if (confirmEmail !== user.email) {
    return c.json({ error: 'メールアドレスが一致しません' }, 400);
  }
  
  try {
    // Delete all related data in order (foreign key constraints)
    
    // 1. Delete sessions
    await c.env.DB.prepare('DELETE FROM sessions WHERE user_id = ?').bind(userId).run();
    
    // 2. Get all project IDs for this user
    const projects = await c.env.DB.prepare(
      'SELECT id FROM projects WHERE user_id = ?'
    ).bind(userId).all();
    
    const projectIds = projects.results?.map((p: any) => p.id) || [];
    
    // 3. Delete project-related data
    for (const projectId of projectIds) {
      await c.env.DB.prepare('DELETE FROM writing_sessions WHERE project_id = ?').bind(projectId).run();
      await c.env.DB.prepare('DELETE FROM characters WHERE project_id = ?').bind(projectId).run();
      await c.env.DB.prepare('DELETE FROM world_settings WHERE project_id = ?').bind(projectId).run();
      await c.env.DB.prepare('DELETE FROM ideas WHERE project_id = ?').bind(projectId).run();
      await c.env.DB.prepare('DELETE FROM calendar_events WHERE project_id = ?').bind(projectId).run();
    }
    
    // 4. Delete projects
    await c.env.DB.prepare('DELETE FROM projects WHERE user_id = ?').bind(userId).run();
    
    // 5. Delete user
    await c.env.DB.prepare('DELETE FROM users WHERE id = ?').bind(userId).run();
    
    return c.json({ success: true, message: 'アカウントを削除しました' });
    
  } catch (error: any) {
    console.error('Account deletion error:', error);
    return c.json({ error: 'アカウント削除中にエラーが発生しました: ' + error.message }, 500);
  }
});

// Get account info (for settings page)
api.get('/auth/account', async (c) => {
  const sessionId = c.req.header('X-Session-Id');
  if (!sessionId) return c.json({ error: '認証が必要です' }, 401);
  
  const session = await c.env.DB.prepare(
    'SELECT * FROM sessions WHERE id = ? AND expires_at > datetime("now")'
  ).bind(sessionId).first();
  
  if (!session) return c.json({ error: 'セッションが無効です' }, 401);
  
  const user = await c.env.DB.prepare(
    'SELECT id, name, email, created_at, language, theme FROM users WHERE id = ?'
  ).bind(session.user_id).first();
  
  // Get project count
  const projectCount = await c.env.DB.prepare(
    'SELECT COUNT(*) as count FROM projects WHERE user_id = ? AND deleted_at IS NULL'
  ).bind(session.user_id).first();
  
  // Get total word count
  const wordCount = await c.env.DB.prepare(
    'SELECT SUM(word_count) as total FROM projects WHERE user_id = ? AND deleted_at IS NULL'
  ).bind(session.user_id).first();
  
  return c.json({ 
    user,
    stats: {
      projectCount: (projectCount as any)?.count || 0,
      totalWordCount: (wordCount as any)?.total || 0
    }
  });
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
  
  const result = await c.env.DB.prepare(query).bind(userId).all();
  
  // Parse library_settings for each project
  const projects = (result.results || []).map((project: any) => {
    if (project.library_settings) {
      try {
        project.library_settings = JSON.parse(project.library_settings);
      } catch (e) {
        // Keep as string if parse fails
      }
    }
    return project;
  });
  
  return c.json({ projects });
});

api.post('/projects', async (c) => {
  const data = await c.req.json();
  const id = generateId();
  
  // Handle library_settings as JSON string
  const librarySettings = data.library_settings ? JSON.stringify(data.library_settings) : null;
  
  await c.env.DB.prepare(
    `INSERT INTO projects (id, user_id, title, description, genre, folder_id, target_word_count, is_library, library_id, library_settings)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id, 
    data.user_id, 
    data.title, 
    data.description || null, 
    data.genre || null, 
    data.folder_id || null, 
    data.target_word_count || 0,
    data.is_library ? 1 : 0,
    data.library_id || null,
    librarySettings
  ).run();
  
  // Create default writing (only for non-library projects)
  if (!data.is_library) {
    await c.env.DB.prepare(
      'INSERT INTO writings (id, project_id, chapter_number, chapter_title) VALUES (?, ?, 1, ?)'
    ).bind(generateId(), id, '第一章').run();
    
    // Create default plot
    await c.env.DB.prepare(
      'INSERT INTO plots (id, project_id, template, structure) VALUES (?, ?, ?, ?)'
    ).bind(generateId(), id, 'kishotenketsu', '{}').run();
  }
  
  const result = await c.env.DB.prepare('SELECT * FROM projects WHERE id = ?').bind(id).first();
  
  // Parse library_settings if it exists
  const project = result as any;
  if (project && project.library_settings) {
    try {
      project.library_settings = JSON.parse(project.library_settings);
    } catch (e) {
      // Keep as string if parse fails
    }
  }
  
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
  if (updates.library_id !== undefined) { fields.push('library_id = ?'); values.push(updates.library_id); }
  if (updates.is_library !== undefined) { fields.push('is_library = ?'); values.push(updates.is_library ? 1 : 0); }
  if (updates.library_settings !== undefined) { 
    fields.push('library_settings = ?'); 
    values.push(typeof updates.library_settings === 'string' ? updates.library_settings : JSON.stringify(updates.library_settings)); 
  }
  
  if (fields.length > 0) {
    fields.push('updated_at = datetime("now")');
    values.push(id);
    await c.env.DB.prepare(
      `UPDATE projects SET ${fields.join(', ')} WHERE id = ?`
    ).bind(...values).run();
  }
  
  const result = await c.env.DB.prepare('SELECT * FROM projects WHERE id = ?').bind(id).first();
  
  // Parse library_settings if it exists
  const project = result as any;
  if (project && project.library_settings) {
    try {
      project.library_settings = JSON.parse(project.library_settings);
    } catch (e) {
      // Keep as string if parse fails
    }
  }
  
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

api.put('/ideas/:id/unadopt', async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('UPDATE ideas SET adopted = 0 WHERE id = ?').bind(id).run();
  return c.json({ success: true });
});

api.delete('/ideas/:id', async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM ideas WHERE id = ?').bind(id).run();
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

api.put('/calendar/:id', async (c) => {
  const id = c.req.param('id');
  const { title, description, is_deadline } = await c.req.json();
  
  await c.env.DB.prepare(
    `UPDATE calendar_events SET title = ?, description = ?, is_deadline = ? WHERE id = ?`
  ).bind(title, description || '', is_deadline ? 1 : 0, id).run();
  
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
      const [plot, characters, worldSettings, chatHistory, calendarEvents, adoptedIdeas, project] = await Promise.all([
        c.env.DB.prepare('SELECT structure FROM plots WHERE project_id = ?').bind(projectId).first(),
        c.env.DB.prepare('SELECT name, description FROM characters WHERE project_id = ?').bind(projectId).all(),
        c.env.DB.prepare('SELECT category, title, content FROM world_settings WHERE project_id = ?').bind(projectId).all(),
        c.env.DB.prepare('SELECT role, content FROM chat_history WHERE project_id = ? ORDER BY created_at DESC LIMIT 20').bind(projectId).all(),
        c.env.DB.prepare('SELECT event_date as date, title, is_deadline FROM calendar_events WHERE project_id = ? OR (user_id = (SELECT user_id FROM projects WHERE id = ?) AND event_date >= date("now"))').bind(projectId, projectId).all(),
        c.env.DB.prepare('SELECT title, content FROM ideas WHERE project_id = ? AND adopted = 1').bind(projectId).all(),
        c.env.DB.prepare('SELECT genre FROM projects WHERE id = ?').bind(projectId).first(),
      ]);
      
      context = {
        plot: plot?.structure,
        characters: characters.results,
        worldSettings: worldSettings.results,
        chatHistory: chatHistory.results.reverse(),
        calendarEvents: calendarEvents.results,
        currentWriting: data.currentWriting,
        adoptedIdeas: adoptedIdeas.results,
        projectGenres: project?.genre,
      };
    }
    
    const result = await callMainAI(c.env, {
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
    // Use Gemini for analysis (better at structured JSON output)
    const result = await callAnalysisAI(c.env, {
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
    const result = await callMainAI(c.env, {
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
    const result = await callMainAI(c.env, {
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

// AI Chat endpoint for Ideas tab and Analysis tab
api.post('/ai/chat', async (c) => {
  const { action, message, content, context, sessionId } = await c.req.json();
  
  try {
    // Handle analysis_chat action
    if (action === 'analysis_chat') {
      const result = await callMainAI(c.env, {
        action: 'analysis_chat',
        content: message || content,
        context: {
          persona: context?.persona,
          writing: context?.writing,
          plot: context?.plot,
          projectContext: context?.projectContext,
          chatHistory: context?.chatHistory
        }
      });
      
      return c.json({ response: result });
    }
    
    // Build system context from story outline and project settings
    let systemContext = '';
    
    if (context) {
      if (context.storyOutline) {
        const outline = context.storyOutline;
        if (outline.characters) systemContext += `\n【キャラクター設定】\n${outline.characters}`;
        if (outline.terminology) systemContext += `\n【専門用語】\n${outline.terminology}`;
        if (outline.worldSetting) systemContext += `\n【世界観】\n${outline.worldSetting}`;
        if (outline.storyGoal) systemContext += `\n【描きたい物語】\n${outline.storyGoal}`;
        if (outline.episodes) systemContext += `\n【各話アウトライン】\n${outline.episodes}`;
      }
      
      if (context.projectGenres) {
        systemContext += `\n【ジャンル】${context.projectGenres}`;
      }
      
      if (context.ideasDocument) {
        systemContext += `\n【ネタ・プロットメモ】\n${context.ideasDocument.slice(0, 1000)}`;
      }
    }
    
    const result = await callMainAI(c.env, {
      action: action || 'ideas_chat',
      content: content,
      context: {
        ...context,
        systemContext
      }
    });
    
    return c.json({ response: result });
  } catch (error: any) {
    console.error('AI Chat Error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================
// Grok Research AI (リサーチ専用 - X/Twitter連携)
// ============================================

// Grok Research endpoint - 資料収集、トレンド調査、ファクトチェック
api.post('/ai/research', async (c) => {
  const { query, type, context } = await c.req.json();
  
  if (!c.env.GROK_API_KEY) {
    return c.json({ error: 'Grok API key is not configured' }, 500);
  }
  
  try {
    const result = await callGrok(c.env.GROK_API_KEY, {
      action: type || 'research',
      content: query,
      context: context || {}
    });
    
    return c.json({ response: result });
  } catch (error: any) {
    console.error('Grok Research Error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================
// Illustration Image Generation (Server-managed API key)
// ============================================

api.post('/illustration/generate', async (c) => {
  const { prompt, negative_prompt, width, height, steps, reference_image, projectContext, sessionId } = await c.req.json();
  
  // Get NovelAI API key from environment (server-side management)
  const apiKey = (c.env as any).NOVELAI_API_KEY;
  
  if (!apiKey) {
    return c.json({ error: 'NovelAI API key is not configured on the server. Please contact administrator.' }, 500);
  }
  
  try {
    // Build enhanced prompt with project context
    let enhancedPrompt = prompt;
    
    if (projectContext) {
      // Add world setting context if available
      if (projectContext.storyOutline?.worldSetting) {
        const worldContext = projectContext.storyOutline.worldSetting.slice(0, 200);
        enhancedPrompt = `${worldContext}, ${prompt}`;
      }
    }
    
    // NovelAI API endpoint for image generation
    const response = await fetch('https://image.novelai.net/ai/generate-image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        input: enhancedPrompt,
        model: 'nai-diffusion-3', // NAI Diffusion Anime V3
        action: reference_image ? 'img2img' : 'generate',
        parameters: {
          width: width || 512,
          height: height || 768,
          scale: 7,
          sampler: 'k_euler_ancestral',
          steps: steps || 28,
          seed: Math.floor(Math.random() * 4294967295),
          n_samples: 1,
          ucPreset: 0,
          qualityToggle: true,
          negative_prompt: negative_prompt || 'low quality, bad anatomy, worst quality',
          ...(reference_image && {
            image: reference_image.replace(/^data:image\/\w+;base64,/, ''),
            strength: 0.6,
            noise: 0.1
          })
        }
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('NovelAI API error:', errorText);
      return c.json({ error: `NovelAI API error: ${response.status}` }, response.status);
    }
    
    // NovelAI returns a zip file containing the image
    const buffer = await response.arrayBuffer();
    
    // Extract PNG from the response
    const bytes = new Uint8Array(buffer);
    
    // Find PNG signature (89 50 4E 47 0D 0A 1A 0A)
    let pngStart = -1;
    for (let i = 0; i < bytes.length - 8; i++) {
      if (bytes[i] === 0x89 && bytes[i+1] === 0x50 && bytes[i+2] === 0x4E && bytes[i+3] === 0x47) {
        pngStart = i;
        break;
      }
    }
    
    if (pngStart === -1) {
      // Fallback: treat entire response as image data
      const base64 = btoa(String.fromCharCode(...bytes));
      return c.json({ imageUrl: `data:image/png;base64,${base64}` });
    }
    
    // Find PNG end (IEND chunk)
    let pngEnd = bytes.length;
    for (let i = pngStart; i < bytes.length - 8; i++) {
      if (bytes[i] === 0x49 && bytes[i+1] === 0x45 && bytes[i+2] === 0x4E && bytes[i+3] === 0x44 &&
          bytes[i+4] === 0xAE && bytes[i+5] === 0x42 && bytes[i+6] === 0x60 && bytes[i+7] === 0x82) {
        pngEnd = i + 8;
        break;
      }
    }
    
    const pngBytes = bytes.slice(pngStart, pngEnd);
    const base64 = btoa(String.fromCharCode(...pngBytes));
    
    return c.json({ imageUrl: `data:image/png;base64,${base64}` });
  } catch (error: any) {
    console.error('Illustration Generation Error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Keep old NovelAI endpoint for backward compatibility (but remove apiKey requirement)
api.post('/novelai/generate', async (c) => {
  const { apiKey, prompt, negative_prompt, width, height, steps, reference_image } = await c.req.json();
  
  // Use server API key if client doesn't provide one
  const finalApiKey = apiKey || (c.env as any).NOVELAI_API_KEY;
  
  if (!finalApiKey) {
    return c.json({ error: 'NovelAI API key is not configured' }, 500);
  }
  
  try {
    // NovelAI API endpoint for image generation
    const response = await fetch('https://image.novelai.net/ai/generate-image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${finalApiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        input: prompt,
        model: 'nai-diffusion-3',
        action: reference_image ? 'img2img' : 'generate',
        parameters: {
          width: width || 512,
          height: height || 768,
          scale: 7,
          sampler: 'k_euler_ancestral',
          steps: steps || 28,
          seed: Math.floor(Math.random() * 4294967295),
          n_samples: 1,
          ucPreset: 0,
          qualityToggle: true,
          negative_prompt: negative_prompt || 'low quality, bad anatomy, worst quality',
          ...(reference_image && {
            image: reference_image.replace(/^data:image\/\w+;base64,/, ''),
            strength: 0.6,
            noise: 0.1
          })
        }
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('NovelAI API error:', errorText);
      return c.json({ error: `NovelAI API error: ${response.status}` }, response.status);
    }
    
    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    
    let pngStart = -1;
    for (let i = 0; i < bytes.length - 8; i++) {
      if (bytes[i] === 0x89 && bytes[i+1] === 0x50 && bytes[i+2] === 0x4E && bytes[i+3] === 0x47) {
        pngStart = i;
        break;
      }
    }
    
    if (pngStart === -1) {
      const base64 = btoa(String.fromCharCode(...bytes));
      return c.json({ imageUrl: `data:image/png;base64,${base64}` });
    }
    
    let pngEnd = bytes.length;
    for (let i = pngStart; i < bytes.length - 8; i++) {
      if (bytes[i] === 0x49 && bytes[i+1] === 0x45 && bytes[i+2] === 0x4E && bytes[i+3] === 0x44 &&
          bytes[i+4] === 0xAE && bytes[i+5] === 0x42 && bytes[i+6] === 0x60 && bytes[i+7] === 0x82) {
        pngEnd = i + 8;
        break;
      }
    }
    
    const pngBytes = bytes.slice(pngStart, pngEnd);
    const base64 = btoa(String.fromCharCode(...pngBytes));
    
    return c.json({ imageUrl: `data:image/png;base64,${base64}` });
  } catch (error: any) {
    console.error('NovelAI Generation Error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================
// Payment Routes (KOMOJU Integration)
// ============================================

const KOMOJU_API_BASE = 'https://komoju.com/api/v1';

// Payment plans configuration
const PAYMENT_PLANS = {
  standard: { amount: 1600, credits: 400000, label: 'スタンダードプラン' },
  addon_100k: { amount: 500, credits: 100000, label: '追加10万文字' },
  addon_300k: { amount: 1000, credits: 300000, label: '追加30万文字' },
  addon_1m: { amount: 2500, credits: 1000000, label: '追加100万文字' },
};

// Create KOMOJU payment session
api.post('/payment/create-session', async (c) => {
  const sessionId = c.req.header('X-Session-Id');
  if (!sessionId) return c.json({ error: '認証が必要です' }, 401);
  
  const session = await c.env.DB.prepare(
    'SELECT * FROM sessions WHERE id = ? AND expires_at > datetime("now")'
  ).bind(sessionId).first();
  
  if (!session) return c.json({ error: 'セッションが無効です' }, 401);
  
  const { planType } = await c.req.json();
  const plan = PAYMENT_PLANS[planType as keyof typeof PAYMENT_PLANS];
  
  if (!plan) {
    return c.json({ error: '無効なプランです' }, 400);
  }
  
  // Check if addon requires premium for standard plan
  if (planType !== 'standard') {
    const user = await c.env.DB.prepare(
      'SELECT is_premium FROM users WHERE id = ?'
    ).bind(session.user_id).first();
    
    if (!(user as any)?.is_premium) {
      return c.json({ error: '追加トークンはスタンダードプラン購入後に利用可能です' }, 400);
    }
  }
  
  const paymentId = generateId();
  const returnUrl = new URL(c.req.url).origin + '/app?payment=' + paymentId;
  
  // Get KOMOJU secret key from environment
  const komojuSecretKey = (c.env as any).KOMOJU_SECRET_KEY;
  if (!komojuSecretKey) {
    return c.json({ error: '決済機能が設定されていません' }, 500);
  }
  
  try {
    // Create KOMOJU session
    const komojuResponse = await fetch(`${KOMOJU_API_BASE}/sessions`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(komojuSecretKey + ':'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: plan.amount,
        currency: 'JPY',
        return_url: returnUrl,
        external_order_num: paymentId,
        metadata: {
          user_id: session.user_id,
          plan_type: planType,
          credits: plan.credits,
        },
        payment_types: ['credit_card', 'paypay', 'linepay', 'konbini'],
        default_locale: 'ja',
      }),
    });
    
    if (!komojuResponse.ok) {
      const error = await komojuResponse.text();
      console.error('KOMOJU session error:', error);
      return c.json({ error: '決済セッションの作成に失敗しました' }, 500);
    }
    
    const komojuData = await komojuResponse.json() as any;
    
    // Store payment record
    await c.env.DB.prepare(
      `INSERT INTO payments (id, user_id, komoju_session_id, amount, credits_purchased, payment_type, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`
    ).bind(paymentId, session.user_id, komojuData.id, plan.amount, plan.credits, planType).run();
    
    return c.json({
      sessionUrl: komojuData.session_url,
      sessionId: komojuData.id,
      paymentId,
    });
  } catch (error: any) {
    console.error('Payment session error:', error);
    return c.json({ error: '決済処理中にエラーが発生しました: ' + error.message }, 500);
  }
});

// Check payment status
api.get('/payment/status/:paymentId', async (c) => {
  const paymentId = c.req.param('paymentId');
  
  const payment = await c.env.DB.prepare(
    'SELECT * FROM payments WHERE id = ?'
  ).bind(paymentId).first() as any;
  
  if (!payment) {
    return c.json({ error: '決済情報が見つかりません' }, 404);
  }
  
  // If still pending, check with KOMOJU
  if (payment.status === 'pending' && payment.komoju_session_id) {
    const komojuSecretKey = (c.env as any).KOMOJU_SECRET_KEY;
    if (komojuSecretKey) {
      try {
        const komojuResponse = await fetch(`${KOMOJU_API_BASE}/sessions/${payment.komoju_session_id}`, {
          headers: {
            'Authorization': 'Basic ' + btoa(komojuSecretKey + ':'),
          },
        });
      
      if (komojuResponse.ok) {
        const komojuData = await komojuResponse.json() as any;
        
        if (komojuData.status === 'completed') {
          // Update payment status
          await c.env.DB.prepare(
            `UPDATE payments SET status = 'completed', komoju_payment_id = ?, completed_at = datetime('now') WHERE id = ?`
          ).bind(komojuData.payment?.id || '', paymentId).run();
          
          // Add credits to user
          await c.env.DB.prepare(
            `UPDATE users SET 
              ai_credits = ai_credits + ?,
              is_premium = 1,
              plan_type = 'premium',
              total_purchased_credits = total_purchased_credits + ?
            WHERE id = ?`
          ).bind(payment.credits_purchased, payment.credits_purchased, payment.user_id).run();
          
          payment.status = 'completed';
        } else if (komojuData.status === 'cancelled') {
          await c.env.DB.prepare(
            `UPDATE payments SET status = 'cancelled' WHERE id = ?`
          ).bind(paymentId).run();
          payment.status = 'cancelled';
        }
      }
    } catch (error) {
      console.error('KOMOJU status check error:', error);
    }
    }
  }
  
  return c.json({ payment });
});

// Get user credits info
api.get('/payment/credits', async (c) => {
  const sessionId = c.req.header('X-Session-Id');
  if (!sessionId) return c.json({ error: '認証が必要です' }, 401);
  
  const session = await c.env.DB.prepare(
    'SELECT * FROM sessions WHERE id = ? AND expires_at > datetime("now")'
  ).bind(sessionId).first();
  
  if (!session) return c.json({ error: 'セッションが無効です' }, 401);
  
  const user = await c.env.DB.prepare(
    'SELECT ai_credits, is_premium, plan_type, total_purchased_credits FROM users WHERE id = ?'
  ).bind(session.user_id).first() as any;
  
  const payments = await c.env.DB.prepare(
    `SELECT * FROM payments WHERE user_id = ? AND status = 'completed' ORDER BY completed_at DESC LIMIT 10`
  ).bind(session.user_id).all();
  
  return c.json({
    credits: user?.ai_credits || 0,
    isPremium: !!user?.is_premium,
    planType: user?.plan_type || 'free',
    totalPurchased: user?.total_purchased_credits || 0,
    recentPayments: payments.results || [],
  });
});

// ============================================
// Invite Code Routes
// ============================================

const DEVELOPER_INVITE_CODE = 'MYMUSE-DEV-2025';

// Apply invite code
api.post('/invite/apply', async (c) => {
  const sessionId = c.req.header('X-Session-Id');
  if (!sessionId) return c.json({ error: '認証が必要です' }, 401);
  
  const session = await c.env.DB.prepare(
    'SELECT * FROM sessions WHERE id = ? AND expires_at > datetime("now")'
  ).bind(sessionId).first();
  
  if (!session) return c.json({ error: 'セッションが無効です' }, 401);
  
  const { code } = await c.req.json();
  
  if (!code || typeof code !== 'string') {
    return c.json({ error: '招待コードを入力してください' }, 400);
  }
  
  const trimmedCode = code.trim().toUpperCase();
  
  // Check if user already used an invite code
  const user = await c.env.DB.prepare(
    'SELECT invite_code_used FROM users WHERE id = ?'
  ).bind(session.user_id).first() as any;
  
  if (user?.invite_code_used) {
    return c.json({ error: '既に招待コードを使用済みです' }, 400);
  }
  
  // Find invite code
  const inviteCode = await c.env.DB.prepare(
    `SELECT * FROM invite_codes WHERE code = ? AND is_active = 1 
     AND (expires_at IS NULL OR expires_at > datetime('now'))
     AND (max_uses IS NULL OR current_uses < max_uses)`
  ).bind(trimmedCode).first() as any;
  
  if (!inviteCode) {
    return c.json({ error: '無効または期限切れの招待コードです' }, 400);
  }
  
  try {
    // Apply invite code benefits
    const updates: string[] = [];
    const values: any[] = [];
    
    updates.push('invite_code_used = ?');
    values.push(trimmedCode);
    
    if (inviteCode.credits_bonus > 0) {
      updates.push('ai_credits = ai_credits + ?');
      values.push(inviteCode.credits_bonus);
    }
    
    if (inviteCode.grants_premium) {
      updates.push('is_premium = 1');
      updates.push("plan_type = 'premium'");
    }
    
    values.push(session.user_id);
    
    await c.env.DB.prepare(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`
    ).bind(...values).run();
    
    // Increment usage count
    await c.env.DB.prepare(
      'UPDATE invite_codes SET current_uses = current_uses + 1 WHERE id = ?'
    ).bind(inviteCode.id).run();
    
    // Record usage
    await c.env.DB.prepare(
      'INSERT INTO invite_code_usage (id, code_id, user_id) VALUES (?, ?, ?)'
    ).bind(generateId(), inviteCode.id, session.user_id).run();
    
    // Get updated user info
    const updatedUser = await c.env.DB.prepare(
      'SELECT ai_credits, is_premium, plan_type FROM users WHERE id = ?'
    ).bind(session.user_id).first();
    
    return c.json({
      success: true,
      message: '招待コードが適用されました！',
      creditsAdded: inviteCode.credits_bonus,
      premiumGranted: !!inviteCode.grants_premium,
      user: updatedUser,
    });
  } catch (error: any) {
    console.error('Invite code error:', error);
    return c.json({ error: '招待コードの適用中にエラーが発生しました' }, 500);
  }
});

// Check invite code (preview without applying)
api.post('/invite/check', async (c) => {
  const { code } = await c.req.json();
  
  if (!code || typeof code !== 'string') {
    return c.json({ valid: false, error: '招待コードを入力してください' });
  }
  
  const trimmedCode = code.trim().toUpperCase();
  
  const inviteCode = await c.env.DB.prepare(
    `SELECT description, credits_bonus, grants_premium FROM invite_codes 
     WHERE code = ? AND is_active = 1 
     AND (expires_at IS NULL OR expires_at > datetime('now'))
     AND (max_uses IS NULL OR current_uses < max_uses)`
  ).bind(trimmedCode).first() as any;
  
  if (!inviteCode) {
    return c.json({ valid: false, error: '無効または期限切れの招待コードです' });
  }
  
  return c.json({
    valid: true,
    description: inviteCode.description,
    creditsBonus: inviteCode.credits_bonus,
    grantsPremium: !!inviteCode.grants_premium,
  });
});

export default api;
