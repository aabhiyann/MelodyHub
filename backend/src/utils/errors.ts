/**
 * Custom Error Classes for MelodyHub API
 * 
 * These error classes provide consistent error handling across the backend.
 * Each error type has a specific HTTP status code and error code for client handling.
 */

/**
 * Validation error detail for form/request validation
 */
export interface ValidationErrorDetail {
    field: string;
    message: string;
    code?: string;
}

/**
 * Service error detail for external service failures
 */
export interface ServiceErrorDetail {
    code: string;
    info?: string;
    context?: Record<string, unknown>;
}

/**
 * Error details type - can be validation errors, service errors, or generic data
 */
export type ErrorDetails =
    | ValidationErrorDetail[]
    | ServiceErrorDetail
    | Record<string, unknown>
    | undefined;

/**
 * Base Application Error
 * All custom errors extend this class
 */
export class AppError extends Error {
    public readonly statusCode: number;
    public readonly code: string;
    public readonly details?: ErrorDetails;
    public readonly isOperational: boolean;

    constructor(
        message: string,
        statusCode: number = 500,
        code: string = 'INTERNAL_ERROR',
        details?: ErrorDetails,
        isOperational = true
    ) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        this.isOperational = isOperational;

        // Maintains proper stack trace for where our error was thrown
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Validation Error (400)
 * Used when request data fails validation
 */
export class ValidationError extends AppError {
    constructor(message: string, details?: ErrorDetails) {
        super(message, 400, 'VALIDATION_ERROR', details);
    }
}

/**
 * Authentication Error (401)
 * Used when authentication fails or is missing
 */
export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized access') {
        super(message, 401, 'UNAUTHORIZED');
    }
}

/**
 * Authorization Error (403)
 * Used when authenticated user lacks permissions
 */
export class ForbiddenError extends AppError {
    constructor(message: string = 'Access forbidden') {
        super(message, 403, 'FORBIDDEN');
    }
}

/**
 * Not Found Error (404)
 * Used when requested resource doesn't exist
 */
export class NotFoundError extends AppError {
    constructor(resource: string = 'Resource') {
        super(`${resource} not found`, 404, 'NOT_FOUND');
    }
}

/**
 * Conflict Error (409)
 * Used when request conflicts with current state (e.g., duplicate entry)
 */
export class ConflictError extends AppError {
    constructor(message: string, details?: ErrorDetails) {
        super(message, 409, 'CONFLICT', details);
    }
}

/**
 * Rate Limit Error (429)
 * Used when user exceeds rate limits
 */
export class RateLimitError extends AppError {
    constructor(message: string = 'Too many requests') {
        super(message, 429, 'RATE_LIMIT_EXCEEDED');
    }
}

/**
 * External Service Error (502)
 * Used when external API/service fails
 */
export class ExternalServiceError extends AppError {
    constructor(service: string, details?: ErrorDetails) {
        super(`External service error: ${service}`, 502, 'EXTERNAL_SERVICE_ERROR', details);
    }
}

/**
 * Database Error (500)
 * Used for database operation failures
 */
export class DatabaseError extends AppError {
    constructor(message: string, details?: ErrorDetails) {
        super(message, 500, 'DATABASE_ERROR', details, false);
    }
}
