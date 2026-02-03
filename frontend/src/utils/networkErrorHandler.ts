/**
 * Network Error Handling with Auto-Recovery
 * 
 * Handles network errors gracefully with retry logic, exponential backoff,
 * and user-friendly error messages.
 */

import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { reportNetworkError } from './errorReporting';

export interface RetryConfig {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    backoffMultiplier?: number;
    retryableStatus?: number[];
}

const DEFAULT_RETRY_CONFIG: Required<RetryConfig> = {
    maxRetries: 3,
    initialDelay: 1000, // 1 second
    maxDelay: 10000, // 10 seconds
    backoffMultiplier: 2,
    retryableStatus: [408, 429, 500, 502, 503, 504]
};

/**
 * Check if error is a network error
 */
export const isNetworkError = (error: any): boolean => {
    if (!error) return false;

    // No response = network error
    if (!error.response) return true;

    // Check status codes
    const status = error.response?.status;
    return status === 0 || status >= 500;
};

/**
 * Check if error is retryable
 */
const isRetryableError = (error: AxiosError, config: Required<RetryConfig>): boolean => {
    if (!error.response) return true; // Network errors are retryable

    const status = error.response.status;
    return config.retryableStatus.includes(status);
};

/**
 * Calculate retry delay with exponential backoff
 */
const calculateRetryDelay = (
    retryCount: number,
    config: Required<RetryConfig>
): number => {
    const delay = config.initialDelay * Math.pow(config.backoffMultiplier, retryCount);
    return Math.min(delay, config.maxDelay);
};

/**
 * Sleep for specified milliseconds
 */
const sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Axios request with auto-retry
 */
export const requestWithRetry = async <T = any>(
    requestConfig: AxiosRequestConfig,
    retryConfig: RetryConfig = {}
): Promise<T> => {
    const config = { ...DEFAULT_RETRY_CONFIG, ...retryConfig };
    let lastError: AxiosError | null = null;

    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
        try {
            const response = await axios(requestConfig);
            return response.data;
        } catch (error) {
            lastError = error as AxiosError;

            // Don't retry if not retryable
            if (!isRetryableError(lastError, config)) {
                break;
            }

            // Don't retry on last attempt
            if (attempt === config.maxRetries) {
                break;
            }

            // Calculate delay and wait
            const delay = calculateRetryDelay(attempt, config);
            console.log(`Request failed, retrying in ${delay}ms (attempt ${attempt + 1}/${config.maxRetries})`);

            // Report retry attempt
            reportNetworkError(
                lastError,
                requestConfig.url,
                requestConfig.method?.toUpperCase()
            );

            await sleep(delay);
        }
    }

    // All retries failed, throw error
    if (lastError) {
        reportNetworkError(
            lastError,
            requestConfig.url,
            requestConfig.method?.toUpperCase()
        );
        throw lastError;
    }

    throw new Error('Request failed with no error details');
};

/**
 * Get user-friendly error message
 */
export const getNetworkErrorMessage = (error: any): string => {
    if (!error) return 'An unknown error occurred';

    // Network/timeout errors
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        return 'Request timeout. Please check your internet connection and try again.';
    }

    if (!error.response) {
        return 'Unable to connect to server. Please check your internet connection.';
    }

    // HTTP error responses
    const status = error.response?.status;
    const message = error.response?.data?.message || error.response?.data?.error?.message;

    switch (status) {
        case 400:
            return message || 'Invalid request. Please try again.';
        case 401:
            return 'You need to be logged in to perform this action.';
        case 403:
            return 'You don\'t have permission to perform this action.';
        case 404:
            return 'The requested resource was not found.';
        case 409:
            return message || 'This resource already exists.';
        case 429:
            return 'Too many requests. Please wait a moment and try again.';
        case 500:
        case 502:
        case 503:
        case 504:
            return 'Server error. Our team has been notified. Please try again later.';
        default:
            return message || 'Something went wrong. Please try again.';
    }
};

/**
 * Check if user is online
 */
export const isOnline = (): boolean => {
    return navigator.onLine;
};

/**
 * Network status hook data
 */
let networkListeners: Array<(online: boolean) => void> = [];

export const onNetworkStatusChange = (callback: (online: boolean) => void): (() => void) => {
    networkListeners.push(callback);

    // Return cleanup function
    return () => {
        networkListeners = networkListeners.filter(cb => cb !== callback);
    };
};

// Setup network listeners
if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
        console.log('🌐 Network connection restored');
        networkListeners.forEach(cb => cb(true));
    });

    window.addEventListener('offline', () => {
        console.log('🚫 Network connection lost');
        networkListeners.forEach(cb => cb(false));
    });
}
