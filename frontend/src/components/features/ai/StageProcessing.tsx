import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-3xl mx-auto flex flex-col min-h-0"
        >
            <div className="flex flex-col items-center justify-center mb-6">
                <motion.h3
                    key={messageIndex}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    className="text-lg font-medium text-brand-primary animate-pulse"
                >
                    {LOADING_MESSAGES[messageIndex]}
                </motion.h3>
                <div className="w-64 h-1 bg-white/10 rounded-full mt-3 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary loading-bar-indeterminate" />
                </div>
            </div>

            {/* Skeleton Layout matched to StageResults */}
            <div className="flex flex-col md:flex-row gap-6 mb-8 opacity-60">
                <div className="flex-shrink-0 animate-pulse">
                    <div className="w-[200px] h-[200px] shadow-2xl rounded-xl bg-white/5 ring-1 ring-white/10" />
                </div>

                <div className="flex flex-col justify-end flex-1 min-w-0 animate-pulse space-y-3">
                    <div className="w-24 h-4 bg-white/10 rounded-full" />
                    <div className="w-3/4 h-10 bg-white/10 rounded-lg" />
                    <div className="w-full h-4 bg-white/5 rounded-full" />
                    <div className="w-2/3 h-4 bg-white/5 rounded-full" />
                    <div className="flex items-center gap-3 pt-4">
                        <div className="w-20 h-4 bg-white/10 rounded-full" />
                        <div className="w-14 h-14 rounded-full bg-white/10" />
                    </div>
                </div>
            </div>

            <div className="flex-1 min-h-[200px] overflow-hidden flex flex-col opacity-60">
                <div className="bg-background-elevated/20 backdrop-blur-sm rounded-xl border border-border-subtle overflow-hidden">
                    <div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 md:px-6 py-2 text-sm text-text-secondary border-b border-border-subtle uppercase tracking-wider">
                        <div>#</div>
                        <div>Title</div>
                        <div>Artist</div>
                        <div><Clock className="size-4 opacity-50" /></div>
                    </div>

                    <div className="max-h-[280px] overflow-hidden">
                        {[1, 2, 3, 4, 5].map((item) => (
                            <div key={item} className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 md:px-6 py-2 text-sm rounded-md animate-pulse mt-2">
                                <div className="flex items-center justify-center">
                                    <div className="w-3 h-3 bg-white/10 rounded-full" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded bg-white/10 flex-shrink-0" />
                                    <div className="w-2/3 h-4 bg-white/10 rounded-full" />
                                </div>
                                <div className="flex items-center">
                                    <div className="w-1/2 h-4 bg-white/5 rounded-full" />
                                </div>
                                <div className="flex items-center justify-end">
                                    <div className="w-12 h-4 bg-white/5 rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
