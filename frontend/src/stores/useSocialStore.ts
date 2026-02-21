import { create } from "zustand";
import { FriendRequest, Activity, UserProfile } from "@/types";
import { getErrorMessage } from "@/utils/errors";
import { socialApi } from "@/lib/api/social";
import toast from "react-hot-toast";

// Re-export User as UserProfile for backwards compatibility
export type User = UserProfile;

interface SocialState {
    users: UserProfile[];
    friends: string[]; // List of friend IDs
    friendRequests: FriendRequest[];
    activity: Activity[];
    isLoading: boolean;
    error: string | null;
}

interface SocialActions {
    fetchUsers: () => Promise<void>;
    fetchFriends: () => Promise<void>;
    fetchFriendRequests: () => Promise<void>;
    fetchFriendActivity: () => Promise<void>;

    sendFriendRequest: (friendId: string) => Promise<void>;
    acceptFriendRequest: (requestId: string) => Promise<void>;
    rejectFriendRequest: (requestId: string) => Promise<void>;
    cancelFriendRequest: (requestId: string) => Promise<void>;
    removeFriend: (friendId: string) => Promise<void>;

    // Helper to check if a user is a friend
    isFriend: (userId: string) => boolean;
}

type SocialStore = SocialState & SocialActions;

const initialState: SocialState = {
    users: [],
    friends: [],
    friendRequests: [],
    activity: [],
    isLoading: false,
    error: null,
};

export const useSocialStore = create<SocialStore>((set, get) => ({
    ...initialState,

    fetchUsers: async () => {
        set({ isLoading: true, error: null });
        try {
            const rawUsers = await socialApi.getUsers();
            // Deduplicate by clerkId AND fullName — backend has genuine duplicate documents
            const seenClerkIds = new Set<string>();
            const seenNames = new Set<string>();
            const users = rawUsers.filter(u => {
                if (u.clerkId && seenClerkIds.has(u.clerkId)) return false;
                if (u.fullName && seenNames.has(u.fullName)) return false;
                if (u.clerkId) seenClerkIds.add(u.clerkId);
                if (u.fullName) seenNames.add(u.fullName);
                return true;
            });
            set({ users });
        } catch (error) {
            set({ error: getErrorMessage(error) });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchFriends: async () => {
        set({ isLoading: true, error: null });
        try {
            const friends = await socialApi.getFriends();
            set({ friends });
        } catch (error) {
            set({ error: getErrorMessage(error) });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchFriendRequests: async () => {
        set({ isLoading: true, error: null });
        try {
            const friendRequests = await socialApi.getFriendRequests();
            set({ friendRequests });
        } catch (error) {
            set({ error: getErrorMessage(error) });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchFriendActivity: async () => {
        set({ isLoading: true, error: null });
        try {
            const activity = await socialApi.getActivity();
            set({ activity });
        } catch (error) {
            set({ error: getErrorMessage(error) });
        } finally {
            set({ isLoading: false });
        }
    },

    sendFriendRequest: async (friendId: string) => {
        // Optimistic update - immediately add to pending state
        // Find the user in the users list to create a proper UserProfile object
        const friendUser = get().users.find(u => u.clerkId === friendId);

        const tempRequest: FriendRequest = {
            _id: `temp-${friendId}`,
            senderId: friendUser || {
                _id: friendId,
                clerkId: friendId,
                fullName: 'Loading...',
                imageUrl: ''
            } as UserProfile,
            to: friendId,
            status: 'pending',
            createdAt: new Date().toISOString(),
        };

        set(state => ({
            friendRequests: [...state.friendRequests, tempRequest],
            isLoading: true,
            error: null
        }));

        try {
            await socialApi.sendFriendRequest(friendId);
            // Refetch to get the actual friend request with correct IDs
            await get().fetchFriendRequests();

            // Success toast
            toast.success("Friend request sent!");
        } catch (error) {
            // Rollback optimistic update on error
            set(state => ({
                friendRequests: state.friendRequests.filter(req => req._id !== tempRequest._id),
                error: getErrorMessage(error)
            }));

            // Error toast
            toast.error("Failed to send friend request");
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    acceptFriendRequest: async (requestId: string) => {
        set({ isLoading: true, error: null });
        try {
            await socialApi.acceptFriendRequest(requestId);
            // Could filter out request from state immediately
            set(state => ({
                friendRequests: state.friendRequests.filter(req => req._id !== requestId)
            }));
            // Ideally we'd also add to friends list, but we might need the ID from response
            await get().fetchFriends();
            await get().fetchFriendActivity();
        } catch (error) {
            set({ error: getErrorMessage(error) });
        } finally {
            set({ isLoading: false });
        }
    },

    rejectFriendRequest: async (requestId: string) => {
        set({ isLoading: true, error: null });
        try {
            await socialApi.rejectFriendRequest(requestId);
            set(state => ({
                friendRequests: state.friendRequests.filter(req => req._id !== requestId)
            }));
        } catch (error) {
            set({ error: getErrorMessage(error) });
        } finally {
            set({ isLoading: false });
        }
    },

    cancelFriendRequest: async (requestId: string) => {
        // Optimistic update - immediately remove from state
        set(state => ({
            friendRequests: state.friendRequests.filter(req => req._id !== requestId && req._id !== `temp-${requestId}`),
            isLoading: true,
            error: null
        }));

        try {
            await socialApi.cancelFriendRequest(requestId);
            toast.success("Friend request cancelled");
        } catch (error) {
            // Refetch on error to restore state
            await get().fetchFriendRequests();
            set({ error: getErrorMessage(error) });
            toast.error("Failed to cancel request");
        } finally {
            set({ isLoading: false });
        }
    },

    removeFriend: async (friendId: string) => {
        set({ isLoading: true, error: null });
        try {
            await socialApi.removeFriend(friendId);
            set(state => ({
                friends: state.friends.filter(id => id !== friendId)
            }));
        } catch (error) {
            set({ error: getErrorMessage(error) });
        } finally {
            set({ isLoading: false });
        }
    },

    isFriend: (userId: string) => {
        return get().friends.includes(userId);
    }
}));
