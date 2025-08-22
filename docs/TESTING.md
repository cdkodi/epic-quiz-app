# Epic Quiz App - Testing Strategy & Specifications

## Testing Philosophy

The Epic Quiz App requires comprehensive testing due to its educational nature and offline-first architecture. Our testing strategy ensures:

1. **Educational Content Accuracy**: Cultural and historical content must be precise
2. **Offline Reliability**: Bulk download packages must be complete and correct
3. **Performance at Scale**: API must handle multiple concurrent quiz generations
4. **Cross-Cultural Sensitivity**: Content validation across multiple epic traditions

## Testing Architecture

### Testing Pyramid Structure

```
                    🔺 E2E Tests (Few)
                   /   Mobile + API Integration
                  /    Performance Under Load
                 /     Real User Scenarios
                
              🔷 Integration Tests (Some)
             /   API Endpoints + Database
            /    Service Layer Integration
           /     Data Flow Validation
          
        🔶 Unit Tests (Many)
       /   Service Methods
      /    Database Queries  
     /     Validation Logic
    /      Business Rules
```

### Test Categories

#### 1. **Unit Tests** (Target: 80%+ coverage)
- **Service Layer Logic**: EpicService, QuizService business rules
- **Validation Middleware**: Request validation and error formatting
- **Database Queries**: SQL query accuracy and performance
- **Content Processing**: Question selection algorithms, scoring logic

#### 2. **Integration Tests** (Target: Key workflows)
- **API Endpoints**: Full request/response cycles with database
- **Database Migrations**: Schema creation and data integrity
- **Content Delivery**: Bulk download completeness and accuracy
- **Cross-Service Communication**: Service interactions

#### 3. **Performance Tests** (Target: SLA compliance)
- **Quiz Generation**: <2s response time for 10-question package
- **Deep Dive Content**: <1s response time for educational content
- **Concurrent Users**: 100+ simultaneous quiz requests
- **Database Performance**: Query optimization validation

#### 4. **Content Quality Tests** (Target: Educational accuracy)
- **Cultural Sensitivity**: Automated content review
- **Translation Accuracy**: Original quotes and translations
- **Cross-Epic Connections**: Thematic link validation
- **Educational Value**: Content depth and learning objectives

## Test Specifications

### Unit Test Specifications

#### **EpicService Unit Tests**

```typescript
describe('EpicService', () => {
  describe('getAllEpics()', () => {
    it('should return only available epics by default', async () => {
      // Test that unavailable epics are filtered out
      // Verify response structure and data accuracy
    });
    
    it('should include unavailable epics when requested', async () => {
      // Test includeUnavailable parameter
      // Verify admin functionality
    });
    
    it('should return epics sorted by creation date', async () => {
      // Test default sorting behavior
      // Verify consistent ordering
    });
  });

  describe('getEpicStats()', () => {
    it('should calculate correct question distribution', async () => {
      // Test category and difficulty counting
      // Verify statistical accuracy
    });
    
    it('should calculate average completion rate correctly', async () => {
      // Test progress aggregation
      // Verify mathematical accuracy
    });
    
    it('should handle epics with no quiz data', async () => {
      // Test edge cases
      // Verify graceful handling of missing data
    });
  });

  describe('updateEpicAvailability()', () => {
    it('should enforce minimum question requirement', async () => {
      // Test business rule: 10 questions minimum
      // Verify error thrown for insufficient content
    });
    
    it('should successfully publish epic with sufficient questions', async () => {
      // Test successful availability update
      // Verify database state change
    });
  });
});
```

#### **QuizService Unit Tests**

```typescript
describe('QuizService', () => {
  describe('generateQuizPackage()', () => {
    it('should create balanced question distribution', async () => {
      // Test algorithm for category/difficulty balance
      // Verify fair representation across all categories
    });
    
    it('should include complete offline data', async () => {
      // Test that package includes all required fields
      // Verify no missing data for offline functionality
    });
    
    it('should respect question count limits', async () => {
      // Test min/max question constraints
      // Verify parameter validation
    });
    
    it('should generate unique quiz IDs', async () => {
      // Test UUID generation and uniqueness
      // Verify no collisions in concurrent generation
    });
    
    it('should handle insufficient questions gracefully', async () => {
      // Test error handling for epics with few questions
      // Verify meaningful error messages
    });
  });

  describe('submitQuizResults()', () => {
    it('should calculate scores correctly', async () => {
      // Test scoring algorithm accuracy
      // Verify percentage calculations
    });
    
    it('should validate answers against database', async () => {
      // Test answer validation logic
      // Verify protection against cheating
    });
    
    it('should update user progress accurately', async () => {
      // Test progress tracking calculations
      // Verify category-specific score updates
    });
    
    it('should generate appropriate educational feedback', async () => {
      // Test feedback algorithm
      // Verify encouraging and helpful messages
    });
    
    it('should handle anonymous users correctly', async () => {
      // Test functionality without user authentication
      // Verify session recording without progress updates
    });
  });

  describe('getDeepDiveContent()', () => {
    it('should return complete educational content', async () => {
      // Test content retrieval accuracy
      // Verify all educational fields present
    });
    
    it('should handle missing content gracefully', async () => {
      // Test fallback behavior for incomplete content
      // Verify meaningful responses
    });
    
    it('should include cross-epic connections when available', async () => {
      // Test thematic link retrieval
      // Verify JSONB query accuracy
    });
  });
});
```

### Integration Test Specifications

#### **API Endpoint Integration Tests**

```typescript
describe('Epic Quiz API Integration', () => {
  describe('GET /api/v1/epics', () => {
    it('should return formatted epic list with metadata', async () => {
      const response = await request(app).get('/api/v1/epics');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.meta.count).toBeGreaterThan(0);
    });
    
    it('should filter unavailable epics by default', async () => {
      // Test default filtering behavior
      // Verify business rule enforcement
    });
  });

  describe('GET /api/v1/quiz', () => {
    it('should generate complete quiz package for valid epic', async () => {
      const response = await request(app)
        .get('/api/v1/quiz?epic=ramayana&count=5');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.questions).toHaveLength(5);
      
      // Verify complete offline data
      response.body.data.questions.forEach(question => {
        expect(question).toHaveProperty('id');
        expect(question).toHaveProperty('text');
        expect(question).toHaveProperty('options');
        expect(question.options).toHaveLength(4);
        expect(question).toHaveProperty('correct_answer_id');
        expect(question).toHaveProperty('basic_explanation');
        expect(question).toHaveProperty('category');
      });
    });
    
    it('should return 404 for non-existent epic', async () => {
      const response = await request(app)
        .get('/api/v1/quiz?epic=nonexistent');
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
    
    it('should validate quiz parameters', async () => {
      const response = await request(app)
        .get('/api/v1/quiz?epic=ramayana&count=25'); // Exceeds max
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation Error');
    });
  });

  describe('POST /api/v1/quiz/submit', () => {
    it('should process valid quiz submission', async () => {
      const submission = {
        quizId: '550e8400-e29b-41d4-a716-446655440000',
        epicId: 'ramayana',
        answers: [
          {
            question_id: '123e4567-e89b-12d3-a456-426614174000',
            user_answer: 0,
            time_spent: 45
          }
        ],
        timeSpent: 300,
        deviceType: 'mobile',
        appVersion: '1.0.0'
      };
      
      const response = await request(app)
        .post('/api/v1/quiz/submit')
        .send(submission);
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('score');
      expect(response.body.data).toHaveProperty('feedback');
      expect(response.body.data.feedback).toHaveProperty('message');
    });
    
    it('should validate answer format', async () => {
      const invalidSubmission = {
        quizId: 'invalid-uuid',
        epicId: 'ramayana',
        answers: []
      };
      
      const response = await request(app)
        .post('/api/v1/quiz/submit')
        .send(invalidSubmission);
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation Error');
    });
  });

  describe('GET /api/v1/questions/:id/deep-dive', () => {
    it('should return rich educational content', async () => {
      const questionId = '123e4567-e89b-12d3-a456-426614174000';
      const response = await request(app)
        .get(`/api/v1/questions/${questionId}/deep-dive`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.content).toHaveProperty('detailed_explanation');
      expect(response.body.data.learning_features).toHaveProperty('estimated_reading_minutes');
    });
    
    it('should return 404 for invalid question ID', async () => {
      const response = await request(app)
        .get('/api/v1/questions/550e8400-e29b-41d4-a716-446655440000/deep-dive');
      
      expect(response.status).toBe(404);
    });
  });
});
```

#### **Database Integration Tests**

```typescript
describe('Database Integration', () => {
  describe('Migration System', () => {
    it('should create all required tables', async () => {
      await database.runMigrations();
      
      // Verify table existence
      const tables = await database.query(`
        SELECT tablename FROM pg_tables 
        WHERE schemaname = 'public' 
        ORDER BY tablename
      `);
      
      const expectedTables = [
        'epics', 'questions', 'educational_content',
        'users', 'user_progress', 'quiz_sessions', 'user_bookmarks'
      ];
      
      expectedTables.forEach(table => {
        expect(tables.rows.find(t => t.tablename === table)).toBeTruthy();
      });
    });
    
    it('should create required indexes', async () => {
      // Test index creation for performance
      const indexes = await database.query(`
        SELECT indexname FROM pg_indexes 
        WHERE tablename IN ('questions', 'user_progress', 'quiz_sessions')
      `);
      
      expect(indexes.rows.length).toBeGreaterThan(5);
    });
  });

  describe('Seed Data', () => {
    it('should insert Ramayana questions correctly', async () => {
      // Test seed data insertion
      const questions = await database.query(
        'SELECT * FROM questions WHERE epic_id = $1',
        ['ramayana']
      );
      
      expect(questions.rows.length).toBeGreaterThan(5);
      
      // Verify question structure
      questions.rows.forEach(question => {
        expect(question.options).toBeInstanceOf(Array);
        expect(question.options).toHaveLength(4);
        expect(question.correct_answer_id).toBeGreaterThanOrEqual(0);
        expect(question.correct_answer_id).toBeLessThan(4);
      });
    });
  });

  describe('Data Integrity', () => {
    it('should enforce foreign key constraints', async () => {
      // Test referential integrity
      await expect(
        database.query(
          'INSERT INTO questions (epic_id, category, difficulty, question_text, options, correct_answer_id, basic_explanation) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          ['nonexistent', 'characters', 'easy', 'Test?', '["A","B","C","D"]', 0, 'Test explanation']
        )
      ).rejects.toThrow();
    });
    
    it('should validate JSONB structure', async () => {
      // Test JSONB constraints
      await expect(
        database.query(
          'INSERT INTO questions (epic_id, category, difficulty, question_text, options, correct_answer_id, basic_explanation) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          ['ramayana', 'characters', 'easy', 'Test?', '["A","B","C"]', 0, 'Test explanation'] // Only 3 options
        )
      ).rejects.toThrow();
    });
  });
});
```

### Performance Test Specifications

#### **Load Testing**

```typescript
describe('Performance Tests', () => {
  describe('Quiz Generation Performance', () => {
    it('should generate quiz package within 2 seconds', async () => {
      const startTime = Date.now();
      
      const response = await request(app)
        .get('/api/v1/quiz?epic=ramayana&count=10');
      
      const duration = Date.now() - startTime;
      
      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(2000); // 2 second SLA
    });
    
    it('should handle 50 concurrent quiz generations', async () => {
      const promises = Array(50).fill(null).map(() => 
        request(app).get('/api/v1/quiz?epic=ramayana&count=10')
      );
      
      const startTime = Date.now();
      const responses = await Promise.all(promises);
      const duration = Date.now() - startTime;
      
      // All should succeed
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
      
      // Average response time should be reasonable
      expect(duration / 50).toBeLessThan(3000);
    });
  });

  describe('Deep Dive Content Performance', () => {
    it('should load educational content within 1 second', async () => {
      const questionId = '123e4567-e89b-12d3-a456-426614174000';
      const startTime = Date.now();
      
      const response = await request(app)
        .get(`/api/v1/questions/${questionId}/deep-dive`);
      
      const duration = Date.now() - startTime;
      
      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(1000); // 1 second SLA
    });
  });

  describe('Database Performance', () => {
    it('should execute balanced question query efficiently', async () => {
      const startTime = Date.now();
      
      await database.query(`
        WITH balanced_questions AS (
          SELECT *, ROW_NUMBER() OVER (PARTITION BY category, difficulty ORDER BY RANDOM()) as rn
          FROM questions 
          WHERE epic_id = $1
        )
        SELECT * FROM balanced_questions 
        WHERE rn <= CEIL($2::float / (4 * 3))
        ORDER BY RANDOM()
        LIMIT $2
      `, ['ramayana', 10]);
      
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(500); // 500ms for database query
    });
  });
});
```

### Content Quality Test Specifications

#### **Educational Content Validation**

```typescript
describe('Content Quality Tests', () => {
  describe('Cultural Sensitivity', () => {
    it('should use respectful language in all content', async () => {
      const questions = await database.query(
        'SELECT basic_explanation FROM questions'
      );
      
      questions.rows.forEach(question => {
        // Test for culturally sensitive language
        expect(question.basic_explanation).not.toMatch(/offensive|inappropriate|terms/i);
      });
    });
    
    it('should provide accurate translations', async () => {
      const content = await database.query(`
        SELECT original_quote, quote_translation 
        FROM questions 
        WHERE original_quote IS NOT NULL
      `);
      
      content.rows.forEach(row => {
        expect(row.quote_translation).toBeTruthy();
        expect(row.quote_translation.length).toBeGreaterThan(5);
      });
    });
  });

  describe('Educational Value', () => {
    it('should provide meaningful explanations', async () => {
      const questions = await database.query(
        'SELECT basic_explanation FROM questions'
      );
      
      questions.rows.forEach(question => {
        expect(question.basic_explanation.length).toBeGreaterThan(20);
        expect(question.basic_explanation).toMatch(/[.!?]$/); // Proper sentence ending
      });
    });
    
    it('should have comprehensive deep dive content', async () => {
      const content = await database.query(`
        SELECT detailed_explanation, cultural_context 
        FROM educational_content
      `);
      
      content.rows.forEach(row => {
        expect(row.detailed_explanation.length).toBeGreaterThan(200);
        if (row.cultural_context) {
          expect(row.cultural_context.length).toBeGreaterThan(50);
        }
      });
    });
  });

  describe('Cross-Epic Connections', () => {
    it('should have valid cross-epic connection structure', async () => {
      const connections = await database.query(`
        SELECT cross_epic_connections 
        FROM educational_content 
        WHERE cross_epic_connections IS NOT NULL
      `);
      
      connections.rows.forEach(row => {
        const connections = row.cross_epic_connections;
        if (connections && connections.length > 0) {
          connections.forEach(conn => {
            expect(conn).toHaveProperty('epicId');
            expect(conn).toHaveProperty('connection');
            expect(conn).toHaveProperty('similarThemes');
            expect(conn.similarThemes).toBeInstanceOf(Array);
          });
        }
      });
    });
  });
});
```

## Test Data Management

### Test Database Setup

```typescript
// Test database configuration
const testDbConfig = {
  host: process.env.TEST_DB_HOST || 'localhost',
  port: parseInt(process.env.TEST_DB_PORT || '5432'),
  database: process.env.TEST_DB_NAME || 'epic_quiz_test',
  user: process.env.TEST_DB_USER || 'postgres',
  password: process.env.TEST_DB_PASSWORD || 'password'
};

beforeAll(async () => {
  // Create test database
  await createTestDatabase();
  await runMigrationsForTest();
  await seedTestData();
});

afterAll(async () => {
  await cleanupTestDatabase();
});

beforeEach(async () => {
  await beginTransaction();
});

afterEach(async () => {
  await rollbackTransaction();
});
```

### Test Data Fixtures

```typescript
export const testFixtures = {
  epics: [
    {
      id: 'test_ramayana',
      title: 'Test Ramayana',
      description: 'Test epic for automated testing',
      is_available: true,
      question_count: 10
    }
  ],
  
  questions: [
    {
      epic_id: 'test_ramayana',
      category: 'characters',
      difficulty: 'easy',
      question_text: 'Test question?',
      options: ['A', 'B', 'C', 'D'],
      correct_answer_id: 0,
      basic_explanation: 'Test explanation for educational content validation.'
    }
  ]
};
```

## Coverage Requirements

### Minimum Coverage Targets
- **Unit Tests**: 85% code coverage
- **Integration Tests**: 100% critical path coverage
- **Performance Tests**: All SLA-critical endpoints
- **Content Quality**: 100% educational content validation

### Critical Test Areas (100% Coverage Required)
1. **Quiz Package Generation**: Complete offline data accuracy
2. **Answer Validation**: Scoring algorithm correctness
3. **Educational Content**: Cultural sensitivity and accuracy
4. **Database Migrations**: Schema integrity and data consistency
5. **API Validation**: Request/response format compliance

This comprehensive testing strategy ensures the Epic Quiz App delivers accurate, culturally respectful, and performant educational experiences across all supported epic traditions.