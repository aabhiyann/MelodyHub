import { useState, useEffect } from "react";
import { axiosInstance } from "@/lib/axios";
import { Song } from "@/types";

export interface ListeningHistoryItem {
    songId: Song;
    playedAt: string;
}

export interface HomeData {
    listeningHistory: ListeningHistoryItem[];
    topArtists: { artist: string; count: number; imageUrl?: string }[];
    isLoading: boolean;
    error: string | null;
}

export const useHomeData = () => {
    const [history, setHistory] = useState<ListeningHistoryItem[]>([]);
    const [topArtists, setTopArtists] = useState<{ artist: string; count: number; imageUrl?: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch user preferences which contains listening history
                const response = await axiosInstance.get("/analytics/user-preferences");
                const data = response.data.data;

                if (data && data.listeningHistory) {
                    setHistory(data.listeningHistory);

                    // Calculate top artists from history for now, or use a dedicated endpoint if available
                    // The implementation plan mentioned getting top artists. 
                    // Let's derive it from history if the backend doesn't provide a direct list yet.
                    // Or check if there is a stats endpoint. 
                    // For MVP, client-side derivation from history is acceptable if history is long enough.

                    const artistCounts: Record<string, number> = {};
                    const artistImages: Record<string, string> = {};

                    data.listeningHistory.forEach((item: ListeningHistoryItem) => {
                        const artist = item.songId?.artist;
                        const imageUrl = item.songId?.imageUrl;
                        if (artist) {
                            artistCounts[artist] = (artistCounts[artist] || 0) + 1;
                            if (imageUrl && !artistImages[artist]) {
                                artistImages[artist] = imageUrl;
                            }
                        }
                    });

                    const sortedArtists = Object.entries(artistCounts)
                        .map(([artist, count]) => ({
                            artist,
                            count,
                            imageUrl: artistImages[artist]
                        }))
                        .sort((a, b) => b.count - a.count)
                        .slice(0, 5);

                    setTopArtists(sortedArtists);
                }
            } catch (err: any) {
                console.error("Error fetching home data:", err);
                setError(err.message || "Failed to load personalized data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return { listeningHistory: history, topArtists, isLoading, error };
};
