/**
 * SpeechBubble - Contextual messages from Melody
 * Friendly, personality-rich speech bubbles
 */

import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SpeechBubbleProps {
    message: string;
    position?: 'above' | 'below' | 'left' | 'right';
    onDismiss?: () => void;
    dismissible?: boolean;
    className?: string;
}

export const SpeechBubble = ({
    message,
    position = 'above',
    onDismiss,
    dismissible = true,
    className,
}: SpeechBubbleProps) => {
    const getPositionClasses = () => {
        switch (position) {
            case 'above':
                return 'bottom-full mb-2 left-1/2 -translate-x-1/2';
            case 'below':
                return 'top-full mt-2 left-1/2 -translate-x-1/2';
            case 'left':
                return 'right-full mr-2 top-1/2 -translate-y-1/2';
            case 'right':
                return 'left-full ml-2 top-1/2 -translate-y-1/2';
        }
    };

    const getTailClasses = () => {
        switch (position) {
            case 'above':
                return 'top-full left-1/2 -translate-x-1/2 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white';
            case 'below':
                return 'bottom-full left-1/2 -translate-x-1/2 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white';
            case 'left':
                return 'left-full top-1/2 -translate-y-1/2 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-white';
            case 'right':
                return 'right-full top-1/2 -translate-y-1/2 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white';
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className={cn(
                    'absolute z-50 max-w-xs',
                    getPositionClasses(),
                    className
                )}
            >
                {/* Speech bubble */}
                <div className="relative bg-white rounded-lg shadow-xl p-4 border-2 border-brand-primary/20">
                    {/* Message */}
                    <p className="text-sm text-gray-800 font-medium pr-6">
                        {message}
                    </p>

                    {/* Dismiss button */}
                    {dismissible && onDismiss && (
                        <button
                            onClick={onDismiss}
                            className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Dismiss message"
                        >
                            <X className="size-3 text-gray-500" />
                        </button>
                    )}

                    {/* Tail/Arrow */}
                    <div className={cn('absolute w-0 h-0', getTailClasses())} />
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
