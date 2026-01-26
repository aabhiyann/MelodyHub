/**
 * AdditionalControls Component
 * Queue, volume, connect, and more options controls for the right side of the player
 */

import { motion } from 'framer-motion';
import { ListMusic, Cast, MoreHorizontal, Maximize2, Minimize2 } from 'lucide-react';
import { VolumeControl } from './VolumeControl';
import { useState } from 'react';

interface AdditionalControlsProps {
    queueCount: number;
    onQueueClick: () => void;
    volume: number;
    isMuted: boolean;
    onVolumeChange: (volume: number) => void;
    onToggleMute: () => void;
    isExpanded: boolean;
    onToggleExpanded: () => void;
}

export const AdditionalControls = ({
    queueCount,
    onQueueClick,
    volume,
    isMuted,
    onVolumeChange,
    onToggleMute,
    isExpanded,
    onToggleExpanded,
}: AdditionalControlsProps) => {
    const [showMoreMenu, setShowMoreMenu] = useState(false);

    return (
        <div className="flex items-center gap-1">
            {/* Queue Button */}
            <motion.button
                onClick={onQueueClick}
                className={`relative p-2 rounded-full hover:bg-white/10 transition-colors ${queueCount > 0 ? 'text-brand-primary' : 'text-zinc-400'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="View queue"
            >
                <ListMusic className="w-5 h-5" />
            </motion.button>

            {/* Connect to Device */}
            <motion.button
                className="p-2 rounded-full hover:bg-white/10 transition-colors hidden md:block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Connect to device"
            >
                <Cast className="w-5 h-5 text-zinc-400 hover:text-white transition-colors" />
            </motion.button>

            {/* Volume Control */}
            <div className="mx-2">
                <VolumeControl
                    volume={volume}
                    isMuted={isMuted}
                    onVolumeChange={onVolumeChange}
                    onToggleMute={onToggleMute}
                />
            </div>

            {/* Expand/Collapse Button */}
            <motion.button
                onClick={onToggleExpanded}
                className="p-2 rounded-full hover:bg-white/10 transition-colors hidden sm:block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={isExpanded ? "Collapse player" : "Expand player"}
            >
                {isExpanded ? (
                    <Minimize2 className="w-5 h-5 text-zinc-400 hover:text-white transition-colors" />
                ) : (
                    <Maximize2 className="w-5 h-5 text-zinc-400 hover:text-white transition-colors" />
                )}
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
                    <MoreHorizontal className="w-5 h-5 text-zinc-400 hover:text-white transition-colors" />
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
