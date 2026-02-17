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
        cancelFriendRequest: vi.fn(),
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
        socialApi.getFriends.mockResolvedValue(['user1']);

        await useSocialStore.getState().acceptFriendRequest('req1');

        const state = useSocialStore.getState();
        expect(state.friendRequests).toHaveLength(0);
        expect(socialApi.acceptFriendRequest).toHaveBeenCalledWith('req1');
    });

    it('rejectFriendRequest removes request from state', async () => {
        useSocialStore.setState({
            friendRequests: [{ _id: 'req1', from: 'user1', status: 'pending' } as any]
        });
        // @ts-ignore
        socialApi.rejectFriendRequest.mockResolvedValue();

        await useSocialStore.getState().rejectFriendRequest('req1');

        const state = useSocialStore.getState();
        expect(state.friendRequests).toHaveLength(0);
        expect(socialApi.rejectFriendRequest).toHaveBeenCalledWith('req1');
    });

    it('cancelFriendRequest removes request optimistically', async () => {
        useSocialStore.setState({
            friendRequests: [{ _id: 'req1', to: 'user2', status: 'pending' } as any]
        });
        // @ts-ignore
        socialApi.cancelFriendRequest.mockResolvedValue();

        await useSocialStore.getState().cancelFriendRequest('req1');

        const state = useSocialStore.getState();
        expect(state.friendRequests).toHaveLength(0);
        expect(socialApi.cancelFriendRequest).toHaveBeenCalledWith('req1');
    });

    it('removeFriend removes from friends list', async () => {
        useSocialStore.setState({ friends: ['user1', 'user2'] });
        // @ts-ignore
        socialApi.removeFriend.mockResolvedValue();

        await useSocialStore.getState().removeFriend('user1');

        const state = useSocialStore.getState();
        expect(state.friends).toEqual(['user2']);
        expect(socialApi.removeFriend).toHaveBeenCalledWith('user1');
    });
});
