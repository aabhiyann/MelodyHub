import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface LikeButtonProps {
    isLiked?: boolean;
    onToggle?: (liked: boolean) => void;
    size?: number;
    className?: string;
}

export const LikeButton = ({ isLiked: initialLiked = false, onToggle, size = 24, className = '' }: LikeButtonProps) => {
    const [isLiked, setIsLiked] = useState(initialLiked);
    const [showParticles, setShowParticles] = useState(false);

    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card clicks
        const newState = !isLiked;
        setIsLiked(newState);
        onToggle?.(newState);

        if (newState) {
            setShowParticles(true);
            setTimeout(() => setShowParticles(false), 1000);

            // Haptic feedback if available
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
        }
    };

    return (
        <button
            onClick={handleLike}
            className={`relative p-2 rounded-full hover:bg-white/10 transition-colors ${className}`}
            aria-label={isLiked ? "Unlike" : "Like"}
            aria-pressed={isLiked}
        >
            <motion.div
                initial={false}
                animate={{
                    scale: isLiked ? [1, 1.4, 1.2, 1] : 1,
                }}
                transition={{
                    duration: 0.4,
                    times: [0, 0.3, 0.6, 1],
                    ease: "easeOut",
                }}
            >
                <Heart
                    size={size}
                    className={isLiked ? 'text-brand-primary' : 'text-zinc-400 hover:text-white'}
                    fill={isLiked ? 'currentColor' : 'none'}
                    strokeWidth={isLiked ? 0 : 2}
                />
            </motion.div>

            {showParticles && <HeartParticles size={size} />}
        </button>
    );
};

const HeartParticles = ({ size }: { size: number }) => {
    const particles = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        angle: (360 / 8) * i,
    }));

    return (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {particles.map(({ id, angle }) => (
                <motion.div
                    key={id}
                    className="absolute w-1.5 h-1.5 rounded-full bg-brand-primary/80"
                    initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                    animate={{
                        scale: [0, 1, 0],
                        x: Math.cos((angle * Math.PI) / 180) * (size * 1.5),
                        y: Math.sin((angle * Math.PI) / 180) * (size * 1.5),
                        opacity: [0, 1, 0],
                    }}
                    transition={{
                        duration: 0.6,
                        ease: "easeOut",
                    }}
                />
            ))}
        </div>
    );
};
