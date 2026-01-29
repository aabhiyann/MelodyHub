import { useEffect, useState } from 'react';
import { motion, animate } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
    current: number;
    total: number;
    className?: string;
    showShimmer?: boolean;
}

export const ProgressBar = ({ current, total, className, showShimmer = true }: ProgressBarProps) => {
    const [displayProgress, setDisplayProgress] = useState(0);

    useEffect(() => {
        const targetProgress = Math.min((current / Math.max(total, 1)) * 100, 100);

        const controls = animate(displayProgress, targetProgress, {
            duration: 0.3,
            ease: "easeOut",
            onUpdate: (latest) => setDisplayProgress(latest),
        });

        return () => controls.stop();
    }, [current, total]);

    return (
        <div className={cn("w-full h-1 bg-white/10 rounded-full overflow-hidden", className)}>
            <motion.div
                className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary relative"
                style={{ width: `${displayProgress}%` }}
            >
                {showShimmer && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full animate-shimmer" />
                )}
            </motion.div>
        </div>
    );
};
