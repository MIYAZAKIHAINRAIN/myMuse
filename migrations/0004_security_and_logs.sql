-- Migration: Security improvements and logging
-- Version: 0004

-- Add password_hash column to users (for secure password storage)
-- Note: Existing plain passwords will be migrated on next login
ALTER TABLE users ADD COLUMN password_hash TEXT;

-- Admin operation logs (audit trail)
CREATE TABLE IF NOT EXISTS admin_logs (
  id TEXT PRIMARY KEY,
  admin_user_id TEXT NOT NULL,
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  details TEXT,
  ip_address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Error logs
CREATE TABLE IF NOT EXISTS error_logs (
  id TEXT PRIMARY KEY,
  error_type TEXT NOT NULL,
  error_message TEXT NOT NULL,
  endpoint TEXT,
  user_id TEXT,
  request_data TEXT,
  stack_trace TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin ON admin_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON admin_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created ON admin_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_error_logs_type ON error_logs(error_type);
CREATE INDEX IF NOT EXISTS idx_error_logs_created ON error_logs(created_at);
