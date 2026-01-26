import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

interface AnalyticsStats {
    totalPlays: number;
    likedSongsCount: number;
    favoriteGenres: string[];
    favoriteArtists: string[];
    listeningHistory: {
        songId: any; // Populated song object
        playedAt: string;
        completionRate: number;
        skipped: boolean;
    }[];
}

interface AnalyticsStore {
    isLoading: boolean;
    error: string | null;
    stats: AnalyticsStats | null;

    fetchUserStats: () => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsStore>((set) => ({
    isLoading: false,
    error: null,
    stats: null,

    fetchUserStats: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get("/analytics/user-preferences");
            set({ stats: response.data.data });
        } catch (error: any) {
            console.error("Error fetching analytics:", error);
            set({ error: error.response?.data?.message || "Failed to fetch analytics" });
        } finally {
            set({ isLoading: false });
        }
    },
}));
