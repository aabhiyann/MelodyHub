/**
 * QueuePanel - Enhanced queue with controls
 * Spotify 2025 inspired with Smart Shuffle, Sleep Timer
 */

import { motion } from 'framer-motion';
import { X, Shuffle, Repeat, Clock, Plus, MoreVertical } from 'lucide-react';
import { LiquidGlassCard } from '@/components/ui/LiquidGlassCard';
import { GlassmorphicButton } from '@/components/ui/GlassmorphicButton';

interface QueuePanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export const QueuePanel = ({ isOpen, onClose }: QueuePanelProps) => {
    if (!isOpen) return null;

    const queue = [
        { id: '1', title: 'Song A', artist: 'Artist A', duration: '3:45' },
        { id: '2', title: 'Song B', artist: 'Artist B', duration: '4:12' },
        { id: '3', title: 'Song C', artist: 'Artist C', duration: '3:08' },
    ];

    return (
        <motion.div
            className="fixed inset-y-0 right-0 w-full md:w-96 z-50 bg-bg-secondary border-l border-white/10"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
        >
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white">Queue</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="size-5 text-text-secondary" />
                    </button>
                </div>

                {/* Controls */}
                <div className="p-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <GlassmorphicButton variant="glass" size="sm" icon={<Shuffle className="size-4" />}>
                            Shuffle
                        </GlassmorphicButton>
                        <GlassmorphicButton variant="glass" size="sm" icon={<Repeat className="size-4" />}>
                            Repeat
                        </GlassmorphicButton>
                        <GlassmorphicButton variant="glass" size="sm" icon={<Clock className="size-4" />}>
                            Sleep Timer
                        </GlassmorphicButton>
                    </div>
                </div>

                {/* Now Playing */}
                <div className="p-4 border-b border-white/10">
                    <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">
                        Now Playing
                    </p>
                    <LiquidGlassCard className="p-3">
                        <div className="flex items-center gap-3">
                            <div className="size-12 bg-gradient-to-br from-brand-primary to-brand-secondary rounded" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white truncate">Current Song</p>
                                <p className="text-xs text-text-secondary truncate">Current Artist</p>
                            </div>
                        </div>
                    </LiquidGlassCard>
                </div>

                {/* Queue List */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                            Next Up ({queue.length})
                        </p>
                        <button className="text-xs text-brand-primary hover:underline">Clear</button>
                    </div>

                    <div className="space-y-2">
                        {queue.map((song, index) => (
                            <motion.div
                                key={song.id}
                                className="group flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                                whileHover={{ x: 4 }}
                            >
                                <span className="text-sm text-text-tertiary w-6">{index + 1}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{song.title}</p>
                                    <p className="text-xs text-text-secondary truncate">{song.artist}</p>
                                </div>
                                <span className="text-xs text-text-tertiary">{song.duration}</span>
                                <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-opacity">
                                    <MoreVertical className="size-4 text-text-secondary" />
                                </button>
                            </motion.div>
                        ))}
                    </div>

                    <button className="w-full mt-4 flex items-center justify-center gap-2 p-3 border-2 border-dashed border-white/10 rounded-lg text-text-secondary hover:border-white/20 hover:text-white transition-colors">
                        <Plus className="size-4" />
                        Add Songs
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
