/**
 * Mock Quiz Data - Realistic quiz questions matching backend API structure
 * TODO: Replace with real API calls when backend is connected
 */

import { QuizPackage, QuizQuestion } from '../types/api';

export const mockRamayanaQuiz: QuizPackage = {
  quiz_id: 'quiz_550e8400-e29b-41d4-a716-446655440000',
  epic: {
    id: 'ramayana',
    title: 'THE RAMAYANA',
    language: 'Sanskrit',
  },
  questions: [
    {
      id: 'q1_550e8400-e29b-41d4-a716-446655440001',
      text: 'Who was Sita\'s father in the Ramayana?',
      options: [
        'King Dasharatha',
        'King Janaka',
        'King Ravana',
        'King Sugriva'
      ],
      correct_answer_id: 1, // King Janaka
      basic_explanation: 'King Janaka of Mithila was Sita\'s adoptive father. He found her while plowing a field and raised her as his daughter.',
      category: 'characters'
    },
    {
      id: 'q2_550e8400-e29b-41d4-a716-446655440002',
      text: 'What special power did Hanuman possess?',
      options: [
        'Shapeshifting abilities',
        'The ability to fly and change size',
        'Control over the elements',
        'Immortality'
      ],
      correct_answer_id: 1, // The ability to fly and change size
      basic_explanation: 'Hanuman, son of the wind god Vayu, could fly through the air and change his size at will - from tiny to gigantic.',
      category: 'characters'
    },
    {
      id: 'q3_550e8400-e29b-41d4-a716-446655440003',
      text: 'Who did Hanuman encounter at the entrance to Lanka?',
      options: [
        'Vibhishana',
        'Lankini (Guardian Spirit)',
        'Ravana',
        'Indrajit'
      ],
      correct_answer_id: 1, // Lankini (Guardian Spirit)
      basic_explanation: 'Lankini was the fierce guardian spirit protecting Lanka. Hanuman had to defeat her to enter the city and search for Sita.',
      category: 'events'
    },
    {
      id: 'q4_550e8400-e29b-41d4-a716-446655440004',
      text: 'How long was Rama\'s exile in the forest?',
      options: [
        '10 years',
        '12 years',
        '14 years',
        '16 years'
      ],
      correct_answer_id: 2, // 14 years
      basic_explanation: 'Rama was exiled to the forest for 14 years due to the promise his father Dasharatha had made to Kaikeyi.',
      category: 'events'
    },
    {
      id: 'q5_550e8400-e29b-41d4-a716-446655440005',
      text: 'Who formed the monkey army that helped Rama?',
      options: [
        'Hanuman',
        'Sugriva',
        'Angada',
        'Jambavan'
      ],
      correct_answer_id: 1, // Sugriva
      basic_explanation: 'Sugriva was the rightful king of the monkeys who allied with Rama after Rama helped him defeat his brother Vali. In gratitude, Sugriva provided his entire monkey army to help rescue Sita.',
      category: 'characters'
    },
    {
      id: 'q6_550e8400-e29b-41d4-a716-446655440006',
      text: 'What does the Ramayana teach about dharma?',
      options: [
        'Dharma is following rules blindly',
        'Dharma means doing what is right even when difficult',
        'Dharma only applies to kings',
        'Dharma is about personal gain'
      ],
      correct_answer_id: 1, // Dharma means doing what is right even when difficult
      basic_explanation: 'The Ramayana demonstrates that dharma (righteous duty) means choosing what is morally right, even when it involves personal sacrifice or hardship.',
      category: 'themes'
    },
    {
      id: 'q7_550e8400-e29b-41d4-a716-446655440007',
      text: 'What cultural practice does Sita\'s swayamvara represent?',
      options: [
        'Arranged marriage',
        'Self-choice marriage ceremony',
        'Royal coronation',
        'Religious ritual'
      ],
      correct_answer_id: 1, // Self-choice marriage ceremony
      basic_explanation: 'Swayamvara was an ancient practice where a princess could choose her husband from assembled suitors, usually through a contest or challenge.',
      category: 'culture'
    },
    {
      id: 'q8_550e8400-e29b-41d4-a716-446655440008',
      text: 'Who was Ravana\'s brother who joined Rama\'s side?',
      options: [
        'Kumbhakarna',
        'Vibhishana',
        'Indrajit',
        'Surpanakha'
      ],
      correct_answer_id: 1, // Vibhishana
      basic_explanation: 'Vibhishana chose dharma over family loyalty and helped Rama defeat Ravana, demonstrating that moral principles are more important than blind loyalty.',
      category: 'characters'
    },
    {
      id: 'q9_550e8400-e29b-41d4-a716-446655440009',
      text: 'What happened during the final battle with Ravana?',
      options: [
        'Hanuman defeated Ravana',
        'Rama used a special divine arrow',
        'The monkeys overwhelmed Ravana',
        'Ravana surrendered'
      ],
      correct_answer_id: 1, // Rama used a special divine arrow
      basic_explanation: 'Rama used the Brahmastra, a divine weapon given by the sage Agastya, to finally defeat the ten-headed demon king Ravana.',
      category: 'events'
    },
    {
      id: 'q10_550e8400-e29b-41d4-a716-446655440010',
      text: 'What is the main lesson of Rama\'s return journey?',
      options: [
        'Victory belongs to the strongest',
        'Good triumphs over evil',
        'Family is most important',
        'Power corrupts everyone'
      ],
      correct_answer_id: 1, // Good triumphs over evil
      basic_explanation: 'Rama\'s return to Ayodhya represents the ultimate victory of good over evil, dharma over adharma, and righteousness over corruption.',
      category: 'themes'
    }
  ]
};

// Helper function to get mock quiz for different epics
export const getMockQuiz = (epicId: string, questionCount: number = 10): QuizPackage => {
  switch (epicId) {
    case 'ramayana':
      return {
        ...mockRamayanaQuiz,
        questions: mockRamayanaQuiz.questions.slice(0, questionCount)
      };
    default:
      // For other epics, return a placeholder
      return {
        quiz_id: `quiz_${Date.now()}`,
        epic: {
          id: epicId,
          title: epicId.toUpperCase(),
          language: 'Sanskrit'
        },
        questions: []
      };
  }
};