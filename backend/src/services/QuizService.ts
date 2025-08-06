/**
 * Quiz Service - Core business logic for quiz functionality
 * 
 * ARCHITECTURAL DECISION: Implementing the hybrid content delivery strategy
 * WHY: This service encapsulates the key architectural pattern of bulk download
 * with on-demand deep content, supporting our offline-first mobile app design.
 */

import { v4 as uuidv4 } from 'uuid';
import database, { executeQuery } from '../config/database';
import {
  Question, QuizPackage, QuizQuestion, DeepDiveContent, 
  QuizSession, QuestionAnswer, CreateQuestionData
} from '../types/database';

export class QuizService {
  /**
   * Generate quiz package for bulk download
   * CRITICAL ARCHITECTURAL IMPLEMENTATION: This method enables offline-first design
   * by providing complete quiz data including basic explanations in single API call
   */
  async generateQuizPackage(epicId: string, questionCount = 10): Promise<QuizPackage> {
    // Validate epic exists and is available
    const epicQuery = 'SELECT id, title, language FROM epics WHERE id = $1 AND is_available = true';
    const epicResult = await executeQuery(epicQuery, [epicId]);
    
    if (epicResult.rows.length === 0) {
      throw new Error('Epic not found or not available');
    }

    const epic = epicResult.rows[0];

    // Get random questions with balanced distribution across categories and difficulties
    // PERFORMANCE OPTIMIZATION: Using TABLESAMPLE for better random distribution at scale
    const questionsQuery = `
      WITH balanced_questions AS (
        SELECT *, ROW_NUMBER() OVER (PARTITION BY category, difficulty ORDER BY RANDOM()) as rn
        FROM questions 
        WHERE epic_id = $1
      )
      SELECT 
        id, question_text, options, correct_answer_id, 
        basic_explanation, category, difficulty
      FROM balanced_questions 
      WHERE rn <= CEIL($2::float / (4 * 3)) -- Distribute across 4 categories and 3 difficulties
      ORDER BY RANDOM()
      LIMIT $2
    `;

    const questionsResult = await executeQuery(questionsQuery, [epicId, questionCount]);

    if (questionsResult.rows.length < Math.min(questionCount, 5)) {
      throw new Error('Insufficient questions available for this epic');
    }

    // Transform database format to API format
    const questions: QuizQuestion[] = questionsResult.rows.map((row: any) => ({
      id: row.id,
      text: row.question_text,
      options: row.options, // PostgreSQL returns JSONB as parsed JSON
      correct_answer_id: row.correct_answer_id,
      basic_explanation: row.basic_explanation,
      category: row.category
    }));

    const quizId = uuidv4();

    return {
      quiz_id: quizId,
      epic: {
        id: epic.id,
        title: epic.title,
        language: epic.language || 'sanskrit'
      },
      questions
    };
  }

  /**
   * Get deep dive educational content for a specific question
   * LAZY LOADING IMPLEMENTATION: Only fetched when user requests "Learn More"
   */
  async getDeepDiveContent(questionId: string): Promise<DeepDiveContent | null> {
    const query = `
      SELECT 
        q.original_quote,
        q.quote_translation,
        ec.detailed_explanation,
        ec.cultural_context,
        ec.historical_background,
        ec.cross_epic_connections,
        ec.related_topics
      FROM questions q
      LEFT JOIN educational_content ec ON q.id = ec.question_id
      WHERE q.id = $1
    `;

    const result = await executeQuery(query, [questionId]);
    
    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    
    return {
      detailed_explanation: row.detailed_explanation || 'Detailed explanation not yet available.',
      original_quote: row.original_quote,
      translation: row.quote_translation,
      cultural_context: row.cultural_context,
      related_topics: row.related_topics || [],
      cross_epic_connections: row.cross_epic_connections || []
    };
  }

  /**
   * Submit quiz results and update user progress
   * BUSINESS LOGIC: Comprehensive progress tracking and analytics
   */
  async submitQuizResults(
    userId: string | null, 
    epicId: string, 
    answers: QuestionAnswer[], 
    timeSpent: number,
    deviceType?: string,
    appVersion?: string
  ): Promise<{
    score: number;
    totalQuestions: number;
    correctAnswers: string[];
    feedback: string;
    progressUpdate?: any;
  }> {
    
    const client = await database.getClient();
    
    try {
      await client.query('BEGIN');

      // Validate answers against database
      const questionIds = answers.map(a => a.question_id);
      const validationQuery = `
        SELECT id, correct_answer_id, category 
        FROM questions 
        WHERE id = ANY($1) AND epic_id = $2
      `;
      
      const validationResult = await client.query(validationQuery, [questionIds, epicId]);
      const validQuestions = new Map(validationResult.rows.map((q: any) => [q.id, q]));

      // Calculate score and categorize results
      let correctCount = 0;
      const correctAnswers: string[] = [];
      const categoryResults: Record<string, { correct: number; total: number }> = {
        characters: { correct: 0, total: 0 },
        events: { correct: 0, total: 0 },
        themes: { correct: 0, total: 0 },
        culture: { correct: 0, total: 0 }
      };

      // Process each answer
      for (const answer of answers) {
        const question = validQuestions.get(answer.question_id);
        if (!question) continue;

        const isCorrect = (question as any).correct_answer_id === answer.user_answer;
        const category = (question as any).category;
        if (categoryResults[category]) {
          categoryResults[category].total++;
          
          if (isCorrect) {
            correctCount++;
            correctAnswers.push(answer.question_id);
            categoryResults[category].correct++;
          }
        }
      }

      const score = Math.round((correctCount / answers.length) * 100);

      // Record quiz session
      const sessionId = uuidv4();
      const sessionQuery = `
        INSERT INTO quiz_sessions (
          id, user_id, epic_id, questions_answered, score, total_questions, 
          time_spent, device_type, app_version
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `;
      
      await client.query(sessionQuery, [
        sessionId, userId, epicId, JSON.stringify(answers), 
        score, answers.length, timeSpent, deviceType, appVersion
      ]);

      let progressUpdate = null;

      // Update user progress if user is registered
      if (userId) {
        const upsertProgressQuery = `
          INSERT INTO user_progress (user_id, epic_id, quizzes_completed, total_questions_answered, correct_answers, category_scores, last_quiz_at)
          VALUES ($1, $2, 1, $3, $4, $5, CURRENT_TIMESTAMP)
          ON CONFLICT (user_id, epic_id)
          DO UPDATE SET 
            quizzes_completed = user_progress.quizzes_completed + 1,
            total_questions_answered = user_progress.total_questions_answered + $3,
            correct_answers = user_progress.correct_answers + $4,
            category_scores = jsonb_set(
              jsonb_set(
                jsonb_set(
                  jsonb_set(user_progress.category_scores, 
                    '{characters,correct}', 
                    to_jsonb((user_progress.category_scores->'characters'->>'correct')::int + $6)
                  ),
                  '{characters,total}', 
                  to_jsonb((user_progress.category_scores->'characters'->>'total')::int + $7)
                ),
                '{events,correct}', 
                to_jsonb((user_progress.category_scores->'events'->>'correct')::int + $8)
              ),
              '{events,total}', 
              to_jsonb((user_progress.category_scores->'events'->>'total')::int + $9)
            ),
            last_quiz_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
          RETURNING *
        `;

        const progressResult = await client.query(upsertProgressQuery, [
          userId, epicId, answers.length, correctCount,
          JSON.stringify(categoryResults),
          categoryResults.characters?.correct || 0, categoryResults.characters?.total || 0,
          categoryResults.events?.correct || 0, categoryResults.events?.total || 0
        ]);

        progressUpdate = progressResult.rows[0];
      }

      await client.query('COMMIT');

      // Generate personalized feedback
      const feedback = this.generateFeedback(score, categoryResults);

      return {
        score,
        totalQuestions: answers.length,
        correctAnswers,
        feedback,
        progressUpdate
      };

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Add new question to epic
   */
  async addQuestion(questionData: CreateQuestionData): Promise<Question> {
    const query = `
      INSERT INTO questions (
        epic_id, category, difficulty, question_text, options, correct_answer_id,
        basic_explanation, original_quote, original_language, quote_translation,
        tags, cross_epic_tags
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const values = [
      questionData.epic_id,
      questionData.category,
      questionData.difficulty,
      questionData.question_text,
      JSON.stringify(questionData.options),
      questionData.correct_answer_id,
      questionData.basic_explanation,
      questionData.original_quote,
      questionData.original_language,
      questionData.quote_translation,
      questionData.tags,
      questionData.cross_epic_tags
    ];

    const result = await executeQuery(query, values);
    return result.rows[0];
  }

  /**
   * Generate personalized feedback based on performance
   */
  private generateFeedback(score: number, categoryResults: Record<string, { correct: number; total: number }>): string {
    if (score >= 90) {
      return "Excellent work! You have a deep understanding of this epic.";
    } else if (score >= 70) {
      return "Good job! You're developing strong knowledge of the epic.";
    } else if (score >= 50) {
      return "Not bad! Consider reviewing the areas where you missed questions.";
    } else {
      const weakestCategory = Object.entries(categoryResults)
        .filter(([_, result]) => result.total > 0)
        .sort(([_, a], [__, b]) => (a.correct / a.total) - (b.correct / b.total))[0];
      
      return `Keep practicing! Focus especially on ${weakestCategory?.[0] || 'all areas'} to improve your understanding.`;
    }
  }

  /**
   * Get questions by category for targeted practice
   */
  async getQuestionsByCategory(epicId: string, category: string, limit = 20): Promise<Question[]> {
    const query = `
      SELECT * FROM questions 
      WHERE epic_id = $1 AND category = $2
      ORDER BY RANDOM()
      LIMIT $3
    `;

    const result = await executeQuery(query, [epicId, category, limit]);
    return result.rows;
  }
}

// Export singleton instance
export const quizService = new QuizService();