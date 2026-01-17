import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { usePlayerStore } from "@/stores/PlayerStore";
import {  Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume2  } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
        <footer className='h-30 sm:h-34 bg-slate-800 border-t border-slate-950 px bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]'>
            <div className='flex justify-between items-center h-full max-w-[1800px] mx-auto'>
                {/* currently playing song */}
                <div className='hidden sm:flex items-center gap-4 min-w-[180px] w-[30%] font-sans'>
                    {currentSong && (
                        <>
                            <img
                                src={currentSong.imageUrl}
                                alt={currentSong.title}
                                className={`w-24 h-24 object-cover rounded-full ${isPlaying ? 'animate-[spin_3s_linear_infinite]' : ''}`}
                            />
                            <div className='flex-1 min-w-0'>
                                <div className='font-mono text-xl truncate hover:underline cursor-pointer'>
                                    {currentSong.title}
                                </div>
                                <div className='text-l text-zinc-400 truncate hover:underline cursor-pointer'>
                                    {currentSong.artist}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* player controls */}
                <div className='flex flex-col items-center gap-2 flex-1 max-w-full sm:max-w-[45%]'>
                    <div className='flex items-center gap-4 sm:gap-6'>
                        <Button
                            size='icon'
                            variant='ghost'
                            className='button-3d'
                            onClick={handleShuffle}
                        >
                            <Shuffle className={`h-8 w-9 ${shuffled ? 'text-white' : 'text-zinc-400'}`} />
                        </Button>

                        <Button
                            size='icon'
                            variant='ghost'
                            className='button-3d'
                            onClick={playPrevious}
                            disabled={!currentSong}
                        >
                            <SkipBack className='h-4 w-4' />
                        </Button>

                        <Button
                            size='icon'
                           className=" button-3d hover:text-gray-900"
                            // className='bg-cyan-950 hover:bg-white/80 text-black rounded-full h-8 w-8'
                            onClick={handlePlayPause} // Use the new play/pause handler
                            disabled={!currentSong}
                        >
                            {isPlaying ? <Pause className='h-5 w-5' /> : <Play className='h-5 w-5' />}
                        </Button>

                        <Button
                            size='icon'
                            variant='ghost'
                            className='button-3d '
                            onClick={playNext}
                            disabled={!currentSong}
                        >
                            <SkipForward className='h-6 w-6' />
                        </Button>

                        <Button
            size='icon'
            variant='ghost'
            className='button-3d '
            onClick={handleRepeat} // Set the onClick to call handleRepeat when clicked
        >
            <Repeat className='h-4 w-4' />
        </Button>
                    </div>

                    <div className='hidden sm:flex items-center gap-2 w-full '>
                        <div className='text-s text-zinc-400'>{formatTime(currentTime)}</div>
                        <Slider
                            value={[currentTime]}
                            max={duration || 100}
                            step={1}
                            className='w-full hover:cursor- active:cursor-grabbing '
                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                            onValueChange={handleSeek}
                        />
                        <div className='text-s text-zinc-400'>{formatTime(duration)}</div>
                    </div>
                </div>
                {/* volume controls */}
                <div className='hidden sm:flex items-center gap-4 min-w-[180px] w-[30%] justify-end'>
                

                    <div className='flex items-center gap-2'>
                        <Button size='icon' variant='ghost' className='hover:text-white text-zinc-400'>
                            
                            <Volume2  className='h-4 w-4' 
                            />

                        </Button>

                        <Slider
                            value={[volume]}
                            max={100}
                            step={1}
                            className='w-24 hover:cursor-grab active:cursor-grabbing slider-track'
                            
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
