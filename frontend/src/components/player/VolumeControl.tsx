/**
 * VolumeControl Component
 * Volume icon with fade-in slider on hover/click
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Volume1, VolumeX } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface VolumeControlProps {
    volume: number;
    isMuted: boolean;
    onVolumeChange: (volume: number) => void;
    onToggleMute: () => void;
}

export const VolumeControl = ({
    volume,
    isMuted,
    onVolumeChange,
    onToggleMute,
}: VolumeControlProps) => {
    const [showSlider, setShowSlider] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const displayVolume = isMuted ? 0 : volume;

    const VolumeIcon = displayVolume === 0 ? VolumeX : displayVolume < 50 ? Volume1 : Volume2;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowSlider(false);
            }
        };

        if (showSlider) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showSlider]);

    return (
        <div
            ref={containerRef}
            className="relative flex items-center gap-2"
            onMouseEnter={() => setShowSlider(true)}
            onMouseLeave={() => setShowSlider(false)}
        >
            {/* Volume Icon Button */}
            <motion.button
                onClick={onToggleMute}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
                <VolumeIcon className="w-5 h-5 text-white/70" />
            </motion.button>

            {/* Volume Slider */}
            <AnimatePresence>
                {showSlider && (
                    <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 100 }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="relative flex items-center">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={displayVolume}
                                onChange={(e) => {
                                    const newVolume = parseInt(e.target.value);
                                    onVolumeChange(newVolume);
                                    if (isMuted && newVolume > 0) {
                                        onToggleMute();
                                    }
                                }}
                                className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer 
                  [&::-webkit-slider-thumb]:appearance-none 
                  [&::-webkit-slider-thumb]:w-3 
                  [&::-webkit-slider-thumb]:h-3 
                  [&::-webkit-slider-thumb]:rounded-full 
                  [&::-webkit-slider-thumb]:bg-white 
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-track]:bg-transparent"
                                style={{
                                    background: `linear-gradient(to right, rgb(139, 92, 246) 0%, rgb(139, 92, 246) ${displayVolume}%, rgba(255,255,255,0.1) ${displayVolume}%, rgba(255,255,255,0.1) 100%)`,
                                }}
                                aria-label="Volume"
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-valuenow={displayVolume}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
