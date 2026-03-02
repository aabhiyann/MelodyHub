import { ReactNode, useState } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SectionErrorBoundaryProps {
    children: ReactNode;
    sectionName?: string;
    showRetry?: boolean;
}

const SectionErrorFallback = ({
    sectionName,
    error,
    onRetry
}: {
    sectionName?: string;
    error: Error | null;
    onRetry: () => void;
}) => {
    return (
        <div className="glass-panel p-6 rounded-xl border border-white/10 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-error/10 rounded-full mb-4">
                <AlertCircle className="size-6 text-error" />
            </div>

            <h3 className="text-lg font-semibold text-text-primary mb-2">
                Something went wrong
            </h3>

            <p className="text-text-secondary text-sm mb-4">
                This section couldn't load. The rest of the page should still work.
            </p>

            <Button
                onClick={onRetry}
                variant="outline"
                size="sm"
                className="border-white/10 hover:bg-white/5 text-text-primary flex items-center gap-2 mx-auto"
            >
                <RefreshCw className="size-4" />
                Retry
            </Button>

            {/* Error Details (Dev Only) */}
            {import.meta.env.DEV && error && (
                <details className="mt-4 text-left">
                    <summary className="cursor-pointer text-text-secondary text-xs mb-2 hover:text-text-primary transition-colors">
                        Error Details (Dev)
                    </summary>
                    <div className="bg-black/30 rounded p-2 overflow-auto max-h-32">
                        <pre className="text-xs text-error font-mono">
                            {error.toString()}
                        </pre>
                    </div>
                </details>
            )}
        </div>
    );
};

export const SectionErrorBoundary = ({
    children,
    sectionName,
    showRetry = true
}: SectionErrorBoundaryProps) => {
    const [resetKey, setResetKey] = useState(0);

    const handleRetry = () => {
        setResetKey(prev => prev + 1);
    };

    return (
        <ErrorBoundary
            key={resetKey}
            fallback={
                showRetry ? (
                    <SectionErrorFallback
                        sectionName={sectionName}
                        error={null}
                        onRetry={handleRetry}
                    />
                ) : (
                    <div className="glass-panel p-4 rounded-xl border border-white/10 text-center">
                        <p className="text-text-secondary text-sm">
                            This section couldn't load. Please refresh the page.
                        </p>
                    </div>
                )
            }
            onError={(error) => {
                console.error(`Section error (${sectionName || 'unnamed'}):`, error);
            }}
        >
            {children}
        </ErrorBoundary>
    );
};
