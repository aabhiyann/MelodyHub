import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAnalyticsStore } from '../AnalyticsStore';
import { analyticsApi } from '@/lib/api/analytics';

// Mock the API service
vi.mock('@/lib/api/analytics', () => ({
    analyticsApi: {
        getUserStats: vi.fn(),
    }
}));

describe('useAnalyticsStore', () => {
    beforeEach(() => {
        useAnalyticsStore.setState({
            stats: null,
            isLoading: false,
            error: null
        });
        vi.clearAllMocks();
    });

    it('initializes correctly', () => {
        const state = useAnalyticsStore.getState();
        expect(state.stats).toBeNull();
        expect(state.isLoading).toBe(false);
    });

    it('fetchUserStats updates state', async () => {
        const mockStats = { totalPlays: 100 };
        // @ts-ignore
        analyticsApi.getUserStats.mockResolvedValue(mockStats);

        await useAnalyticsStore.getState().fetchUserStats();

        const state = useAnalyticsStore.getState();
        expect(state.stats).toEqual(mockStats);
        expect(state.isLoading).toBe(false);
    });

    it('fetchUserStats handles error', async () => {
        // @ts-ignore
        analyticsApi.getUserStats.mockRejectedValue(new Error('Failed'));

        await useAnalyticsStore.getState().fetchUserStats();

        const state = useAnalyticsStore.getState();
        expect(state.error).toBe('Failed to fetch analytics');
        expect(state.isLoading).toBe(false);
    });
});
