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
    time_period: '5th century BCE',
    question_count: 342,
    is_available: true,
    difficulty_level: 'beginner',
    estimated_reading_time: '2-3 hours',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'mahabharata',
    title: 'THE MAHABHARATA',
    description: 'Ancient Indian Epic',
    language: 'Sanskrit',
    culture: 'Hindu',
    time_period: '4th century BCE',
    question_count: 0, // Coming soon
    is_available: false,
    difficulty_level: 'advanced',
    estimated_reading_time: '8-10 hours',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'odyssey',
    title: 'THE ODYSSEY',
    description: 'Ancient Greek Epic',
    language: 'Ancient Greek',
    culture: 'Greek',
    time_period: '8th century BCE',
    question_count: 0, // Future release
    is_available: false,
    difficulty_level: 'intermediate',
    estimated_reading_time: '4-5 hours',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
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