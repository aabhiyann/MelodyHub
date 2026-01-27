import { create } from "zustand";
import { socket } from "@/lib/socket";
import { axiosInstance } from "@/lib/axios";

interface Message {
    _id: string;
    senderId: string;
    receiverId: string;
    content: string;
    createdAt: string;
}

interface ChatStore {
    onlineUsers: string[];
    userActivities: Map<string, string>;
    messages: Message[];
    isLoading: boolean;
    error: string | null;

    // Actions
    connectSocket: (userId: string) => void;
    disconnectSocket: () => void;
    sendMessage: (receiverId: string, content: string) => Promise<void>;
    updateActivity: (activity: string) => void;
    fetchMessages: (userId: string) => Promise<void>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
    onlineUsers: [],
    userActivities: new Map(),
    messages: [],
    isLoading: false,
    error: null,

    connectSocket: (userId: string) => {
        if (!userId) return;

        socket.auth = { userId };
        socket.connect();

        socket.emit("user_connected", userId);

        socket.on("users_online", (users: string[]) => {
            set({ onlineUsers: users });
        });

        socket.on("activities", (activities: [string, string][]) => {
            set({ userActivities: new Map(activities) });
        });

        socket.on("activity_updated", ({ userId, activity }: { userId: string; activity: string }) => {
            const newActivities = new Map(get().userActivities);
            newActivities.set(userId, activity);
            set({ userActivities: newActivities });
        });

        socket.on("receive_message", (message: Message) => {
            set((state) => ({ messages: [...state.messages, message] }));
        });

        socket.on("message_sent", (message: Message) => {
            set((state) => ({ messages: [...state.messages, message] }));
        });

        socket.on("user_disconnected", (disconnectedId: string) => {
            set((state) => ({
                onlineUsers: state.onlineUsers.filter(id => id !== disconnectedId)
            }));
            const newActivities = new Map(get().userActivities);
            newActivities.delete(disconnectedId);
            set({ userActivities: newActivities });
        });
    },

    disconnectSocket: () => {
        if (socket.connected) {
            socket.disconnect();
            set({ onlineUsers: [], userActivities: new Map() });
        }
    },

    sendMessage: async (receiverId: string, content: string) => {
        const senderId = (socket.auth as any)?.userId;
        if (!senderId) return;

        socket.emit("send_message", { senderId, receiverId, content });
    },

    updateActivity: (activity: string) => {
        const userId = (socket.auth as any)?.userId;
        if (userId) {
            socket.emit("update_activity", { userId, activity });
        }
    },

    fetchMessages: async (userId: string) => {
        set({ isLoading: true });
        try {
            const response = await axiosInstance.get(`/chat/${userId}`);
            set({ messages: response.data });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    }
}));
