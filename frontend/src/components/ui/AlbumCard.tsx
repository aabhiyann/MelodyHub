/**
 * AlbumCard - Premium album card with Liquid Glass design
 * Apple Music inspired with "album art leaps off screen" effect
 */

import { motion } from 'framer-motion';
import { Play, Heart, MoreHorizontal } from 'lucide-react';
import { LiquidGlassCard } from './LiquidGlassCard';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface AlbumCardProps {
    id: string;
    title: string;
    artist: string;
    imageUrl: string;
    onClick?: () => void;
    onPlay?: () => void;
    onLike?: () => void;
    isLiked?: boolean;
}

export const AlbumCard = ({
    title,
    artist,
    imageUrl,
    onClick,
    onPlay,
    onLike,
    isLiked = false,
}: AlbumCardProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const prefersReducedMotion = useReducedMotion();

    return (
        <LiquidGlassCard
            className="p-4 group"
            hover
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            {/* Album Art Container */}
            <div className="relative aspect-square mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
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
                    className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3"
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
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Play className="size-6 text-white fill-white" />
                    </motion.button>

                    {/* Like Button */}
                    <motion.button
                        className={cn(
                            'p-2 rounded-full transition-colors',
                            isLiked
                                ? 'bg-brand-primary text-white'
                                : 'bg-white/10 backdrop-bl hover:bg-white/20 text-white'
                        )}
                        onClick={(e) => {
                            e.stopPropagation();
                            onLike?.();
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Heart className={cn('size-5', isLiked && 'fill-current')} />
                    </motion.button>

                    {/* More Options */}
                    <motion.button
                        className="p-2 bg-white/10 backdrop-blur hover:bg-white/20 rounded-full transition-colors"
                        onClick={(e) => e.stopPropagation()}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <MoreHorizontal className="size-5 text-white" />
                    </motion.button>
                </motion.div>
            </div>

            {/* Album Info */}
            <div className="space-y-1">
                <h3 className="font-semibold text-base text-white truncate">
                    {title}
                </h3>
                <p className="text-sm text-text-secondary truncate">{artist}</p>
            </div>
        </LiquidGlassCard>
    );
};
