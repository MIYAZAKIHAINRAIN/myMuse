-- Library (Series/Parent-Child Project) Support
-- Add columns to projects table for library functionality

-- is_library: TRUE if this project is a library (parent) that contains other projects
ALTER TABLE projects ADD COLUMN is_library INTEGER DEFAULT 0;

-- library_id: Foreign key to parent library (if this project belongs to a series)
ALTER TABLE projects ADD COLUMN library_id TEXT REFERENCES projects(id) ON DELETE SET NULL;

-- library_settings: JSON containing shared settings for the series (only for library projects)
-- Stores: description, shared_characters, shared_world_setting, shared_terminology
ALTER TABLE projects ADD COLUMN library_settings TEXT;

-- Create index for library lookups
CREATE INDEX IF NOT EXISTS idx_projects_library ON projects(library_id);
CREATE INDEX IF NOT EXISTS idx_projects_is_library ON projects(is_library);
