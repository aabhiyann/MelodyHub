import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const LOADING_MESSAGES = [
    "Analyzing your music taste...",
    "Finding the perfect songs...",
    "Curating your playlist...",
    "Adding some surprises...",
    "Almost there..."
];

export const StageProcessing = () => {
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
            className="flex flex-col items-center justify-center w-full max-w-lg mx-auto py-12"
        >
            {/* Loading Message - refined typography */}
            <div className="h-10 mb-8 overflow-hidden">
                <motion.h3
                    key={messageIndex}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="text-h4 md:text-h3 font-semibold text-center text-text-primary"
                >
                    {LOADING_MESSAGES[messageIndex]}
                </motion.h3>
            </div>

            {/* Progress Bar - determinate-style using loading-bar */}
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-8">
                <div
                    className="h-full w-full bg-gradient-to-r from-brand-primary via-purple-500 to-brand-secondary loading-bar-indeterminate"
                />
            </div>

            <p className="text-text-tertiary text-sm animate-pulse">
                Melody is working her magic...
            </p>
        </motion.div>
    );
};
