import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { gamificationApi, DailyChallenge } from '../lib/api/gamification';

export type { DailyChallenge };

interface GamificationState {
    xp: number;
    level: number;
    gems: number;
    streak: number;
    streakFreezes: number;
    dailyChallenges: DailyChallenge[];
    latestAward: { amount: number, source: string } | null;
    isLoading: boolean;
    error: string | null;
}

interface GamificationActions {
    fetchStats: () => Promise<void>;
    awardXP: (amount: number, source: string) => Promise<void>;
    resetAward: () => void;
}

type GamificationStore = GamificationState & GamificationActions;

const initialState: GamificationState = {
    xp: 0,
    level: 1,
    gems: 0,
    streak: 0,
    streakFreezes: 0,
    dailyChallenges: [],
    latestAward: null,
    isLoading: false,
    error: null,
};

export const useGamificationStore = create<GamificationStore>()(
    persist(
        (set, get) => ({
            ...initialState,

            fetchStats: async () => {
                set({ isLoading: true, error: null });
                try {
                    const data = await gamificationApi.getStats();
                    set({
                        xp: data.gamification.xp,
                        level: data.gamification.level,
                        gems: data.gamification.gems,
                        streak: data.gamification.streak,
                        streakFreezes: data.gamification.streakFreezes,
                        dailyChallenges: data.dailyChallenges || [],
                        isLoading: false
                    });
                } catch (error) {
                    console.error('Error fetching gamification stats:', error);
                    set({ isLoading: false, error: 'Failed to fetch stats' });
                }
            },

            awardXP: async (amount: number, source: string) => {
                const previousState = get();
                try {
                    // Optimistic update
                    set(state => ({
                        xp: state.xp + amount,
                        latestAward: { amount, source }
                    }));

                    const response = await gamificationApi.awardXP(amount, source);

                    // Sync with server if level changed
                    if (response.level > previousState.level) {
                        set({ level: response.level });
                    }
                } catch (error) {
                    console.error('Error awarding XP:', error);
                    // Revert optimistic update on failure
                    set({ xp: previousState.xp, latestAward: null });
                }
            },

            resetAward: () => {
                set({ latestAward: null });
            }
        }),
        {
            name: 'gamification-storage',
            partialize: (state) => ({
                xp: state.xp,
                level: state.level,
                gems: state.gems,
                streak: state.streak,
                streakFreezes: state.streakFreezes
            }),
        }
    )
);
