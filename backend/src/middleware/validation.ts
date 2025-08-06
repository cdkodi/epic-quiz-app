/**
 * Request Validation Middleware
 * 
 * ARCHITECTURAL DECISION: Joi validation with custom error formatting
 * WHY: Provides comprehensive request validation with educational-app-specific
 * error messages that help developers and maintain data quality.
 */

import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

/**
 * Generic validation middleware factory
 */
export const validate = (schema: Joi.ObjectSchema, property: 'body' | 'params' | 'query' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false, // Show all validation errors
      stripUnknown: true, // Remove unknown fields
      convert: true // Convert strings to numbers where appropriate
    });

    if (error) {
      const validationErrors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));

      return res.status(400).json({
        error: 'Validation Error',
        message: 'Request validation failed',
        details: validationErrors,
        timestamp: new Date().toISOString()
      });
    }

    // Replace request property with validated and sanitized value
    req[property] = value;
    return next();
  };
};

/**
 * Common validation schemas
 */
export const schemas = {
  // Epic ID validation - enforces lowercase with underscores
  epicId: Joi.string()
    .pattern(/^[a-z_]+$/)
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.pattern.base': 'Epic ID must contain only lowercase letters and underscores',
      'string.min': 'Epic ID must be at least 3 characters long',
      'string.max': 'Epic ID cannot exceed 50 characters'
    }),

  // UUID validation for questions
  uuid: Joi.string()
    .guid({ version: 'uuidv4' })
    .required()
    .messages({
      'string.guid': 'Must be a valid UUID v4'
    }),

  // Quiz request parameters
  quizParams: Joi.object({
    epicId: Joi.string()
      .pattern(/^[a-z_]+$/)
      .required()
      .messages({
        'string.pattern.base': 'Epic ID must contain only lowercase letters and underscores'
      }),
    count: Joi.number()
      .integer()
      .min(5)
      .max(20)
      .default(10)
      .messages({
        'number.min': 'Quiz must have at least 5 questions',
        'number.max': 'Quiz cannot exceed 20 questions'
      }),
    difficulty: Joi.string()
      .valid('easy', 'medium', 'hard', 'mixed')
      .default('mixed')
      .messages({
        'any.only': 'Difficulty must be one of: easy, medium, hard, mixed'
      }),
    category: Joi.string()
      .valid('characters', 'events', 'themes', 'culture', 'mixed')
      .default('mixed')
      .messages({
        'any.only': 'Category must be one of: characters, events, themes, culture, mixed'
      })
  }),

  // Quiz submission validation
  quizSubmission: Joi.object({
    quizId: Joi.string()
      .guid({ version: 'uuidv4' })
      .required(),
    epicId: Joi.string()
      .pattern(/^[a-z_]+$/)
      .required(),
    answers: Joi.array()
      .items(
        Joi.object({
          question_id: Joi.string().guid({ version: 'uuidv4' }).required(),
          user_answer: Joi.number().integer().min(0).max(3).required(),
          time_spent: Joi.number().integer().min(1).max(300).required() // 1 second to 5 minutes per question
        })
      )
      .min(1)
      .max(20)
      .required(),
    timeSpent: Joi.number()
      .integer()
      .min(10) // Minimum 10 seconds total
      .max(1800) // Maximum 30 minutes
      .required(),
    deviceType: Joi.string()
      .valid('mobile', 'tablet', 'web')
      .optional(),
    appVersion: Joi.string()
      .pattern(/^\d+\.\d+\.\d+$/)
      .optional()
      .messages({
        'string.pattern.base': 'App version must be in format x.y.z (e.g., 1.0.0)'
      })
  }),

  // Pagination validation
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    sort: Joi.string().valid('created_at', 'updated_at', 'title', 'question_count').default('created_at'),
    order: Joi.string().valid('asc', 'desc').default('desc')
  }),

  // Search validation
  search: Joi.object({
    q: Joi.string()
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.min': 'Search query must be at least 2 characters',
        'string.max': 'Search query cannot exceed 100 characters'
      })
  })
};

/**
 * Error response formatter for consistent API error responses
 */
export const formatError = (error: any, req: Request): any => {
  const baseError = {
    error: error.name || 'Internal Server Error',
    message: error.message,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method
  };

  // Add specific error details based on error type
  if (error.name === 'ValidationError') {
    return {
      ...baseError,
      type: 'validation_error',
      details: error.details || []
    };
  }

  if (error.name === 'NotFoundError' || error.message.includes('not found')) {
    return {
      ...baseError,
      type: 'resource_not_found',
      statusCode: 404
    };
  }

  if (error.name === 'UnauthorizedError') {
    return {
      ...baseError,
      type: 'unauthorized',
      statusCode: 401
    };
  }

  // Generic server error (don't expose internal details in production)
  if (process.env.NODE_ENV === 'production') {
    return {
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
      timestamp: baseError.timestamp,
      path: baseError.path,
      method: baseError.method,
      type: 'server_error',
      statusCode: 500
    };
  }

  return baseError;
};