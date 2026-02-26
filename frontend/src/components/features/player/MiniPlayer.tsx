/**
 * MiniPlayer - Bottom bar mini player  
 * FIXED: Using correct PlayerStore functions
 */

import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, Heart, ChevronUp } from 'lucide-react';
import { usePlayerStore } from '@/stores/PlayerStore';

export const MiniPlayer = () => {
    const { currentSong, isPlaying, togglePlay, playNext } = usePlayerStore();

    if (!currentSong) return null;

    return (
        <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 md:left-[240px]"
            initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
        >
            <div className="bg-background-elevated/80 border-t border-white/10 backdrop-blur-2xl shadow-2xl">
                <div className="flex items-center gap-4 px-4 py-3">
                    <button onClick={() => { }} className="flex items-center gap-3 flex-1 min-w-0 hover:bg-white/5 p-2 -m-2 rounded-lg transition-colors group">
                        <img src={currentSong.imageUrl} alt={currentSong.title} className="size-12 rounded-md object-cover shrink-0 shadow-lg shadow-black/50 border border-white/5 group-hover:shadow-xl transition-shadow" />
                        <div className="flex-1 min-w-0 text-left">
                            <p className="text-sm font-semibold text-white truncate">{currentSong.title}</p>
                            <p className="text-xs text-text-secondary truncate">{currentSong.artist}</p>
                        </div>
                    </button>
                    <div className="flex items-center gap-2 shrink-0">
                        <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                            <Heart className="size-5 text-text-secondary hover:text-white" />
                        </button>
                        <button onClick={togglePlay} className="p-2 bg-white/10 hover:bg-white/15 rounded-lg transition-colors">
                            {isPlaying ? <Pause className="size-5 text-white fill-white" /> : <Play className="size-5 text-white fill-white" />}
                        </button>
                        <button onClick={() => playNext(true)} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                            <SkipForward className="size-5 text-text-secondary hover:text-white" />
                        </button>
                        <button onClick={() => { }} className="p-2 hover:bg-white/5 rounded-lg transition-colors ml-2">
                            <ChevronUp className="size-5 text-text-secondary hover:text-white" />
                        </button>
                    </div>
                </div>
                <div className="h-1 bg-white/10">
                    <motion.div className="h-full bg-brand-primary" style={{ width: '45%' }} />
                </div>
            </div>
        </motion.div>
    );
};
