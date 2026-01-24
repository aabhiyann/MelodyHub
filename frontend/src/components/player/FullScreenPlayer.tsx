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
    Heart,
    Volume2,
    List,
    Mic2,
    VolumeX
} from 'lucide-react';
import { usePlayerStore } from '@/stores/PlayerStore';
import { useMusicStore } from '@/stores/MusicStore';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { ShuffleButton } from './ShuffleButton';
import { RepeatButton } from './RepeatButton';
import { LyricsPanel } from './LyricsPanel';

export const FullScreenPlayer = () => {
    const {
        currentSong,
        isPlaying,
        isExpanded,
        toggleExpanded,
        togglePlay,
        playNext,
        playPrevious,
        volume,
        setVolume,
        isMuted,
        toggleMute,
        currentTime,
        duration,
        seek
    } = usePlayerStore();

    const [activeTab, setActiveTab] = useState<'player' | 'lyrics' | 'queue'>('player');

    // Handle seeking
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = Number(e.target.value);
        seek(time);
    };

    const { albums } = useMusicStore();
    const albumName = currentSong ? (albums.find(a => a._id === currentSong.albumId)?.title || 'Single') : 'Single';

    // Format time (mm:ss)
    const formatTime = (time: number) => {
        if (!time || isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    if (!isExpanded || !currentSong) return null;

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
                    className="absolute inset-0 opacity-30 blur-3xl opacity-20"
                    style={{
                        backgroundImage: `url(${currentSong.imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />

                {/* Content */}
                <div className="relative h-full flex flex-col p-6 max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8 shrink-0">
                        <button
                            onClick={toggleExpanded}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            aria-label="Close full screen"
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

                    {/* Active Tab Content */}
                    <div className="flex-1 min-h-0 flex flex-col">
                        {activeTab === 'player' && (
                            <>
                                {/* Album Art */}
                                <div className="flex-1 flex items-center justify-center mb-8 px-8 min-h-0">
                                    <motion.img
                                        src={currentSong.imageUrl}
                                        alt={currentSong.title}
                                        className="w-full max-w-md aspect-square rounded-2xl shadow-2xl object-cover"
                                        layoutId="albumArt"
                                    />
                                </div>

                                {/* Song Info */}
                                <div className="text-center mb-8 shrink-0">
                                    <h1 className="text-3xl font-bold text-white mb-2">{currentSong.title}</h1>
                                    <p className="text-xl text-text-secondary font-medium">{currentSong.artist}</p>
                                    <p className="text-sm text-text-tertiary mt-1">{albumName}</p>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-8 shrink-0">
                                    <div className="relative group h-2 w-full">
                                        <input
                                            type="range"
                                            min={0}
                                            max={duration || 100}
                                            value={currentTime}
                                            onChange={handleSeek}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                        />
                                        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-white rounded-full relative"
                                                style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-xs text-text-secondary mt-2 font-medium font-mono">
                                        <span>{formatTime(currentTime)}</span>
                                        <span>{formatTime(duration)}</span>
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="flex items-center justify-center gap-8 mb-8 shrink-0">
                                    {/* Shuffle */}
                                    <div className="scale-125">
                                        <ShuffleButton />
                                    </div>

                                    {/* Previous */}
                                    <button
                                        onClick={playPrevious}
                                        className="p-3 hover:bg-white/10 rounded-full transition-colors"
                                    >
                                        <SkipBack className="size-8 text-white fill-white" />
                                    </button>

                                    {/* Play/Pause */}
                                    <button
                                        onClick={togglePlay}
                                        className="p-6 bg-white hover:bg-white/90 rounded-full transition-transform hover:scale-105 active:scale-95 shadow-xl"
                                    >
                                        {isPlaying ? (
                                            <Pause className="size-10 text-black fill-black" />
                                        ) : (
                                            <Play className="size-10 text-black fill-black ml-1" />
                                        )}
                                    </button>

                                    {/* Next */}
                                    <button
                                        onClick={playNext}
                                        className="p-3 hover:bg-white/10 rounded-full transition-colors"
                                    >
                                        <SkipForward className="size-8 text-white fill-white" />
                                    </button>

                                    {/* Repeat */}
                                    <div className="scale-125">
                                        <RepeatButton />
                                    </div>
                                </div>

                                {/* Volume & Actions */}
                                <div className="flex items-center gap-4 justify-center max-w-sm mx-auto w-full shrink-0 mb-4">
                                    <button
                                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                        onClick={toggleMute}
                                    >
                                        {isMuted || volume === 0 ? (
                                            <VolumeX className="size-5 text-text-secondary" />
                                        ) : (
                                            <Volume2 className="size-5 text-text-secondary" />
                                        )}
                                    </button>

                                    <div className="flex-1 group relative h-10 flex items-center">
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={isMuted ? 0 : volume}
                                            onChange={(e) => setVolume(Number(e.target.value))}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div className="h-1 bg-white/20 rounded-full overflow-hidden w-full pointer-events-none">
                                            <motion.div
                                                className="h-full bg-white rounded-full"
                                                style={{ width: `${isMuted ? 0 : volume}%` }}
                                            />
                                        </div>
                                    </div>

                                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                        <Heart className="size-5 text-text-secondary hover:text-white" />
                                    </button>
                                </div>
                            </>
                        )}

                        {activeTab === 'lyrics' && (
                            <LyricsPanel song={currentSong} currentTime={currentTime} />
                        )}

                        {activeTab === 'queue' && (
                            <div className="flex-1 flex items-center justify-center text-text-secondary">
                                <div className="text-center">
                                    <List className="size-12 mx-auto mb-4 opacity-50" />
                                    <p className="text-lg font-medium">Queue Management</p>
                                    <p className="text-sm opacity-60">Coming soon in the next update!</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
