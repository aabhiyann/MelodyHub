/**
 * LikeButton - Animated heart button with particle burst
 * Premium micro-interaction inspired by Twitter/Instagram
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import { likeAnimation, vibrate } from '@/lib/interactions';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
    isLiked?: boolean;
    onLike?: (liked: boolean) => void;
    size?: number;
    showCount?: boolean;
    count?: number;
    className?: string;
}

export const LikeButton = ({
    isLiked: initialLiked = false,
    onLike,
    size = 24,
    showCount = false,
    count = 0,
    className,
}: LikeButtonProps) => {
    const [isLiked, setIsLiked] = useState(initialLiked);
    const [showParticles, setShowParticles] = useState(false);

    const handleClick = () => {
        const newLiked = !isLiked;
        setIsLiked(newLiked);
        onLike?.(newLiked);

        if (newLiked) {
            setShowParticles(true);
            vibrate([10, 20, 10]); // Haptic feedback
            setTimeout(() => setShowParticles(false), 1000);
        }
    };

    return (
        <div className={cn('relative inline-flex items-center gap-2', className)}>
            <motion.button
                onClick={handleClick}
                aria-label={isLiked ? "Unlike song" : "Like song"}
                aria-pressed={isLiked}
                className={cn(
                    'relative p-2 rounded-full transition-colors',
                    isLiked
                        ? 'bg-error/10 text-error'
                        : 'hover:bg-surface-raised text-text-secondary hover:text-text-primary'
                )}
                variants={likeAnimation}
                initial="initial"
                animate={isLiked ? 'liked' : 'initial'}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                <Heart
                    className={cn('transition-all duration-300')}
                    size={size}
                    fill={isLiked ? 'currentColor' : 'none'}
                    strokeWidth={2}
                />

                {/* Particle burst */}
                <AnimatePresence>
                    {showParticles && (
                        <div className='absolute inset-0 pointer-events-none'>
                            {Array.from({ length: 8 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    className='absolute top-1/2 left-1/2'
                                    initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                                    animate={{
                                        scale: [0, 1, 0],
                                        x: Math.cos((i * Math.PI) / 4) * 30,
                                        y: Math.sin((i * Math.PI) / 4) * 30,
                                        opacity: [1, 1, 0],
                                    }}
                                    transition={{ duration: 0.6, ease: 'easeOut' }}
                                >
                                    <Heart className='text-error' size={12} fill='currentColor' />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Like count */}
            {showCount && (
                <motion.span
                    className='text-body-sm text-text-secondary'
                    initial={{ scale: 1 }}
                    animate={{ scale: isLiked ? [1, 1.2, 1] : 1 }}
                    transition={{ duration: 0.3 }}
                >
                    {count + (isLiked && !initialLiked ? 1 : 0)}
                </motion.span>
            )}
        </div>
    );
};
