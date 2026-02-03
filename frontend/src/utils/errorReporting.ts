/**
 * Error Reporting Utility
 * Centralized error logging and monitoring integration
 */

export const reportError = (
  error: Error,
  errorInfo?: React.ErrorInfo,
  context?: string
): void => {
  // Always log to console in development
  if (import.meta.env.DEV) {
    console.group('🚨 Error Boundary Caught Error');
    console.error('Error:', error);
    console.error('Error Message:', error.message);
    console.error('Stack:', error.stack);
    if (errorInfo) {
      console.error('Component Stack:', errorInfo.componentStack);
    }
    if (context) {
      console.error('Context:', context);
    }
    console.groupEnd();
  }

  // Send to monitoring service (Sentry, LogRocket, etc.)
  // Uncomment and configure when ready
  /*
  if (typeof window !== 'undefined' && window.Sentry) {
    window.Sentry.captureException(error, {
      extra: {
        componentStack: errorInfo?.componentStack,
        context,
      },
    });
  }
  */

  // Could also send to custom logging endpoint
  /*
  fetch('/api/errors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      error: error.toString(),
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      context,
      timestamp: new Date().toISOString(),
    }),
  }).catch(console.error);
  */
};

export const logError = (context: string, error: unknown): void => {
  const errorObj = error instanceof Error ? error : new Error(String(error));
  reportError(errorObj, undefined, context);
};
