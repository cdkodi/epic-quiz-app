/**
 * Epic Quiz App - API Types
 * Matching backend API structure
 */

// Kanda (chapter/section) information
export interface Kanda {
  id: string;
  name: string;
  title: string;
  description?: string;
  order_index: number;
  image_url?: string;
  character_focus?: string[];
  key_themes?: string[];
  estimated_reading_time?: string;
}

// Epic types (matching Supabase schema)
export interface Epic {
  id: string;
  title: string;
  description?: string;
  language?: string;
  culture?: string;
  // Database fields
  question_count: number;
  is_available: boolean;
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  estimated_reading_time?: string;
  // Image support
  cover_image_url?: string;
  kandas?: Kanda[];
  // Legacy aliases for backward compatibility
  totalQuestions: number;
  isAvailable: boolean;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime?: string;
  coverImage?: string;
}

// Progressive Quiz Block types
export interface QuizBlock {
  id: number;
  epic_id: string;
  block_name: string;
  difficulty_level: 'easy' | 'medium' | 'hard';
  phase: 'foundational' | 'development' | 'mastery';
  start_sarga: number;
  end_sarga: number;
  kanda: string;
  learning_objectives: string[];
  narrative_summary: string;
  key_themes: string[];
  cultural_elements: string[];
  sequence_order: number;
  is_available: boolean;
  prerequisite_blocks?: number[];
  total_questions?: number;
  character_questions?: number;
  event_questions?: number;
  theme_questions?: number;
  culture_questions?: number;
}

// Quiz types - Updated with progressive block support
export interface QuizPackage {
  id: string;
  epicId: string;
  epicTitle: string;
  questions: Question[];
  totalQuestions: number;
  downloadedAt: string;
  // Progressive block info
  block_info?: {
    id: number;
    name: string;
    difficulty: string;
    sarga_range: string;
    learning_objectives: string[];
  };
  // Legacy properties
  quiz_id?: string;
  epic?: any;
  metadata: {
    language: string;
    culture: string;
    difficulty: string;
    estimatedTime: string;
  };
}

export interface Question {
  id: string;
  epicId: string;
  kandaId?: string; // Which Kanda this question belongs to
  category: 'characters' | 'events' | 'themes' | 'culture';
  difficulty: 'easy' | 'medium' | 'hard';
  questionText: string;
  text: string; // Legacy alias for questionText
  options: string[];
  correctAnswerId: number;
  explanation: string;
  tags: string[];
  culturalContext?: string;
  sourceReference: string;
}

// Legacy alias for backward compatibility
export type QuizQuestion = Question;

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
  questionId: string;
  detailedExplanation: string;
  historicalBackground?: string;
  culturalSignificance?: string;
  scholarlyNotes?: string;
  crossEpicConnections?: any[];
  relatedTopics?: string[];
  recommendedReading?: string[];
  chapterSummary?: {
    title: string;
    keyEvents: string;
    mainCharacters: string;
    themes: string;
    narrativeSummary: string;
  };
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