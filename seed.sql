-- Demo User
INSERT OR IGNORE INTO users (id, email, name, language, theme, ai_credits) VALUES 
  ('demo-user-001', 'demo@mymuse.app', 'デモユーザー', 'ja', 'light', 10000);

-- Demo Folders
INSERT OR IGNORE INTO folders (id, user_id, name) VALUES 
  ('folder-001', 'demo-user-001', '長編小説'),
  ('folder-002', 'demo-user-001', '短編集');

-- Demo Project
INSERT OR IGNORE INTO projects (id, user_id, title, description, genre, folder_id, target_word_count) VALUES 
  ('project-001', 'demo-user-001', '星降る夜の物語', 'ファンタジー長編小説の執筆プロジェクト', 'fantasy', 'folder-001', 100000);

-- Demo Plot
INSERT OR IGNORE INTO plots (id, project_id, template, structure) VALUES 
  ('plot-001', 'project-001', 'kishotenketsu', '{"ki":"主人公が不思議な星を見つける","sho":"星の力で異世界へ","ten":"敵との対峙","ketsu":"世界を救い帰還"}');

-- Demo Writing
INSERT OR IGNORE INTO writings (id, project_id, chapter_number, chapter_title, content, word_count) VALUES 
  ('writing-001', 'project-001', 1, '第一章：始まりの夜', '夜空に一筋の流れ星が走った。少年は窓辺に立ち、その光を追いかけた。', 30);

-- Demo Chat History
INSERT OR IGNORE INTO chat_history (id, project_id, thread_id, role, content, tab_context) VALUES 
  ('chat-001', 'project-001', 'thread-001', 'user', 'この物語の主人公の性格について相談したいです。', 'consultation'),
  ('chat-002', 'project-001', 'thread-001', 'assistant', '主人公の性格設定について、いくつかの方向性を提案させていただきます。ファンタジー作品では、成長型の主人公が読者の共感を得やすい傾向があります。', 'consultation');

-- Demo Calendar Event
INSERT OR IGNORE INTO calendar_events (id, user_id, project_id, event_date, title, is_deadline) VALUES 
  ('event-001', 'demo-user-001', 'project-001', '2026-03-31', '第一稿完成締め切り', 1);
