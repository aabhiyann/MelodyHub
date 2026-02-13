import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useSocialStore } from '../useSocialStore';
import { socialApi } from '@/lib/api/social';

// Mock the API service
vi.mock('@/lib/api/social', () => ({
    socialApi: {
        getUsers: vi.fn(),
        getFriends: vi.fn(),
        getFriendRequests: vi.fn(),
        getActivity: vi.fn(),
        sendFriendRequest: vi.fn(),
        acceptFriendRequest: vi.fn(),
        rejectFriendRequest: vi.fn(),
        removeFriend: vi.fn()
    }
}));

describe('useSocialStore', () => {
    beforeEach(() => {
        useSocialStore.setState({
            users: [],
            friends: [],
            friendRequests: [],
            activity: [],
            isLoading: false,
            error: null
        });
        vi.clearAllMocks();
    });

    it('initializes correctly', () => {
        const state = useSocialStore.getState();
        expect(state.users).toEqual([]);
        expect(state.isLoading).toBe(false);
    });

    it('fetchFriends updates state on success', async () => {
        const mockFriends = ['user1', 'user2'];
        // @ts-ignore
        socialApi.getFriends.mockResolvedValue(mockFriends);

        await useSocialStore.getState().fetchFriends();

        const state = useSocialStore.getState();
        expect(state.friends).toEqual(mockFriends);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
    });

    it('fetchFriendRequests updates state on success', async () => {
        const mockRequests = [{ _id: 'req1', from: 'user1' }];
        // @ts-ignore
        socialApi.getFriendRequests.mockResolvedValue(mockRequests);

        await useSocialStore.getState().fetchFriendRequests();

        const state = useSocialStore.getState();
        expect(state.friendRequests).toEqual(mockRequests);
    });

    it('sendFriendRequest handles success', async () => {
        // @ts-ignore
        socialApi.sendFriendRequest.mockResolvedValue();

        await useSocialStore.getState().sendFriendRequest('friend1');

        const state = useSocialStore.getState();
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
        expect(socialApi.sendFriendRequest).toHaveBeenCalledWith('friend1');
    });

    it('sendFriendRequest handles error', async () => {
        // @ts-ignore
        socialApi.sendFriendRequest.mockRejectedValue(new Error('Failed'));

        await expect(useSocialStore.getState().sendFriendRequest('friend1')).rejects.toThrow();

        const state = useSocialStore.getState();
        expect(state.error).toBe('Failed');
        expect(state.isLoading).toBe(false);
    });

    it('acceptFriendRequest updates state optimistically', async () => {
        // Setup initial state with a request
        useSocialStore.setState({
            friendRequests: [{ _id: 'req1', from: 'user1', status: 'pending' } as any]
        });

        // @ts-ignore
        socialApi.acceptFriendRequest.mockResolvedValue();
        // @ts-ignore
        socialApi.getFriends.mockResolvedValue(['user1']); // Subsequent fetch

        await useSocialStore.getState().acceptFriendRequest('req1');

        const state = useSocialStore.getState();
        // Request removed
        expect(state.friendRequests).toHaveLength(0);
        expect(socialApi.acceptFriendRequest).toHaveBeenCalledWith('req1');
    });
});
