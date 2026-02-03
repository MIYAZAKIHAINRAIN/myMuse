// Database Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  language: string;
  theme: 'light' | 'dark';
  ai_credits: number;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  genre?: string;
  status: 'active' | 'archived' | 'deleted';
  deadline?: string;
  target_word_count: number;
  folder_id?: string;
  pinned_plot?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface Folder {
  id: string;
  user_id: string;
  name: string;
  parent_id?: string;
  created_at: string;
}

export interface Idea {
  id: string;
  project_id: string;
  title: string;
  content?: string;
  genre?: string;
  adopted: boolean;
  created_at: string;
}

export interface Plot {
  id: string;
  project_id: string;
  template: 'kishotenketsu' | 'three_act' | 'blake_snyder';
  structure: string;
  created_at: string;
  updated_at: string;
}

export interface Character {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  voice_settings?: string;
  created_at: string;
}

export interface WorldSetting {
  id: string;
  project_id: string;
  category: string;
  title: string;
  content?: string;
  created_at: string;
}

export interface Writing {
  id: string;
  project_id: string;
  chapter_number: number;
  chapter_title?: string;
  content?: string;
  word_count: number;
  writing_direction: 'horizontal' | 'vertical';
  font_family: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  project_id: string;
  thread_id: string;
  role: 'user' | 'assistant';
  content: string;
  tab_context?: string;
  created_at: string;
}

export interface CalendarEvent {
  id: string;
  user_id: string;
  project_id?: string;
  event_date: string;
  title: string;
  description?: string;
  is_deadline: boolean;
  created_at: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  badge_type: string;
  badge_title: string;
  badge_description?: string;
  earned_at: string;
}

// API Types
export interface AIRequest {
  action: 'continue' | 'rewrite' | 'expand' | 'proofread' | 'summarize' | 'translate' | 'title' | 'style' | 'custom';
  content: string;
  context?: {
    plot?: string;
    characters?: Character[];
    worldSettings?: WorldSetting[];
    chatHistory?: ChatMessage[];
    calendarEvents?: CalendarEvent[];
  };
  options?: {
    style?: 'formal' | 'casual' | 'literary';
    targetLanguage?: string;
    targetWordCount?: number;
    customPrompt?: string;
  };
}

export interface IdeaGenerationRequest {
  genre: string;
  keywords?: string;
  mood?: string;
  count: 3 | 5 | 10;
}

export interface AnalysisResult {
  emotionCurve: { point: number; emotion: number; label: string }[];
  radarChart: { axis: string; value: number }[];
  reviews: {
    persona: 'general' | 'harsh' | 'fan';
    name: string;
    rating: number;
    comment: string;
  }[];
}

// Environment Bindings
export interface Env {
  DB: D1Database;
  GEMINI_API_KEY: string;
}
