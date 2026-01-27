import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useGamificationStore } from '@/stores/GamificationStore';

export const XPFloatingIndicator = () => {
    // We need a way to trigger this from the store or event bus.
    // Ideally, the store would have a "lastEarnedXP" timestamp or similar.
    // For now, let's subscribe to store changes if possible, or just use a local trigger mechanism
    // if we refactor the store to emit events.

    // Actually, a better pattern might be a global event bus or a store generic "notification" queue.
    // Let's modify the store to holding a "latestAward" object.

    const latestAward = useGamificationStore(state => state.latestAward);
    const [visible, setVisible] = useState(false);
    const [award, setAward] = useState<{ amount: number, source: string } | null>(null);

    useEffect(() => {
        if (latestAward) {
            setAward(latestAward);
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [latestAward]);

    return (
        <AnimatePresence>
            {visible && award && (
                <motion.div
                    className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: -20, scale: 1 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <div className="bg-yellow-500/90 text-black font-bold px-4 py-2 rounded-full shadow-lg backdrop-blur-sm border border-yellow-400 flex items-center gap-2">
                        <span className="text-lg">+{award.amount} XP</span>
                        <span className="text-xs opacity-75 font-normal uppercase tracking-wider">{award.source}</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
