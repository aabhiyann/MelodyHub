import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bug } from 'lucide-react';

/**
 * Test Component for Error Boundaries
 * Add this to any page to test error boundary functionality
 * 
 * Usage:
 * import { ErrorBoundaryTest } from '@/components/ErrorBoundaryTest';
 * 
 * Then add: <ErrorBoundaryTest />
 */

const CrashingComponent = ({ type }: { type: 'render' | 'event' }) => {
    if (type === 'render') {
        throw new Error('💥 Test error thrown during render!');
    }
    return null;
};

export const ErrorBoundaryTest = () => {
    const [shouldCrash, setShouldCrash] = useState<'render' | 'event' | null>(null);

    const handleEventError = () => {
        throw new Error('💥 Test error thrown during event handler!');
    };

    return (
        <div className="fixed bottom-24 left-6 z-50 glass-panel p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10">
            <div className="flex items-center gap-2 mb-3">
                <Bug className="size-4 text-yellow-500" />
                <h3 className="text-sm font-semibold text-yellow-500">Error Boundary Test</h3>
            </div>

            <div className="flex flex-col gap-2">
                <Button
                    size="sm"
                    variant="outline"
                    className="text-xs border-red-500/30 hover:bg-red-500/10 text-red-400"
                    onClick={() => setShouldCrash('render')}
                >
                    Trigger Render Error
                </Button>

                <Button
                    size="sm"
                    variant="outline"
                    className="text-xs border-orange-500/30 hover:bg-orange-500/10 text-orange-400"
                    onClick={handleEventError}
                >
                    Trigger Event Error
                </Button>
            </div>

            <p className="text-[10px] text-zinc-500 mt-2">
                Dev testing only - remove before production
            </p>

            {shouldCrash && <CrashingComponent type={shouldCrash} />}
        </div>
    );
};
