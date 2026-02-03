/**
 * User Error Feedback System
 * 
 * Allows users to report errors with additional context.
 * Useful for debugging production issues.
 */

import { reportError, ErrorSeverity } from './errorReporting';

export interface ErrorFeedback {
    errorId: string;
    errorMessage: string;
    userDescription?: string;
    reproductionSteps?: string;
    expectedBehavior?: string;
    actualBehavior?: string;
    screenshots?: File[];
    timestamp: string;
    url: string;
    userAgent: string;
}

/**
 * Submit error feedback from user
 */
export const submitErrorFeedback = async (feedback: Omit<ErrorFeedback, 'timestamp' | 'url' | 'userAgent'>): Promise<void> => {
    const completeFeedback: ErrorFeedback = {
        ...feedback,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
    };

    // Log to monitoring service
    const error = new Error(`User Reported Error: ${feedback.errorMessage}`);
    reportError(error, undefined, {
        component: 'UserFeedback',
        severity: ErrorSeverity.WARNING,
        metadata: {
            userFeedback: completeFeedback,
            userReported: true
        }
    });

    // In production, send to backend endpoint
    if (import.meta.env.PROD) {
        try {
            // await axios.post('/api/error-feedback', completeFeedback);
            console.log('Error feedback submitted:', completeFeedback);
        } catch (error) {
            console.error('Failed to submit error feedback:', error);
        }
    } else {
        console.log('📧 Error Feedback:', completeFeedback);
    }
};

/**
 * Generate unique error ID for tracking
 */
export const generateErrorId = (): string => {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
