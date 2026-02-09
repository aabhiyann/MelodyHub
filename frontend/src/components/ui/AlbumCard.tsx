/**
 * AlbumCard - Premium album card with Liquid Glass design
 * Apple Music inspired with "album art leaps off screen" effect
 */

import { motion } from 'framer-motion';
import { Play, Heart } from 'lucide-react';
import { LiquidGlassCard } from './LiquidGlassCard';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useCardReveal } from '@/hooks/useCardReveal';

interface AlbumCardProps {
    id: string;
    title: string;
    artist: string;
    imageUrl: string;
    onClick?: () => void;
    onPlay?: () => void;
    onLike?: () => void;
    isLiked?: boolean;
    index?: number;
}

export const AlbumCard = ({
    title,
    artist,
    imageUrl,
    onClick,
    onPlay,
    onLike,
    isLiked = false,
    index = 0,
}: AlbumCardProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const prefersReducedMotion = useReducedMotion();
    const { ref, animate, transition } = useCardReveal({ delay: index });

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={animate}
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
            }}
            transition={transition as any}
        >
            <LiquidGlassCard
                className="p-4 group cursor-pointer"
                hover
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={onClick}
            >
                {/* Album Art - Spotify/Apple Music: rounded-xl, shadow, hover scale */}
                <div className="relative aspect-square mb-4 rounded-xl overflow-hidden shadow-lg bg-surface-card group-hover:shadow-xl transition-shadow duration-300">
                    {/* Album Image */}
                    <motion.img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover"
                        whileHover={!prefersReducedMotion ? { scale: 1.05 } : undefined}
                        transition={{ duration: 0.3 }}
                    />

                    {/* Overlay on hover */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-center justify-center gap-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Play Button */}
                        <motion.button
                            className="p-3 bg-brand-primary rounded-full hover:bg-brand-primary-hover transition-colors shadow-lg"
                            onClick={(e) => {
                                e.stopPropagation();
                                onPlay?.();
                            }}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{
                                scale: isHovered ? 1 : 0.8,
                                opacity: isHovered ? 1 : 0
                            }}
                            transition={{ duration: 0.2, delay: 0.05 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Play className="size-6 text-white fill-white ml-0.5" />
                        </motion.button>

                        {/* Like Button */}
                        <motion.button
                            className={cn(
                                'p-2 rounded-full transition-colors',
                                isLiked
                                    ? 'bg-brand-primary text-white'
                                    : 'bg-white/10 backdrop-blur-md hover:bg-white/20 text-white'
                            )}
                            onClick={(e) => {
                                e.stopPropagation();
                                onLike?.();
                            }}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{
                                scale: isHovered ? 1 : 0.8,
                                opacity: isHovered ? 1 : 0
                            }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Heart className={cn('size-5', isLiked && 'fill-current')} />
                        </motion.button>
                    </motion.div>
                </div>

                {/* Album Info - design tokens */}
                <div className="space-y-1">
                    <h3 className="font-semibold text-base text-text-primary truncate group-hover:text-brand-primary transition-colors">
                        {title}
                    </h3>
                    <p className="text-sm text-text-secondary truncate">{artist}</p>
                </div>
            </LiquidGlassCard>
        </motion.div>
    );
};
