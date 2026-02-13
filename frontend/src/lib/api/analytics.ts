import { axiosInstance } from "../axios";
import { Song } from "@/types";
import { extractData } from "@/utils/apiAdapter";

export interface AnalyticsStats {
    totalPlays: number;
    likedSongsCount: number;
    favoriteGenres: string[];
    favoriteArtists: string[];
    listeningHistory: {
        songId: Song;
        playedAt: string;
        completionRate: number;
        skipped: boolean;
    }[];
}

export const analyticsApi = {
    getUserStats: async (): Promise<AnalyticsStats> => {
        const response = await axiosInstance.get("/analytics/user-preferences");
        return extractData<AnalyticsStats>(response.data);
    }
};
