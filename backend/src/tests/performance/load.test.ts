/**
 * Performance and Load Tests
 * 
 * CRITICAL SLA TESTING: These tests validate that the API meets educational
 * performance requirements under load, especially for mobile usage scenarios.
 */

import request from 'supertest';
import { Express } from 'express';
import { setupTests, teardownTests, beginTestTransaction, rollbackTestTransaction, testQuery } from '../setup';

// Mock the main app setup (same as integration tests)
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import epicsRouter from '../../routes/epics';
import quizRouter from '../../routes/quiz';
import contentRouter from '../../routes/content';

let app: Express;

describe('Performance and Load Tests', () => {
  beforeAll(async () => {
    await setupTests();
    
    // Set up test app
    app = express();
    app.use(helmet());
    app.use(cors());
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true }));
    
    app.use('/api/v1/epics', epicsRouter);
    app.use('/api/v1/quiz', quizRouter);
    app.use('/api/v1/questions', contentRouter);
    app.use('/api/v1/content', contentRouter);
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

  describe('Quiz Generation Performance - CRITICAL SLA: <2s', () => {
    it('should generate quiz package within 2 seconds', async () => {
      const startTime = Date.now();
      
      const response = await request(app)
        .get('/api/v1/quiz?epic=test_ramayana&count=10');
      
      const duration = Date.now() - startTime;
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(duration).toBeLessThan(2000); // 2 second SLA
      
      console.log(`Quiz generation took ${duration}ms (SLA: <2000ms)`);
    });

    it('should maintain performance with maximum question count', async () => {
      const startTime = Date.now();
      
      const response = await request(app)
        .get('/api/v1/quiz?epic=test_ramayana&count=20'); // Maximum allowed
      
      const duration = Date.now() - startTime;
      
      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(3000); // Slightly higher allowance for max questions
      
      console.log(`Max question quiz generation took ${duration}ms`);
    });

    it('should handle concurrent quiz generations efficiently', async () => {
      const concurrentRequests = 10;
      const promises: Promise<any>[] = [];
      
      const startTime = Date.now();
      
      for (let i = 0; i < concurrentRequests; i++) {
        promises.push(
          request(app)
            .get('/api/v1/quiz?epic=test_ramayana&count=5')
            .then(response => {
              expect(response.status).toBe(200);
              return response;
            })
        );
      }
      
      const responses = await Promise.all(promises);
      const duration = Date.now() - startTime;
      
      expect(responses).toHaveLength(concurrentRequests);
      
      // All requests should succeed
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.questions).toHaveLength(5);
      });
      
      // Average time per request should be reasonable
      const avgTime = duration / concurrentRequests;
      expect(avgTime).toBeLessThan(4000); // 4s average under concurrent load
      
      console.log(`${concurrentRequests} concurrent requests took ${duration}ms total, ${avgTime.toFixed(0)}ms average`);
    });

    it('should generate unique quiz IDs under concurrent load', async () => {
      const concurrentRequests = 20;
      const promises: Promise<any>[] = [];
      
      for (let i = 0; i < concurrentRequests; i++) {
        promises.push(
          request(app)
            .get('/api/v1/quiz?epic=test_ramayana&count=3')
        );
      }
      
      const responses = await Promise.all(promises);
      const quizIds = responses.map(response => response.body.data.quiz_id);
      
      // All quiz IDs should be unique
      const uniqueIds = new Set(quizIds);
      expect(uniqueIds.size).toBe(concurrentRequests);
      
      console.log(`Generated ${uniqueIds.size} unique quiz IDs under concurrent load`);
    });
  });

  describe('Deep Dive Content Performance - CRITICAL SLA: <1s', () => {
    let testQuestionId: string;

    beforeEach(async () => {
      const result = await testQuery('SELECT id FROM questions WHERE epic_id = $1 LIMIT 1', ['test_ramayana']);
      testQuestionId = result.rows[0].id;
    });

    it('should load educational content within 1 second', async () => {
      const startTime = Date.now();
      
      const response = await request(app)
        .get(`/api/v1/questions/${testQuestionId}/deep-dive`);
      
      const duration = Date.now() - startTime;
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(duration).toBeLessThan(1000); // 1 second SLA
      
      console.log(`Deep dive content loaded in ${duration}ms (SLA: <1000ms)`);
    });

    it('should handle concurrent deep dive requests efficiently', async () => {
      const concurrentRequests = 15;
      const promises: Promise<any>[] = [];
      
      const startTime = Date.now();
      
      for (let i = 0; i < concurrentRequests; i++) {
        promises.push(
          request(app)
            .get(`/api/v1/questions/${testQuestionId}/deep-dive`)
            .then(response => {
              expect(response.status).toBe(200);
              return response;
            })
        );
      }
      
      const responses = await Promise.all(promises);
      const duration = Date.now() - startTime;
      
      expect(responses).toHaveLength(concurrentRequests);
      
      // All requests should return identical content (testing caching effectiveness)
      const firstContent = responses[0].body.data.content.detailed_explanation;
      responses.forEach(response => {
        expect(response.body.data.content.detailed_explanation).toBe(firstContent);
      });
      
      const avgTime = duration / concurrentRequests;
      expect(avgTime).toBeLessThan(1500); // 1.5s average under concurrent load
      
      console.log(`${concurrentRequests} concurrent deep dive requests: ${avgTime.toFixed(0)}ms average`);
    });
  });

  describe('Epic Listing Performance', () => {
    beforeEach(async () => {
      // Add multiple epics for performance testing
      const epicsToAdd = [
        { id: 'perf_epic_1', title: 'Performance Epic 1', is_available: true },
        { id: 'perf_epic_2', title: 'Performance Epic 2', is_available: true },
        { id: 'perf_epic_3', title: 'Performance Epic 3', is_available: false },
        { id: 'perf_epic_4', title: 'Performance Epic 4', is_available: true },
        { id: 'perf_epic_5', title: 'Performance Epic 5', is_available: true }
      ];

      for (const epic of epicsToAdd) {
        await testQuery(`
          INSERT INTO epics (id, title, is_available) 
          VALUES ($1, $2, $3)
          ON CONFLICT (id) DO NOTHING
        `, [epic.id, epic.title, epic.is_available]);
      }
    });

    it('should list epics within 500ms', async () => {
      const startTime = Date.now();
      
      const response = await request(app).get('/api/v1/epics');
      
      const duration = Date.now() - startTime;
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(duration).toBeLessThan(500); // 500ms target
      
      console.log(`Epic listing took ${duration}ms (target: <500ms)`);
    });

    it('should handle epic search efficiently', async () => {
      const startTime = Date.now();
      
      const response = await request(app).get('/api/v1/epics/search?q=Performance');
      
      const duration = Date.now() - startTime;
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(duration).toBeLessThan(800); // 800ms for search with LIKE queries
      
      console.log(`Epic search took ${duration}ms (target: <800ms)`);
    });

    it('should calculate epic stats efficiently', async () => {
      const startTime = Date.now();
      
      const response = await request(app).get('/api/v1/epics/test_ramayana/stats');
      
      const duration = Date.now() - startTime;
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(duration).toBeLessThan(1000); // 1s for complex aggregation queries
      
      console.log(`Epic stats calculation took ${duration}ms (target: <1000ms)`);
    });
  });

  describe('Quiz Submission Performance', () => {
    let testQuestionIds: string[];

    beforeEach(async () => {
      const result = await testQuery('SELECT id FROM questions WHERE epic_id = $1 LIMIT 5', ['test_ramayana']);
      testQuestionIds = result.rows.map(row => row.id);
    });

    it('should process quiz submission within 1 second', async () => {
      const submission = {
        quizId: '550e8400-e29b-41d4-a716-446655440000',
        epicId: 'test_ramayana',
        answers: testQuestionIds.slice(0, 3).map(questionId => ({
          question_id: questionId,
          user_answer: 0,
          time_spent: 30
        })),
        timeSpent: 90,
        deviceType: 'mobile',
        appVersion: '1.0.0'
      };

      const startTime = Date.now();
      
      const response = await request(app)
        .post('/api/v1/quiz/submit')
        .send(submission);
      
      const duration = Date.now() - startTime;
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(duration).toBeLessThan(1000); // 1 second for submission processing
      
      console.log(`Quiz submission processed in ${duration}ms (target: <1000ms)`);
    });

    it('should handle concurrent quiz submissions', async () => {
      const concurrentSubmissions = 8;
      const promises: Promise<any>[] = [];
      
      const startTime = Date.now();
      
      for (let i = 0; i < concurrentSubmissions; i++) {
        const submission = {
          quizId: `550e8400-e29b-41d4-a716-${String(i).padStart(12, '0')}`,
          epicId: 'test_ramayana',
          answers: [{
            question_id: testQuestionIds[0],
            user_answer: i % 4, // Vary answers
            time_spent: 30 + i * 5
          }],
          timeSpent: 30 + i * 5,
          deviceType: 'mobile',
          appVersion: '1.0.0'
        };

        promises.push(
          request(app)
            .post('/api/v1/quiz/submit')
            .send(submission)
        );
      }
      
      const responses = await Promise.all(promises);
      const duration = Date.now() - startTime;
      
      expect(responses).toHaveLength(concurrentSubmissions);
      
      // All submissions should succeed
      responses.forEach((response, index) => {
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('score');
        expect(response.body.data).toHaveProperty('feedback');
      });
      
      const avgTime = duration / concurrentSubmissions;
      expect(avgTime).toBeLessThan(2000); // 2s average under concurrent load
      
      console.log(`${concurrentSubmissions} concurrent submissions: ${avgTime.toFixed(0)}ms average`);
    });
  });

  describe('Database Performance Under Load', () => {
    it('should maintain query performance with multiple operations', async () => {
      // Simulate mixed workload: epic listing, quiz generation, content retrieval
      const mixedOperations: Promise<any>[] = [];
      
      const startTime = Date.now();
      
      // Add epic listings
      for (let i = 0; i < 5; i++) {
        mixedOperations.push(request(app).get('/api/v1/epics'));
      }
      
      // Add quiz generations
      for (let i = 0; i < 10; i++) {
        mixedOperations.push(
          request(app).get('/api/v1/quiz?epic=test_ramayana&count=3')
        );
      }
      
      // Add deep dive content requests
      const questionResult = await testQuery('SELECT id FROM questions WHERE epic_id = $1 LIMIT 1', ['test_ramayana']);
      const questionId = questionResult.rows[0].id;
      
      for (let i = 0; i < 8; i++) {
        mixedOperations.push(
          request(app).get(`/api/v1/questions/${questionId}/deep-dive`)
        );
      }
      
      const responses = await Promise.all(mixedOperations);
      const duration = Date.now() - startTime;
      
      expect(responses).toHaveLength(23); // 5 + 10 + 8
      
      // All operations should succeed
      responses.forEach(response => {
        expect(response.status).toBeGreaterThanOrEqual(200);
        expect(response.status).toBeLessThan(300);
      });
      
      const avgTime = duration / responses.length;
      expect(avgTime).toBeLessThan(1500); // 1.5s average for mixed workload
      
      console.log(`Mixed workload (${responses.length} operations): ${avgTime.toFixed(0)}ms average`);
    });

    it('should handle high-frequency requests without degradation', async () => {
      const requestCount = 50;
      const promises: Promise<any>[] = [];
      
      const startTime = Date.now();
      
      // Rapid-fire epic requests (simulating mobile app refreshes)
      for (let i = 0; i < requestCount; i++) {
        promises.push(
          request(app)
            .get('/api/v1/epics')
            .then(response => {
              expect(response.status).toBe(200);
              return Date.now(); // Return completion time
            })
        );
      }
      
      const completionTimes = await Promise.all(promises);
      const totalDuration = Date.now() - startTime;
      
      // Calculate request rate
      const requestsPerSecond = (requestCount / totalDuration) * 1000;
      
      // Should handle at least 20 requests per second
      expect(requestsPerSecond).toBeGreaterThan(20);
      
      console.log(`Handled ${requestsPerSecond.toFixed(1)} requests/second (target: >20)`);
      
      // Check for performance consistency (no significant degradation over time)
      const firstHalfAvg = completionTimes.slice(0, 25).reduce((sum, time) => sum + (time - startTime), 0) / 25;
      const secondHalfAvg = completionTimes.slice(25).reduce((sum, time) => sum + (time - startTime), 0) / 25;
      
      // Second half shouldn't be more than 50% slower than first half
      expect(secondHalfAvg).toBeLessThan(firstHalfAvg * 1.5);
      
      console.log(`Performance consistency: first half ${firstHalfAvg.toFixed(0)}ms, second half ${secondHalfAvg.toFixed(0)}ms`);
    });
  });

  describe('Memory and Resource Usage', () => {
    it('should not have memory leaks with repeated requests', async () => {
      const initialMemory = process.memoryUsage();
      
      // Make many requests to test for memory leaks
      for (let i = 0; i < 100; i++) {
        await request(app).get('/api/v1/epics');
      }
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = process.memoryUsage();
      
      // Memory usage shouldn't increase dramatically
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
      const memoryIncreaseRatio = memoryIncrease / initialMemory.heapUsed;
      
      expect(memoryIncreaseRatio).toBeLessThan(0.5); // Less than 50% increase
      
      console.log(`Memory increase after 100 requests: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB (${(memoryIncreaseRatio * 100).toFixed(1)}%)`);
    });

    it('should handle large quiz packages efficiently', async () => {
      // Add more questions to create larger quiz packages
      const largeQuestionSet = [];
      for (let i = 0; i < 20; i++) {
        largeQuestionSet.push([
          'test_ramayana',
          'characters',
          'medium',
          `Large test question ${i}?`,
          '["Option A", "Option B", "Option C", "Option D"]',
          i % 4,
          `This is a longer explanation for test question ${i} that includes more detailed content to test performance with larger response payloads. It should still be fast enough for mobile consumption.`
        ]);
      }

      for (const question of largeQuestionSet) {
        await testQuery(`
          INSERT INTO questions (epic_id, category, difficulty, question_text, options, correct_answer_id, basic_explanation)
          VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7)
        `, question);
      }

      const startTime = Date.now();
      
      const response = await request(app)
        .get('/api/v1/quiz?epic=test_ramayana&count=20');
      
      const duration = Date.now() - startTime;
      
      expect(response.status).toBe(200);
      expect(response.body.data.questions).toHaveLength(20);
      expect(duration).toBeLessThan(3000); // 3s for large quiz package
      
      // Check response size
      const responseSize = JSON.stringify(response.body).length;
      console.log(`Large quiz package (20 questions) generated in ${duration}ms, size: ${(responseSize / 1024).toFixed(1)}KB`);
      
      // Should be under 200KB for mobile efficiency
      expect(responseSize).toBeLessThan(200 * 1024); // 200KB limit
    });
  });
});