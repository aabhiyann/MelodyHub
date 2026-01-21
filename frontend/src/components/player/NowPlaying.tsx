/**
 * NowPlaying Component
 * Displays current track info with album art, song title, artist, and action buttons
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Heart, FileText } from 'lucide-react';
import { usePlayerStore } from '@/stores/PlayerStore';
import { useState } from 'react';
import { HeartParticles } from '../HeartParticles';

export const NowPlaying = () => {
    const { currentSong, isPlaying } = usePlayerStore();
    const [isLiked, setIsLiked] = useState(false);
    const [showParticles, setShowParticles] = useState(false);

    const handleLike = () => {
        const newLikedState = !isLiked;
        setIsLiked(newLikedState);

        if (newLikedState) {
            setShowParticles(true);
            setTimeout(() => setShowParticles(false), 600);

            if ('vibrate' in navigator) {
                navigator.vibrate(50);
            }
        }
    };

    if (!currentSong) {
        return (
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-white/5 animate-pulse" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-white/5 rounded animate-pulse" />
                    <div className="h-3 w-24 bg-white/5 rounded animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4 min-w-0">
            {/* Album Artwork */}
            <motion.div
                className="relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden shadow-lg"
                animate={{
                    rotate: isPlaying ? 360 : 0,
                }}
                transition={{
                    duration: 20,
                    repeat: isPlaying ? Infinity : 0,
                    ease: 'linear',
                }}
            >
                <img
                    src={currentSong.imageUrl}
                    alt={currentSong.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </motion.div>

            {/* Track Info */}
            <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-white truncate hover:underline cursor-pointer">
                    {currentSong.title}
                </h3>
                <p className="text-sm text-white/60 truncate hover:underline cursor-pointer">
                    {currentSong.artist}
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
                {/* Like Button */}
                <motion.button
                    onClick={handleLike}
                    className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
                    whileTap={{ scale: 0.9 }}
                    aria-label={isLiked ? 'Unlike track' : 'Like track'}
                >
                    <motion.div
                        animate={{
                            scale: isLiked ? [1, 1.3, 1] : 1,
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        <Heart
                            className={`w-5 h-5 transition-all duration-300 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white/70'
                                }`}
                        />
                    </motion.div>

                    {/* Glow Effect */}
                    <AnimatePresence>
                        {isLiked && (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 1 }}
                                animate={{ scale: 1.5, opacity: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0 rounded-full bg-red-500/50 pointer-events-none"
                            />
                        )}
                    </AnimatePresence>

                    {/* Particle Burst */}
                    <AnimatePresence>
                        {showParticles && <HeartParticles count={6} color="#ef4444" size={6} />}
                    </AnimatePresence>
                </motion.button>

                {/* Lyrics Button */}
                <motion.button
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="View lyrics"
                >
                    <FileText className="w-5 h-5 text-white/70" />
                </motion.button>
            </div>
        </div>
    );
};
