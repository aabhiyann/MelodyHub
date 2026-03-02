/**
 * NowPlaying Component
 * Displays current track info with album art, song title, artist, and action buttons
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Plus, Maximize2 } from 'lucide-react';
import { usePlayerStore } from '@/stores/PlayerStore';
import { useState, memo } from 'react';
import { HeartParticles } from '@/components/shared/HeartParticles';
import { OptimizedImage } from '@/components/shared/OptimizedImage';
import { AddToPlaylistDialog } from '@/components/features/playlist/AddToPlaylistDialog';

export const NowPlaying = memo(() => {
    const { currentSong, isPlaying } = usePlayerStore();
    const [isLiked, setIsLiked] = useState(false);
    const [showParticles, setShowParticles] = useState(false);
    const [showPlaylistDialog, setShowPlaylistDialog] = useState(false);

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
                <div className="w-14 h-14 rounded-md bg-white/5 animate-pulse" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-white/5 rounded animate-pulse" />
                    <div className="h-3 w-24 bg-white/5 rounded animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4 min-w-0 group/container">
            {/* Gradient Definition for Heart */}
            <svg width="0" height="0" className="absolute pointer-events-none">
                <defs>
                    <linearGradient id="heart-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#EF4444" /> {/* red-500 */}
                        <stop offset="100%" stopColor="#F59E0B" /> {/* amber-500 */}
                    </linearGradient>
                </defs>
            </svg>

            {/* Album Artwork */}
            <div className="relative flex-shrink-0 w-14 h-14 group/art cursor-pointer">
                <motion.div
                    className="w-full h-full rounded-lg overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.4)] border border-white/5"
                    animate={{
                        rotate: isPlaying ? 360 : 0
                    }}
                    transition={{
                        duration: 20,
                        ease: "linear",
                        repeat: Infinity,
                        repeatType: "loop"
                    }}
                    style={{ willChange: "transform" }}
                >
                    <OptimizedImage
                        src={currentSong.imageUrl}
                        alt={currentSong.title}
                        size="thumbnail"
                        className="w-full h-full object-cover"
                    />
                </motion.div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 rounded-lg bg-black/40 opacity-0 group-hover/art:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                    <Maximize2 className="w-6 h-6 text-white drop-shadow-md" />
                </div>
            </div>

            {/* Track Info */}
            <div className="flex-1 min-w-0 flex flex-col justify-center overflow-hidden">
                <div className="overflow-hidden relative w-full">
                    <h3
                        className={`text-[14px] font-semibold text-white leading-tight tracking-wide whitespace-nowrap ${currentSong.title.length > 22
                                ? 'inline-block animate-marquee hover:pause-marquee'
                                : 'truncate'
                            }`}
                        title={currentSong.title}
                    >
                        {currentSong.title.length > 22
                            ? `${currentSong.title}\u00a0\u00a0\u00a0\u00a0${currentSong.title}`
                            : currentSong.title}
                    </h3>
                </div>
                <p className="text-[13px] font-normal text-zinc-400 truncate hover:text-white hover:underline cursor-pointer transition-colors mt-0.5">
                    {currentSong.artist}
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 opacity-0 group-hover/container:opacity-100 transition-opacity duration-300">
                {/* Like Button */}
                <motion.button
                    onClick={handleLike}
                    className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
                    whileTap={{ scale: 0.9 }}
                    aria-label={isLiked ? 'Unlike track' : 'Like track'}
                >
                    <motion.div
                        animate={{
                            scale: isLiked ? [1, 1.4, 1.1, 1] : 1,
                        }}
                        transition={{ duration: 0.4 }}
                    >
                        <Heart
                            className={`w-5 h-5 transition-all duration-300 ${isLiked ? 'stroke-none' : 'text-zinc-400 hover:text-white'
                                }`}
                            style={isLiked ? { fill: 'url(#heart-gradient)' } : {}}
                        />
                    </motion.div>

                    {/* Particle Burst */}
                    <AnimatePresence>
                        {showParticles && <HeartParticles count={8} color="#EF4444" size={4} />}
                    </AnimatePresence>
                </motion.button>

                {/* Add to Playlist Button */}
                <motion.button
                    onClick={() => setShowPlaylistDialog(true)}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Add to playlist"
                >
                    <Plus className="w-5 h-5" />
                </motion.button>
            </div>

            {/* AddToPlaylistDialog */}
            {currentSong && (
                <AddToPlaylistDialog
                    songId={currentSong._id}
                    open={showPlaylistDialog}
                    onOpenChange={setShowPlaylistDialog}
                />
            )}
        </div>
    );
});
