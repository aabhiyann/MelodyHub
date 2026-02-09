import { useGamificationStore } from '@/stores/GamificationStore';
import { Flame, Snowflake } from 'lucide-react';
import { motion } from 'framer-motion';

export const StreakBadge = () => {
    const { streak, streakFreezes } = useGamificationStore();

    return (
        <div className="flex items-center gap-2 bg-zinc-800/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/5">
            <div className="relative">
                <Flame
                    className={`size-5 ${streak > 0 ? 'text-orange-500 fill-orange-500' : 'text-zinc-500'}`}
                />
                {streakFreezes > 0 && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -bottom-1 -right-1 bg-cyan-500 rounded-full p-0.5"
                    >
                        <Snowflake className="size-2 text-white fill-white" />
                    </motion.div>
                )}
            </div>
            <span className={`font-bold text-sm ${streak > 0 ? 'text-orange-500' : 'text-zinc-500'}`}>
                {streak}
            </span>
        </div>
    );
};
