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
        e.preventDefault();
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
    };

    const handleMouseLeave = () => {
        if (!isDragging) {
            setHoverTime(null);
        }
    };

    // Global mouse/touch event handlers for dragging
    useEffect(() => {
        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                handleSeek(e.clientX);
            }
        };

        const handleGlobalMouseUp = () => {
            if (isDragging) {
                setIsDragging(false);
                setHoverTime(null);
            }
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleGlobalMouseMove);
            window.addEventListener('mouseup', handleGlobalMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleGlobalMouseMove);
                window.removeEventListener('mouseup', handleGlobalMouseUp);
            };
        }
    }, [isDragging]);

    return (
        <div className="w-full flex items-center gap-3 group">
            {/* Current Time */}
            <span className="text-xs text-zinc-400 font-mono w-10 text-right">
                {formatTime(currentTime)}
            </span>

            {/* Progress Bar Container */}
            <div
                ref={progressRef}
                className="relative flex-1 h-1 bg-white/10 rounded-full cursor-pointer touch-none py-2"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onTouchStart={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                    const touch = e.touches[0];
                    handleSeek(touch.clientX);
                }}
                onTouchMove={(e) => {
                    if (isDragging) {
                        const touch = e.touches[0];
                        handleSeek(touch.clientX);
                    }
                }}
                onTouchEnd={() => {
                    setIsDragging(false);
                    setHoverTime(null);
                }}
                role="slider"
                aria-label="Seek"
                aria-valuemin={0}
                aria-valuemax={duration}
                aria-valuenow={currentTime}
                tabIndex={0}
            >
                {/* Background Track */}
                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-1 bg-white/10 rounded-full overflow-hidden group-hover:h-1.5 transition-all duration-200">
                    {/* Buffered Progress */}
                    <motion.div
                        className="absolute top-0 left-0 h-full bg-white/20 rounded-full"
                        style={{ width: `${buffered}%` }}
                        transition={{ duration: 0.1 }}
                    />

                    {/* Current Progress */}
                    <motion.div
                        className="absolute top-0 left-0 h-full bg-white group-hover:bg-brand-primary rounded-full transition-colors"
                        style={{ width: `${progress}%` }}
                        transition={{ duration: 0.1 }}
                    />
                </div>

                {/* Thumb */}
                <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                    style={{ left: `${progress}%`, transform: `translate(-50%, -50%) scale(${isDragging ? 1.2 : 1})` }}
                />

                {/* Hover Preview Tooltip */}
                {hoverTime !== null && (
                    <div
                        className="absolute bottom-full mb-2 px-2 py-1 bg-zinc-900 border border-white/10 text-white text-xs rounded shadow-xl pointer-events-none whitespace-nowrap z-50"
                        style={{
                            left: hoverX,
                            transform: 'translateX(-50%)',
                        }}
                    >
                        {formatTime(hoverTime)}
                    </div>
                )}
            </div>

            {/* Duration */}
            <span className="text-xs text-zinc-400 font-mono w-10 text-left">
                {formatTime(duration)}
            </span>
        </div>
    );
};
