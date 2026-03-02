import { InteractiveSlider } from '@/components/ui/InteractiveSlider';

interface ProgressBarProps {
    currentTime: number;
    duration: number;
    bufferedTime: number;
    isBuffering?: boolean;
    onSeek: (time: number) => void;
}

const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00';

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const ProgressBar = ({
    currentTime,
    duration,
    bufferedTime,
    isBuffering = false,
    onSeek,
}: ProgressBarProps) => {

    return (
        <div className="w-full flex items-center gap-3 group">
            {/* Current Time */}
            <span className="text-xs text-zinc-400 font-mono w-10 text-right">
                {formatTime(currentTime)}
            </span>

            {/* Interactive Slider */}
            <div className="flex-1">
                <InteractiveSlider
                    value={currentTime}
                    max={duration || 100}
                    bufferedValue={bufferedTime}
                    isBuffering={isBuffering}
                    onChange={onSeek}
                    className="h-8"
                />
            </div>

            {/* Duration */}
            <span className="text-xs text-zinc-400 font-mono w-10 text-left">
                {formatTime(duration)}
            </span>
        </div>
    );
};
