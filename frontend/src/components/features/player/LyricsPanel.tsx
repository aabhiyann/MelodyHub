import { useEffect, useState, useRef } from 'react';
import { Song } from '@/types';
import { axiosInstance } from '@/lib/axios';
import { Loader2, Music2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface LyricsPanelProps {
    song: Song;
    currentTime?: number;
}

interface ParsedLyric {
    time: number;
    text: string;
}

export const LyricsPanel = ({ song, currentTime = 0 }: LyricsPanelProps) => {
    const [rawLyrics, setRawLyrics] = useState<string | null>(null);
    const [parsedLyrics, setParsedLyrics] = useState<ParsedLyric[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState<number>(-1);

    const containerRef = useRef<HTMLDivElement>(null);
    const activeLineRef = useRef<HTMLParagraphElement>(null);

    // 1. Fetch Lyrics
    useEffect(() => {
        const fetchLyrics = async () => {
            if (!song) return;

            setIsLoading(true);
            setError(null);

            try {
                const response = await axiosInstance.get(`/lyrics/${song._id}`);
                setRawLyrics(response.data.lyrics || response.data.data?.lyrics || null);
            } catch (err) {
                console.error("Failed to fetch lyrics:", err);
                setError("Could not load lyrics for this track.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchLyrics();
    }, [song._id]);

    // 2. Parse LRC format [mm:ss.ms] into objects
    useEffect(() => {
        if (!rawLyrics) {
            setParsedLyrics([]);
            return;
        }

        const lines = rawLyrics.split('\n');
        const parsed: ParsedLyric[] = [];

        // Check if the lyrics actually contain Time Tags [mm:ss.ms]
        const hasTimeTags = lines.some(line => /^\[\d{2}:\d{2}\.\d{2,3}\]/.test(line));

        if (!hasTimeTags) {
            // It's just flat text, fall back to simple line breaks with dummy times
            lines.forEach((line) => {
                if (line.trim()) {
                    parsed.push({ time: -1, text: line.trim() });
                }
            });
            setParsedLyrics(parsed);
            return;
        }

        // Parse LRC
        const timeRegex = /^\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/;
        lines.forEach((line) => {
            const match = line.match(timeRegex);
            if (match) {
                const [, min, sec, ms, textItem] = match;
                // Convert [mm:ss.ms] to total seconds integer/float
                const text = textItem.trim();
                const totalSeconds = parseInt(min) * 60 + parseInt(sec) + parseInt(ms) / 1000;

                // Only push if there's actual text (ignore purely instrumental empty lines for display unless desired)
                if (text) {
                    parsed.push({
                        time: totalSeconds,
                        text: text
                    });
                }
            } else {
                // Handle text without tags natively mixed in
                if (line.trim() && !line.startsWith('[')) {
                    // Try to append it to the last item or just insert it
                    parsed.push({ time: -1, text: line.trim() });
                }
            }
        });

        // Ensure chronological order
        parsed.sort((a, b) => a.time - b.time);
        setParsedLyrics(parsed);
    }, [rawLyrics]);

    // 3. Find Active Line Index based on currentTime
    useEffect(() => {
        if (parsedLyrics.length === 0 || currentTime === 0) return;

        // If lyrics have no time tags, we can't sync it.
        if (parsedLyrics[0].time === -1) {
            setActiveIndex(-1);
            return;
        }

        // Find the most recent line that has passed
        let newIndex = -1;
        for (let i = 0; i < parsedLyrics.length; i++) {
            if (currentTime >= parsedLyrics[i].time) {
                newIndex = i;
            } else {
                break; // Because array is sorted
            }
        }

        if (newIndex !== activeIndex) {
            setActiveIndex(newIndex);
        }
    }, [currentTime, parsedLyrics, activeIndex]);

    // 4. Auto-Scroll to Active Line
    useEffect(() => {
        if (activeLineRef.current && containerRef.current) {
            const container = containerRef.current;
            const activeLine = activeLineRef.current;

            // Calculate exact position to scroll to center of container
            const containerCenterY = container.clientHeight / 2;
            const activeLineCenterY = activeLine.offsetTop + (activeLine.clientHeight / 2);

            container.scrollTo({
                top: activeLineCenterY - containerCenterY,
                behavior: 'smooth'
            });
        }
    }, [activeIndex]);

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center text-text-secondary">
                <Loader2 className="size-8 animate-spin" />
            </div>
        );
    }

    if (error || parsedLyrics.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-text-secondary gap-4 p-8">
                <Music2 className="size-16 opacity-20" />
                <p className="text-lg font-medium">{error || "No lyrics available"}</p>
                {!error && <p className="text-sm opacity-60">We couldn't find lyrics for this track.</p>}
            </div>
        );
    }

    // Determine if these lyrics are timed (LRC)
    const isSynced = parsedLyrics.length > 0 && parsedLyrics[0].time !== -1;

    return (
        <motion.div
            ref={containerRef}
            className="h-full overflow-y-auto px-4 py-[30vh] text-center scrollbar-none" // 30vh padding so first/last lines can reach the center
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }} // Hide scrollbar specifically for immersive scroll
        >
            <div className="max-w-2xl mx-auto space-y-8">
                {parsedLyrics.map((lyric, index) => {
                    const isActive = index === activeIndex;
                    const isPassed = index < activeIndex;

                    return (
                        <p
                            key={index}
                            ref={isActive ? activeLineRef : null}
                            className={`text-2xl md:text-3xl font-extrabold tracking-tight transition-all duration-500 ease-out origin-center
                                ${!isSynced
                                    ? 'text-white/80' // Unsynced: uniform 80% opacity
                                    : isActive
                                        ? 'text-white scale-110 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                                        : isPassed
                                            ? 'text-white/40 scale-100' // Passed: dim more
                                            : 'text-white/30 scale-95 blur-[1px]' // Future: dim and slightly blur
                                }`}
                        >
                            {lyric.text}
                        </p>
                    );
                })}
                <div className="pt-32 pb-4 text-xs font-bold text-text-tertiary uppercase tracking-widest">
                    Lyrics provided by MelodyHub
                </div>
            </div>
        </motion.div>
    );
};
