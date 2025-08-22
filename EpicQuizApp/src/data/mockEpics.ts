/**
 * Mock Epic Data - Realistic placeholder data matching backend API structure
 * TODO: Replace with real API calls when backend is connected
 */

import { Epic, Kanda } from '../types/api';

// Mock Kanda data for Ramayana
export const ramayanaKandas: Kanda[] = [
  {
    id: 'bala_kanda',
    name: 'Bala Kanda',
    title: 'The Childhood',
    description: 'Birth and early life of Rama, his education and marriage to Sita',
    order_index: 1,
    image_url: 'bala-kanda.jpg',
    character_focus: ['Rama', 'Sita', 'Dasharatha', 'Vishwamitra'],
    key_themes: ['divine birth', 'education', 'marriage', 'dharma'],
    estimated_reading_time: '45 min'
  },
  {
    id: 'ayodhya_kanda',
    name: 'Ayodhya Kanda',
    title: 'The Royal Court',
    description: 'Rama\'s exile, departure from Ayodhya, and the grief of the royal family',
    order_index: 2,
    image_url: 'ayodhya-kanda.jpg',
    character_focus: ['Rama', 'Sita', 'Lakshmana', 'Kaikeyi', 'Bharata'],
    key_themes: ['exile', 'duty', 'sacrifice', 'family bonds'],
    estimated_reading_time: '60 min'
  },
  {
    id: 'aranya_kanda',
    name: 'Aranya Kanda',
    title: 'The Forest',
    description: 'Life in the forest, encounters with sages, and Sita\'s abduction',
    order_index: 3,
    image_url: 'aranya-kanda.jpg',
    character_focus: ['Rama', 'Sita', 'Lakshmana', 'Ravana', 'Surpanakha'],
    key_themes: ['forest life', 'protection', 'temptation', 'loss'],
    estimated_reading_time: '50 min'
  },
  {
    id: 'kishkindha_kanda',
    name: 'Kishkindha Kanda',
    title: 'The Monkey Kingdom',
    description: 'Alliance with Hanuman and Sugriva, search for Sita begins',
    order_index: 4,
    image_url: 'kishkindha-kanda.jpg',
    character_focus: ['Hanuman', 'Sugriva', 'Vali', 'Rama', 'Angada'],
    key_themes: ['friendship', 'loyalty', 'justice', 'alliance'],
    estimated_reading_time: '40 min'
  },
  {
    id: 'sundara_kanda',
    name: 'Sundara Kanda',
    title: 'The Beautiful Chapter',
    description: 'Hanuman\'s journey to Lanka, meeting Sita, and return with news',
    order_index: 5,
    image_url: 'sundara-kanda.jpg',
    character_focus: ['Hanuman', 'Sita', 'Ravana', 'Lanka demons'],
    key_themes: ['devotion', 'courage', 'hope', 'divine power'],
    estimated_reading_time: '35 min'
  },
  {
    id: 'yuddha_kanda',
    name: 'Yuddha Kanda',
    title: 'The War',
    description: 'The great battle between Rama\'s army and Ravana\'s forces',
    order_index: 6,
    image_url: 'yuddha-kanda.jpg',
    character_focus: ['Rama', 'Ravana', 'Hanuman', 'Lakshmana', 'Indrajit'],
    key_themes: ['good vs evil', 'warfare', 'victory', 'righteousness'],
    estimated_reading_time: '70 min'
  },
  {
    id: 'uttara_kanda',
    name: 'Uttara Kanda',
    title: 'The Final Chapter',
    description: 'Return to Ayodhya, Rama\'s coronation, and later events',
    order_index: 7,
    image_url: 'uttara-kanda.jpg',
    character_focus: ['Rama', 'Sita', 'Bharata', 'Hanuman', 'Ayodhya citizens'],
    key_themes: ['return', 'kingship', 'duty vs personal desire', 'legacy'],
    estimated_reading_time: '55 min'
  }
];

export const mockEpics: Epic[] = [
  {
    id: 'ramayana',
    title: 'Ramayana',
    description: 'The epic tale of Rama, an exiled prince, and his quest to rescue his wife Sita from the demon king Ravana.',
    language: 'Sanskrit',
    culture: 'Hindu',
    question_count: 342,
    is_available: true,
    difficulty_level: 'beginner',
    estimated_reading_time: '2-3 hours',
    // Image support
    cover_image_url: 'ramayana-cover.jpg',
    kandas: ramayanaKandas,
    // Legacy aliases for backward compatibility
    totalQuestions: 342,
    isAvailable: true,
    difficulty: 'beginner',
    estimatedTime: '2-3 hours',
    coverImage: '🕉️'
  },
  {
    id: 'mahabharata',
    title: 'Mahabharata',
    description: 'The story of the Kurukshetra War between two groups of cousins, the Kauravas and the Pandavas, and the fates of the Kaurava and Pandava princes and their successors.',
    language: 'Sanskrit',
    culture: 'Hindu',
    question_count: 0, // Coming soon
    is_available: true,
    difficulty_level: 'advanced',
    estimated_reading_time: '8-10 hours',
    // Image support
    cover_image_url: 'mahabharata-cover.jpg',
    kandas: [], // Will be populated when content is added
    // Legacy aliases for backward compatibility
    totalQuestions: 0,
    isAvailable: true,
    difficulty: 'advanced',
    estimatedTime: '8-10 hours',
    coverImage: '⚔️'
  },
  {
    id: 'bhagavad_gita',
    title: 'Bhagavad Gita',
    description: 'A dialogue between Arjuna and Krishna, exploring dharma, karma, and the path to enlightenment.',
    language: 'Sanskrit',
    culture: 'Hindu',
    question_count: 0, // Coming soon
    is_available: true,
    difficulty_level: 'intermediate',
    estimated_reading_time: '3-4 hours',
    // Image support
    cover_image_url: 'bhagavad-gita-cover.jpg',
    kandas: [], // Will use "chapters" instead of kandas
    // Legacy aliases for backward compatibility
    totalQuestions: 0,
    isAvailable: true,
    difficulty: 'intermediate',
    estimatedTime: '3-4 hours',
    coverImage: '📿'
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
    // Image support
    cover_image_url: 'odyssey-cover.jpg',
    kandas: [], // Will use "books" instead of kandas
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
    completed_questions: 34,
    total_questions: 342,
    completion_percentage: 10,
    accuracy_rate: 85,
  },
  mahabharata: {
    completed_questions: 0,
    total_questions: 0,
    completion_percentage: 0,
    accuracy_rate: 0,
  },
  bhagavad_gita: {
    completed_questions: 0,
    total_questions: 0,
    completion_percentage: 50,
    accuracy_rate: 0,
  },
  odyssey: {
    completed_questions: 0,
    total_questions: 0,
    completion_percentage: 0,
    accuracy_rate: 0,
  },
};