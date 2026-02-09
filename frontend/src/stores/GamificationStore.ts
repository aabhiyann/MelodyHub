import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

export interface DailyChallenge {
    _id: string;
    title: string;
    description: string;
    target: number;
    progress: number;
    reward: { xp: number; gems: number };
    completed: boolean;
}

interface GamificationState {
    xp: number;
    level: number;
    gems: number;
    streak: number;
    streakFreezes: number;
    dailyChallenges: DailyChallenge[];
    latestAward: { amount: number, source: string } | null;
    isLoading: boolean;
    fetchStats: () => Promise<void>;
    awardXP: (amount: number, source: string) => Promise<void>;
}

export const useGamificationStore = create<GamificationState>()(
    persist(
        (set, get) => ({
            xp: 0,
            level: 1,
            gems: 0,
            streak: 0,
            streakFreezes: 0,
            dailyChallenges: [],
            latestAward: null,
            isLoading: false,

            fetchStats: async () => {
                set({ isLoading: true });
                try {
                    const response = await axios.get('/api/gamification/stats');
                    const { gamification, dailyChallenges } = response.data;
                    set({
                        xp: gamification.xp,
                        level: gamification.level,
                        gems: gamification.gems,
                        streak: gamification.streak,
                        streakFreezes: gamification.streakFreezes,
                        dailyChallenges: dailyChallenges || [],
                        isLoading: false
                    });
                } catch (error) {
                    console.error('Error fetching gamification stats:', error);
                    set({ isLoading: false });
                }
            },

            awardXP: async (amount: number, source: string) => {
                try {
                    // Optimistic update
                    set(state => ({
                        xp: state.xp + amount,
                        latestAward: { amount, source } // Trigger animation
                    }));

                    // Clear award after a short delay so it can be triggered again (hook handles this via effect dependency, but resetting logic in store is safer for repeated same-value awards)
                    // Actually, the hook depends on the object reference changing. 
                    // Since we create a new object { amount, source }, the effect will fire. 
                    // But we might want to clear it eventually.

                    const response = await axios.post('/api/gamification/xp', { amount, source });
                    // Sync with server response in case of level up
                    if (response.data.level > get().level) {
                        // Trigger level up animation/modal here?
                        // For now just update state
                        set({ level: response.data.level });
                    }
                } catch (error) {
                    console.error('Error awarding XP:', error);
                    // Revert optimistic update?
                }
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
            }), // Persist core stats
        }
    )
);
