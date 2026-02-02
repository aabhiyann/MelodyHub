/**
 * PlaybackControls Component
 * Main playback controls with play/pause, previous/next, shuffle, and repeat
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat } from 'lucide-react';
import { usePlayerStore } from '@/stores/PlayerStore';

export const PlaybackControls = () => {
    const {
        isPlaying,
        shuffled,
        isRepeating,
        togglePlay,
        playPrevious,
        playNext,
        shuffleQueue,
        toggleRepeat,
        queue,
        currentIndex,
    } = usePlayerStore();

    const canGoPrevious = currentIndex > 0;
    const canGoNext = currentIndex < queue.length - 1;

    return (
        <div className="flex flex-col items-center justify-center">
            {/* Main Controls Row */}
            <div className="flex items-center gap-6">
                {/* Shuffle Button */}
                <motion.button
                    onClick={shuffleQueue}
                    className={`p-2 rounded-full transition-all duration-200 ${shuffled
                        ? 'text-brand-primary bg-brand-primary/10 shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                        : 'text-text-tertiary hover:text-text-primary hover:bg-surface-glass'
                        }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Toggle shuffle"
                    aria-pressed={shuffled}
                >
                    <Shuffle className="w-[18px] h-[18px]" />
                </motion.button>

                {/* Previous Button */}
                <motion.button
                    onClick={playPrevious}
                    disabled={!canGoPrevious}
                    className="p-2 rounded-full hover:bg-surface-glass-strong text-text-secondary hover:text-text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    whileHover={canGoPrevious ? { scale: 1.1 } : {}}
                    whileTap={canGoPrevious ? { scale: 0.95 } : {}}
                    aria-label="Previous track"
                >
                    <SkipBack className="w-6 h-6 fill-current" />
                </motion.button>

                {/* Play/Pause Hero Button */}
                <motion.button
                    onClick={togglePlay}
                    className="relative w-12 h-12 rounded-full flex items-center justify-center transition-transform group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                    {/* Gradient Background & Glow */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-[0_4px_16px_rgba(124,58,237,0.5)] group-hover:shadow-[0_6px_20px_rgba(124,58,237,0.6)] transition-shadow duration-300" />

                    {/* Icon */}
                    <div className="relative z-10 text-white">
                        <AnimatePresence mode="wait">
                            {isPlaying ? (
                                <motion.div
                                    key="pause"
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.5, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Pause className="w-6 h-6 fill-current" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="play"
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.5, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Play className="w-6 h-6 fill-current ml-1" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.button>

                {/* Next Button */}
                <motion.button
                    onClick={playNext}
                    disabled={!canGoNext && !isRepeating}
                    className="p-2 rounded-full hover:bg-surface-glass-strong text-text-secondary hover:text-text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    whileHover={canGoNext || isRepeating ? { scale: 1.1 } : {}}
                    whileTap={canGoNext || isRepeating ? { scale: 0.95 } : {}}
                    aria-label="Next track"
                >
                    <SkipForward className="w-6 h-6 fill-current" />
                </motion.button>

                {/* Repeat Button */}
                <motion.button
                    onClick={toggleRepeat}
                    className={`p-2 rounded-full transition-all duration-200 ${isRepeating
                        ? 'text-brand-primary bg-brand-primary/10 shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                        : 'text-text-tertiary hover:text-text-primary hover:bg-surface-glass'
                        }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Toggle repeat"
                    aria-pressed={isRepeating}
                >
                    {isRepeating ? (
                        <div className="relative">
                            <Repeat className="w-[18px] h-[18px]" />
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-current" />
                        </div>
                    ) : (
                        <Repeat className="w-[18px] h-[18px]" />
                    )}
                </motion.button>
            </div>
        </div>
    );
};
