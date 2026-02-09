import { ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { motion } from 'framer-motion';
import { Home, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface PageErrorBoundaryProps {
    children: ReactNode;
}

const PageErrorFallback = ({ error }: { error: Error | null }) => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/home');
        window.location.reload();
    };

    const handleReload = () => {
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-surface-base flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center max-w-md"
            >
                {/* Error Icon */}
                <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-error/20 blur-3xl rounded-full" />
                    <div className="relative bg-surface-elevated p-6 rounded-full border border-white/10">
                        <AlertTriangle className="size-16 text-error" />
                    </div>
                </div>

                {/* Error Message */}
                <h1 className="text-3xl font-display font-bold text-text-primary mb-4">
                    Oops! Something Went Wrong
                </h1>

                <p className="text-text-secondary mb-8 leading-relaxed">
                    We encountered an unexpected error while loading this page.
                    Don't worry, your data is safe. Try refreshing the page or going back home.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        onClick={handleReload}
                        className="bg-brand-primary hover:bg-brand-primary/90 text-white shadow-glow-primary flex items-center gap-2"
                    >
                        <RefreshCw className="size-4" />
                        Reload Page
                    </Button>

                    <Button
                        onClick={handleGoHome}
                        variant="outline"
                        className="border-white/10 hover:bg-white/5 text-text-primary flex items-center gap-2"
                    >
                        <Home className="size-4" />
                        Go Home
                    </Button>
                </div>

                {/* Error Details (Dev Only) */}
                {import.meta.env.DEV && error && (
                    <details className="mt-8 text-left">
                        <summary className="cursor-pointer text-text-secondary text-sm mb-2 hover:text-text-primary transition-colors">
                            Error Details (Development Only)
                        </summary>
                        <div className="bg-black/50 rounded-lg p-4 border border-white/10 overflow-auto max-h-48">
                            <pre className="text-xs text-error font-mono">
                                {error.toString()}
                                {'\n\n'}
                                {error.stack}
                            </pre>
                        </div>
                    </details>
                )}
            </motion.div>
        </div>
    );
};

export const PageErrorBoundary = ({ children }: PageErrorBoundaryProps) => {
    return (
        <ErrorBoundary
            fallback={<PageErrorFallback error={null} />}
            onError={(error) => {
                console.error('Page-level error:', error);
            }}
        >
            {children}
        </ErrorBoundary>
    );
};
