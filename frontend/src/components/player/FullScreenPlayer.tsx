/**
 * FullScreenPlayer - Immersive full-screen player
 * Large album art, comprehensive controls, lyrics/queue tabs
 */

import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Play,
    Pause,
    SkipForward,
    SkipBack,
    Repeat,
    Shuffle,
    Heart,
    Volume2,
    List,
    Mic2,
} from 'lucide-react';
import { usePlayerStore } from '@/stores/PlayerStore';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export const FullScreenPlayer = () => {
    const {
        currentSong,
        isPlaying,
        playerState,
        togglePlayPause,
        next,
        previous,
        toggleShuffle,
        cycleRepeat,
        setPlayerState,
        isShuffle,
        repeatMode,
    } = usePlayerStore();

    const [activeTab, setActiveTab] = useState<'player' | 'lyrics' | 'queue'>('player');

    if (playerState !== 'fullscreen' || !currentSong) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[100] bg-gradient-to-b from-bg-primary to-bg-secondary"
                initial={{ opacity: 0, y: '100%' }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
                {/* Background Blur */}
                <div
                    className="absolute inset-0 opacity-30 blur-3xl"
                    style={{
                        backgroundImage: `url(${currentSong.imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />

                {/* Content */}
                <div className="relative h-full flex flex-col p-6 max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <button
                            onClick={() => setPlayerState('mini')}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X className="size-6 text-white" />
                        </button>

                        {/* Tabs */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveTab('player')}
                                className={cn(
                                    'px-4 py-2 rounded-lg font-medium transition-colors',
                                    activeTab === 'player'
                                        ? 'bg-white/10 text-white'
                                        : 'text-text-secondary hover:text-white'
                                )}
                            >
                                Player
                            </button>
                            <button
                                onClick={() => setActiveTab('lyrics')}
                                className={cn(
                                    'px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2',
                                    activeTab === 'lyrics'
                                        ? 'bg-white/10 text-white'
                                        : 'text-text-secondary hover:text-white'
                                )}
                            >
                                <Mic2 className="size-4" />
                                Lyrics
                            </button>
                            <button
                                onClick={() => setActiveTab('queue')}
                                className={cn(
                                    'px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2',
                                    activeTab === 'queue'
                                        ? 'bg-white/10 text-white'
                                        : 'text-text-secondary hover:text-white'
                                )}
                            >
                                <List className="size-4" />
                                Queue
                            </button>
                        </div>
                    </div>

                    {/* Album Art */}
                    <div className="flex-1 flex items-center justify-center mb-8">
                        <motion.img
                            src={currentSong.imageUrl}
                            alt={currentSong.title}
                            className="w-full max-w-md aspect-square rounded-2xl shadow-2xl object-cover"
                            layoutId="albumArt"
                        />
                    </div>

                    {/* Song Info */}
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-white mb-2">{currentSong.title}</h1>
                        <p className="text-lg text-text-secondary mb-1">{currentSong.artist}</p>
                        <p className="text-sm text-text-tertiary">{currentSong.album}</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                        <div className="h-1 bg-white/20 rounded-full overflow-hidden mb-2">
                            <motion.div
                                className="h-full bg-white"
                                style={{ width: '45%' }}
                            />
                        </div>
                        <div className="flex justify-between text-xs text-text-secondary">
                            <span>1:23</span>
                            <span>3:45</span>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-4 mb-6">
                        {/* Shuffle */}
                        <button
                            onClick={toggleShuffle}
                            className={cn(
                                'p-2 rounded-lg transition-colors',
                                isShuffle ? 'text-brand-primary' : 'text-text-secondary hover:text-white'
                            )}
                        >
                            <Shuffle className="size-5" />
                        </button>

                        {/* Previous */}
                        <button
                            onClick={previous}
                            className="p-3 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <SkipBack className="size-6 text-white fill-white" />
                        </button>

                        {/* Play/Pause */}
                        <button
                            onClick={togglePlayPause}
                            className="p-5 bg-white hover:bg-white/90 rounded-full transition-colors"
                        >
                            {isPlaying ? (
                                <Pause className="size-8 text-black fill-black" />
                            ) : (
                                <Play className="size-8 text-black fill-black ml-1" />
                            )}
                        </button>

                        {/* Next */}
                        <button
                            onClick={next}
                            className="p-3 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <SkipForward className="size-6 text-white fill-white" />
                        </button>

                        {/* Repeat */}
                        <button
                            onClick={cycleRepeat}
                            className={cn(
                                'p-2 rounded-lg transition-colors',
                                repeatMode !== 'off' ? 'text-brand-primary' : 'text-text-secondary hover:text-white'
                            )}
                        >
                            <Repeat className="size-5" />
                        </button>
                    </div>

                    {/* Volume & Actions */}
                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <Heart className="size-5 text-text-secondary hover:text-white" />
                        </button>

                        <Volume2 className="size-5 text-text-secondary shrink-0" />
                        <input
                            type="range"
                            min="0"
                            max="100"
                            defaultValue="70"
                            className="flex-1 h-1 bg-white/20 rounded-full appearance-none
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:size-3
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-white
                [&::-webkit-slider-thumb]:cursor-pointer"
                        />
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
