/**
 * Quiz API Routes - Core Educational Functionality
 * 
 * CRITICAL ARCHITECTURAL IMPLEMENTATION: This file implements the hybrid content
 * delivery model that enables offline-first mobile experience. The bulk download
 * endpoint is the cornerstone of our performance strategy.
 */

import { Router, Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { validate, schemas, formatError } from '../middleware/validation';
import { quizService } from '../services/QuizService';
import { epicService } from '../services/EpicService';
import { executeQuery } from '../config/database';

const router = Router();

/**
 * GET /api/v1/quiz?epic={epicId}&count={count}&difficulty={level}&category={category}
 * Generate quiz package for bulk download
 * 
 * *** CRITICAL ENDPOINT FOR OFFLINE-FIRST ARCHITECTURE ***
 * 
 * This endpoint embodies our core architectural decision: single API call downloads
 * complete quiz package including all questions, options, and basic explanations.
 * This enables the mobile app to function offline after initial download.
 * 
 * PERFORMANCE TARGET: <2 seconds response time for 10-question package
 * MOBILE OPTIMIZATION: Response optimized for mobile bandwidth and storage
 */
router.get('/',
  validate(schemas.quizParams, 'query'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { epicId, count, difficulty, category } = req.query;
      
      // Verify epic exists and is available
      const epic = await epicService.getEpicById(epicId as string);
      if (!epic) {
        return res.status(404).json({
          success: false,
          error: 'Epic not found',
          message: `Epic '${epicId}' does not exist or is not available`,
          timestamp: new Date().toISOString()
        });
      }

      if (!epic.is_available) {
        return res.status(403).json({
          success: false,
          error: 'Epic not available',
          message: `Epic '${epicId}' is not currently available for quizzes`,
          timestamp: new Date().toISOString()
        });
      }

      // PROGRESSIVE SARGA-BLOCK SYSTEM: Generate quiz with educational structure
      const kanda = req.query.kanda as string;
      const sarga = req.query.sarga ? parseInt(req.query.sarga as string) : undefined;
      const blockId = req.query.blockId ? parseInt(req.query.blockId as string) : undefined;
      
      const quizPackage = await quizService.generateQuizPackage(
        epicId as string,
        parseInt(count as string) || 10,
        { 
          kanda, 
          sarga, 
          difficulty: difficulty as any, 
          category: category as any,
          blockId 
        }
      );

      // Add metadata for mobile app caching and analytics
      const response = {
        success: true,
        data: quizPackage,
        meta: {
          epic: {
            id: epic.id,
            title: epic.title,
            language: epic.language,
            culture: epic.culture
          },
          quiz_info: {
            question_count: quizPackage.questions.length,
            estimated_time_minutes: Math.ceil(quizPackage.questions.length * 1.5), // 1.5 min per question
            difficulty_requested: difficulty,
            category_requested: category,
            generated_at: new Date().toISOString(),
            cache_duration_hours: 24 // Suggest mobile app cache duration
          },
          // Performance metadata for monitoring
          categories_distribution: getCategoriesDistribution(quizPackage.questions),
          difficulty_distribution: getDifficultyDistribution(quizPackage.questions)
        }
      };

      // Set cache headers to optimize mobile performance
      res.set({
        'Cache-Control': 'public, max-age=3600', // 1 hour cache
        'ETag': `"${quizPackage.quiz_id}"`,
        'Content-Type': 'application/json; charset=utf-8'
      });

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/v1/quiz/chapter/:epicId/:kanda/:sarga
 * Get quiz for specific chapter (Sarga)
 * 
 * CHAPTER-SPECIFIC LEARNING: Enables targeted study of individual chapters
 */
router.get('/chapter/:epicId/:kanda/:sarga',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { epicId, kanda, sarga } = req.params;
      const questionCount = parseInt(req.query.count as string) || 10;
      
      // Generate chapter-specific quiz
      const quizPackage = await quizService.generateChapterQuiz(
        epicId,
        kanda,
        parseInt(sarga),
        questionCount
      );

      // Get chapter summary for educational context
      const chapterSummary = await quizService.getChapterSummary(
        epicId,
        kanda,
        parseInt(sarga)
      );

      const response = {
        success: true,
        data: {
          quiz: quizPackage,
          chapter_summary: chapterSummary,
          chapter_info: {
            epic_id: epicId,
            kanda,
            sarga: parseInt(sarga),
            title: chapterSummary?.title || `${kanda} Sarga ${sarga}`
          }
        },
        meta: {
          generated_at: new Date().toISOString(),
          chapter_focus: true
        }
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/v1/quiz/chapter/:epicId/:kanda/:sarga/questions
 * Get all questions for a specific chapter
 * 
 * COMPREHENSIVE LEARNING: Complete chapter coverage for thorough study
 */
router.get('/chapter/:epicId/:kanda/:sarga/questions',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { epicId, kanda, sarga } = req.params;
      
      const questions = await quizService.getChapterQuestions(
        epicId,
        kanda,
        parseInt(sarga)
      );

      const chapterSummary = await quizService.getChapterSummary(
        epicId,
        kanda,
        parseInt(sarga)
      );

      const response = {
        success: true,
        data: {
          questions,
          chapter_summary: chapterSummary,
          chapter_info: {
            epic_id: epicId,
            kanda,
            sarga: parseInt(sarga),
            question_count: questions.length
          }
        }
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/v1/quiz/submit
 * Submit quiz results and update user progress
 * 
 * BUSINESS LOGIC: Comprehensive scoring, progress tracking, and analytics
 * SUPPORTS: Both registered users and anonymous sessions
 */
router.post('/submit',
  validate(schemas.quizSubmission, 'body'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { quizId, epicId, answers, timeSpent, deviceType, appVersion } = req.body;
      
      // Extract user ID from auth (if implemented) or allow anonymous
      const userId = req.user?.id || null; // Will implement auth later
      
      // Process quiz submission
      const results = await quizService.submitQuizResults(
        userId,
        epicId,
        answers,
        timeSpent,
        deviceType,
        appVersion
      );

      // Enhanced response with educational feedback
      const response = {
        success: true,
        data: {
          quiz_id: quizId,
          score: results.score,
          total_questions: results.totalQuestions,
          correct_answers: results.correctAnswers.length,
          percentage: Math.round((results.correctAnswers.length / results.totalQuestions) * 100),
          
          // Educational feedback
          feedback: {
            message: results.feedback,
            performance_level: getPerformanceLevel(results.score),
            encouragement: getEncouragement(results.score),
            next_steps: getNextSteps(results.score, epicId as string)
          },
          
          // Progress data (if user is registered)
          progress: results.progressUpdate ? {
            total_quizzes: results.progressUpdate.quizzes_completed,
            average_score: Math.round(
              (results.progressUpdate.correct_answers / results.progressUpdate.total_questions_answered) * 100
            ),
            category_strengths: analyzeCategoryPerformance(results.progressUpdate.category_scores),
            mastery_level: results.progressUpdate.mastery_level
          } : null,
          
          // Time analysis
          time_analysis: {
            total_seconds: timeSpent,
            average_per_question: Math.round(timeSpent / results.totalQuestions),
            efficiency_rating: getEfficiencyRating(timeSpent, results.totalQuestions, results.score)
          }
        },
        meta: {
          submitted_at: new Date().toISOString(),
          device_type: deviceType,
          app_version: appVersion
        }
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/v1/quiz/blocks/:epicId
 * Get available progressive learning blocks for an epic
 * 
 * PROGRESSIVE LEARNING: Enables structured story-based progression
 */
router.get('/blocks/:epicId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { epicId } = req.params;
      const difficulty = req.query.difficulty as string;
      
      const blocks = await quizService.getAvailableBlocks(epicId, difficulty);
      
      res.json({
        success: true,
        data: {
          epic_id: epicId,
          blocks,
          total_blocks: blocks.length
        },
        meta: {
          difficulty_filter: difficulty || 'all',
          generated_at: new Date().toISOString()
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/v1/quiz/blocks/:epicId/recommended
 * Get recommended next block based on user progress
 * 
 * ADAPTIVE LEARNING: Smart progression recommendations
 */
router.get('/blocks/:epicId/recommended',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { epicId } = req.params;
      const difficulty = (req.query.difficulty as string) || 'easy';
      const userId = req.user?.id || null;
      
      const recommendedBlock = await quizService.getNextRecommendedBlock(
        epicId, 
        userId, 
        difficulty as any
      );
      
      res.json({
        success: true,
        data: {
          recommended_block: recommendedBlock,
          epic_id: epicId,
          user_id: userId,
          difficulty_level: difficulty
        },
        meta: {
          recommendation_type: userId ? 'personalized' : 'default',
          generated_at: new Date().toISOString()
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/v1/quiz/block/:blockId
 * Generate quiz for a specific progressive block
 * 
 * BLOCK-BASED LEARNING: Structured narrative progression
 */
router.get('/block/:blockId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const blockId = parseInt(req.params.blockId);
      const count = parseInt(req.query.count as string) || 10;
      const difficulty = req.query.difficulty as string;
      const category = req.query.category as string;
      
      // Get block info first
      const blockQuery = `
        SELECT qb.*, e.title as epic_title
        FROM quiz_blocks qb
        JOIN epics e ON qb.epic_id = e.id
        WHERE qb.id = $1 AND qb.is_available = true
      `;
      const blockResult = await executeQuery(blockQuery, [blockId]);
      
      if (blockResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Block not found',
          message: `Quiz block ${blockId} does not exist or is not available`
        });
      }
      
      const blockInfo = blockResult.rows[0];
      
      const quizPackage = await quizService.generateBlockQuiz(
        blockInfo.epic_id,
        blockId,
        count,
        { difficulty: difficulty as any, category }
      );
      
      res.json({
        success: true,
        data: quizPackage,
        meta: {
          block: {
            id: blockInfo.id,
            name: blockInfo.block_name,
            difficulty: blockInfo.difficulty_level,
            phase: blockInfo.phase,
            narrative_summary: blockInfo.narrative_summary,
            learning_objectives: blockInfo.learning_objectives,
            sarga_range: `${blockInfo.start_sarga}-${blockInfo.end_sarga}`
          },
          epic: {
            id: blockInfo.epic_id,
            title: blockInfo.epic_title
          },
          generated_at: new Date().toISOString()
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/v1/quiz/history
 * Get user's quiz history (requires authentication)
 * 
 * LEARNING ANALYTICS: Track progress over time
 */
router.get('/history',
  // TODO: Add authentication middleware
  validate(schemas.pagination, 'query'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
          message: 'User must be logged in to view quiz history',
          timestamp: new Date().toISOString()
        });
      }

      // TODO: Implement quiz history service method
      // const history = await quizService.getUserQuizHistory(userId, req.query);

      res.json({
        success: true,
        message: 'Quiz history endpoint - implementation pending',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Helper methods for educational feedback and analysis
 */

/**
 * Analyze category distribution in questions
 */
function getCategoriesDistribution(questions: any[]) {
  const distribution: Record<string, number> = {};
  questions.forEach(q => {
    distribution[q.category] = (distribution[q.category] || 0) + 1;
  });
  return distribution;
}

/**
 * Analyze difficulty distribution in questions  
 */
function getDifficultyDistribution(questions: any[]) {
  const distribution: Record<string, number> = {};
  questions.forEach(q => {
    // Note: difficulty is in the database but not exposed in quiz package for UI reasons
    // This would need to be tracked during question selection
  });
  return distribution;
}

/**
 * Determine performance level based on score
 */
function getPerformanceLevel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 60) return 'Fair';
  return 'Needs Improvement';
}

/**
 * Generate encouraging message based on performance
 */
function getEncouragement(score: number): string {
  if (score >= 90) {
    return "Outstanding! You have deep knowledge of this epic.";
  } else if (score >= 75) {
    return "Great work! You're developing strong understanding.";
  } else if (score >= 60) {
    return "Good effort! Keep practicing to strengthen your knowledge.";
  } else {
    return "Keep learning! Every quiz helps you understand these timeless stories better.";
  }
}

/**
 * Suggest next steps based on performance
 */
function getNextSteps(score: number, epicId: string): string[] {
  const steps: string[] = [];
  
  if (score < 75) {
    steps.push(`Review the explanations for questions you missed`);
    steps.push(`Try another ${epicId} quiz to reinforce your learning`);
  }
  
  if (score >= 75) {
    steps.push(`Explore the "Learn More" content for deeper understanding`);
    steps.push(`Try a more challenging difficulty level`);
  }
  
  if (score >= 90) {
    steps.push(`Consider exploring cross-epic connections`);
    steps.push(`Share interesting facts with friends`);
  }
  
  return steps;
}

/**
 * Analyze category performance for targeted learning
 */
function analyzeCategoryPerformance(categoryScores: any): any {
  const analysis: any = {};
  
  Object.entries(categoryScores).forEach(([category, scores]: [string, any]) => {
    const percentage = scores.total > 0 ? Math.round((scores.correct / scores.total) * 100) : 0;
    analysis[category] = {
      percentage,
      level: percentage >= 80 ? 'strong' : percentage >= 60 ? 'developing' : 'needs_focus'
    };
  });
  
  return analysis;
}

/**
 * Rate quiz-taking efficiency
 */
function getEfficiencyRating(timeSpent: number, questionCount: number, score: number): string {
  const avgTimePerQuestion = timeSpent / questionCount;
  
  // Efficient: Good score with reasonable time
  if (score >= 80 && avgTimePerQuestion <= 90) return 'efficient';
  
  // Thorough: Good score with longer time (thoughtful)
  if (score >= 75 && avgTimePerQuestion > 90) return 'thorough';
  
  // Rushed: Lower score with very fast time
  if (score < 70 && avgTimePerQuestion < 60) return 'rushed';
  
  return 'balanced';
}

/**
 * Error handling middleware
 */
router.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const formattedError = formatError(error, req);
  const statusCode = formattedError.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    ...formattedError
  });
});

export default router;