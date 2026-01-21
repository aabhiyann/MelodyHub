/**
 * MelodyMascot Component
 * Animated AI assistant mascot with different emotional states
 */

import { motion, Variants } from 'framer-motion';
import { ConfettiEffect } from './ConfettiEffect';

export type MascotState = 'idle' | 'listening' | 'thinking' | 'success' | 'error';

interface MelodyMascotProps {
    state: MascotState;
    size?: 'sm' | 'md' | 'lg';
}

export const MelodyMascot = ({ state, size = 'md' }: MelodyMascotProps) => {
    const sizeClasses = {
        sm: 'w-24 h-24',
        md: 'w-32 h-32',
        lg: 'w-40 h-40',
    };

    // Animation variants for each state
    const mascotVariants: Variants = {
        idle: {
            y: [0, -10, 0],
            rotate: 0,
            scale: 1,
            transition: {
                y: {
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                },
            },
        },
        listening: {
            rotate: [-5, 5, -5],
            scale: 1.05,
            y: 0,
            transition: {
                rotate: {
                    duration: 0.6,
                    repeat: 2,
                    ease: 'easeInOut',
                },
                scale: {
                    duration: 0.3,
                },
            },
        },
        thinking: {
            rotate: [0, 360, 720],
            scale: [1, 0.9, 1],
            y: 0,
            transition: {
                rotate: {
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                },
                scale: {
                    duration: 1,
                    repeat: Infinity,
                    ease: 'easeInOut',
                },
            },
        },
        success: {
            scale: [1, 1.3, 1],
            y: [0, -40, 0],
            rotate: [0, 10, -10, 0],
            transition: {
                duration: 0.8,
                ease: 'easeOut',
            },
        },
        error: {
            x: [-10, 10, -10, 10, 0],
            rotate: [-5, 5, -5, 5, 0],
            transition: {
                duration: 0.5,
                ease: 'easeInOut',
            },
        },
    };

    // Glow effect variants
    const glowVariants: Variants = {
        idle: {
            scale: 1,
            opacity: 0.3,
        },
        listening: {
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            transition: {
                duration: 1,
                repeat: Infinity,
            },
        },
        thinking: {
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3],
            transition: {
                duration: 1.5,
                repeat: Infinity,
            },
        },
        success: {
            scale: 1.5,
            opacity: 0.8,
            transition: {
                duration: 0.5,
            },
        },
        error: {
            scale: 1,
            opacity: 0.2,
        },
    };

    return (
        <div className="relative flex justify-center items-center mb-8">
            {/* Background glow */}
            <motion.div
                className="absolute inset-0 bg-brand-primary/30 blur-3xl rounded-full"
                variants={glowVariants}
                initial="idle"
                animate={state}
            />

            {/* Mascot */}
            <motion.div
                className={`relative ${sizeClasses[size]}`}
                variants={mascotVariants}
                initial="idle"
                animate={state}
                transition={{ duration: 0.3 }}
            >
                <img
                    src="/melody.webp"
                    alt="Melody AI Assistant"
                    className="w-full h-full object-contain drop-shadow-2xl"
                />

                {/* Thinking indicator - pulsing ring */}
                {state === 'thinking' && (
                    <motion.div
                        className="absolute inset-0 border-4 border-brand-primary rounded-full"
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [1, 0, 1],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                )}

                {/* Success confetti */}
                {state === 'success' && <ConfettiEffect />}
            </motion.div>
        </div>
    );
};
