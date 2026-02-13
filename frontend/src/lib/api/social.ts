import { axiosInstance } from "../axios";
import { FriendRequest, Activity, UserProfile } from "@/types";
import { extractData } from "@/utils/apiAdapter";

export const socialApi = {
    getUsers: async (): Promise<UserProfile[]> => {
        constresponse = await axiosInstance.get("/users");
        return extractData<UserProfile[]>(constresponse.data);
    },

    getFriends: async (): Promise<string[]> => {
        const response = await axiosInstance.get("/social/friends");
        return response.data.data;
    },

    getFriendRequests: async (): Promise<FriendRequest[]> => {
        const response = await axiosInstance.get("/social/friend-requests");
        return response.data.data;
    },

    getActivity: async (): Promise<Activity[]> => {
        const response = await axiosInstance.get("/social/activity");
        return response.data.data;
    },

    sendFriendRequest: async (friendId: string): Promise<void> => {
        await axiosInstance.post("/social/friend-request", { friendId });
    },

    acceptFriendRequest: async (requestId: string): Promise<void> => {
        await axiosInstance.post("/social/friend-request/accept", { requestId });
    },

    rejectFriendRequest: async (requestId: string): Promise<void> => {
        await axiosInstance.post("/social/friend-request/reject", { requestId });
    },

    removeFriend: async (friendId: string): Promise<void> => {
        await axiosInstance.delete(`/social/friend/${friendId}`);
    }
};
