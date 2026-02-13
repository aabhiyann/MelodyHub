import { axiosInstance } from "../axios";

export interface DailyChallenge {
    _id: string;
    title: string;
    description: string;
    target: number;
    progress: number;
    reward: { xp: number; gems: number };
    completed: boolean;
}

export interface GamificationStatsResponse {
    gamification: {
        xp: number;
        level: number;
        gems: number;
        streak: number;
        streakFreezes: number;
    };
    dailyChallenges: DailyChallenge[];
}

export interface AwardXPResponse {
    success: boolean;
    level: number;
    xp: number;
    message: string;
}

export const gamificationApi = {
    getStats: async (): Promise<GamificationStatsResponse> => {
        const response = await axiosInstance.get('/gamification/stats');
        return response.data;
    },

    awardXP: async (amount: number, source: string): Promise<AwardXPResponse> => {
        const response = await axiosInstance.post('/gamification/xp', { amount, source });
        return response.data;
    }
};
