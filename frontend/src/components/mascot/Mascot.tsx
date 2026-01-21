/**
 * Mascot - Melody the Turtle mascot component
 * Delightful, contextual mascot with personality
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useMascot } from '@/hooks/useMascot';
import { SpeechBubble } from './SpeechBubble';
import { Confetti } from './animations/Confetti';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { getHolidayTheme } from '@/utils/holidays';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export const Mascot = () => {
    const mascot = useMascot();
    const prefersReducedMotion = useReducedMotion();
    const [showConfetti, setShowConfetti] = useState(false);
    const [holidayTheme, setHolidayTheme] = useState(getHolidayTheme());

    // Show confetti for excited/celebrating states
    useEffect(() => {
        if (mascot.state === 'excited' || mascot.state === 'celebrating') {
            setShowConfetti(true);
            const timer = setTimeout(() => setShowConfetti(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [mascot.state]);

    if (!mascot.isVisible) return null;

    const handleClick = () => {
        mascot.incrementClicks();

        // Easter egg: 5 clicks triggers secret animation
        if (mascot.clickCount >= 4) {
            mascot.setState('excited');
            mascot.showMessage("You found a secret! 🎉");
            mascot.unlockAnimation('secret-backflip');
            mascot.resetClicks();
        }
    };

    const getPositionClasses = () => {
        switch (mascot.position) {
            case 'bottom-right':
                return 'bottom-4 right-4 md:bottom-8 md:right-8';
            case 'center':
                return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
            case 'top-right':
                return 'top-4 right-4 md:top-8 md:right-8';
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ x: 100, y: 100, scale: 0, opacity: 0 }}
                animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                exit={{ x: 100, y: 100, scale: 0, opacity: 0 }}
                transition={{
                    type: prefersReducedMotion ? 'tween' : 'spring',
                    stiffness: 200,
                    damping: 20,
                }}
                className={cn(
                    'fixed z-50 cursor-pointer select-none',
                    getPositionClasses()
                )}
                onClick={handleClick}
                whileHover={!prefersReducedMotion ? { scale: 1.05, rotate: 5 } : {}}
                whileTap={!prefersReducedMotion ? { scale: 0.95 } : {}}
            >
                {/* Mascot container */}
                <div className="relative">
                    {/* Speech bubble */}
                    {mascot.message && (
                        <SpeechBubble
                            message={mascot.message.text}
                            position="above"
                            onDismiss={mascot.message.dismissible ? mascot.hideMessage : undefined}
                            dismissible={mascot.message.dismissible}
                        />
                    )}

                    {/* Confetti effect */}
                    {showConfetti && !prefersReducedMotion && <Confetti />}

                    {/* Mascot image/animation */}
                    <motion.div
                        className="w-24 h-24 md:w-32 md:h-32 relative"
                        animate={{
                            // Idle breathing animation
                            scale: mascot.state === 'idle' && !prefersReducedMotion
                                ? [1, 1.02, 1]
                                : 1,
                            // Happy bounce
                            y: mascot.state === 'happy' && !prefersReducedMotion
                                ? [0, -10, 0, -5, 0]
                                : 0,
                            // Celebrating dance (wiggle)
                            rotate: mascot.state === 'celebrating' && !prefersReducedMotion
                                ? [0, -10, 10, -10, 10, 0]
                                : 0,
                            // Excited jump
                            ...(mascot.state === 'excited' && !prefersReducedMotion && {
                                y: [0, -30, 0],
                                rotate: [0, 360, 0],
                            }),
                            // Loading spin
                            ...(mascot.state === 'loading' && !prefersReducedMotion && {
                                rotate: 360,
                            }),
                            // Thinking tilt
                            ...(mascot.state === 'thinking' && !prefersReducedMotion && {
                                rotate: 15,
                            }),
                        }}
                        transition={{
                            scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                            y: mascot.state === 'happy'
                                ? { duration: 0.6 }
                                : mascot.state === 'excited'
                                    ? { duration: 0.8 }
                                    : {},
                            rotate: mascot.state === 'celebrating'
                                ? { duration: 0.5, ease: 'easeInOut' }
                                : mascot.state === 'loading'
                                    ? { duration: 2, repeat: Infinity, ease: 'linear' }
                                    : mascot.state === 'excited'
                                        ? { duration: 0.8 }
                                        : {},
                        }}
                    >
                        {/* Holiday accessory */}
                        {holidayTheme && (
                            <div className="absolute -top-2 -right-2 text-2xl">
                                {holidayTheme.accessory === 'santa-hat' && '🎅'}
                                {holidayTheme.accessory === 'party-hat' && '🎉'}
                                {holidayTheme.accessory === 'witch-hat' && '🎃'}
                            </div>
                        )}

                        {/* Using existing mascot image */}
                        <img
                            src="/mascot/melody-icon.png"
                            alt="Melody the Turtle"
                            className="w-full h-full object-contain drop-shadow-lg"
                        />
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
