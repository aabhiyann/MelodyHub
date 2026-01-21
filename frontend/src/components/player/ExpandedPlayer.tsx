/**
 * ExpandedPlayer - Middle state between mini and fullscreen
 * Click-to-expand overlay with medium-sized controls
 */

import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, SkipForward, SkipBack, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import { usePlayerStore } from '@/stores/PlayerStore';
import { cn } from '@/lib/utils';

export const ExpandedPlayer = () => {
    const {
        currentSong,
        isPlaying,
        playerState,
        togglePlayPause,
        next,
        previous,
        setPlayerState,
    } = usePlayerStore();

    if (playerState !== 'expanded' || !currentSong) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed bottom-0 left-0 right-0 z-50 md:left-[240px]"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
                <div className="bg-bg-secondary border-t border-white/10 backdrop-blur-xl p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => setPlayerState('mini')}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <ChevronDown className="size-5 text-text-secondary" />
                        </button>
                        <button
                            onClick={() => setPlayerState('fullscreen')}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <ChevronUp className="size-5 text-text-secondary" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex items-center gap-6">
                        {/* Album Art */}
                        <motion.img
                            src={currentSong.imageUrl}
                            alt={currentSong.title}
                            className="size-32 rounded-lg object-cover shadow-xl"
                            layoutId="albumArt"
                        />

                        {/* Song Info & Controls */}
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-1">{currentSong.title}</h3>
                            <p className="text-base text-text-secondary mb-4">{currentSong.artist}</p>

                            {/* Controls */}
                            <div className="flex items-center gap-3">
                                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                    <Heart className="size-5 text-text-secondary hover:text-white" />
                                </button>

                                <button
                                    onClick={previous}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <SkipBack className="size-6 text-white" />
                                </button>

                                <button
                                    onClick={togglePlayPause}
                                    className="p-4 bg-brand-primary hover:bg-brand-primary-hover rounded-full transition-colors"
                                >
                                    {isPlaying ? (
                                        <Pause className="size-6 text-white fill-white" />
                                    ) : (
                                        <Play className="size-6 text-white fill-white ml-0.5" />
                                    )}
                                </button>

                                <button
                                    onClick={next}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <SkipForward className="size-6 text-white" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                        <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-brand-primary"
                                style={{ width: '45%' }}
                            />
                        </div>
                        <div className="flex justify-between text-xs text-text-tertiary mt-1">
                            <span>1:23</span>
                            <span>3:45</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
