/**
 * AdditionalControls Component
 * Queue, volume, connect, and more options controls for the right side of the player
 */

import { motion } from 'framer-motion';
import { ListMusic, Cast, MoreHorizontal } from 'lucide-react';
import { VolumeControl } from './VolumeControl';
import { useState } from 'react';

interface AdditionalControlsProps {
    queueCount: number;
    onQueueClick: () => void;
    volume: number;
    isMuted: boolean;
    onVolumeChange: (volume: number) => void;
    onToggleMute: () => void;
}

export const AdditionalControls = ({
    queueCount,
    onQueueClick,
    volume,
    isMuted,
    onVolumeChange,
    onToggleMute,
}: AdditionalControlsProps) => {
    const [showMoreMenu, setShowMoreMenu] = useState(false);

    return (
        <div className="flex items-center gap-2">
            {/* Queue Button */}
            <motion.button
                onClick={onQueueClick}
                className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="View queue"
            >
                <ListMusic className="w-5 h-5 text-white/70" />
                {queueCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-primary text-white text-xs rounded-full flex items-center justify-center font-semibold">
                        {queueCount > 99 ? '99+' : queueCount}
                    </span>
                )}
            </motion.button>

            {/* Volume Control */}
            <VolumeControl
                volume={volume}
                isMuted={isMuted}
                onVolumeChange={onVolumeChange}
                onToggleMute={onToggleMute}
            />

            {/* Connect to Device */}
            <motion.button
                className="p-2 rounded-full hover:bg-white/10 transition-colors hidden md:block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Connect to device"
            >
                <Cast className="w-5 h-5 text-white/70" />
            </motion.button>

            {/* More Options */}
            <div className="relative">
                <motion.button
                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="More options"
                >
                    <MoreHorizontal className="w-5 h-5 text-white/70" />
                </motion.button>

                {/* More Menu Dropdown */}
                {showMoreMenu && (
                    <div className="absolute right-0 bottom-full mb-2 w-48 rounded-xl border border-white/10 bg-zinc-900/95 p-1 shadow-xl backdrop-blur-xl">
                        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/10 hover:text-white transition-colors text-left">
                            View Lyrics
                        </button>
                        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/10 hover:text-white transition-colors text-left">
                            Share Track
                        </button>
                        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/10 hover:text-white transition-colors text-left">
                            Add to Playlist
                        </button>
                        <div className="h-px bg-white/10 my-1" />
                        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/10 hover:text-white transition-colors text-left">
                            Go to Album
                        </button>
                        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/10 hover:text-white transition-colors text-left">
                            Go to Artist
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
