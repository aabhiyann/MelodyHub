import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { usePlayerStore } from "@/stores/PlayerStore";
import { Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const PlaybackControls = () => {
    const { currentSong, isPlaying, togglePlay, playNext, playPrevious, shuffleQueue, shuffled } = usePlayerStore();

    const [volume, setVolume] = useState(75);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Enable keyboard shortcuts for media control
    useKeyboardShortcuts(audioRef);

    useEffect(() => {
        audioRef.current = document.querySelector("audio");

        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);

        audio.addEventListener("timeupdate", updateTime);
        audio.addEventListener("loadedmetadata", updateDuration);

        const handleEnded = () => {
            usePlayerStore.setState({ isPlaying: false });
        };

        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("timeupdate", updateTime);
            audio.removeEventListener("loadedmetadata", updateDuration);
            audio.removeEventListener("ended", handleEnded);
        };
    }, [currentSong]);

    const handleSeek = (value: number[]) => {
        if (audioRef.current) {
            audioRef.current.currentTime = value[0];
        }
    };

    const handlePlayPause = () => {
        togglePlay();
    };

    const handleShuffle = () => {
        shuffleQueue(); // Shuffles the queue in the store
    };

    const toggleRepeat = usePlayerStore(state => state.toggleRepeat);
    const handleRepeat = () => {
        toggleRepeat(); // Toggle the repeat state in the player store
    };

    return (
        <footer
            className='h-20 sm:h-24 glass-toolbar border-t border-white/5 px-4 fixed bottom-0 left-0 right-0 z-50 bg-[#09090b]/80 backdrop-blur-xl'
            role="contentinfo"
            aria-label="Media player controls"
        >
            <div className='flex justify-between items-center h-full max-w-[1800px] mx-auto py-2 sm:py-0'>
                {/* 1. Left Section: Now Playing */}
                <div className='flex items-center gap-4 w-[30%] min-w-[180px]'>
                    {currentSong && (
                        <>
                            <div className="relative group flex-shrink-0">
                                <img
                                    src={currentSong.imageUrl}
                                    alt={currentSong.title}
                                    className={`size-14 object-cover rounded-md shadow-lg border border-white/5 ${isPlaying ? 'animate-spin-slow' : ''}`}
                                />
                                <div className="absolute inset-0 bg-black/10 rounded-md group-hover:bg-black/0 transition-colors" />
                            </div>
                            <div className='flex-1 min-w-0 flex flex-col justify-center'>
                                <div className='font-semibold text-white text-base truncate cursor-pointer hover:underline tracking-tight'>
                                    {currentSong.title}
                                </div>
                                <div className='text-xs text-text-secondary truncate hover:text-white cursor-pointer transition-colors font-medium'>
                                    {currentSong.artist}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    size='icon'
                                    variant='ghost'
                                    className={`text-text-secondary hover:text-white hidden lg:flex ${usePlayerStore(state => state.isLyricsOpen) ? 'text-brand-primary' : ''}`}
                                    onClick={usePlayerStore(state => state.toggleLyrics)}
                                >
                                    {/* Lyrics Icon using Mic2 or similar if available, creating a simple SVG here for now or assuming Mic2 import later (keeping existing imports for now, using MessageSquare as placeholder for lyrics or just a custom icon) */}
                                    {/* Using generic Heart for now as requested in requirements, will add Lyrics icon if imported */}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mic-2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></svg>
                                </Button>
                            </div>
                        </>
                    )}
                </div>

                {/* 2. Center Section: Controls */}
                <div className='flex flex-col items-center gap-2 flex-1 max-w-[40%]'>
                    <div className='flex items-center gap-6'>
                        <Button
                            size='icon'
                            variant='ghost'
                            className='text-text-secondary hover:text-white hover:bg-transparent transition-colors'
                            onClick={handleShuffle}
                        >
                            <Shuffle className={`h-4 w-4 ${shuffled ? 'text-brand-primary' : ''}`} />
                        </Button>

                        <Button
                            size='icon'
                            variant='ghost'
                            className='text-white hover:text-white/80 hover:bg-transparent transition-colors'
                            onClick={playPrevious}
                            disabled={!currentSong}
                        >
                            <SkipBack className='h-5 w-5 fill-current' />
                        </Button>

                        <Button
                            size='icon'
                            className="h-12 w-12 rounded-full bg-white text-black hover:scale-105 transition-transform shadow-lg hover:bg-white/90 flex items-center justify-center p-0"
                            onClick={handlePlayPause}
                            disabled={!currentSong}
                        >
                            {isPlaying ? <Pause className='h-6 w-6 fill-current' /> : <Play className='h-6 w-6 fill-current ml-0.5' />}
                        </Button>

                        <Button
                            size='icon'
                            variant='ghost'
                            className='text-white hover:text-white/80 hover:bg-transparent transition-colors'
                            onClick={playNext}
                            disabled={!currentSong}
                        >
                            <SkipForward className='h-5 w-5 fill-current' />
                        </Button>

                        <Button
                            size='icon'
                            variant='ghost'
                            className={`hover:bg-transparent transition-colors ${usePlayerStore(state => state.isRepeating) ? 'text-brand-primary' : 'text-text-secondary hover:text-white'}`}
                            onClick={handleRepeat}
                        >
                            <Repeat className='h-4 w-4' />
                        </Button>
                    </div>

                    {/* Progress Bar */}
                    <div className='hidden sm:flex items-center gap-2 w-full max-w-lg'>
                        <div className='text-xs text-text-tertiary tabular-nums w-10 text-right font-medium'>{formatTime(currentTime)}</div>
                        <div className="flex-1 h-3 group flex items-center cursor-pointer">
                            <Slider
                                value={[currentTime]}
                                max={duration || 100}
                                step={0.1}
                                className='w-full'
                                onValueChange={handleSeek}
                            />
                        </div>
                        <div className='text-xs text-text-tertiary tabular-nums w-10 font-medium'>{formatTime(duration)}</div>
                    </div>
                </div>

                {/* 3. Right Section: Volume & Extras */}
                <div className='hidden sm:flex items-center gap-3 w-[30%] min-w-[180px] justify-end'>
                    {/* Glass panel container for volume could be added here if desired, keeping simple for now to match Spotify */}
                    <div className='flex items-center gap-2'>
                        <Volume2 className='h-4 w-4 text-text-secondary' />
                        <Slider
                            value={[volume]}
                            max={100}
                            step={1}
                            className='w-24 cursor-pointer'
                            onValueChange={(value) => {
                                setVolume(value[0]);
                                if (audioRef.current) {
                                    audioRef.current.volume = value[0] / 100;
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default PlaybackControls;
