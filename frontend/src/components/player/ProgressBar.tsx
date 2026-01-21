/**
 * ProgressBar Component
 * Custom progress bar with scrubbing, hover preview, and time labels
 */

import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

interface ProgressBarProps {
    currentTime: number;
    duration: number;
    bufferedTime: number;
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
    onSeek,
}: ProgressBarProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const [hoverTime, setHoverTime] = useState<number | null>(null);
    const [hoverX, setHoverX] = useState(0);
    const progressRef = useRef<HTMLDivElement>(null);

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
    const buffered = duration > 0 ? (bufferedTime / duration) * 100 : 0;

    const handleSeek = (clientX: number) => {
        if (!progressRef.current) return;

        const rect = progressRef.current.getBoundingClientRect();
        const percent = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
        const time = (percent / 100) * duration;

        onSeek(time);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        handleSeek(e.clientX);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!progressRef.current) return;

        const rect = progressRef.current.getBoundingClientRect();
        const percent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        const time = (percent / 100) * duration;

        setHoverTime(time);
        setHoverX(e.clientX - rect.left);

        if (isDragging) {
            handleSeek(e.clientX);
        }
    };

    const handleMouseLeave = () => {
        setHoverTime(null);
    };

    useEffect(() => {
        const handleMouseUp = () => setIsDragging(false);

        if (isDragging) {
            window.addEventListener('mouseup', handleMouseUp);
            return () => window.removeEventListener('mouseup', handleMouseUp);
        }
    }, [isDragging]);

    return (
        <div className="w-full">
            {/* Progress Bar */}
            <div
                ref={progressRef}
                className="relative h-1 bg-white/10 rounded-full cursor-pointer group"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                role="slider"
                aria-label="Seek"
                aria-valuemin={0}
                aria-valuemax={duration}
                aria-valuenow={currentTime}
                tabIndex={0}
            >
                {/* Buffered Progress */}
                <motion.div
                    className="absolute top-0 left-0 h-full bg-white/20 rounded-full"
                    style={{ width: `${buffered}%` }}
                    transition={{ duration: 0.1 }}
                />

                {/* Current Progress */}
                <motion.div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-primary to-purple-400 rounded-full"
                    style={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                />

                {/* Thumb */}
                <motion.div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ left: `${progress}%`, x: '-50%' }}
                    animate={isDragging ? { scale: 1.3 } : { scale: 1 }}
                />

                {/* Hover Preview Tooltip */}
                {hoverTime !== null && (
                    <div
                        className="absolute bottom-full mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded pointer-events-none"
                        style={{
                            left: hoverX,
                            transform: 'translateX(-50%)',
                        }}
                    >
                        {formatTime(hoverTime)}
                    </div>
                )}
            </div>

            {/* Time Labels */}
            <div className="flex justify-between mt-1 text-xs text-white/50 font-mono">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
            </div>
        </div>
    );
};
