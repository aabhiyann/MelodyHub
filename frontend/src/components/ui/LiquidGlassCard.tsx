/**
 * LiquidGlassCard - Premium glassmorphic card component
 * Apple Music 2025 / Spotify inspired translucent design
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface LiquidGlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    variant?: 'default' | 'elevated' | 'subtle';
    onClick?: () => void;
}

export const LiquidGlassCard = ({
    children,
    className,
    hover = false,
    variant = 'default',
    onClick,
}: LiquidGlassCardProps) => {
    const prefersReducedMotion = useReducedMotion();

    const variantStyles = {
        default: 'bg-white/5 border-white/10',
        elevated: 'bg-white/8 border-white/15',
        subtle: 'bg-white/3 border-white/5',
    };

    return (
        <motion.div
            className={cn(
                // Base liquid glass styles
                'relative rounded-xl',
                'backdrop-blur-xl backdrop-saturate-[180%]',
                'border',
                'shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.1)]',
                // Variant
                variantStyles[variant],
                // Interactive
                onClick && 'cursor-pointer',
                className
            )}
            whileHover={
                hover && !prefersReducedMotion
                    ? {
                        scale: 1.02,
                        boxShadow: '0 12px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.15)',
                    }
                    : undefined
            }
            whileTap={
                onClick && !prefersReducedMotion
                    ? { scale: 0.98 }
                    : undefined
            }
            transition={{
                type: 'spring',
                stiffness: 300,
                damping: 25,
            }}
            onClick={onClick}
        >
            {/* Specular highlight (top edge) */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Content */}
            {children}
        </motion.div>
    );
};
