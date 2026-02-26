/**
 * FullScreenPlayer - Immersive full-screen player
 * Large album art, comprehensive controls, lyrics/queue tabs
 */

import { motion, AnimatePresence } from 'framer-motion';
import {
    Play,
    Pause,
    SkipForward,
    SkipBack,
    Heart,
    ListMusic,
    Mic2,
    MonitorSpeaker,
    MoreHorizontal,
    Volume1,
    Volume2
} from 'lucide-react';
import { usePlayerStore } from '@/stores/PlayerStore';
// import { useMusicStore } from '@/stores/MusicStore';
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
        currentTime,
        duration,
        seek,
        volume,
        setVolume,
        isMuted,
        toggleMute
    } = usePlayerStore();

    const [activeTab, setActiveTab] = useState<'player' | 'lyrics' | 'queue'>('player');

    // Handle seeking
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = Number(e.target.value);
        seek(time);
    };

    // const { albums } = useMusicStore();
    // const albumName = currentSong ? (albums.find(a => a._id === currentSong.albumId)?.title || 'Single') : 'Single';

    // Format time (mm:ss)
    const formatTime = (time: number) => {
        if (!time || isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    if (!isExpanded || !currentSong) return null;

    // Gestures
    const handleDragEnd = (_: any, info: any) => {
        // Swipe Down to Close
        if (info.offset.y > 100 || info.velocity.y > 500) {
            toggleExpanded();
        }
        // Swipe Up for Queue
        if (info.offset.y < -100 || info.velocity.y < -500) {
            setActiveTab('queue');
        }
    };

    const vibrate = () => {
        if ('vibrate' in navigator) navigator.vibrate(10);
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col"
                initial={{ opacity: 0, y: '100%' }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={{ top: 0, bottom: 0.1 }}
                onDragEnd={handleDragEnd}
                style={{ height: '100dvh' }}
            >
                {/* Background Gradient & Blur */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div
                        className="absolute inset-0 opacity-40 blur-[100px] scale-150 transition-all duration-1000"
                        style={{
                            backgroundImage: `url(${currentSong.imageUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-3xl" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80" />
                </div>

                {/* Content Container */}
                <div className="relative flex flex-col h-full w-full max-w-lg mx-auto px-6 py-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6 shrink-0 z-10">
                        <motion.button
                            onClick={() => { vibrate(); toggleExpanded(); }}
                            className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
                            whileTap={{ scale: 0.9 }}
                        >
                            <div className="w-12 h-1 bg-white/50 rounded-full mx-auto mb-1" />
                        </motion.button>

                        <div className="flex gap-1 bg-black/20 backdrop-blur-md rounded-full p-1">
                            {(['player', 'lyrics', 'queue'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => { vibrate(); setActiveTab(tab); }}
                                    className={cn(
                                        "px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300",
                                        activeTab === tab
                                            ? "bg-white/20 text-white shadow-lg"
                                            : "text-white/50 hover:text-white"
                                    )}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>

                        <button className="p-2 opacity-0 pointer-events-none">
                            <MoreHorizontal className="size-6" />
                        </button>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 min-h-0 flex flex-col justify-center relative z-10">
                        <AnimatePresence mode="wait">
                            {activeTab === 'player' && (
                                <motion.div
                                    key="player"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="flex flex-col h-full"
                                >
                                    {/* Album Art (Large) */}
                                    <div className="flex-1 flex items-center justify-center py-4">
                                        <motion.div
                                            className="relative aspect-square w-full max-w-[340px] rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/10"
                                            style={{ rotate: isPlaying ? 0 : 0 }} // Could add subtle rotation here
                                        >
                                            <img
                                                src={currentSong.imageUrl}
                                                alt={currentSong.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </motion.div>
                                    </div>

                                    {/* Track Info */}
                                    <div className="flex items-end justify-between mb-8 px-1">
                                        <div className="flex-1 min-w-0 pr-4">
                                            <motion.h2 className="text-2xl font-bold text-white leading-tight truncate">
                                                {currentSong.title}
                                            </motion.h2>
                                            <motion.p className="text-lg text-white/60 truncate mt-1">
                                                {currentSong.artist}
                                            </motion.p>
                                        </div>
                                        <motion.button
                                            whileTap={{ scale: 0.8 }}
                                            onClick={vibrate}
                                            className="p-3 bg-white/5 rounded-full text-white/50 hover:text-red-500 hover:bg-white/10 transition-colors"
                                        >
                                            <Heart className="size-6" />
                                        </motion.button>
                                    </div>

                                    {/* Progress */}
                                    <div className="mb-8 px-1">
                                        <div className="relative group h-1 w-full flex items-center">
                                            <input
                                                type="range"
                                                min={0}
                                                max={duration || 100}
                                                value={currentTime}
                                                onChange={handleSeek}
                                                className="absolute inset-0 w-full h-4 -top-1.5 opacity-0 cursor-pointer z-20"
                                            />
                                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-white rounded-full"
                                                    style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                                                />
                                            </div>
                                            <div
                                                className="absolute h-4 w-4 bg-white rounded-full shadow-lg left-0 top-1/2 -translate-y-1/2 pointer-events-none transition-transform"
                                                style={{ left: `${(currentTime / (duration || 1)) * 100}%`, transform: 'translate(-50%, -50%)' }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-xs text-white/40 mt-3 font-medium font-mono">
                                            <span>{formatTime(currentTime)}</span>
                                            <span>{formatTime(duration)}</span>
                                        </div>
                                    </div>

                                    {/* Controls */}
                                    <div className="flex items-center justify-between px-2 pb-6">
                                        <ShuffleButton />

                                        <motion.button
                                            onClick={() => { vibrate(); playPrevious(); }}
                                            whileTap={{ scale: 0.9 }}
                                            className="p-4 text-white hover:text-white/80 transition-colors"
                                        >
                                            <SkipBack className="size-9 fill-current" />
                                        </motion.button>

                                        <motion.button
                                            onClick={() => { vibrate(); togglePlay(); }}
                                            whileTap={{ scale: 0.9 }}
                                            className="relative size-20 rounded-full bg-white flex items-center justify-center shadow-[0_8px_32px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform"
                                        >
                                            {isPlaying ? (
                                                <Pause className="size-8 text-black fill-black" />
                                            ) : (
                                                <Play className="size-8 text-black fill-black ml-1" />
                                            )}
                                        </motion.button>

                                        <motion.button
                                            onClick={() => { vibrate(); playNext(true); }}
                                            whileTap={{ scale: 0.9 }}
                                            className="p-4 text-white hover:text-white/80 transition-colors"
                                        >
                                            <SkipForward className="size-9 fill-current" />
                                        </motion.button>

                                        <RepeatButton />
                                    </div>

                                    {/* Mobile Volume Slider */}
                                    <div className="flex items-center gap-3 px-4 pb-6 w-full max-w-[400px] mx-auto opacity-70 hover:opacity-100 transition-opacity">
                                        <button onClick={() => setVolume(0)}><Volume1 className="size-4 text-white" /></button>
                                        <div className="relative flex-1 h-3 flex items-center group">
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={isMuted ? 0 : volume}
                                                onChange={(e) => {
                                                    const vol = Number(e.target.value);
                                                    setVolume(vol);
                                                    if (isMuted && vol > 0) toggleMute();
                                                }}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-white rounded-full group-hover:bg-brand-primary transition-colors"
                                                    style={{ width: `${isMuted ? 0 : volume}%` }}
                                                />
                                            </div>
                                            <div
                                                className="absolute h-3 w-3 bg-white rounded-full shadow-md pointer-events-none transition-transform opacity-0 group-hover:opacity-100"
                                                style={{ left: `calc(${isMuted ? 0 : volume}% - 6px)` }}
                                            />
                                        </div>
                                        <button onClick={() => setVolume(100)}><Volume2 className="size-4 text-white" /></button>
                                    </div>

                                    {/* Bottom Actions */}
                                    <div className="flex items-center justify-between px-4 pb-4">
                                        <button className="p-2 text-white/40 hover:text-white transition-colors">
                                            <MonitorSpeaker className="size-5" />
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('lyrics')}
                                            className="p-2 text-white/40 hover:text-white transition-colors"
                                        >
                                            <Mic2 className="size-5" />
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('queue')}
                                            className="p-2 text-white/40 hover:text-white transition-colors"
                                        >
                                            <ListMusic className="size-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'lyrics' && (
                                <motion.div
                                    key="lyrics"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="flex-1 h-full overflow-hidden"
                                >
                                    <LyricsPanel song={currentSong} currentTime={currentTime} />
                                </motion.div>
                            )}

                            {activeTab === 'queue' && (
                                <motion.div
                                    key="queue"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="flex-1 h-full flex flex-col items-center justify-center text-white/50"
                                >
                                    <ListMusic className="size-16 mb-4 opacity-30" />
                                    <p className="text-lg font-medium">Coming Soon</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
