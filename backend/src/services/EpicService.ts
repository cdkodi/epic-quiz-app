/**
 * Epic Service - Business logic for epic management
 * 
 * ARCHITECTURAL DECISION: Service layer pattern for business logic
 * WHY: Separates database operations from API routes, making testing easier
 * and providing reusable business logic across different endpoints.
 */

import database, { executeQuery } from '../config/database';
import { Epic, CreateEpicData, PaginationOptions, PaginatedResult } from '../types/database';

export class EpicService {
  /**
   * Get all available epics
   * PERFORMANCE OPTIMIZATION: Only fetch available epics by default
   */
  async getAllEpics(includeUnavailable = false): Promise<Epic[]> {
    const query = `
      SELECT * FROM epics 
      ${includeUnavailable ? '' : 'WHERE is_available = true'}
      ORDER BY created_at DESC
    `;
    
    const result = await executeQuery(query);
    return result.rows;
  }

  /**
   * Get epic by ID with question count validation
   */
  async getEpicById(epicId: string): Promise<Epic | null> {
    const query = `
      SELECT * FROM epics 
      WHERE id = $1
    `;
    
    const result = await executeQuery(query, [epicId]);
    return result.rows[0] || null;
  }

  /**
   * Create new epic
   * BUSINESS RULE: New epics start as unavailable until content is added
   */
  async createEpic(epicData: CreateEpicData): Promise<Epic> {
    const query = `
      INSERT INTO epics (
        id, title, description, language, culture, time_period, 
        difficulty_level, estimated_reading_time, is_available
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, false)
      RETURNING *
    `;
    
    const values = [
      epicData.id,
      epicData.title,
      epicData.description,
      epicData.language,
      epicData.culture,
      epicData.time_period,
      epicData.difficulty_level,
      epicData.estimated_reading_time
    ];
    
    const result = await executeQuery(query, values);
    return result.rows[0];
  }

  /**
   * Update epic availability status
   * BUSINESS RULE: Epic becomes available when it has sufficient questions
   */
  async updateEpicAvailability(epicId: string, isAvailable: boolean): Promise<Epic | null> {
    // Check if epic has enough questions if making it available
    if (isAvailable) {
      const questionCountQuery = 'SELECT COUNT(*) as count FROM questions WHERE epic_id = $1';
      const countResult = await executeQuery(questionCountQuery, [epicId]);
      const questionCount = parseInt(countResult.rows[0].count);
      
      if (questionCount < 10) {
        throw new Error('Epic must have at least 10 questions to be made available');
      }
    }

    const query = `
      UPDATE epics 
      SET is_available = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await executeQuery(query, [epicId, isAvailable]);
    return result.rows[0] || null;
  }

  /**
   * Get epic statistics
   */
  async getEpicStats(epicId: string): Promise<{
    total_questions: number;
    questions_by_category: Record<string, number>;
    questions_by_difficulty: Record<string, number>;
    avg_completion_rate: number;
  }> {
    const statsQuery = `
      SELECT 
        COUNT(*) as total_questions,
        COUNT(*) FILTER (WHERE category = 'characters') as characters_count,
        COUNT(*) FILTER (WHERE category = 'events') as events_count,
        COUNT(*) FILTER (WHERE category = 'themes') as themes_count,
        COUNT(*) FILTER (WHERE category = 'culture') as culture_count,
        COUNT(*) FILTER (WHERE difficulty = 'easy') as easy_count,
        COUNT(*) FILTER (WHERE difficulty = 'medium') as medium_count,
        COUNT(*) FILTER (WHERE difficulty = 'hard') as hard_count
      FROM questions 
      WHERE epic_id = $1
    `;
    
    const completionQuery = `
      SELECT AVG(completion_percentage) as avg_completion
      FROM user_progress 
      WHERE epic_id = $1 AND quizzes_completed > 0
    `;
    
    const [statsResult, completionResult] = await Promise.all([
      executeQuery(statsQuery, [epicId]),
      executeQuery(completionQuery, [epicId])
    ]);
    
    const stats = statsResult.rows[0];
    const completion = completionResult.rows[0];
    
    return {
      total_questions: parseInt(stats.total_questions),
      questions_by_category: {
        characters: parseInt(stats.characters_count),
        events: parseInt(stats.events_count),
        themes: parseInt(stats.themes_count),
        culture: parseInt(stats.culture_count)
      },
      questions_by_difficulty: {
        easy: parseInt(stats.easy_count),
        medium: parseInt(stats.medium_count),
        hard: parseInt(stats.hard_count)
      },
      avg_completion_rate: parseFloat(completion.avg_completion) || 0
    };
  }

  /**
   * Search epics by title or description
   */
  async searchEpics(searchTerm: string): Promise<Epic[]> {
    const query = `
      SELECT * FROM epics 
      WHERE is_available = true 
      AND (
        title ILIKE $1 
        OR description ILIKE $1
        OR culture ILIKE $1
      )
      ORDER BY 
        CASE WHEN title ILIKE $1 THEN 1 ELSE 2 END,
        created_at DESC
    `;
    
    const result = await executeQuery(query, [`%${searchTerm}%`]);
    return result.rows;
  }

  /**
   * Get trending epics based on recent activity
   */
  async getTrendingEpics(limit = 5): Promise<Epic[]> {
    const query = `
      SELECT e.*, COUNT(qs.id) as recent_sessions
      FROM epics e
      LEFT JOIN quiz_sessions qs ON e.id = qs.epic_id 
        AND qs.completed_at > NOW() - INTERVAL '7 days'
      WHERE e.is_available = true
      GROUP BY e.id
      ORDER BY recent_sessions DESC, e.created_at DESC
      LIMIT $1
    `;
    
    const result = await executeQuery(query, [limit]);
    return result.rows;
  }
}

// Export singleton instance
export const epicService = new EpicService();