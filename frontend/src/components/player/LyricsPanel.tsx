/**
 * LyricsPanel - Real-time synced lyrics display
 * Click lines to jump to timestamp
 */

import { motion } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface LyricLine {
    timestamp: number; // Seconds
    text: string;
}

interface LyricsPanelProps {
    lyrics: LyricLine[];
    currentTime: number;
    onSeek: (time: number) => void;
}

export const LyricsPanel = ({ lyrics, currentTime, onSeek }: LyricsPanelProps) => {
    const [isKaraokeMode, setIsKaraokeMode] = useState(false);

    // Find current line
    const currentLineIndex = lyrics.findIndex((line, index) => {
        const nextLine = lyrics[index + 1];
        return currentTime >= line.timestamp && (!nextLine || currentTime < nextLine.timestamp);
    });

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h3 className="font-semibold text-white">Lyrics</h3>
                <button
                    onClick={() => setIsKaraokeMode(!isKaraokeMode)}
                    className={cn(
                        'px-3 py-1 rounded-lg text-sm font-medium transition-colors',
                        isKaraokeMode
                            ? 'bg-brand-primary text-white'
                            : 'bg-white/10 text-text-secondary hover:text-white'
                    )}
                >
                    Karaoke Mode
                </button>
            </div>

            {/* Lyrics */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4 max-w-2xl mx-auto">
                    {lyrics.map((line, index) => {
                        const isActive = index === currentLineIndex;
                        const isPast = index < currentLineIndex;

                        return (
                            <motion.button
                                key={index}
                                onClick={() => onSeek(line.timestamp)}
                                className={cn(
                                    'block w-full text-left px-4 py-2 rounded-lg transition-all cursor-pointer',
                                    isActive && 'bg-brand-primary/20',
                                    isKaraokeMode && !isActive && 'blur-sm'
                                )}
                                animate={{
                                    opacity: isPast ? 0.5 : 1,
                                    scale: isActive ? 1.05 : 1,
                                }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <p
                                    className={cn(
                                        'text-lg leading-relaxed transition-colors',
                                        isActive
                                            ? 'text-white font-semibold'
                                            : isPast
                                                ? 'text-text-tertiary'
                                                : 'text-text-secondary'
                                    )}
                                >
                                    {line.text}
                                </p>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Footer Info */}
            <div className="p-4 border-t border-white/10 text-center">
                <p className="text-xs text-text-tertiary">
                    Click any line to jump to that part of the song
                </p>
            </div>
        </div>
    );
};

// Mock lyrics data generator
export const generateMockLyrics = (): LyricLine[] => [
    { timestamp: 0, text: "Welcome to this amazing song" },
    { timestamp: 5, text: "With lyrics that sync in real-time" },
    { timestamp: 10, text: "Click any line to jump around" },
    { timestamp: 15, text: "Karaoke mode blurs inactive lines" },
    { timestamp: 20, text: "Making it perfect for singing along" },
    { timestamp: 25, text: "This is just a demo" },
    { timestamp: 30, text: "In production, connect to Musixmatch or Genius API" },
    { timestamp: 35, text: "For real synchronized lyrics" },
];
