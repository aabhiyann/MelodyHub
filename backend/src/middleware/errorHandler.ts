import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';

/**
 * Global Error Handler Middleware
 * 
 * Catches all errors thrown in the application and returns consistent error responses.
 * Should be registered as the last middleware in the Express app.
 * 
 * Error Response Format:
 * {
 *   success: false,
 *   error: {
 *     message: string,
 *     code: string,
 *     details?: any  // Only in development
 *   }
 * }
 */
export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    // Log error for debugging
    console.error('❌ Error caught by error handler:', {
        name: err.name,
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });

    // Handle known AppErrors
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            error: {
                message: err.message,
                code: err.code,
                ...(process.env.NODE_ENV === 'development' && err.details && { details: err.details }),
            },
        });
        return;
    }

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        res.status(400).json({
            success: false,
            error: {
                message: 'Validation failed',
                code: 'VALIDATION_ERROR',
                ...(process.env.NODE_ENV === 'development' && { details: err.message }),
            },
        });
        return;
    }

    // Handle Mongoose CastError (invalid ObjectId)
    if (err.name === 'CastError') {
        res.status(400).json({
            success: false,
            error: {
                message: 'Invalid ID format',
                code: 'INVALID_ID',
            },
        });
        return;
    }

    // Handle Mongoose duplicate key errors
    if ((err as any).code === 11000) {
        res.status(409).json({
            success: false,
            error: {
                message: 'Duplicate entry',
                code: 'DUPLICATE_ENTRY',
                ...(process.env.NODE_ENV === 'development' && { details: err.message }),
            },
        });
        return;
    }

    // Handle unknown errors (500 Internal Server Error)
    res.status(500).json({
        success: false,
        error: {
            message: process.env.NODE_ENV === 'development'
                ? err.message
                : 'Internal server error',
            code: 'INTERNAL_ERROR',
            ...(process.env.NODE_ENV === 'development' && {
                stack: err.stack,
                details: err
            }),
        },
    });
};

/**
 * 404 Not Found Handler
 * Catches requests to undefined routes
 */
export const notFoundHandler = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    res.status(404).json({
        success: false,
        error: {
            message: `Route not found: ${req.method} ${req.path}`,
            code: 'ROUTE_NOT_FOUND',
        },
    });
};
