import { useEffect, useState } from 'react';
import { Song } from '@/types';
import { axiosInstance } from '@/lib/axios';
import { Loader2, Music2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface LyricsPanelProps {
    song: Song;
    currentTime?: number;
}

export const LyricsPanel = ({ song, currentTime }: LyricsPanelProps) => {
    const [lyrics, setLyrics] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLyrics = async () => {
            if (!song) return;

            setIsLoading(true);
            setError(null);

            try {
                const response = await axiosInstance.get(`/lyrics/${song._id}`);
                // Assuming backend returns { success: true, data: { lyrics: "..." } }
                // or just { lyrics: "..." } depending on BaseController
                // BaseController usually wraps in `data`.
                // Let's assume standard response structure.
                setLyrics(response.data.lyrics || response.data.data?.lyrics || null);
            } catch (err) {
                console.error("Failed to fetch lyrics:", err);
                setError("Could not load lyrics for this song.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchLyrics();
    }, [song._id]);

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center text-text-secondary">
                <Loader2 className="size-8 animate-spin" />
            </div>
        );
    }

    if (error || !lyrics) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-text-secondary gap-4 p-8">
                <Music2 className="size-16 opacity-20" />
                <p className="text-lg font-medium">{error || "No lyrics available"}</p>
                {!error && <p className="text-sm opacity-60">We couldn't find lyrics for this track.</p>}
            </div>
        );
    }

    // Simple parsing to display lines nicely (handling generic Newlines)
    // If it is LRC (has timestamps), we might want to strip them for now for a cleaner "Text" view
    // or keep them if we want to show it's synced data.
    // For now, let's just create line breaks.

    return (
        <motion.div
            className="h-full overflow-y-auto px-4 py-8 text-center scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="max-w-2xl mx-auto space-y-6">
                {lyrics.split('\n').map((line, index) => {
                    // Primitive check for LRC timestamp to style it differently or hide it
                    const isTimestamp = line.match(/^\[\d{2}:\d{2}\.\d{2}\]/);
                    const text = isTimestamp ? line.replace(/^\[\d{2}:\d{2}\.\d{2}\]/, '') : line;

                    return (
                        <p
                            key={index}
                            className={`text-xl md:text-2xl font-semibold transition-colors duration-300 ${
                                // Placeholder active logic if we wanted to use currentTime
                                'text-white/80 hover:text-white'
                                }`}
                        >
                            {text || <span className="opacity-0">...</span>}
                        </p>
                    );
                })}
                <div className="pt-20 pb-4 text-xs text-text-tertiary uppercase tracking-widest">
                    Lyrics provided by MelodyHub
                </div>
            </div>
        </motion.div>
    );
};
