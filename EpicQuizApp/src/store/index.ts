/**
 * Epic Quiz App - Redux Store Configuration
 */

import { configureStore } from '@reduxjs/toolkit';
import epicReducer from './slices/epicSlice';
import quizReducer from './slices/quizSlice';

export const store = configureStore({
  reducer: {
    epic: epicReducer,
    quiz: quizReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;