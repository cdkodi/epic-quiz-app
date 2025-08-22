/**
 * Database Type Definitions
 * 
 * ARCHITECTURAL DECISION: Centralized type definitions matching database schema
 * WHY: Ensures type safety across the application and single source of truth
 * for database structure. Makes refactoring safer and development more efficient.
 */

export interface Epic {
  id: string;
  title: string;
  description?: string;
  language?: string;
  culture?: string;
  time_period?: string;
  question_count: number;
  is_available: boolean;
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  estimated_reading_time?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Question {
  id: string;
  epic_id: string;
  category: 'characters' | 'events' | 'themes' | 'culture';
  difficulty: 'easy' | 'medium' | 'hard';
  question_text: string;
  options: string[]; // Will be parsed from JSONB
  correct_answer_id: number;
  basic_explanation: string;
  original_quote?: string;
  original_language?: string;
  quote_translation?: string;
  tags: string[];
  cross_epic_tags: string[];
  created_at: Date;
  updated_at: Date;
}

export interface EducationalContent {
  question_id: string;
  detailed_explanation: string;
  cultural_context?: string;
  historical_background?: string;
  cross_epic_connections: CrossEpicConnection[];
  related_topics: string[];
  recommended_reading?: string[];
  content_version: number;
  last_reviewed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface CrossEpicConnection {
  epicId: string;
  connection: string;
  similarThemes: string[];
}

export interface User {
  id: string;
  username?: string;
  email?: string;
  preferred_language: string;
  notification_settings: {
    quiz_reminders: boolean;
    achievement_alerts: boolean;
  };
  is_active: boolean;
  created_at: Date;
  last_active_at: Date;
}

export interface UserProgress {
  user_id: string;
  epic_id: string;
  quizzes_completed: number;
  total_questions_answered: number;
  correct_answers: number;
  category_scores: CategoryScores;
  completion_percentage: number;
  mastery_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  last_quiz_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface CategoryScores {
  characters: { correct: number; total: number };
  events: { correct: number; total: number };
  themes: { correct: number; total: number };
  culture: { correct: number; total: number };
}

export interface QuizSession {
  id: string;
  user_id?: string; // Optional for anonymous sessions
  epic_id: string;
  questions_answered: QuestionAnswer[];
  score: number;
  total_questions: number;
  time_spent: number; // in seconds
  device_type?: string;
  app_version?: string;
  completed_at: Date;
}

export interface QuestionAnswer {
  question_id: string;
  user_answer: number;
  is_correct: boolean;
  time_spent: number; // in seconds
}

export interface UserBookmark {
  user_id: string;
  question_id: string;
  bookmarked_at: Date;
  notes?: string;
}

// API Response Types
export interface QuizPackage {
  quiz_id: string;
  epic: {
    id: string;
    title: string;
    language: string;
  };
  block_info?: {
    id: number;
    name: string;
    difficulty: string;
    sarga_range: string;
    learning_objectives: string[];
  };
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correct_answer_id: number;
  basic_explanation: string;
  category: string;
}

export interface DeepDiveContent {
  detailed_explanation: string;
  original_quote?: string;
  translation?: string;
  cultural_context?: string;
  related_topics: string[];
  cross_epic_connections: CrossEpicConnection[];
}

// Database query result types
export interface DatabaseResult<T = any> {
  rows: T[];
  rowCount: number;
  command: string;
}

// Utility types for database operations
export type CreateEpicData = Omit<Epic, 'created_at' | 'updated_at' | 'question_count'>;
export type CreateQuestionData = Omit<Question, 'id' | 'created_at' | 'updated_at'>;
export type CreateUserData = Omit<User, 'id' | 'created_at' | 'last_active_at'>;

// Pagination types
export interface PaginationOptions {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
  };
}

// Express Request extension types
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username?: string;
        email?: string;
      };
    }
  }
}