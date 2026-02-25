-- Migration: Payment and Invite Code Support
-- Version: 0003

-- Add plan and payment fields to users
ALTER TABLE users ADD COLUMN plan_type TEXT DEFAULT 'free';
ALTER TABLE users ADD COLUMN is_premium INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN invite_code_used TEXT;
ALTER TABLE users ADD COLUMN total_purchased_credits INTEGER DEFAULT 0;

-- Payments table (KOMOJU transactions)
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  komoju_session_id TEXT,
  komoju_payment_id TEXT,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'JPY',
  credits_purchased INTEGER NOT NULL,
  payment_type TEXT NOT NULL, -- 'standard' | 'addon_100k' | 'addon_300k' | 'addon_1m'
  status TEXT DEFAULT 'pending', -- 'pending' | 'completed' | 'cancelled' | 'failed'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Invite codes table
CREATE TABLE IF NOT EXISTS invite_codes (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  is_active INTEGER DEFAULT 1,
  max_uses INTEGER DEFAULT NULL, -- NULL means unlimited
  current_uses INTEGER DEFAULT 0,
  credits_bonus INTEGER DEFAULT 0, -- Bonus credits when using this code
  grants_premium INTEGER DEFAULT 0, -- Whether this code grants premium status
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME
);

-- Track invite code usage
CREATE TABLE IF NOT EXISTS invite_code_usage (
  id TEXT PRIMARY KEY,
  code_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  used_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (code_id) REFERENCES invite_codes(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_komoju ON payments(komoju_session_id);
CREATE INDEX IF NOT EXISTS idx_invite_codes_code ON invite_codes(code);
CREATE INDEX IF NOT EXISTS idx_invite_usage_user ON invite_code_usage(user_id);
