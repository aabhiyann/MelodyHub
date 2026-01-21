/**
 * SleepTimer - Sleep timer functionality
 * Pauses playback after specified duration
 */

import { useState, useEffect } from 'react';
import { Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassmorphicButton } from '@/components/ui/GlassmorphicButton';
import { LiquidGlassCard } from '@/components/ui/LiquidGlassCard';
import { usePlayerStore } from '@/stores/PlayerStore';

const TIMER_OPTIONS = [
    { label: '15 minutes', minutes: 15 },
    { label: '30 minutes', minutes: 30 },
    { label: '45 minutes', minutes: 45 },
    { label: '1 hour', minutes: 60 },
    { label: 'End of current song', minutes: -1 },
];

export const SleepTimer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTimer, setActiveTimer] = useState<number | null>(null);
    const [remainingTime, setRemainingTime] = useState<number>(0);
    const { pause } = usePlayerStore();

    useEffect(() => {
        if (!activeTimer || activeTimer === -1) return;

        const endTime = Date.now() + activeTimer * 60 * 1000;

        const interval = setInterval(() => {
            const remaining = Math.max(0, endTime - Date.now());
            setRemainingTime(Math.ceil(remaining / 1000));

            if (remaining <= 0) {
                pause();
                setActiveTimer(null);
                setIsOpen(false);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [activeTimer, pause]);

    const handleSetTimer = (minutes: number) => {
        setActiveTimer(minutes);
        setIsOpen(false);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <>
            {/* Timer Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors relative"
            >
                <Clock className="size-5 text-text-secondary hover:text-white" />
                {activeTimer && activeTimer !== -1 && (
                    <span className="absolute -top-1 -right-1 size-3 bg-brand-primary rounded-full" />
                )}
            </button>

            {/* Timer Popup */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute bottom-full right-0 mb-2 w-64"
                    >
                        <LiquidGlassCard className="p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-white">Sleep Timer</h3>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-white/10 rounded"
                                >
                                    <X className="size-4 text-text-secondary" />
                                </button>
                            </div>

                            {activeTimer ? (
                                <div className="text-center py-4">
                                    <p className="text-sm text-text-secondary mb-2">Music will stop in</p>
                                    <p className="text-3xl font-bold text-brand-primary mb-4">
                                        {formatTime(remainingTime)}
                                    </p>
                                    <GlassmorphicButton
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setActiveTimer(null)}
                                        fullWidth
                                    >
                                        Cancel Timer
                                    </GlassmorphicButton>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {TIMER_OPTIONS.map((option) => (
                                        <button
                                            key={option.label}
                                            onClick={() => handleSetTimer(option.minutes)}
                                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-white transition-colors"
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </LiquidGlassCard>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
