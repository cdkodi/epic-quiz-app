/**
 * EpicService Unit Tests
 * 
 * BUSINESS LOGIC TESTING: These tests validate epic management functionality
 * including availability rules and content quality requirements.
 */

import { EpicService } from '../../services/EpicService';
import { setupTests, teardownTests, beginTestTransaction, rollbackTestTransaction, testQuery, testFixtures } from '../setup';

describe('EpicService', () => {
  let epicService: EpicService;

  beforeAll(async () => {
    await setupTests();
    epicService = new EpicService();
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

  describe('getAllEpics()', () => {
    it('should return only available epics by default', async () => {
      // Add unavailable epic
      await testQuery(`
        INSERT INTO epics (id, title, is_available) 
        VALUES ('unavailable_test', 'Unavailable Test Epic', false)
      `);

      const result = await epicService.getAllEpics();

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      
      // All returned epics should be available
      result.forEach(epic => {
        expect(epic.is_available).toBe(true);
      });
      
      // Should not include unavailable epic
      const unavailable = result.find(epic => epic.id === 'unavailable_test');
      expect(unavailable).toBeUndefined();
    });

    it('should include unavailable epics when requested', async () => {
      // Add unavailable epic
      await testQuery(`
        INSERT INTO epics (id, title, is_available) 
        VALUES ('unavailable_test2', 'Another Unavailable Epic', false)
      `);

      const result = await epicService.getAllEpics(true);

      expect(result).toBeInstanceOf(Array);
      
      // Should include both available and unavailable
      const available = result.filter(epic => epic.is_available);
      const unavailable = result.filter(epic => !epic.is_available);
      
      expect(available.length).toBeGreaterThan(0);
      expect(unavailable.length).toBeGreaterThan(0);
      
      // Should include our unavailable epic
      const testUnavailable = result.find(epic => epic.id === 'unavailable_test2');
      expect(testUnavailable).toBeTruthy();
      expect(testUnavailable.is_available).toBe(false);
    });

    it('should return epics sorted by creation date desc', async () => {
      // Add multiple epics with different timestamps
      await testQuery(`
        INSERT INTO epics (id, title, is_available, created_at) 
        VALUES 
          ('oldest_test', 'Oldest Epic', true, '2023-01-01 00:00:00'),
          ('newest_test', 'Newest Epic', true, '2024-01-01 00:00:00')
      `);

      const result = await epicService.getAllEpics();

      expect(result.length).toBeGreaterThan(2);
      
      // Should be sorted by creation date desc (newest first)
      for (let i = 0; i < result.length - 1; i++) {
        const current = new Date(result[i].created_at);
        const next = new Date(result[i + 1].created_at);
        expect(current.getTime()).toBeGreaterThanOrEqual(next.getTime());
      }
    });

    it('should return proper epic structure', async () => {
      const result = await epicService.getAllEpics();

      expect(result.length).toBeGreaterThan(0);
      
      result.forEach(epic => {
        expect(epic).toHaveProperty('id');
        expect(epic).toHaveProperty('title');
        expect(epic).toHaveProperty('description');
        expect(epic).toHaveProperty('language');
        expect(epic).toHaveProperty('culture');
        expect(epic).toHaveProperty('question_count');
        expect(epic).toHaveProperty('is_available');
        expect(epic).toHaveProperty('created_at');
        expect(epic).toHaveProperty('updated_at');
        
        // Validate data types
        expect(typeof epic.id).toBe('string');
        expect(typeof epic.title).toBe('string');
        expect(typeof epic.question_count).toBe('number');
        expect(typeof epic.is_available).toBe('boolean');
        expect(epic.created_at).toBeInstanceOf(Date);
        expect(epic.updated_at).toBeInstanceOf(Date);
      });
    });
  });

  describe('getEpicById()', () => {
    it('should return epic for valid ID', async () => {
      const result = await epicService.getEpicById('test_ramayana');

      expect(result).toBeTruthy();
      expect(result.id).toBe('test_ramayana');
      expect(result.title).toBe('Test Ramayana');
      expect(result.is_available).toBe(true);
    });

    it('should return null for non-existent epic', async () => {
      const result = await epicService.getEpicById('nonexistent_epic');
      expect(result).toBeNull();
    });

    it('should return unavailable epic if it exists', async () => {
      // Add unavailable epic
      await testQuery(`
        INSERT INTO epics (id, title, is_available) 
        VALUES ('unavailable_get_test', 'Unavailable Get Test', false)
      `);

      const result = await epicService.getEpicById('unavailable_get_test');

      expect(result).toBeTruthy();
      expect(result.id).toBe('unavailable_get_test');
      expect(result.is_available).toBe(false);
    });
  });

  describe('createEpic()', () => {
    it('should create new epic with valid data', async () => {
      const epicData = {
        id: 'new_test_epic',
        title: 'New Test Epic',
        description: 'A newly created test epic',
        language: 'sanskrit',
        culture: 'hindu',
        time_period: 'Ancient Test Period',
        difficulty_level: 'intermediate' as const,
        estimated_reading_time: '1-2 hours'
      };

      const result = await epicService.createEpic(epicData);

      expect(result).toBeTruthy();
      expect(result.id).toBe('new_test_epic');
      expect(result.title).toBe('New Test Epic');
      expect(result.is_available).toBe(false); // Should start as unavailable
      expect(result.question_count).toBe(0); // Should start with 0 questions
      expect(result.created_at).toBeInstanceOf(Date);
      expect(result.updated_at).toBeInstanceOf(Date);

      // Verify it was actually inserted
      const inserted = await testQuery('SELECT * FROM epics WHERE id = $1', ['new_test_epic']);
      expect(inserted.rows.length).toBe(1);
      expect(inserted.rows[0].title).toBe('New Test Epic');
    });

    it('should create epic with minimal required data', async () => {
      const epicData = {
        id: 'minimal_epic',
        title: 'Minimal Epic',
        description: undefined,
        language: undefined,
        culture: undefined,
        time_period: undefined,
        difficulty_level: undefined,
        estimated_reading_time: undefined
      };

      const result = await epicService.createEpic(epicData);

      expect(result).toBeTruthy();
      expect(result.id).toBe('minimal_epic');
      expect(result.title).toBe('Minimal Epic');
      expect(result.is_available).toBe(false);
      expect(result.question_count).toBe(0);
    });

    it('should enforce unique epic ID constraint', async () => {
      const epicData = {
        id: 'test_ramayana', // Already exists
        title: 'Duplicate Epic',
        description: 'Should fail',
        language: 'test',
        culture: 'test',
        time_period: 'test',
        difficulty_level: 'beginner' as const,
        estimated_reading_time: 'test'
      };

      await expect(epicService.createEpic(epicData)).rejects.toThrow();
    });
  });

  describe('updateEpicAvailability()', () => {
    it('should successfully make epic available with sufficient questions', async () => {
      // Create epic with enough questions
      await testQuery(`
        INSERT INTO epics (id, title, is_available, question_count) 
        VALUES ('availability_test', 'Availability Test Epic', false, 15)
      `);

      const result = await epicService.updateEpicAvailability('availability_test', true);

      expect(result).toBeTruthy();
      expect(result.id).toBe('availability_test');
      expect(result.is_available).toBe(true);

      // Verify database was updated
      const updated = await testQuery('SELECT is_available FROM epics WHERE id = $1', ['availability_test']);
      expect(updated.rows[0].is_available).toBe(true);
    });

    it('should reject making epic available with insufficient questions', async () => {
      // Create epic with too few questions
      await testQuery(`
        INSERT INTO epics (id, title, is_available, question_count) 
        VALUES ('insufficient_test', 'Insufficient Questions Epic', false, 5)
      `);

      await expect(
        epicService.updateEpicAvailability('insufficient_test', true)
      ).rejects.toThrow('Epic must have at least 10 questions to be made available');

      // Verify epic remains unavailable
      const unchanged = await testQuery('SELECT is_available FROM epics WHERE id = $1', ['insufficient_test']);
      expect(unchanged.rows[0].is_available).toBe(false);
    });

    it('should allow making epic unavailable regardless of question count', async () => {
      const result = await epicService.updateEpicAvailability('test_ramayana', false);

      expect(result).toBeTruthy();
      expect(result.id).toBe('test_ramayana');
      expect(result.is_available).toBe(false);
    });

    it('should return null for non-existent epic', async () => {
      const result = await epicService.updateEpicAvailability('nonexistent', true);
      expect(result).toBeNull();
    });

    it('should update the updated_at timestamp', async () => {
      const before = await testQuery('SELECT updated_at FROM epics WHERE id = $1', ['test_ramayana']);
      const beforeTime = new Date(before.rows[0].updated_at);

      // Wait a bit to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 10));

      await epicService.updateEpicAvailability('test_ramayana', false);

      const after = await testQuery('SELECT updated_at FROM epics WHERE id = $1', ['test_ramayana']);
      const afterTime = new Date(after.rows[0].updated_at);

      expect(afterTime.getTime()).toBeGreaterThan(beforeTime.getTime());
    });
  });

  describe('getEpicStats()', () => {
    beforeEach(async () => {
      // Ensure we have some quiz sessions for testing completion rates
      await testQuery(`
        INSERT INTO users (id, username) VALUES ('stats_user', 'statsuser')
      `);

      await testQuery(`
        INSERT INTO user_progress (user_id, epic_id, quizzes_completed, total_questions_answered, correct_answers, completion_percentage)
        VALUES ('stats_user', 'test_ramayana', 3, 15, 12, 75.0)
      `);
    });

    it('should calculate question counts by category correctly', async () => {
      const result = await epicService.getEpicStats('test_ramayana');

      expect(result).toHaveProperty('total_questions');
      expect(result).toHaveProperty('questions_by_category');
      expect(result).toHaveProperty('questions_by_difficulty');
      expect(result).toHaveProperty('avg_completion_rate');

      expect(typeof result.total_questions).toBe('number');
      expect(result.total_questions).toBeGreaterThan(0);

      // Check category distribution
      const categories = result.questions_by_category;
      expect(categories).toHaveProperty('characters');
      expect(categories).toHaveProperty('events');
      expect(categories).toHaveProperty('themes');
      expect(categories).toHaveProperty('culture');

      // Verify totals add up
      const categoryTotal = Object.values(categories).reduce((sum: number, count: number) => sum + count, 0);
      expect(categoryTotal).toBe(result.total_questions);
    });

    it('should calculate question counts by difficulty correctly', async () => {
      const result = await epicService.getEpicStats('test_ramayana');

      const difficulties = result.questions_by_difficulty;
      expect(difficulties).toHaveProperty('easy');
      expect(difficulties).toHaveProperty('medium');
      expect(difficulties).toHaveProperty('hard');

      // Verify totals add up
      const difficultyTotal = Object.values(difficulties).reduce((sum: number, count: number) => sum + count, 0);
      expect(difficultyTotal).toBe(result.total_questions);
    });

    it('should calculate average completion rate', async () => {
      const result = await epicService.getEpicStats('test_ramayana');

      expect(typeof result.avg_completion_rate).toBe('number');
      expect(result.avg_completion_rate).toBeGreaterThanOrEqual(0);
      expect(result.avg_completion_rate).toBeLessThanOrEqual(100);
    });

    it('should handle epic with no user progress data', async () => {
      // Create epic with no progress data
      await testQuery(`
        INSERT INTO epics (id, title, is_available) 
        VALUES ('no_progress_epic', 'No Progress Epic', true)
      `);

      await testQuery(`
        INSERT INTO questions (epic_id, category, difficulty, question_text, options, correct_answer_id, basic_explanation)
        VALUES ('no_progress_epic', 'characters', 'easy', 'Test?', '["A","B","C","D"]', 0, 'Test')
      `);

      const result = await epicService.getEpicStats('no_progress_epic');

      expect(result.avg_completion_rate).toBe(0);
      expect(result.total_questions).toBe(1);
    });

    it('should return stats for epic with no questions', async () => {
      // Create epic with no questions
      await testQuery(`
        INSERT INTO epics (id, title, is_available, question_count) 
        VALUES ('no_questions_epic', 'No Questions Epic', false, 0)
      `);

      const result = await epicService.getEpicStats('no_questions_epic');

      expect(result.total_questions).toBe(0);
      expect(result.questions_by_category.characters).toBe(0);
      expect(result.questions_by_category.events).toBe(0);
      expect(result.questions_by_category.themes).toBe(0);
      expect(result.questions_by_category.culture).toBe(0);
    });
  });

  describe('searchEpics()', () => {
    beforeEach(async () => {
      // Add epics with different characteristics for search testing
      await testQuery(`
        INSERT INTO epics (id, title, description, culture, is_available) 
        VALUES 
          ('greek_epic', 'Greek Epic Test', 'Ancient Greek literature about heroes', 'greek', true),
          ('hindu_epic', 'Hindu Epic Test', 'Sanskrit literature from ancient India', 'hindu', true),
          ('unavailable_search', 'Unavailable Epic', 'This should not appear in search', 'test', false)
      `);
    });

    it('should find epics by title', async () => {
      const result = await epicService.searchEpics('Greek Epic');

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      
      const found = result.find(epic => epic.id === 'greek_epic');
      expect(found).toBeTruthy();
      expect(found.title).toContain('Greek');
    });

    it('should find epics by description', async () => {
      const result = await epicService.searchEpics('Sanskrit literature');

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      
      const found = result.find(epic => epic.id === 'hindu_epic');
      expect(found).toBeTruthy();
    });

    it('should find epics by culture', async () => {
      const result = await epicService.searchEpics('greek');

      expect(result).toBeInstanceOf(Array);
      const found = result.find(epic => epic.id === 'greek_epic');
      expect(found).toBeTruthy();
    });

    it('should perform case-insensitive search', async () => {
      const result = await epicService.searchEpics('GREEK');

      expect(result).toBeInstanceOf(Array);
      const found = result.find(epic => epic.id === 'greek_epic');
      expect(found).toBeTruthy();
    });

    it('should only return available epics', async () => {
      const result = await epicService.searchEpics('Epic');

      expect(result).toBeInstanceOf(Array);
      
      // Should not include unavailable epic
      const unavailable = result.find(epic => epic.id === 'unavailable_search');
      expect(unavailable).toBeUndefined();
      
      // All results should be available
      result.forEach(epic => {
        expect(epic.is_available).toBe(true);
      });
    });

    it('should return empty array for no matches', async () => {
      const result = await epicService.searchEpics('NonExistentSearchTerm');
      expect(result).toEqual([]);
    });

    it('should sort results with title matches first', async () => {
      // Add epics to test sorting priority
      await testQuery(`
        INSERT INTO epics (id, title, description, is_available) 
        VALUES 
          ('title_match', 'Heroes and Legends', 'Description without key term', true),
          ('desc_match', 'Another Epic', 'This epic is about heroes in ancient times', true)
      `);

      const result = await epicService.searchEpics('Heroes');

      expect(result.length).toBeGreaterThan(1);
      
      // Title matches should come before description matches
      const titleMatch = result.find(epic => epic.id === 'title_match');
      const descMatch = result.find(epic => epic.id === 'desc_match');
      
      if (titleMatch && descMatch) {
        const titleIndex = result.indexOf(titleMatch);
        const descIndex = result.indexOf(descMatch);
        expect(titleIndex).toBeLessThan(descIndex);
      }
    });
  });

  describe('getTrendingEpics()', () => {
    beforeEach(async () => {
      // Add additional epics for trending test
      await testQuery(`
        INSERT INTO epics (id, title, is_available) 
        VALUES 
          ('trending_epic_1', 'Trending Epic 1', true),
          ('trending_epic_2', 'Trending Epic 2', true),
          ('not_trending', 'Not Trending Epic', true)
      `);

      // Add recent quiz sessions to make epics "trending"
      const recentDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 1 day ago
      const weekAgoDate = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000); // 8 days ago (outside trending window)

      await testQuery(`
        INSERT INTO quiz_sessions (id, epic_id, questions_answered, score, total_questions, time_spent, completed_at)
        VALUES 
          ('session1', 'test_ramayana', '[]', 80, 5, 300, $1),
          ('session2', 'test_ramayana', '[]', 90, 5, 250, $1),
          ('session3', 'trending_epic_1', '[]', 70, 3, 180, $1),
          ('session4', 'not_trending', '[]', 60, 4, 240, $2)
      `, [recentDate.toISOString(), weekAgoDate.toISOString()]);
    });

    it('should return epics sorted by recent activity', async () => {
      const result = await epicService.getTrendingEpics(5);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBeLessThanOrEqual(5);

      // All should be available
      result.forEach(epic => {
        expect(epic.is_available).toBe(true);
      });

      // Should include epics with recent activity first
      const ramayana = result.find(epic => epic.id === 'test_ramayana');
      const trending1 = result.find(epic => epic.id === 'trending_epic_1');
      
      expect(ramayana).toBeTruthy(); // Should be included (has recent sessions)
      expect(trending1).toBeTruthy(); // Should be included (has recent sessions)
    });

    it('should respect limit parameter', async () => {
      const result = await epicService.getTrendingEpics(2);
      expect(result.length).toBeLessThanOrEqual(2);
    });

    it('should exclude unavailable epics from trending', async () => {
      // Make one epic unavailable
      await testQuery(`UPDATE epics SET is_available = false WHERE id = 'trending_epic_1'`);

      const result = await epicService.getTrendingEpics(10);

      const unavailable = result.find(epic => epic.id === 'trending_epic_1');
      expect(unavailable).toBeUndefined();
    });

    it('should handle case with no recent activity', async () => {
      // Clear recent sessions
      await testQuery(`DELETE FROM quiz_sessions WHERE completed_at > NOW() - INTERVAL '7 days'`);

      const result = await epicService.getTrendingEpics(5);

      // Should still return available epics, just sorted by creation date
      expect(result).toBeInstanceOf(Array);
      result.forEach(epic => {
        expect(epic.is_available).toBe(true);
      });
    });
  });
});