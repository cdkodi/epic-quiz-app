/**
 * Test Setup and Configuration
 * 
 * ARCHITECTURAL DECISION: Isolated test database with transaction rollback
 * WHY: Ensures test isolation, prevents test data pollution, and enables
 * parallel test execution without conflicts.
 */

import { Pool } from 'pg';
import database from '../config/database';

// Test database configuration
export const testDbConfig = {
  host: process.env.TEST_DB_HOST || 'localhost',
  port: parseInt(process.env.TEST_DB_PORT || '5432'),
  database: process.env.TEST_DB_NAME || 'epic_quiz_test',
  user: process.env.TEST_DB_USER || 'postgres',
  password: process.env.TEST_DB_PASSWORD || 'password',
  max: 5, // Smaller pool for tests
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 5000
};

let testPool: Pool;
let currentTransaction: any = null;

/**
 * Initialize test environment
 */
export async function setupTests(): Promise<void> {
  try {
    // Create test database if it doesn't exist
    await createTestDatabase();
    
    // Initialize test database connection
    testPool = new Pool(testDbConfig);
    
    // Run migrations on test database
    await runTestMigrations();
    
    // Insert test seed data
    await insertTestData();
    
    console.log('✅ Test environment setup complete');
  } catch (error) {
    console.error('❌ Test setup failed:', error);
    throw error;
  }
}

/**
 * Cleanup test environment
 */
export async function teardownTests(): Promise<void> {
  try {
    if (currentTransaction) {
      await currentTransaction.rollback();
      currentTransaction.release();
      currentTransaction = null;
    }
    
    if (testPool) {
      await testPool.end();
    }
    
    // Drop test database
    await dropTestDatabase();
    
    console.log('✅ Test environment cleanup complete');
  } catch (error) {
    console.error('❌ Test cleanup failed:', error);
  }
}

/**
 * Begin transaction for test isolation
 */
export async function beginTestTransaction(): Promise<void> {
  if (currentTransaction) {
    throw new Error('Transaction already active');
  }
  
  currentTransaction = await testPool.connect();
  await currentTransaction.query('BEGIN');
}

/**
 * Rollback transaction to clean up test data
 */
export async function rollbackTestTransaction(): Promise<void> {
  if (currentTransaction) {
    await currentTransaction.query('ROLLBACK');
    currentTransaction.release();
    currentTransaction = null;
  }
}

/**
 * Execute query in test environment
 */
export async function testQuery(text: string, params?: any[]): Promise<any> {
  if (currentTransaction) {
    return currentTransaction.query(text, params);
  }
  return testPool.query(text, params);
}

/**
 * Create test database
 */
async function createTestDatabase(): Promise<void> {
  const adminPool = new Pool({
    ...testDbConfig,
    database: 'postgres' // Connect to default database to create test database
  });
  
  try {
    // Check if test database exists
    const result = await adminPool.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [testDbConfig.database]
    );
    
    if (result.rows.length === 0) {
      await adminPool.query(`CREATE DATABASE ${testDbConfig.database}`);
      console.log(`✅ Created test database: ${testDbConfig.database}`);
    }
  } catch (error) {
    if (!error.message.includes('already exists')) {
      throw error;
    }
  } finally {
    await adminPool.end();
  }
}

/**
 * Drop test database
 */
async function dropTestDatabase(): Promise<void> {
  const adminPool = new Pool({
    ...testDbConfig,
    database: 'postgres'
  });
  
  try {
    // Terminate all connections to test database
    await adminPool.query(`
      SELECT pg_terminate_backend(pid) 
      FROM pg_stat_activity 
      WHERE datname = $1 AND pid <> pg_backend_pid()
    `, [testDbConfig.database]);
    
    await adminPool.query(`DROP DATABASE IF EXISTS ${testDbConfig.database}`);
    console.log(`✅ Dropped test database: ${testDbConfig.database}`);
  } catch (error) {
    console.warn(`⚠️  Warning: Could not drop test database: ${error.message}`);
  } finally {
    await adminPool.end();
  }
}

/**
 * Run migrations on test database
 */
async function runTestMigrations(): Promise<void> {
  // Use the same migration system but on test database
  const fs = require('fs');
  const path = require('path');
  
  const migrationsDir = path.join(__dirname, '../../database/migrations');
  const schemaFile = path.join(__dirname, '../../database/schema.sql');
  
  if (fs.existsSync(schemaFile)) {
    const schemaSql = fs.readFileSync(schemaFile, 'utf8');
    await testPool.query(schemaSql);
    console.log('✅ Test database schema created');
  }
}

/**
 * Insert test data fixtures
 */
async function insertTestData(): Promise<void> {
  // Insert test epic
  await testPool.query(`
    INSERT INTO epics (id, title, description, language, culture, is_available, difficulty_level)
    VALUES ('test_ramayana', 'Test Ramayana', 'Test epic for automated testing', 'sanskrit', 'hindu', true, 'beginner')
    ON CONFLICT (id) DO NOTHING
  `);
  
  // Insert test questions
  const testQuestions = [
    {
      epic_id: 'test_ramayana',
      category: 'characters',
      difficulty: 'easy',
      question_text: 'Who is the main protagonist in our test epic?',
      options: '["Test Rama", "Test Krishna", "Test Arjuna", "Test Hanuman"]',
      correct_answer_id: 0,
      basic_explanation: 'Test Rama is the main character in our test version of the Ramayana.',
      tags: ['test', 'protagonist'],
      cross_epic_tags: ['heroism', 'leadership']
    },
    {
      epic_id: 'test_ramayana',
      category: 'events',
      difficulty: 'medium',
      question_text: 'What is the duration of the test exile?',
      options: '["10 years", "14 years", "16 years", "20 years"]',
      correct_answer_id: 1,
      basic_explanation: 'The test exile period is 14 years, matching the traditional Ramayana.',
      tags: ['test', 'exile'],
      cross_epic_tags: ['sacrifice', 'duty']
    },
    {
      epic_id: 'test_ramayana',
      category: 'themes',
      difficulty: 'hard',
      question_text: 'What philosophical concept does our test epic primarily explore?',
      options: '["Test Dharma", "Test Karma", "Test Moksha", "Test Artha"]',
      correct_answer_id: 0,
      basic_explanation: 'Test Dharma (righteousness) is the central philosophical theme explored throughout the epic.',
      tags: ['test', 'philosophy'],
      cross_epic_tags: ['morality', 'duty', 'righteousness']
    },
    {
      epic_id: 'test_ramayana',
      category: 'culture',
      difficulty: 'medium',
      question_text: 'In which language was our test epic originally composed?',
      options: '["Test Hindi", "Test Sanskrit", "Test Tamil", "Test Prakrit"]',
      correct_answer_id: 1,
      basic_explanation: 'The test epic follows the tradition of being composed in Sanskrit.',
      tags: ['test', 'language'],
      cross_epic_tags: ['literature', 'ancient_texts']
    }
  ];
  
  for (const question of testQuestions) {
    await testPool.query(`
      INSERT INTO questions (
        epic_id, category, difficulty, question_text, options, 
        correct_answer_id, basic_explanation, tags, cross_epic_tags
      )
      VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7, $8, $9)
      ON CONFLICT (id) DO NOTHING
    `, [
      question.epic_id, question.category, question.difficulty,
      question.question_text, question.options, question.correct_answer_id,
      question.basic_explanation, question.tags, question.cross_epic_tags
    ]);
  }
  
  // Get question IDs for educational content
  const questions = await testPool.query('SELECT id FROM questions WHERE epic_id = $1', ['test_ramayana']);
  
  // Insert educational content for first question
  if (questions.rows.length > 0) {
    await testPool.query(`
      INSERT INTO educational_content (
        question_id, detailed_explanation, cultural_context, cross_epic_connections, related_topics
      )
      VALUES (
        $1,
        $2,
        $3,
        $4::jsonb,
        $5
      )
      ON CONFLICT (question_id) DO NOTHING
    `, [
      questions.rows[0].id,
      'This is a detailed test explanation that demonstrates the educational content system. It provides comprehensive information about the character, their role in the epic, and their significance in the broader cultural context. This content is designed to transform quiz questions into learning opportunities.',
      'Test cultural context explaining the historical and social background of the epic and its characters within ancient Indian society.',
      JSON.stringify([{
        epicId: 'mahabharata',
        connection: 'Both test epics explore themes of duty and righteousness',
        similarThemes: ['dharma', 'heroism', 'sacrifice']
      }]),
      ['test_dharma', 'test_heroism', 'ancient_literature']
    ]);
  }
  
  console.log('✅ Test data inserted successfully');
}

/**
 * Test data fixtures for use in tests
 */
export const testFixtures = {
  validEpicId: 'test_ramayana',
  invalidEpicId: 'nonexistent_epic',
  
  validQuizParams: {
    epic: 'test_ramayana',
    count: 3,
    difficulty: 'mixed',
    category: 'mixed'
  },
  
  invalidQuizParams: {
    epic: 'INVALID_FORMAT', // uppercase not allowed
    count: 25, // exceeds maximum
    difficulty: 'invalid'
  },
  
  validQuizSubmission: {
    quizId: '550e8400-e29b-41d4-a716-446655440000',
    epicId: 'test_ramayana',
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
  },
  
  invalidQuizSubmission: {
    quizId: 'invalid-uuid',
    epicId: 'test_ramayana',
    answers: [], // empty answers
    timeSpent: 5 // too short
  }
};

/**
 * Helper function to get a test question ID
 */
export async function getTestQuestionId(): Promise<string> {
  const result = await testQuery(
    'SELECT id FROM questions WHERE epic_id = $1 LIMIT 1',
    ['test_ramayana']
  );
  
  if (result.rows.length === 0) {
    throw new Error('No test questions found');
  }
  
  return result.rows[0].id;
}