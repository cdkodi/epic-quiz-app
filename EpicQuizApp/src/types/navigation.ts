/**
 * Epic Quiz App - Navigation Types
 * Type safety for React Navigation
 */

import { Epic, QuizPackage, QuestionAnswer } from './api';

export type RootStackParamList = {
  EpicLibrary: undefined;
  Quiz: {
    epic: Epic;
    quizPackage: QuizPackage;
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