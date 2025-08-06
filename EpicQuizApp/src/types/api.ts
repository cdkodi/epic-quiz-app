/**
 * Epic Quiz App - API Types
 * Matching backend API structure
 */

// Epic types
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
  created_at: string;
  updated_at: string;
}

// Quiz types
export interface QuizPackage {
  quiz_id: string;
  epic: {
    id: string;
    title: string;
    language: string;
  };
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correct_answer_id: number;
  basic_explanation: string;
  category: 'characters' | 'events' | 'themes' | 'culture';
}

export interface QuestionAnswer {
  question_id: string;
  user_answer: number;
  time_spent: number; // in seconds
}

export interface QuizSubmission {
  quizId: string;
  epicId: string;
  answers: QuestionAnswer[];
  timeSpent: number;
  deviceType?: 'mobile' | 'tablet';
  appVersion?: string;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: string[];
  feedback: string;
  progressUpdate?: any;
}

// Deep dive content
export interface DeepDiveContent {
  detailed_explanation: string;
  original_quote?: string;
  translation?: string;
  cultural_context?: string;
  related_topics: string[];
  cross_epic_connections: CrossEpicConnection[];
}

export interface CrossEpicConnection {
  epicId: string;
  connection: string;
  similarThemes: string[];
}

// API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}