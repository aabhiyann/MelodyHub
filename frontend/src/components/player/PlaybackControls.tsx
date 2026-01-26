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
                    className={`p-1.5 rounded-full transition-colors ${shuffled
                        ? 'text-brand-primary bg-brand-primary/10'
                        : 'text-zinc-400 hover:text-white hover:bg-white/10'
                        }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Toggle shuffle"
                    aria-pressed={shuffled}
                >
                    <Shuffle className="w-4 h-4" />
                    {shuffled && (
                        <motion.div
                            className="absolute inset-0 rounded-full"
                            animate={{ boxShadow: ['0 0 0 0 rgba(88, 86, 214, 0.4)', '0 0 0 8px rgba(88, 86, 214, 0)'] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                    )}
                </motion.button>

                {/* Previous Button */}
                <motion.button
                    onClick={playPrevious}
                    disabled={!canGoPrevious}
                    className="p-1 rounded-full hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    whileHover={canGoPrevious ? { scale: 1.1 } : {}}
                    whileTap={canGoPrevious ? { scale: 0.95 } : {}}
                    aria-label="Previous track"
                >
                    <SkipBack className="w-5 h-5 text-zinc-200 fill-zinc-200" />
                </motion.button>

                {/* Play/Pause Button */}
                <motion.button
                    onClick={togglePlay}
                    className="relative w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
                    whileHover={{ boxShadow: '0 0 20px rgba(255,255,255,0.2)' }}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                    <AnimatePresence mode="wait">
                        {isPlaying ? (
                            <motion.div
                                key="pause"
                                initial={{ scale: 0, rotate: -90 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 90 }}
                                transition={{ duration: 0.15 }}
                            >
                                <Pause className="w-4 h-4 text-black fill-black" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="play"
                                initial={{ scale: 0, rotate: -90 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 90 }}
                                transition={{ duration: 0.15 }}
                            >
                                <Play className="w-4 h-4 text-black fill-black ml-0.5" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>

                {/* Next Button */}
                <motion.button
                    onClick={playNext}
                    disabled={!canGoNext && !isRepeating}
                    className="p-1 rounded-full hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    whileHover={canGoNext || isRepeating ? { scale: 1.1 } : {}}
                    whileTap={canGoNext || isRepeating ? { scale: 0.95 } : {}}
                    aria-label="Next track"
                >
                    <SkipForward className="w-5 h-5 text-zinc-200 fill-zinc-200" />
                </motion.button>

                {/* Repeat Button */}
                <motion.button
                    onClick={toggleRepeat}
                    className={`relative p-1.5 rounded-full transition-colors ${isRepeating
                        ? 'text-brand-primary bg-brand-primary/10'
                        : 'text-zinc-400 hover:text-white hover:bg-white/10'
                        }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Toggle repeat"
                    aria-pressed={isRepeating}
                >
                    {isRepeating ? (
                        <Repeat className="w-4 h-4 font-bold" />
                    ) : (
                        <Repeat className="w-4 h-4" />
                    )}
                    {isRepeating && (
                        <motion.div
                            className="absolute inset-0 rounded-full"
                            animate={{ boxShadow: ['0 0 0 0 rgba(88, 86, 214, 0.4)', '0 0 0 8px rgba(88, 86, 214, 0)'] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                    )}
                </motion.button>
            </div>
        </div>
    );
};
