/**
 * Mock Epic Data - Realistic placeholder data matching backend API structure
 * TODO: Replace with real API calls when backend is connected
 */

import { Epic } from '../types/api';

export const mockEpics: Epic[] = [
  {
    id: 'ramayana',
    title: 'THE RAMAYANA',
    description: 'Ancient Indian Epic',
    language: 'Sanskrit',
    culture: 'Hindu',
    question_count: 342,
    is_available: true,
    difficulty_level: 'beginner',
    estimated_reading_time: '2-3 hours',
    // Legacy aliases for backward compatibility
    totalQuestions: 342,
    isAvailable: true,
    difficulty: 'beginner',
    estimatedTime: '2-3 hours',
    coverImage: '🕉️'
  },
  {
    id: 'mahabharata',
    title: 'THE MAHABHARATA',
    description: 'Ancient Indian Epic',
    language: 'Sanskrit',
    culture: 'Hindu',
    question_count: 0, // Coming soon
    is_available: false,
    difficulty_level: 'advanced',
    estimated_reading_time: '8-10 hours',
    // Legacy aliases for backward compatibility
    totalQuestions: 0,
    isAvailable: false,
    difficulty: 'advanced',
    estimatedTime: '8-10 hours',
    coverImage: '⚔️'
  },
  {
    id: 'odyssey',
    title: 'THE ODYSSEY',
    description: 'Ancient Greek Epic',
    language: 'Ancient Greek',
    culture: 'Greek',
    question_count: 0, // Future release
    is_available: false,
    difficulty_level: 'intermediate',
    estimated_reading_time: '4-5 hours',
    // Legacy aliases for backward compatibility
    totalQuestions: 0,
    isAvailable: false,
    difficulty: 'intermediate',
    estimatedTime: '4-5 hours',
    coverImage: '🏺'
  },
];

// Mock user progress data (simulates what would come from backend)
export const mockUserProgress = {
  ramayana: {
    completed_questions: 240,
    total_questions: 342,
    completion_percentage: 70,
    accuracy_rate: 85,
  },
  mahabharata: {
    completed_questions: 0,
    total_questions: 0,
    completion_percentage: 0,
    accuracy_rate: 0,
  },
  odyssey: {
    completed_questions: 0,
    total_questions: 0,
    completion_percentage: 0,
    accuracy_rate: 0,
  },
};