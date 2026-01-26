import { useState, useRef, useEffect, ReactNode } from "react";
import { motion, useAnimation } from "framer-motion";
import { Loader2, ArrowDown } from "lucide-react";

interface PullToRefreshProps {
    onRefresh: () => Promise<void>;
    children: ReactNode;
}

export const PullToRefresh = ({ onRefresh, children }: PullToRefreshProps) => {
    const [startY, setStartY] = useState(0);
    const [pullDistance, setPullDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const controls = useAnimation();

    const THRESHOLD = 80;
    const MAX_PULL = 150;

    const handleTouchStart = (e: React.TouchEvent) => {
        if (containerRef.current?.scrollTop === 0) {
            setStartY(e.touches[0].clientY);
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (startY === 0 || isRefreshing) return;

        const currentY = e.touches[0].clientY;
        const diff = currentY - startY;

        if (diff > 0 && containerRef.current?.scrollTop === 0) {
            // Add resistance
            const damped = diff * 0.5;
            setPullDistance(Math.min(damped, MAX_PULL));
            e.preventDefault(); // Prevent native scroll
        }
    };

    const handleTouchEnd = async () => {
        if (isRefreshing) return;

        if (pullDistance > THRESHOLD) {
            setIsRefreshing(true);
            setPullDistance(THRESHOLD); // Snap to threshold
            await onRefresh();
            setIsRefreshing(false);
        }

        setPullDistance(0);
        setStartY(0);
    };

    return (
        <div
            ref={containerRef}
            className="h-full overflow-y-auto overscroll-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div
                className="flex items-center justify-center overflow-hidden transition-all duration-200"
                style={{ height: pullDistance }}
            >
                {isRefreshing ? (
                    <Loader2 className="animate-spin text-brand-primary" />
                ) : (
                    <ArrowDown
                        className="text-text-secondary transition-transform"
                        style={{ transform: `rotate(${pullDistance > THRESHOLD ? 180 : 0}deg)` }}
                    />
                )}
            </div>
            <motion.div>
                {children}
            </motion.div>
        </div>
    );
};
