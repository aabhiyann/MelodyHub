/**
 * PullToRefresh - Pull-down to refresh content
 * Mobile-friendly content refresh interaction
 */

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
    onRefresh: () => Promise<void>;
    children: React.ReactNode;
    threshold?: number;
    disabled?: boolean;
}

export const PullToRefresh = ({
    onRefresh,
    children,
    threshold = 80,
    disabled = false,
}: PullToRefreshProps) => {
    const [pullDistance, setPullDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [canRefresh, setCanRefresh] = useState(false);
    const startY = useRef(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        if (disabled || isRefreshing) return;

        const scrollTop = containerRef.current?.scrollTop || 0;
        if (scrollTop === 0) {
            startY.current = e.touches[0].clientY;
        }
    }, [disabled, isRefreshing]);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (disabled || isRefreshing || startY.current === 0) return;

        const currentY = e.touches[0].clientY;
        const distance = currentY - startY.current;

        if (distance > 0) {
            // Prevent default pull-to-refresh
            e.preventDefault();

            // Apply resistance
            const resistance = 2.5;
            const adjustedDistance = distance / resistance;
            setPullDistance(Math.min(adjustedDistance, threshold * 1.5));
            setCanRefresh(adjustedDistance >= threshold);
        }
    }, [disabled, isRefreshing, threshold]);

    const handleTouchEnd = useCallback(async () => {
        if (disabled || isRefreshing) return;

        if (canRefresh) {
            setIsRefreshing(true);
            try {
                await onRefresh();
            } finally {
                setIsRefreshing(false);
                setPullDistance(0);
                setCanRefresh(false);
            }
        } else {
            setPullDistance(0);
            setCanRefresh(false);
        }

        startY.current = 0;
    }, [disabled, isRefreshing, canRefresh, onRefresh]);

    const rotation = (pullDistance / threshold) * 360;
    const opacity = Math.min(pullDistance / threshold, 1);

    return (
        <div
            ref={containerRef}
            className="h-full overflow-y-auto"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Pull indicator */}
            <motion.div
                className="flex items-center justify-center"
                animate={{
                    height: isRefreshing ? 60 : pullDistance,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
                <motion.div
                    style={{ opacity }}
                    animate={{
                        rotate: isRefreshing ? 360 : rotation,
                    }}
                    transition={{
                        rotate: isRefreshing
                            ? { repeat: Infinity, duration: 1, ease: 'linear' }
                            : { duration: 0 },
                    }}
                >
                    <RefreshCw
                        className={`size-6 ${canRefresh ? 'text-brand-primary' : 'text-gray-400'
                            }`}
                    />
                </motion.div>
            </motion.div>

            {/* Content */}
            <motion.div
                animate={{
                    y: isRefreshing ? 60 : pullDistance,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
                {children}
            </motion.div>
        </div>
    );
};
