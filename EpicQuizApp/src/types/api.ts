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
  totalQuestions: number;
  isAvailable: boolean;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime?: string;
  coverImage?: string;
}

// Quiz types
export interface QuizPackage {
  id: string;
  epicId: string;
  epicTitle: string;
  questions: Question[];
  totalQuestions: number;
  downloadedAt: string;
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
  category: 'characters' | 'events' | 'themes' | 'culture';
  difficulty: 'easy' | 'medium' | 'hard';
  questionText: string;
  options: string[];
  correctAnswerId: number;
  explanation: string;
  tags: string[];
  culturalContext?: string;
  sourceReference: string;
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