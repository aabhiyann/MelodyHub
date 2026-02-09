
import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/stores/PlayerStore";
import { Pause, Play, Repeat, Shuffle, SkipBack, SkipForward } from "lucide-react";
import { memo } from "react";

export const PlaybackControls = memo(() => {
    const { currentSong, isPlaying, togglePlay, playNext, playPrevious, shuffleQueue, shuffled, isRepeating, toggleRepeat } = usePlayerStore();

    const handlePlayPause = (e: React.MouseEvent) => {
        e.stopPropagation();
        togglePlay();
    };

    return (
        <div className='flex items-center gap-6'>
            <Button
                size='icon'
                variant='ghost'
                className='text-text-secondary hover:text-white hover:bg-transparent transition-colors'
                onClick={shuffleQueue}
                title="Shuffle"
            >
                <Shuffle className={`h-4 w-4 ${shuffled ? 'text-brand-primary' : ''}`} />
            </Button>

            <Button
                size='icon'
                variant='ghost'
                className='text-white hover:text-white/80 hover:bg-transparent transition-colors'
                onClick={playPrevious}
                disabled={!currentSong}
                title="Previous"
            >
                <SkipBack className='h-5 w-5 fill-current' />
            </Button>

            <div className="relative flex items-center justify-center p-2">
                {/* Play/Pause Button */}
                <Button
                    size='icon'
                    className="h-12 w-12 rounded-full bg-white text-black hover:scale-105 active:scale-95 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center justify-center p-0 z-10"
                    onClick={handlePlayPause}
                    disabled={!currentSong}
                    title={isPlaying ? "Pause" : "Play"}
                >
                    {isPlaying ? (
                        <Pause className='h-6 w-6 fill-current' />
                    ) : (
                        <Play className='h-6 w-6 fill-current ml-0.5' />
                    )}
                </Button>
            </div>

            <Button
                size='icon'
                variant='ghost'
                className='text-white hover:text-white/80 hover:bg-transparent transition-colors'
                onClick={() => playNext(true)}
                disabled={!currentSong}
                title="Next"
            >
                <SkipForward className='h-5 w-5 fill-current' />
            </Button>

            <Button
                size='icon'
                variant='ghost'
                className={`hover:bg-transparent transition-colors ${isRepeating ? 'text-brand-primary' : 'text-text-secondary hover:text-white'}`}
                onClick={toggleRepeat}
                title="Repeat"
            >
                <Repeat className='h-4 w-4' />
            </Button>
        </div>
    );
});

export default PlaybackControls;
