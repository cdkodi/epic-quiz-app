/**
 * Epics API Routes
 * 
 * ARCHITECTURAL DECISION: Epic-centric URL structure
 * WHY: Reflects the educational content hierarchy and makes the API intuitive
 * for both mobile app developers and potential future web interfaces.
 */

import { Router, Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { validate, schemas, formatError } from '../middleware/validation';
import { epicService } from '../services/EpicService';

const router = Router();

/**
 * GET /api/v1/epics
 * Get all available epics
 * 
 * BUSINESS LOGIC: Only returns epics marked as available by default
 * This ensures mobile apps don't see incomplete content.
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const includeUnavailable = req.query.includeUnavailable === 'true';
    const epics = await epicService.getAllEpics(includeUnavailable);
    
    res.json({
      success: true,
      data: epics,
      meta: {
        count: epics.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/epics/trending
 * Get trending epics based on recent quiz activity
 * 
 * EDUCATIONAL VALUE: Helps users discover popular content
 */
router.get('/trending', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string) || 5;
    const trendingEpics = await epicService.getTrendingEpics(limit);
    
    res.json({
      success: true,
      data: trendingEpics,
      meta: {
        count: trendingEpics.length,
        period: '7 days',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/epics/search
 * Search epics by title, description, or culture
 * 
 * DISCOVERY FEATURE: Enables content exploration across cultures
 */
router.get('/search', 
  validate(schemas.search, 'query'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { q } = req.query;
      const results = await epicService.searchEpics(q as string);
      
      res.json({
        success: true,
        data: results,
        meta: {
          query: q,
          count: results.length,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/v1/epics/:epicId
 * Get detailed information about a specific epic
 * 
 * MOBILE APP USAGE: Epic selection screen details
 */
router.get('/:epicId',
  validate(Joi.object({ epicId: schemas.epicId }), 'params'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { epicId } = req.params;
      const epic = await epicService.getEpicById(epicId!);
      
      if (!epic) {
        return res.status(404).json({
          success: false,
          error: 'Epic not found',
          message: `Epic with ID '${epicId}' does not exist`,
          timestamp: new Date().toISOString()
        });
      }

      res.json({
        success: true,
        data: epic,
        timestamp: new Date().toISOString()
      });
      return;
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/v1/epics/:epicId/stats
 * Get comprehensive statistics for an epic
 * 
 * CONTENT MANAGEMENT: Useful for administrators and analytics
 */
router.get('/:epicId/stats',
  validate(Joi.object({ epicId: schemas.epicId }), 'params'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { epicId } = req.params;
      
      // Verify epic exists
      const epic = await epicService.getEpicById(epicId!);
      if (!epic) {
        return res.status(404).json({
          success: false,
          error: 'Epic not found',
          message: `Epic with ID '${epicId}' does not exist`,
          timestamp: new Date().toISOString()
        });
      }

      const stats = await epicService.getEpicStats(epicId!);
      
      res.json({
        success: true,
        data: {
          epic: {
            id: epic.id,
            title: epic.title,
            language: epic.language
          },
          statistics: stats
        },
        timestamp: new Date().toISOString()
      });
      return;
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/v1/epics
 * Create a new epic (Admin functionality)
 * 
 * CONTENT MANAGEMENT: For adding new literary works
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newEpic = await epicService.createEpic(req.body);
    
    res.status(201).json({
      success: true,
      data: newEpic,
      message: 'Epic created successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/v1/epics/:epicId/availability
 * Update epic availability status (Admin functionality)
 * 
 * BUSINESS RULE: Epic must have sufficient questions to be made available
 */
router.put('/:epicId/availability',
  validate(Joi.object({ epicId: schemas.epicId }), 'params'),
  validate(Joi.object({
    isAvailable: Joi.boolean().required()
  }), 'body'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { epicId } = req.params;
      const { isAvailable } = req.body;
      
      const updatedEpic = await epicService.updateEpicAvailability(epicId!, isAvailable);
      
      if (!updatedEpic) {
        return res.status(404).json({
          success: false,
          error: 'Epic not found',
          message: `Epic with ID '${epicId}' does not exist`,
          timestamp: new Date().toISOString()
        });
      }

      res.json({
        success: true,
        data: updatedEpic,
        message: `Epic ${isAvailable ? 'published' : 'unpublished'} successfully`,
        timestamp: new Date().toISOString()
      });
      return;
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Error handling middleware for this router
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