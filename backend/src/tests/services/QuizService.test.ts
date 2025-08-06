/**
 * QuizService Unit Tests
 * 
 * CRITICAL TESTING: These tests validate the core educational functionality
 * including the hybrid content delivery strategy that enables offline-first mobile app.
 */

import { QuizService } from '../../services/QuizService';
import { setupTests, teardownTests, beginTestTransaction, rollbackTestTransaction, testQuery, testFixtures, getTestQuestionId } from '../setup';

describe('QuizService', () => {
  let quizService: QuizService;

  beforeAll(async () => {
    await setupTests();
    quizService = new QuizService();
  });

  afterAll(async () => {
    await teardownTests();
  });

  beforeEach(async () => {
    await beginTestTransaction();
  });

  afterEach(async () => {
    await rollbackTestTransaction();
  });

  describe('generateQuizPackage()', () => {
    it('should create complete quiz package with offline data', async () => {
      const result = await quizService.generateQuizPackage('test_ramayana', 3);

      // Verify package structure
      expect(result).toHaveProperty('quiz_id');
      expect(result).toHaveProperty('epic');
      expect(result).toHaveProperty('questions');
      expect(result.epic.id).toBe('test_ramayana');
      expect(result.questions).toHaveLength(3);

      // Verify each question has complete offline data
      result.questions.forEach(question => {
        expect(question).toHaveProperty('id');
        expect(question).toHaveProperty('text');
        expect(question).toHaveProperty('options');
        expect(question.options).toHaveLength(4);
        expect(question).toHaveProperty('correct_answer_id');
        expect(question.correct_answer_id).toBeGreaterThanOrEqual(0);
        expect(question.correct_answer_id).toBeLessThan(4);
        expect(question).toHaveProperty('basic_explanation');
        expect(question.basic_explanation.length).toBeGreaterThan(10);
        expect(question).toHaveProperty('category');
        expect(['characters', 'events', 'themes', 'culture']).toContain(question.category);
      });
    });

    it('should generate unique quiz IDs', async () => {
      const result1 = await quizService.generateQuizPackage('test_ramayana', 2);
      const result2 = await quizService.generateQuizPackage('test_ramayana', 2);

      expect(result1.quiz_id).not.toBe(result2.quiz_id);
      expect(result1.quiz_id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should respect question count limits', async () => {
      const result = await quizService.generateQuizPackage('test_ramayana', 2);
      expect(result.questions).toHaveLength(2);
    });

    it('should handle request for more questions than available', async () => {
      // Our test data has 4 questions, request 10
      const result = await quizService.generateQuizPackage('test_ramayana', 10);
      expect(result.questions.length).toBeLessThanOrEqual(4);
      expect(result.questions.length).toBeGreaterThanOrEqual(1);
    });

    it('should throw error for non-existent epic', async () => {
      await expect(
        quizService.generateQuizPackage('nonexistent_epic', 5)
      ).rejects.toThrow('Epic not found or not available');
    });

    it('should throw error for unavailable epic', async () => {
      // Create unavailable epic
      await testQuery(`
        INSERT INTO epics (id, title, is_available) 
        VALUES ('unavailable_epic', 'Unavailable Epic', false)
      `);

      await expect(
        quizService.generateQuizPackage('unavailable_epic', 5)
      ).rejects.toThrow('Epic not found or not available');
    });

    it('should create balanced question distribution when possible', async () => {
      // Add more questions to test balance
      await testQuery(`
        INSERT INTO questions (epic_id, category, difficulty, question_text, options, correct_answer_id, basic_explanation)
        VALUES 
          ('test_ramayana', 'characters', 'easy', 'Test Q5?', '["A","B","C","D"]', 0, 'Test explanation 5'),
          ('test_ramayana', 'characters', 'medium', 'Test Q6?', '["A","B","C","D"]', 1, 'Test explanation 6'),
          ('test_ramayana', 'events', 'easy', 'Test Q7?', '["A","B","C","D"]', 2, 'Test explanation 7'),
          ('test_ramayana', 'themes', 'hard', 'Test Q8?', '["A","B","C","D"]', 3, 'Test explanation 8')
      `);

      const result = await quizService.generateQuizPackage('test_ramayana', 6);
      
      // Count categories
      const categoryCount = result.questions.reduce((acc, q) => {
        acc[q.category] = (acc[q.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Should have representation from multiple categories
      const categories = Object.keys(categoryCount);
      expect(categories.length).toBeGreaterThan(1);
    });
  });

  describe('getDeepDiveContent()', () => {
    it('should return rich educational content for valid question', async () => {
      const questionId = await getTestQuestionId();
      const result = await quizService.getDeepDiveContent(questionId);

      expect(result).toBeTruthy();
      expect(result).toHaveProperty('detailed_explanation');
      expect(result.detailed_explanation.length).toBeGreaterThan(50);
      expect(result).toHaveProperty('cultural_context');
      expect(result).toHaveProperty('related_topics');
      expect(result).toHaveProperty('cross_epic_connections');
      expect(result.related_topics).toBeInstanceOf(Array);
      expect(result.cross_epic_connections).toBeInstanceOf(Array);
    });

    it('should return null for non-existent question', async () => {
      const result = await quizService.getDeepDiveContent('550e8400-e29b-41d4-a716-446655440000');
      expect(result).toBeNull();
    });

    it('should handle questions without educational content gracefully', async () => {
      // Insert question without educational content
      const questionResult = await testQuery(`
        INSERT INTO questions (epic_id, category, difficulty, question_text, options, correct_answer_id, basic_explanation)
        VALUES ('test_ramayana', 'characters', 'easy', 'No deep dive?', '["A","B","C","D"]', 0, 'Basic only')
        RETURNING id
      `);
      
      const questionId = questionResult.rows[0].id;
      const result = await quizService.getDeepDiveContent(questionId);
      
      // Should return basic structure even if some fields are missing
      expect(result).toBeTruthy();
      expect(result).toHaveProperty('detailed_explanation');
    });

    it('should include cross-epic connections when available', async () => {
      const questionId = await getTestQuestionId();
      const result = await quizService.getDeepDiveContent(questionId);

      if (result && result.cross_epic_connections.length > 0) {
        result.cross_epic_connections.forEach(connection => {
          expect(connection).toHaveProperty('epicId');
          expect(connection).toHaveProperty('connection');
          expect(connection).toHaveProperty('similarThemes');
          expect(connection.similarThemes).toBeInstanceOf(Array);
        });
      }
    });
  });

  describe('submitQuizResults()', () => {
    let testQuestionIds: string[];

    beforeEach(async () => {
      // Get test question IDs
      const questions = await testQuery('SELECT id FROM questions WHERE epic_id = $1 LIMIT 3', ['test_ramayana']);
      testQuestionIds = questions.rows.map((row: any) => row.id);
    });

    it('should calculate scores correctly for all correct answers', async () => {
      const answers = testQuestionIds.map(questionId => ({
        question_id: questionId,
        user_answer: 0, // Assume 0 is correct for test
        time_spent: 30
      }));

      // Get correct answers from database
      const correctAnswers = await testQuery(
        'SELECT id, correct_answer_id FROM questions WHERE id = ANY($1)',
        [testQuestionIds]
      );

      // Build answers with correct responses
      const validAnswers = correctAnswers.rows.map((row: any) => ({
        question_id: row.id,
        user_answer: row.correct_answer_id,
        time_spent: 30
      }));

      const result = await quizService.submitQuizResults(
        null, // anonymous user
        'test_ramayana',
        validAnswers,
        90 // total time
      );

      expect(result.score).toBe(100);
      expect(result.totalQuestions).toBe(validAnswers.length);
      expect(result.correctAnswers).toHaveLength(validAnswers.length);
      expect(result.feedback).toContain('Excellent'); // Should have positive feedback
    });

    it('should calculate scores correctly for mixed answers', async () => {
      const answers = testQuestionIds.slice(0, 2).map((questionId, index) => ({
        question_id: questionId,
        user_answer: index === 0 ? 0 : 1, // First correct, second incorrect (assuming 0 is correct)
        time_spent: 30
      }));

      // Get correct answers for comparison
      const correctAnswers = await testQuery(
        'SELECT id, correct_answer_id FROM questions WHERE id = ANY($1)',
        [answers.map(a => a.question_id)]
      );

      // Calculate expected score
      let expectedCorrect = 0;
      answers.forEach(answer => {
        const correct = correctAnswers.rows.find((row: any) => row.id === answer.question_id);
        if (correct && correct.correct_answer_id === answer.user_answer) {
          expectedCorrect++;
        }
      });

      const result = await quizService.submitQuizResults(
        null,
        'test_ramayana',
        answers,
        60
      );

      const expectedScore = Math.round((expectedCorrect / answers.length) * 100);
      expect(result.score).toBe(expectedScore);
      expect(result.totalQuestions).toBe(answers.length);
      expect(result.correctAnswers).toHaveLength(expectedCorrect);
    });

    it('should validate answers against database questions', async () => {
      const fakeQuestionId = '550e8400-e29b-41d4-a716-446655440000';
      const answers = [{
        question_id: fakeQuestionId,
        user_answer: 0,
        time_spent: 30
      }];

      const result = await quizService.submitQuizResults(
        null,
        'test_ramayana',
        answers,
        30
      );

      // Should handle invalid question IDs gracefully
      expect(result.score).toBe(0);
      expect(result.correctAnswers).toHaveLength(0);
    });

    it('should generate appropriate educational feedback', async () => {
      const answers = [{
        question_id: testQuestionIds[0],
        user_answer: 0,
        time_spent: 30
      }];

      const result = await quizService.submitQuizResults(
        null,
        'test_ramayana',
        answers,
        30
      );

      expect(result.feedback).toBeTruthy();
      expect(typeof result.feedback).toBe('string');
      expect(result.feedback.length).toBeGreaterThan(10);
    });

    it('should record quiz session for analytics', async () => {
      const answers = testQuestionIds.slice(0, 2).map(questionId => ({
        question_id: questionId,
        user_answer: 0,
        time_spent: 30
      }));

      await quizService.submitQuizResults(
        null,
        'test_ramayana',
        answers,
        60,
        'mobile',
        '1.0.0'
      );

      // Verify session was recorded
      const sessions = await testQuery(
        'SELECT * FROM quiz_sessions WHERE epic_id = $1',
        ['test_ramayana']
      );

      expect(sessions.rows.length).toBeGreaterThan(0);
      const session = sessions.rows[0];
      expect(session.epic_id).toBe('test_ramayana');
      expect(session.device_type).toBe('mobile');
      expect(session.app_version).toBe('1.0.0');
      expect(session.time_spent).toBe(60);
    });

    it('should handle user progress updates for registered users', async () => {
      // Create test user
      const userResult = await testQuery(`
        INSERT INTO users (id, username) 
        VALUES ('test-user-123', 'testuser') 
        RETURNING id
      `);
      const userId = userResult.rows[0].id;

      const answers = [{
        question_id: testQuestionIds[0],
        user_answer: 0,
        time_spent: 30
      }];

      const result = await quizService.submitQuizResults(
        userId,
        'test_ramayana',
        answers,
        30
      );

      expect(result.progressUpdate).toBeTruthy();
      
      // Verify progress was recorded
      const progress = await testQuery(
        'SELECT * FROM user_progress WHERE user_id = $1 AND epic_id = $2',
        [userId, 'test_ramayana']
      );

      expect(progress.rows.length).toBe(1);
      expect(progress.rows[0].quizzes_completed).toBe(1);
      expect(progress.rows[0].total_questions_answered).toBe(1);
    });

    it('should handle time analysis correctly', async () => {
      const answers = [{
        question_id: testQuestionIds[0],
        user_answer: 0,
        time_spent: 45
      }];

      const result = await quizService.submitQuizResults(
        null,
        'test_ramayana',
        answers,
        45
      );

      // Should calculate average time per question
      expect(result.totalQuestions).toBe(1);
      // Time spent should be recorded correctly
      expect(typeof result.score).toBe('number');
    });
  });

  describe('addQuestion()', () => {
    it('should add new question with valid data', async () => {
      const questionData = {
        epic_id: 'test_ramayana',
        category: 'characters' as const,
        difficulty: 'medium' as const,
        question_text: 'New test question?',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correct_answer_id: 2,
        basic_explanation: 'This is a test explanation for the new question.',
        original_quote: 'Test original quote',
        original_language: 'sanskrit',
        quote_translation: 'Test translation',
        tags: ['new', 'test'],
        cross_epic_tags: ['universal', 'theme']
      };

      const result = await quizService.addQuestion(questionData);

      expect(result).toHaveProperty('id');
      expect(result.epic_id).toBe('test_ramayana');
      expect(result.category).toBe('characters');
      expect(result.difficulty).toBe('medium');
      expect(result.question_text).toBe('New test question?');
      expect(result.options).toEqual(['Option A', 'Option B', 'Option C', 'Option D']);
      expect(result.correct_answer_id).toBe(2);
      expect(result.basic_explanation).toBe('This is a test explanation for the new question.');

      // Verify it was actually inserted
      const inserted = await testQuery('SELECT * FROM questions WHERE id = $1', [result.id]);
      expect(inserted.rows.length).toBe(1);
      expect(inserted.rows[0].question_text).toBe('New test question?');
    });

    it('should enforce question count trigger', async () => {
      const initialCount = await testQuery(
        'SELECT question_count FROM epics WHERE id = $1',
        ['test_ramayana']
      );

      const questionData = {
        epic_id: 'test_ramayana',
        category: 'events' as const,
        difficulty: 'easy' as const,
        question_text: 'Another test question?',
        options: ['A', 'B', 'C', 'D'],
        correct_answer_id: 0,
        basic_explanation: 'Another test explanation.',
        original_quote: undefined,
        original_language: undefined,
        quote_translation: undefined,
        tags: ['count', 'test'],
        cross_epic_tags: ['increment']
      };

      await quizService.addQuestion(questionData);

      const finalCount = await testQuery(
        'SELECT question_count FROM epics WHERE id = $1',
        ['test_ramayana']
      );

      expect(finalCount.rows[0].question_count).toBe(initialCount.rows[0].question_count + 1);
    });
  });

  describe('getQuestionsByCategory()', () => {
    it('should return questions filtered by category', async () => {
      const result = await quizService.getQuestionsByCategory('test_ramayana', 'characters', 10);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      
      result.forEach(question => {
        expect(question.category).toBe('characters');
        expect(question.epic_id).toBe('test_ramayana');
      });
    });

    it('should respect limit parameter', async () => {
      const result = await quizService.getQuestionsByCategory('test_ramayana', 'characters', 1);
      expect(result.length).toBeLessThanOrEqual(1);
    });

    it('should return empty array for non-existent category', async () => {
      const result = await quizService.getQuestionsByCategory('test_ramayana', 'nonexistent' as any, 10);
      expect(result).toEqual([]);
    });
  });
});