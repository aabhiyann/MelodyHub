/**
 * useGeminiPlaylist Hook
 * Custom hook for managing AI playlist generation state
 */

import { useState } from 'react';
import { generatePlaylist } from '@/lib/gemini-client';

interface Track {
    title: string;
    artist: string;
    reason?: string;
}

interface Playlist {
    name: string;
    description: string;
    tracks: Track[];
}

export const useGeminiPlaylist = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [playlist, setPlaylist] = useState<Playlist | null>(null);

    const generate = async (prompt: string): Promise<Playlist | null> => {
        setLoading(true);
        setError(null);

        try {
            const result = await generatePlaylist(prompt);
            setPlaylist(result);
            return result;
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Oops! Melody got confused. Let's try that again? 🎵";

            setError(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setPlaylist(null);
        setError(null);
    };

    return {
        generate,
        reset,
        loading,
        error,
        playlist,
    };
};
