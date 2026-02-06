/**
 * NowPlaying Component
 * Displays current track info with album art, song title, artist, and action buttons
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Plus, Maximize2 } from 'lucide-react';
import { usePlayerStore } from '@/stores/PlayerStore';
import { useState, memo } from 'react';
import { HeartParticles } from '@/components/shared/HeartParticles';

export const NowPlaying = memo(() => {
    const { currentSong, isPlaying } = usePlayerStore();
    const [isLiked, setIsLiked] = useState(false);
    const [showParticles, setShowParticles] = useState(false);
    const [showAddMenu, setShowAddMenu] = useState(false);

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
                    <img
                        src={currentSong.imageUrl}
                        alt={currentSong.title}
                        className="w-full h-full object-cover"
                    />
                </motion.div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 rounded-lg bg-black/40 opacity-0 group-hover/art:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                    <Maximize2 className="w-6 h-6 text-white drop-shadow-md" />
                </div>
            </div>

            {/* Track Info */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h3 className="text-[14px] font-semibold text-white truncate hover:underline cursor-pointer leading-tight tracking-wide">
                    {currentSong.title}
                </h3>
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
                <div className="relative">
                    <motion.button
                        onClick={() => setShowAddMenu(!showAddMenu)}
                        className={`p-2 rounded-full hover:bg-white/10 transition-colors ${showAddMenu ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white'}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Add to playlist"
                    >
                        <Plus className="w-5 h-5" />
                    </motion.button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                        {showAddMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute left-0 bottom-full mb-2 w-48 bg-zinc-900 border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 p-1"
                            >
                                <div className="px-3 py-2 border-b border-white/10 mb-1">
                                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Add to Playlist</span>
                                </div>
                                <button className="w-full text-left px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    New Playlist
                                </button>
                                <button className="w-full text-left px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                    Liked Songs
                                </button>
                                <button className="w-full text-left px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                    Daily Mix 1
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
});
