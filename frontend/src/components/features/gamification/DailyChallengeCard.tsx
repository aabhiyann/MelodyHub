import { CheckCircle2, Circle } from 'lucide-react';
import { motion } from 'framer-motion';

interface DailyChallengeCardProps {
    challenge: {
        id: string;
        type: string;
        target: number;
        progress: number;
        completed: boolean;
        reward: { xp: number; gems: number };
    };
}

export const DailyChallengeCard = ({ challenge }: DailyChallengeCardProps) => {
    const progressPercent = Math.min((challenge.progress / challenge.target) * 100, 100);

    return (
        <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4 flex items-center justify-between">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-white">Daily Challenge</h3>
                    {challenge.completed && (
                        <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full font-bold">
                            COMPLETED
                        </span>
                    )}
                </div>
                <p className="text-sm text-zinc-400 mb-3">
                    {challenge.type === 'listen_count' && `Listen to ${challenge.target} songs`}
                    {challenge.type === 'login' && `Log in to the app`}
                </p>

                {/* Progress Bar */}
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden w-full max-w-[200px]">
                    <motion.div
                        className="h-full bg-brand-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
                <div className="text-xs text-zinc-500 mt-1">
                    {challenge.progress} / {challenge.target}
                </div>
            </div>

            <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1 text-sm font-bold text-yellow-400">
                    <span>+{challenge.reward.xp} XP</span>
                </div>
                <div className="flex items-center gap-1 text-sm font-bold text-cyan-400">
                    <span>+{challenge.reward.gems} Gems</span>
                </div>

                <div className="mt-2">
                    {challenge.completed ? (
                        <CheckCircle2 className="text-green-500 size-6" />
                    ) : (
                        <Circle className="text-zinc-600 size-6" />
                    )}
                </div>
            </div>
        </div>
    );
};
