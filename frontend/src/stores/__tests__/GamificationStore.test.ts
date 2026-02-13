import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useGamificationStore } from '../GamificationStore';
import { gamificationApi } from '@/lib/api/gamification';

// Mock the API service
vi.mock('@/lib/api/gamification', () => ({
    gamificationApi: {
        getStats: vi.fn(),
        awardXP: vi.fn(),
    }
}));

describe('GamificationStore', () => {
    beforeEach(() => {
        useGamificationStore.setState({
            xp: 0,
            level: 1,
            gems: 0,
            streak: 0,
            streakFreezes: 0,
            dailyChallenges: [],
            latestAward: null,
            isLoading: false,
            error: null
        });
        vi.clearAllMocks();
    });

    it('initializes with default values', () => {
        const state = useGamificationStore.getState();
        expect(state.xp).toBe(0);
        expect(state.level).toBe(1);
        expect(state.isLoading).toBe(false);
    });

    it('fetchStats updates state on success', async () => {
        const mockStats = {
            gamification: {
                xp: 100,
                level: 2,
                gems: 50,
                streak: 5,
                streakFreezes: 1
            },
            dailyChallenges: [{ _id: '1', title: 'Test' }]
        };

        // @ts-ignore
        gamificationApi.getStats.mockResolvedValue(mockStats);

        await useGamificationStore.getState().fetchStats();

        const state = useGamificationStore.getState();
        expect(state.xp).toBe(100);
        expect(state.level).toBe(2);
        // @ts-ignore
        expect(state.dailyChallenges).toHaveLength(1);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
    });

    it('fetchStats handles errors', async () => {
        // @ts-ignore
        gamificationApi.getStats.mockRejectedValue(new Error('API Error'));

        await useGamificationStore.getState().fetchStats();

        const state = useGamificationStore.getState();
        expect(state.error).toBe('Failed to fetch stats');
        expect(state.isLoading).toBe(false);
    });

    it('awardXP updates state optimistically', async () => {
        // @ts-ignore
        gamificationApi.awardXP.mockResolvedValue({ success: true, level: 1, xp: 60 });

        const promise = useGamificationStore.getState().awardXP(50, 'test');

        // Check optimistic update immediately
        const stateOptimistic = useGamificationStore.getState();
        expect(stateOptimistic.xp).toBe(50);
        expect(stateOptimistic.latestAward).toEqual({ amount: 50, source: 'test' });

        await promise;

        // Check final state (mock response didn't change level)
        const stateFinal = useGamificationStore.getState();
        expect(stateFinal.level).toBe(1);
    });

    it('awardXP reverts optimistic update on failure', async () => {
        // @ts-ignore
        gamificationApi.awardXP.mockRejectedValue(new Error('Network Error'));

        // Set initial XP
        useGamificationStore.setState({ xp: 100 });

        await useGamificationStore.getState().awardXP(50, 'test');

        const state = useGamificationStore.getState();
        expect(state.xp).toBe(100); // Reverted to 100
        expect(state.latestAward).toBeNull(); // Cleared
    });
});
