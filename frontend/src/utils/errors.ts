/**
 * Error handling utilities for consistent error management across the application
 */

// ============================================
// Error Types
// ============================================

export interface ApiError {
    message: string;
    status?: number;
    code?: string;
    details?: unknown;
}

// ============================================
// Type Guards
// ============================================

export function isAxiosError(error: unknown): error is {
    response: { data: { message?: string }; status: number };
    message: string;
} {
    return (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as any).response === 'object'
    );
}

export function isErrorWithMessage(error: unknown): error is { message: string } {
    return (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as any).message === 'string'
    );
}

// ============================================
// Error Handlers
// ============================================

/**
 * Convert any thrown error into a standardized ApiError format
 * @param error - Unknown error from catch block
 * @returns Standardized ApiError object
 */
export function handleApiError(error: unknown): ApiError {
    // Handle Axios errors (most common in API calls)
    if (isAxiosError(error)) {
        return {
            message: error.response.data?.message || error.message || 'An error occurred',
            status: error.response.status,
            details: error.response.data,
        };
    }

    // Handle standard Error objects
    if (isErrorWithMessage(error)) {
        return {
            message: error.message,
        };
    }

    // Handle string errors
    if (typeof error === 'string') {
        return {
            message: error,
        };
    }

    // Fallback for unknown error types
    return {
        message: 'An unknown error occurred',
        details: error,
    };
}

/**
 * Get a user-friendly error message from any error
 * @param error - Unknown error from catch block
 * @param fallback - Fallback message if none can be extracted
 * @returns User-friendly error message string
 */
export function getErrorMessage(error: unknown, fallback = 'An error occurred'): string {
    const apiError = handleApiError(error);
    return apiError.message || fallback;
}

/**
 * Log error with consistent formatting
 * @param context - Context where error occurred (e.g., 'MusicStore.fetchSongs')
 * @param error - The error to log
 */
export function logError(context: string, error: unknown): void {
    const apiError = handleApiError(error);
    console.error(`[${context}]`, {
        message: apiError.message,
        status: apiError.status,
        code: apiError.code,
        details: apiError.details,
    });
}
