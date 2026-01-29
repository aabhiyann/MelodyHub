import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayerStore } from "@/stores/PlayerStore";
import { Play, Pause, SkipBack, SkipForward, ChevronDown, Repeat, Shuffle, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { LikeButton } from "@/components/ui/LikeButton";
import { InteractiveSlider } from "@/components/ui/InteractiveSlider";

const MobilePlayer = () => {
    const {
        currentSong,
        isPlaying,
        togglePlay,
        playNext,
        playPrevious,
        currentTime,
        duration,
        seek,
        toggleRepeat,
        isRepeating,
        shuffleQueue,
        shuffled
    } = usePlayerStore();

    const [isExpanded, setIsExpanded] = useState(false);

    // Gestures for Mini Player
    const miniPlayerHandlers = useSwipeable({
        onSwipedUp: () => setIsExpanded(true),
        onSwipedLeft: () => playNext(),
        onSwipedRight: () => playPrevious(),
        trackMouse: true
    });

    // Gestures for Full Player
    const fullPlayerHandlers = useSwipeable({
        onSwipedDown: () => setIsExpanded(false),
        trackMouse: true
    });

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    if (!currentSong) return null;

    return (
        <>
            {/* Full Screen Player */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-[200] bg-zinc-900 flex flex-col safe-area-inset-top"
                        {...fullPlayerHandlers}
                    >
                        {/* Background Blur */}
                        <div
                            className="absolute inset-0 opacity-40 blur-3xl"
                            style={{ background: `linear-gradient(to bottom, ${currentSong.imageUrl ? 'var(--brand-primary)' : '#555'}, #000)` }}
                        />
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" />

                        {/* Content */}
                        <div className="relative z-10 flex flex-col h-full px-6 pt-4 pb-8">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-8">
                                <button onClick={() => setIsExpanded(false)} className="p-2 text-white/50 hover:text-white">
                                    <ChevronDown className="size-8" />
                                </button>
                                <span className="text-sm font-medium tracking-widest uppercase text-white/70">Now Playing</span>
                                <button className="p-2 text-white/50 hover:text-white">
                                    <List className="size-6" />
                                </button>
                            </div>

                            {/* Album Art */}
                            <div className="flex-1 flex items-center justify-center mb-8">
                                <motion.img
                                    src={currentSong.imageUrl}
                                    alt={currentSong.title}
                                    className="w-full aspect-square object-cover rounded-2xl shadow-2xl border border-white/10 max-h-[40vh]"
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                />
                            </div>

                            {/* Song Info */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1 leading-tight line-clamp-1">{currentSong.title}</h2>
                                    <p className="text-lg text-white/60 line-clamp-1">{currentSong.artist}</p>
                                </div>
                                <LikeButton size={28} className="text-white hover:bg-white/10" />
                            </div>

                            {/* Progress */}
                            <div className="mb-6 space-y-2">
                                <InteractiveSlider
                                    value={currentTime}
                                    max={duration || 100}
                                    onChange={seek}
                                    className="w-full h-8"
                                    showTooltip={true}
                                />
                                <div className="flex justify-between text-xs font-mono text-white/50">
                                    <span>{formatTime(currentTime)}</span>
                                    <span>{formatTime(duration)}</span>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center justify-between mb-8">
                                <button onClick={toggleRepeat} className={cn("p-2 transition-colors", isRepeating ? "text-brand-primary" : "text-white/40")}>
                                    <Repeat className="size-6" />
                                </button>

                                <button onClick={playPrevious} className="p-2 text-white hover:text-brand-primary transition-colors active:scale-90">
                                    <SkipBack className="size-8" />
                                </button>

                                <button
                                    onClick={togglePlay}
                                    className="p-4 bg-white text-black rounded-full shadow-lg active:scale-95 transition-transform"
                                >
                                    {isPlaying ? <Pause className="size-8 fill-current" /> : <Play className="size-8 fill-current ml-1" />}
                                </button>

                                <button onClick={playNext} className="p-2 text-white hover:text-brand-primary transition-colors active:scale-90">
                                    <SkipForward className="size-8" />
                                </button>

                                <button onClick={shuffleQueue} className={cn("p-2 transition-colors", shuffled ? "text-brand-primary" : "text-white/40")}>
                                    <Shuffle className="size-6" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mini Player */}
            {!isExpanded && (
                <div
                    {...miniPlayerHandlers}
                    onClick={() => setIsExpanded(true)}
                    className="fixed bottom-[74px] left-2 right-2 h-[64px] bg-[rgba(20,20,20,0.95)] backdrop-blur-md border border-white/10 rounded-xl shadow-lg z-[95] flex items-center px-2 pr-4 overflow-hidden"
                >
                    {/* Progress Bar (Top Border) */}
                    <div
                        className="absolute top-0 left-0 h-[2px] bg-brand-primary z-10"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                    />

                    <img
                        src={currentSong.imageUrl}
                        alt="cover"
                        className="size-12 rounded-lg object-cover shrink-0 mr-3 animate-spin-slow"
                        style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
                    />

                    <div className="flex-1 min-w-0 mr-4">
                        <h4 className="text-sm font-semibold text-white truncate">{currentSong.title}</h4>
                        <p className="text-xs text-white/60 truncate">{currentSong.artist}</p>
                    </div>

                    <button
                        onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                        className="p-2 rounded-full text-white hover:bg-white/10 active:scale-90 transition-all"
                    >
                        {isPlaying ? <Pause className="size-6 fill-white" /> : <Play className="size-6 fill-white ml-0.5" />}
                    </button>

                    {/* Next Button only used if enough space, mostly gesture based */}
                    {/* <button 
                        onClick={(e) => { e.stopPropagation(); playNext(); }}
                        className="p-2 rounded-full text-white/70 hover:text-white"
                    >
                        <SkipForward className="size-6" />
                    </button> */}
                </div>
            )}
        </>
    );
};

export default MobilePlayer;
