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
    Volume1,
    Volume2
} from 'lucide-react';
import { usePlayerStore } from '@/stores/PlayerStore';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useDominantColor } from '@/hooks/useDominantColor';
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
        bufferedTime,
        isBuffering,
        seek,
        volume,
        setVolume,
        isMuted,
        toggleMute
    } = usePlayerStore();

    const [activeTab, setActiveTab] = useState<'player' | 'lyrics' | 'queue'>('player');

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = Number(e.target.value);
        seek(time);
        window.dispatchEvent(new CustomEvent('player-seek', { detail: time }));
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

    const handleDragEnd = (_: unknown, info: { offset: { y: number }; velocity: { y: number } }) => {
        if (info.offset.y > 80 || info.velocity.y > 400) toggleExpanded();
    };

    const vibrate = () => {
        if ('vibrate' in navigator) navigator.vibrate(10);
    };

    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
    const bufferedPercent = duration > 0 ? (bufferedTime / duration) * 100 : 0;
    const dominantColor = useDominantColor(currentSong?.imageUrl);

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[1100] flex flex-col bg-zinc-950"
                initial={{ opacity: 0, y: '100%' }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: '100%' }}
                transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={{ top: 0, bottom: 0.15 }}
                onDragEnd={handleDragEnd}
                style={{ height: '100dvh' }}
            >
                {/* Background: blurred album art + gradient from extracted dominant color */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div
                        className="absolute inset-0 opacity-50 blur-[120px] scale-150 transition-all duration-700"
                        style={{
                            backgroundImage: `url(${currentSong.imageUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    {dominantColor && (
                        <div
                            className="absolute inset-0 transition-opacity duration-500"
                            style={{
                                background: `linear-gradient(180deg, ${dominantColor}33 0%, transparent 45%, transparent 65%, rgba(0,0,0,0.9) 100%)`,
                            }}
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
                </div>

                {/* Content Container */}
                <div
                    className="relative flex flex-col h-full w-full max-w-full md:max-w-2xl mx-auto px-4 md:px-8 pt-4 md:pt-8 min-w-0"
                    style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px) + 16px, 24px)' }}
                >
                    {/* Close handle - swipe down or tap to close; 44px min touch target */}
                    <div className="flex justify-center shrink-0 z-10 mb-2 min-h-11">
                        <motion.button
                            onClick={() => { vibrate(); toggleExpanded(); }}
                            className="w-12 h-1.5 rounded-full bg-white/40 hover:bg-white/60 transition-colors min-w-11 min-h-11 flex items-center justify-center"
                            whileTap={{ scale: 0.95 }}
                            aria-label="Close player"
                        />
                    </div>

                    {/* Tabs: Player | Lyrics | Queue - 44px min touch target */}
                    <div className="flex justify-center gap-1 shrink-0 z-10 mb-4">
                        {(['player', 'lyrics', 'queue'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => { vibrate(); setActiveTab(tab); }}
                                className={cn(
                                    'min-w-11 min-h-11 px-4 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center justify-center',
                                    activeTab === tab ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'
                                )}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
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
                                    className="flex flex-col md:flex-row md:items-center md:gap-16 h-full"
                                >
                                    {/* Large album art with shadow/glow */}
                                    <div className="flex-1 flex items-center justify-center py-6 md:py-8 w-full">
                                        <motion.div
                                            className="relative aspect-square w-full max-w-[280px] md:max-w-[360px] rounded-3xl md:rounded-[40px] overflow-hidden"
                                            style={{
                                                boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08), 0 0 80px -20px rgba(0,0,0,0.6)',
                                            }}
                                        >
                                            <img
                                                src={currentSong.imageUrl}
                                                alt=""
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                                onError={(e) => { e.currentTarget.src = '/placeholder-album.svg'; }}
                                            />
                                        </motion.div>
                                    </div>

                                    {/* Controls & Info Column (Desktop) */}
                                    <div className="flex-1 flex flex-col justify-center w-full max-w-lg mx-auto md:mx-0">

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
                                                className="min-w-11 min-h-11 p-3 bg-white/5 rounded-full text-white/50 hover:text-red-500 hover:bg-white/10 transition-colors flex items-center justify-center shrink-0"
                                            >
                                                <Heart className="size-6" />
                                            </motion.button>
                                        </div>

                                        {/* Full progress bar with current time and total time */}
                                        <div className="mb-6 px-0">
                                            <div className="relative group h-2 w-full flex items-center">
                                                <input
                                                    type="range"
                                                    min={0}
                                                    max={duration || 100}
                                                    value={currentTime}
                                                    onChange={handleSeek}
                                                    className="absolute inset-0 w-full h-10 -top-4 opacity-0 cursor-pointer z-20"
                                                />
                                                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden relative">
                                                    {/* Buffered region */}
                                                    <div
                                                        className="absolute inset-0 h-full bg-white/30 rounded-full transition-all duration-200"
                                                        style={{ width: `${bufferedPercent}%` }}
                                                    />
                                                    <motion.div
                                                        className="relative h-full bg-[#22C55E] rounded-full"
                                                        style={{ width: `${progressPercent}%` }}
                                                        transition={{ type: 'tween', duration: 0.1 }}
                                                    />
                                                    {isBuffering && (
                                                        <div
                                                            className="absolute inset-0 h-full rounded-full bg-gradient-to-r from-transparent via-white/25 to-transparent animate-pulse pointer-events-none"
                                                            style={{ left: `${progressPercent}%`, width: '30%' }}
                                                            aria-hidden
                                                        />
                                                    )}
                                                </div>
                                                <div
                                                    className="absolute h-4 w-4 bg-white rounded-full shadow-md top-1/2 pointer-events-none -translate-y-1/2 -translate-x-1/2"
                                                    style={{ left: `${progressPercent}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between text-xs text-white/60 mt-2 font-mono">
                                                <span>{formatTime(currentTime)}</span>
                                                <span>{formatTime(duration)}</span>
                                            </div>
                                        </div>

                                        {/* Controls */}
                                        <div className="flex items-center justify-between px-2 pb-4">
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
                                            <button className="min-w-11 min-h-11 flex items-center justify-center" onClick={() => setVolume(0)} aria-label="Mute"><Volume1 className="size-4 text-white" /></button>
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
                                            <button className="min-w-11 min-h-11 flex items-center justify-center" onClick={() => setVolume(100)} aria-label="Max volume"><Volume2 className="size-4 text-white" /></button>
                                        </div>

                                        {/* Bottom Actions */}
                                        <div className="flex items-center justify-between px-4 pb-4">
                                            <button className="min-w-11 min-h-11 p-2 text-white/40 hover:text-white transition-colors flex items-center justify-center" aria-label="Devices">
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
