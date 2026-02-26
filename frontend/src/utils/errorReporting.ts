/**
 * Enhanced Error Reporting with Monitoring Integration
 * 
 * This utility provides comprehensive error logging and integrates with
 * production monitoring services like Sentry, LogRocket, etc.
 */

import { ErrorInfo } from 'react';

// Define error severity levels
export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  FATAL = 'fatal'
}

// Extended error context
export interface ErrorContext {
  component?: string;
  userId?: string;
  userEmail?: string;
  route?: string;
  action?: string;
  metadata?: Record<string, any>;
  severity?: ErrorSeverity;
}

/**
 * Report error to monitoring service and console
 */
export const reportError = (
  error: Error,
  errorInfo?: ErrorInfo,
  context?: string | ErrorContext
): void => {
  // Normalize context
  const errorContext: ErrorContext = typeof context === 'string'
    ? { component: context }
    : (context || {});

  const severity = errorContext.severity || ErrorSeverity.ERROR;

  // Development logging
  if (import.meta.env.DEV) {
    console.group(`🚨 Error Boundary Caught Error [${severity.toUpperCase()}]`);
    console.error('Error:', error);
    console.error('Error Message:', (error instanceof Error ? error.message : "Unknown error"));
    if (error.stack) {
      console.error('Stack Trace:', error.stack);
    }
    if (errorInfo?.componentStack) {
      console.error('Component Stack:', errorInfo.componentStack);
    }
    if (errorContext) {
      console.log('Context:', errorContext);
    }
    console.groupEnd();
  }

  // Production monitoring integration
  if (import.meta.env.PROD) {
    // Sentry integration
    const sentry = window.Sentry;
    if (sentry) {
      sentry.withScope((scope) => {
        // Set severity
        scope.setLevel(severity === ErrorSeverity.FATAL ? 'fatal' : severity);

        // Set user context
        if (errorContext.userId) {
          scope.setUser({
            id: errorContext.userId,
            email: errorContext.userEmail
          });
        }

        // Set custom context
        if (errorContext.component) {
          scope.setTag('component', errorContext.component);
        }
        if (errorContext.route) {
          scope.setTag('route', errorContext.route);
        }
        if (errorContext.action) {
          scope.setContext('action', { name: errorContext.action });
        }
        if (errorContext.metadata) {
          scope.setContext('metadata', errorContext.metadata);
        }

        // Set component stack if available
        if (errorInfo?.componentStack) {
          scope.setContext('react', {
            componentStack: errorInfo.componentStack
          });
        }

        // Capture the error
        sentry.captureException(error);
      });
    }

    // LogRocket integration
    if (window.LogRocket) {
      window.LogRocket.captureException(error, {
        tags: {
          component: errorContext.component,
          severity
        },
        extra: {
          errorInfo,
          ...errorContext.metadata
        }
      });
    }

    // Custom analytics/logging service
    if (window.analytics) {
      window.analytics.track('Error Occurred', {
        error: (error instanceof Error ? error.message : "Unknown error"),
        component: errorContext.component,
        severity,
        stack: error.stack,
        ...errorContext.metadata
      });
    }
  }
};

/**
 * Report network errors specifically
 */
export const reportNetworkError = (
  error: Error,
  endpoint?: string,
  method?: string
): void => {
  reportError(error, undefined, {
    component: 'NetworkRequest',
    severity: ErrorSeverity.WARNING,
    metadata: {
      endpoint,
      method,
      isNetworkError: true,
      timestamp: new Date().toISOString()
    }
  });
};

/**
 * Report user action errors
 */
export const reportUserActionError = (
  error: Error,
  action: string,
  metadata?: Record<string, any>
): void => {
  reportError(error, undefined, {
    action,
    severity: ErrorSeverity.ERROR,
    metadata: {
      ...metadata,
      userAction: true,
      timestamp: new Date().toISOString()
    }
  });
};

// Type declarations for monitoring services
interface SentryScope {
  setLevel: (level: string) => void;
  setUser: (user: { id?: string; email?: string } | null) => void;
  setTag: (key: string, value: string) => void;
  setContext: (key: string, context: unknown) => void;
}

declare global {
  interface Window {
    Sentry?: {
      withScope: (callback: (scope: SentryScope) => void) => void;
      captureException: (error: Error) => void;
    };
    LogRocket?: {
      captureException: (error: Error, context?: Record<string, unknown>) => void;
    };
    analytics?: {
      track: (event: string, properties?: Record<string, unknown>) => void;
    };
  }
}

