/**
 * Epic Quiz App - Navigation Types
 * Type safety for React Navigation
 */

import { Epic, QuizPackage, QuestionAnswer } from './api';

export type RootStackParamList = {
  EpicLibrary: undefined;
  BlockSelection: {
    epic: Epic;
    difficulty?: 'easy' | 'medium' | 'hard';
  };
  Quiz: {
    epic: Epic;
    difficulty?: 'easy' | 'medium' | 'hard';
    category?: 'characters' | 'events' | 'themes' | 'culture' | 'mixed';
    blockId?: number;
    quizPackage?: QuizPackage; // Optional since Quiz screen will generate it
  };
  QuizResults: {
    epic: Epic;
    quizPackage: QuizPackage;
    answers: QuestionAnswer[];
    score: number;
    correctAnswers: string[];
    feedback: string;
  };
  Explanation: {
    epic: Epic;
    questions: Array<{
      question: any;
      userAnswer: number;
      isCorrect: boolean;
    }>;
    currentIndex: number;
  };
  DeepDive: {
    questionId: string;
    questionText: string;
  };
};

export type ScreenNames = keyof RootStackParamList;