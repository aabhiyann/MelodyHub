/**
 * MiniPlayer - Bottom bar mini player
 * Click to expand, compact info display
 */

import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, Heart, ChevronUp } from 'lucide-react';
import { usePlayerStore } from '@/stores/PlayerStore';
import { cn } from '@/lib/utils';

export const MiniPlayer = () => {
    const {
        currentSong,
        isPlaying,
        togglePlayPause,
        next,
        setPlayerState,
    } = usePlayerStore();

    if (!currentSong) return null;

    return (
        <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 md:left-[240px]"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
        >
            <div className="bg-bg-secondary border-t border-white/10 backdrop-blur-xl">
                <div className="flex items-center gap-4 px-4 py-3">
                    {/* Album Art + Song Info */}
                    <button
                        onClick={() => setPlayerState('expanded')}
                        className="flex items-center gap-3 flex-1 min-w-0 hover:bg-white/5 p-2 -m-2 rounded-lg transition-colors"
                    >
                        <img
                            src={currentSong.imageUrl}
                            alt={currentSong.title}
                            className="size-12 rounded object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0 text-left">
                            <p className="text-sm font-semibold text-white truncate">
                                {currentSong.title}
                            </p>
                            <p className="text-xs text-text-secondary truncate">
                                {currentSong.artist}
                            </p>
                        </div>
                    </button>

                    {/* Controls */}
                    <div className="flex items-center gap-2 shrink-0">
                        {/* Like */}
                        <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                            <Heart className="size-5 text-text-secondary hover:text-white" />
                        </button>

                        {/* Play/Pause */}
                        <button
                            onClick={togglePlayPause}
                            className="p-2 bg-white/10 hover:bg-white/15 rounded-lg transition-colors"
                        >
                            {isPlaying ? (
                                <Pause className="size-5 text-white fill-white" />
                            ) : (
                                <Play className="size-5 text-white fill-white" />
                            )}
                        </button>

                        {/* Next */}
                        <button
                            onClick={next}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <SkipForward className="size-5 text-text-secondary hover:text-white" />
                        </button>

                        {/* Expand */}
                        <button
                            onClick={() => setPlayerState('expanded')}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors ml-2"
                        >
                            <ChevronUp className="size-5 text-text-secondary hover:text-white" />
                        </button>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1 bg-white/10">
                    <motion.div
                        className="h-full bg-brand-primary"
                        style={{ width: '45%' }} // Replace with actual progress
                    />
                </div>
            </div>
        </motion.div>
    );
};
