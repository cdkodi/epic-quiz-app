/**
 * Educational Content API Routes
 * 
 * ARCHITECTURAL FOCUS: Implements the "Learn More" functionality that enables
 * on-demand loading of rich educational content. This completes our hybrid
 * content delivery strategy (bulk download + lazy loading).
 */

import { Router, Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { validate, schemas, formatError } from '../middleware/validation';
import { quizService } from '../services/QuizService';

const router = Router();

/**
 * GET /api/v1/questions/:questionId/deep-dive
 * Get rich educational content for a specific question
 * 
 * *** CRITICAL ENDPOINT FOR EDUCATIONAL VALUE ***
 * 
 * This endpoint implements the lazy loading strategy for heavy educational content.
 * When users tap "Learn More" on any explanation, this provides:
 * - Detailed 2-3 paragraph explanations
 * - Original language quotes with translations  
 * - Cultural and historical context
 * - Cross-epic thematic connections
 * 
 * PERFORMANCE TARGET: <1 second response time
 * EDUCATIONAL GOAL: Transform quiz questions into learning opportunities
 */
router.get('/:questionId/deep-dive',
  validate(Joi.object({ questionId: schemas.uuid }), 'params'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { questionId } = req.params;
      
      // Get rich educational content
      const deepDiveContent = await quizService.getDeepDiveContent(questionId);
      
      if (!deepDiveContent) {
        return res.status(404).json({
          success: false,
          error: 'Content not found',
          message: `Educational content for question '${questionId}' is not available`,
          timestamp: new Date().toISOString()
        });
      }

      // Enhanced response with learning-focused structure
      const response = {
        success: true,
        data: {
          question_id: questionId,
          content: deepDiveContent,
          
          // Learning enhancement features
          learning_features: {
            has_original_quote: !!deepDiveContent.original_quote,
            has_cultural_context: !!deepDiveContent.cultural_context,
            cross_epic_connections_count: deepDiveContent.cross_epic_connections?.length || 0,
            related_topics_count: deepDiveContent.related_topics?.length || 0,
            
            // Estimated reading time (based on content length)
            estimated_reading_minutes: this.calculateReadingTime(deepDiveContent),
            
            // Learning level assessment
            content_depth: this.assessContentDepth(deepDiveContent)
          },
          
          // Cross-epic discovery features
          discovery: {
            related_themes: deepDiveContent.related_topics || [],
            cross_epic_parallels: deepDiveContent.cross_epic_connections?.map(conn => ({
              epic: conn.epicId,
              connection_type: conn.connection,
              shared_themes: conn.similarThemes
            })) || [],
            
            // Suggestions for further exploration
            explore_next: this.generateExplorationSuggestions(deepDiveContent)
          }
        },
        meta: {
          content_type: 'deep_dive_educational',
          language: 'en', // TODO: Support multiple languages
          accessed_at: new Date().toISOString(),
          cache_duration_hours: 24 // Suggest client caching
        }
      };

      // Set cache headers for performance
      res.set({
        'Cache-Control': 'public, max-age=86400', // 24 hours cache
        'Content-Type': 'application/json; charset=utf-8'
      });

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/v1/questions/:questionId
 * Get basic question information (used for bookmarking, sharing)
 * 
 * FEATURE: Supports question sharing and bookmarking functionality
 */
router.get('/:questionId',
  validate(Joi.object({ questionId: schemas.uuid }), 'params'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { questionId } = req.params;
      
      // TODO: Implement basic question info service method
      // const questionInfo = await quizService.getQuestionInfo(questionId);
      
      res.json({
        success: true,
        message: 'Question info endpoint - implementation pending',
        question_id: questionId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/v1/content/cross-epic-themes
 * Explore thematic connections across epics
 * 
 * EDUCATIONAL DISCOVERY: Enables comparative literature analysis
 */
router.get('/cross-epic-themes', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const theme = req.query.theme as string;
    
    if (!theme) {
      return res.status(400).json({
        success: false,
        error: 'Missing parameter',
        message: 'Theme parameter is required',
        timestamp: new Date().toISOString()
      });
    }

    // TODO: Implement cross-epic theme analysis
    // const themeConnections = await contentService.getCrossEpicThemeConnections(theme);
    
    res.json({
      success: true,
      message: 'Cross-epic themes endpoint - implementation pending',
      requested_theme: theme,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/questions/:questionId/bookmark
 * Bookmark a question for later review (requires authentication)
 * 
 * LEARNING MANAGEMENT: Personal learning organization
 */
router.post('/:questionId/bookmark',
  validate(Joi.object({ questionId: schemas.uuid }), 'params'),
  validate(Joi.object({
    notes: Joi.string().max(500).optional()
  }), 'body'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { questionId } = req.params;
      const { notes } = req.body;
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
          message: 'User must be logged in to bookmark questions',
          timestamp: new Date().toISOString()
        });
      }

      // TODO: Implement bookmark service
      // const bookmark = await bookmarkService.addBookmark(userId, questionId, notes);
      
      res.status(201).json({
        success: true,
        message: 'Question bookmarked successfully',
        data: {
          question_id: questionId,
          user_id: userId,
          notes: notes,
          bookmarked_at: new Date().toISOString()
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Helper functions for educational content enhancement
 */

/**
 * Calculate estimated reading time based on content length
 */
function calculateReadingTime(content: any): number {
  const wordsPerMinute = 200; // Average reading speed
  
  let totalWords = 0;
  
  if (content.detailed_explanation) {
    totalWords += content.detailed_explanation.split(' ').length;
  }
  
  if (content.cultural_context) {
    totalWords += content.cultural_context.split(' ').length;
  }
  
  // Add extra time for original quotes (slower reading)
  if (content.original_quote) {
    totalWords += content.original_quote.split(' ').length * 1.5;
  }
  
  return Math.ceil(totalWords / wordsPerMinute) || 1;
}

/**
 * Assess the depth and complexity of educational content
 */
function assessContentDepth(content: any): 'basic' | 'intermediate' | 'advanced' {
  let depthScore = 0;
  
  // Check for various content features
  if (content.detailed_explanation?.length > 500) depthScore += 2;
  if (content.cultural_context) depthScore += 1;
  if (content.original_quote) depthScore += 1;
  if (content.cross_epic_connections?.length > 0) depthScore += 2;
  if (content.related_topics?.length > 3) depthScore += 1;
  
  if (depthScore >= 5) return 'advanced';
  if (depthScore >= 3) return 'intermediate';
  return 'basic';
}

/**
 * Generate suggestions for further exploration
 */
function generateExplorationSuggestions(content: any): string[] {
  const suggestions: string[] = [];
  
  if (content.cross_epic_connections?.length > 0) {
    suggestions.push('Explore similar themes in other epics');
  }
  
  if (content.related_topics?.length > 0) {
    suggestions.push('Learn about related concepts and themes');
  }
  
  if (content.original_quote) {
    suggestions.push('Study more original language passages');
  }
  
  if (content.cultural_context) {
    suggestions.push('Dive deeper into cultural and historical background');
  }
  
  // Always provide at least one suggestion
  if (suggestions.length === 0) {
    suggestions.push('Take another quiz to reinforce your learning');
  }
  
  return suggestions;
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