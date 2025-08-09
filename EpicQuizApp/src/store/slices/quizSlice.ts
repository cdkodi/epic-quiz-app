/**
 * Quiz Redux Slice - Manages quiz state and progress
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { QuizPackage, QuestionAnswer, QuizSubmission, QuizResult } from '../../types/api';
import apiService from '../../services/api';

export interface QuizState {
  currentQuiz: QuizPackage | null;
  currentQuestionIndex: number;
  answers: QuestionAnswer[];
  timeSpent: number;
  quizStartTime: number | null;
  questionStartTime: number | null;
  results: QuizResult | null;
  loading: boolean;
  submitting: boolean;
  error: string | null;
}

const initialState: QuizState = {
  currentQuiz: null,
  currentQuestionIndex: 0,
  answers: [],
  timeSpent: 0,
  quizStartTime: null,
  questionStartTime: null,
  results: null,
  loading: false,
  submitting: false,
  error: null,
};

// Async thunks
export const generateQuiz = createAsyncThunk(
  'quiz/generateQuiz',
  async ({ epicId, count = 10 }: { epicId: string; count?: number }, { rejectWithValue }) => {
    const response = await apiService.generateQuiz(epicId, count);
    if (!response.success) {
      return rejectWithValue(response.error || 'Failed to generate quiz');
    }
    return response.data!;
  }
);

export const submitQuiz = createAsyncThunk(
  'quiz/submitQuiz',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { quiz: QuizState };
    const { currentQuiz, answers, timeSpent } = state.quiz;
    
    if (!currentQuiz) {
      return rejectWithValue('No active quiz');
    }

    const submission: QuizSubmission = {
      quizId: currentQuiz.quiz_id,
      epicId: currentQuiz.epic.id,
      answers,
      timeSpent,
      deviceType: 'mobile',
      appVersion: '1.0.0', // TODO: Get from app config
    };

    const response = await apiService.submitQuiz(submission);
    if (!response.success) {
      return rejectWithValue(response.error || 'Failed to submit quiz');
    }
    return response.data!;
  }
);

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    startQuiz: (state, action: PayloadAction<QuizPackage>) => {
      state.currentQuiz = action.payload;
      state.currentQuestionIndex = 0;
      state.answers = [];
      state.timeSpent = 0;
      state.quizStartTime = Date.now();
      state.questionStartTime = Date.now();
      state.results = null;
      state.error = null;
    },
    
    answerQuestion: (state, action: PayloadAction<{ questionId: string; answer: number }>) => {
      const now = Date.now();
      const questionTime = state.questionStartTime ? now - state.questionStartTime : 0;
      
      const existingAnswerIndex = state.answers.findIndex(a => a.question_id === action.payload.questionId);
      const newAnswer: QuestionAnswer = {
        question_id: action.payload.questionId,
        user_answer: action.payload.answer,
        time_spent: Math.floor(questionTime / 1000), // Convert to seconds
      };
      
      if (existingAnswerIndex >= 0) {
        state.answers[existingAnswerIndex] = newAnswer;
      } else {
        state.answers.push(newAnswer);
      }
    },
    
    nextQuestion: (state) => {
      if (state.currentQuiz && state.currentQuestionIndex < state.currentQuiz.questions.length - 1) {
        state.currentQuestionIndex += 1;
        state.questionStartTime = Date.now();
      }
    },
    
    previousQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
        state.questionStartTime = Date.now();
      }
    },
    
    updateTimeSpent: (state) => {
      if (state.quizStartTime) {
        state.timeSpent = Math.floor((Date.now() - state.quizStartTime) / 1000);
      }
    },
    
    resetQuiz: (state) => {
      return initialState;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Generate quiz
      .addCase(generateQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuiz = action.payload;
        state.currentQuestionIndex = 0;
        state.answers = [];
        state.timeSpent = 0;
        state.quizStartTime = Date.now();
        state.questionStartTime = Date.now();
        state.results = null;
      })
      .addCase(generateQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Submit quiz
      .addCase(submitQuiz.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(submitQuiz.fulfilled, (state, action) => {
        state.submitting = false;
        state.results = action.payload;
      })
      .addCase(submitQuiz.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  startQuiz,
  answerQuestion,
  nextQuestion,
  previousQuestion,
  updateTimeSpent,
  resetQuiz,
  clearError,
} = quizSlice.actions;

export default quizSlice.reducer;