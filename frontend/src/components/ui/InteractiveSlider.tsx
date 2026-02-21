import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { formatDuration } from '@/utils/formatTime';

interface SliderProps {
    value: number;
    min?: number;
    max?: number;
    onChange: (value: number) => void;
    onDragStart?: () => void;
    onDragEnd?: () => void;
    className?: string;
    showTooltip?: boolean;
    bufferedValue?: number;
}

export const InteractiveSlider = ({
    value,
    min = 0,
    max = 100,
    onChange,
    onDragStart,
    onDragEnd,
    className,
    showTooltip = true,
    bufferedValue = 0
}: SliderProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const [hoverPosition, setHoverPosition] = useState<number | null>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const position = ((e.clientX - rect.left) / rect.width) * 100;
        setHoverPosition(Math.min(Math.max(position, 0), 100));
    };

    return (
        <div
            className={cn("relative h-6 flex items-center group cursor-pointer touch-none", className)}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoverPosition(null)}
        >
            {/* Background Track */}
            <div className="absolute inset-0 flex items-center">
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden group-hover:h-2 transition-all duration-300">
                    {/* Buffered Fill */}
                    <div
                        className="absolute top-0 left-0 h-full bg-white/30 rounded-full transition-all duration-300"
                        style={{ width: `${(bufferedValue / max) * 100}%` }}
                    />

                    {/* Progress Fill */}
                    <div
                        className="relative h-full bg-brand-primary rounded-full"
                        style={{ width: `${(value / max) * 100}%` }}
                    />
                </div>
            </div>

            {/* Hover Tooltip */}
            {showTooltip && hoverPosition !== null && !isDragging && (
                <motion.div
                    className="absolute -top-8 bg-zinc-800 text-xs px-2 py-1 rounded border border-white/10 pointer-events-none"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ left: `${hoverPosition}%`, x: '-50%' }}
                >
                    {formatDuration((hoverPosition / 100) * max)}
                </motion.div>
            )}

            {/* Native Slider Input (Invisible but accessible & functional) */}
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                onMouseDown={() => {
                    setIsDragging(true);
                    onDragStart?.();
                }}
                onMouseUp={() => {
                    setIsDragging(false);
                    onDragEnd?.();
                }}
                className="absolute inset-0 w-full opacity-0 cursor-pointer"
            />

            {/* Visual Drag Knob */}
            <motion.div
                className="absolute w-4 h-4 bg-white rounded-full shadow-lg pointer-events-none ring-2 ring-white/20"
                animate={{
                    scale: isDragging || hoverPosition !== null ? 1.3 : 0,
                    opacity: isDragging || hoverPosition !== null ? 1 : 0
                }}
                transition={{ duration: 0.1 }}
                style={{
                    left: `${(value / max) * 100}%`,
                    x: '-50%'
                }}
            />
        </div>
    );
};
