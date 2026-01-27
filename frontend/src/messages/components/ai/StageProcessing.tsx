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
            {/* Loading Message */}
            <div className="h-8 mb-8 overflow-hidden">
                <motion.h4
                    key={messageIndex}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="text-2xl font-bold text-center text-white"
                >
                    {LOADING_MESSAGES[messageIndex]}
                </motion.h4>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-8">
                <motion.div
                    className="h-full bg-gradient-to-r from-brand-primary via-purple-500 to-brand-secondary"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "linear"
                    }}
                />
            </div>

            <p className="text-zinc-500 text-sm animate-pulse">
                Melody is working her magic...
            </p>
        </motion.div>
    );
};
