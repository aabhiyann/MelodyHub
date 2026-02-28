import { useGamificationStore } from '@/stores/GamificationStore';
import { Gem } from 'lucide-react';

export const GemsIndicator = () => {
    const { gems } = useGamificationStore();

    return (
        <div
            className="flex items-center gap-2 bg-zinc-800/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/5 cursor-default"
            title={`You have ${gems} gems`}
        >
            <Gem className="size-4 text-emerald-400 fill-emerald-400/20" />
            <span className="font-bold text-sm text-emerald-400">
                {gems}
            </span>
        </div>
    );
};
