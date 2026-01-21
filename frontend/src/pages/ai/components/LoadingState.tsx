/**
 * LoadingState Component
 * Shows Melody thinking with rotating loading messages
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MelodyMascot } from './MelodyMascot';

const LOADING_MESSAGES = [
    'Analyzing your vibe...',
    'Curating the perfect tracks...',
    'Diving into the music library...',
    'Almost there...',
];

export const LoadingState = () => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
        >
            <MelodyMascot state="thinking" size="lg" />

            <motion.div
                key={messageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4"
            >
                <h3 className="text-2xl font-bold text-white mb-2">
                    Creating your playlist...
                </h3>
                <p className="text-zinc-400">{LOADING_MESSAGES[messageIndex]}</p>
            </motion.div>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mt-6">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-brand-primary"
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.2,
                        }}
                    />
                ))}
            </div>
        </motion.div>
    );
};
