import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";
import toast from "react-hot-toast";
import { FriendRequest, Activity, UserProfile } from "@/types";
import { getErrorMessage } from "@/utils/errors";
import { extractData } from "@/utils/apiAdapter"; // Import the adapter

// Re-export User as UserProfile for backwards compatibility
export type User = UserProfile;

interface SocialStore {
    users: UserProfile[];
    friends: string[]; // List of friend IDs
    friendRequests: FriendRequest[];
    activity: Activity[];
    isLoading: boolean;
    error: string | null;

    fetchUsers: () => Promise<void>;
    fetchFriends: () => Promise<void>;
    fetchFriendRequests: () => Promise<void>;
    fetchFriendActivity: () => Promise<void>;

    sendFriendRequest: (friendId: string) => Promise<void>;
    acceptFriendRequest: (requestId: string) => Promise<void>;
    rejectFriendRequest: (requestId: string) => Promise<void>;
    removeFriend: (friendId: string) => Promise<void>;
}

export const useSocialStore = create<SocialStore>((set, get) => ({
    users: [],
    friends: [],
    friendRequests: [],
    activity: [],
    isLoading: false,
    error: null,

    fetchUsers: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get("/users");
            set({ users: extractData<UserProfile[]>(response.data) }); // Use extractData
        } catch (error) {
            set({ error: getErrorMessage(error) });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchFriends: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get("/social/friends");
            set({ friends: response.data.data });
        } catch (error) {
            set({ error: getErrorMessage(error) });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchFriendRequests: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get("/social/friend-requests");
            set({ friendRequests: response.data.data });
        } catch (error) {
            set({ error: getErrorMessage(error) });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchFriendActivity: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get("/social/activity");
            set({ activity: response.data.data });
        } catch (error) {
            set({ error: getErrorMessage(error) });
        } finally {
            set({ isLoading: false });
        }
    },

    sendFriendRequest: async (friendId) => {
        try {
            await axiosInstance.post("/social/friend-request", { friendId });
            toast.success("Friend request sent");
        } catch (error) {
            toast.error(getErrorMessage(error, "Failed to send request"));
        }
    },

    acceptFriendRequest: async (requestId) => {
        try {
            await axiosInstance.put(`/social/friend-request/${requestId}/accept`);
            toast.success("Friend request accepted");
            get().fetchFriendRequests();
            get().fetchFriends();
        } catch (error) {
            toast.error(getErrorMessage(error, "Failed to accept request"));
        }
    },

    rejectFriendRequest: async (requestId) => {
        try {
            await axiosInstance.put(`/social/friend-request/${requestId}/reject`);
            toast.success("Friend request rejected");
            get().fetchFriendRequests();
        } catch (error) {
            toast.error(getErrorMessage(error, "Failed to reject request"));
        }
    },

    removeFriend: async (friendId) => {
        try {
            await axiosInstance.delete(`/social/friends/${friendId}`);
            toast.success("Friend removed");
            get().fetchFriends();
        } catch (error) {
            toast.error(getErrorMessage(error, "Failed to remove friend"));
        }
    },
}));
