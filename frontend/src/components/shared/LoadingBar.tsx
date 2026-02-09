/**
 * LoadingBar Component
 * Vercel-style progress bar for page transitions and loading states
 */

import { motion, AnimatePresence } from 'framer-motion';
import { progressBarVariants } from '@/lib/animation-variants';

interface LoadingBarProps {
    isLoading: boolean;
    color?: string;
}

export const LoadingBar = ({
    isLoading,
    color = 'var(--primary-500)'
}: LoadingBarProps) => {
    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    className="fixed top-0 left-0 right-0 z-[9999] h-1"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={progressBarVariants}
                    style={{
                        backgroundColor: color,
                        boxShadow: `0 0 10px ${color}, 0 0 5px ${color}`,
                    }}
                />
            )}
        </AnimatePresence>
    );
};
