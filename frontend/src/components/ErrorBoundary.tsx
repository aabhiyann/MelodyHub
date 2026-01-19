import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error to console in development
        console.error('Error caught by boundary:', error, errorInfo);

        // TODO: Send to error tracking service (Sentry) in production
        // if (import.meta.env.PROD) {
        //   Sentry.captureException(error, { extra: errorInfo });
        // }
    }

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)]">
                    <div className="text-center p-8 glass rounded-lg max-w-md">
                        <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)] mb-4">
                            Something went wrong
                        </h1>
                        <p className="text-[var(--color-text-secondary)] mb-6">
                            We're sorry, but something unexpected happened. Please try refreshing the page.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-[var(--melody-purple-600)] hover:bg-[var(--melody-purple-700)] 
                text-white px-6 py-3 rounded-full font-semibold transition-all"
                        >
                            Refresh Page
                        </button>
                        {import.meta.env.DEV && this.state.error && (
                            <details className="mt-6 text-left">
                                <summary className="cursor-pointer text-[var(--color-text-secondary)] mb-2">
                                    Error Details (Dev Only)
                                </summary>
                                <pre className="text-xs text-red-400 overflow-auto p-4 bg-black/20 rounded">
                                    {this.state.error.toString()}
                                    {'\n'}
                                    {this.state.error.stack}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
