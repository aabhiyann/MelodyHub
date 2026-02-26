import { io, Socket } from "socket.io-client";
import { StateCreator } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { Message, User } from "@/types";
import { getErrorMessage } from "@/utils/errors";
import toast from "react-hot-toast";
import type { ChatStore } from "@/stores/ChatStore";

const BASE_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || (import.meta.env.MODE === "development" ? "http://localhost:5001" : "/");

// Map to store timeouts for clearing typing status
const typingTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

export class ChatManager {
    private set: Parameters<StateCreator<ChatStore>>[0];
    private get: Parameters<StateCreator<ChatStore>>[1];
    private socket: Socket | null = null;
    private userId: string | null = null;

    constructor(
        set: Parameters<StateCreator<ChatStore>>[0],
        get: Parameters<StateCreator<ChatStore>>[1]
    ) {
        this.set = set;
        this.get = get;
    }

    initSocket(userId: string) {
        if (this.socket?.connected) return;

        this.userId = userId;
        const socket = io(BASE_URL, {
            auth: { userId },
        });

        this.socket = socket;

        socket.on("connect", () => {
            console.log("Socket connected", socket.id);
            socket.emit("user_connected", userId);
        });

        socket.on("connect_error", (error) => {
            console.error("Socket connection error:", (error instanceof Error ? error.message : "Unknown error"));
        });

        socket.on("error", (error) => {
            console.error("Socket error:", error);
        });

        socket.on("receive_message", (message: Message) => {
            this.set((state: ChatStore) => ({
                messages: [...state.messages, message],
            }));
        });

        socket.on("message_sent", (message: Message) => {
            // Replace the optimistic temp message with the server-confirmed one
            this.set((state: ChatStore) => {
                const filteredMessages = state.messages.filter(
                    (m: Message) => !m._id.startsWith("temp-") || m.content !== message.content
                );
                return { messages: [...filteredMessages, message] };
            });
        });

        socket.on("activity_updated", ({ userId, activity }: { userId: string; activity: string }) => {
            this.set((state: ChatStore) => {
                const newActivities = new Map(state.activities);
                newActivities.set(userId, activity);
                return { activities: newActivities };
            });
        });

        socket.on("users_online", (users: string[]) => {
            this.set({ onlineUsers: new Set(users) });
        });

        socket.on("activities", (activities: [string, string][]) => {
            this.set({ activities: new Map(activities) });
        });

        socket.on("user_connected", (userId: string) => {
            this.set((state: ChatStore) => {
                const newOnlineUsers = new Set(state.onlineUsers);
                newOnlineUsers.add(userId);
                return { onlineUsers: newOnlineUsers };
            });
        });

        socket.on("user_disconnected", (userId: string) => {
            this.set((state: ChatStore) => {
                const newOnlineUsers = new Set(state.onlineUsers);
                newOnlineUsers.delete(userId);
                return { onlineUsers: newOnlineUsers };
            });
        });

        socket.on("user_typing", ({ senderId }: { senderId: string }) => {
            this.set((state: ChatStore) => {
                const newTypingUsers = new Set(state.typingUsers);
                newTypingUsers.add(senderId);

                // Clear existing timeout if any
                if (typingTimeouts.has(senderId)) {
                    clearTimeout(typingTimeouts.get(senderId));
                }

                // Set new timeout to remove user after 3 seconds
                const timeout = setTimeout(() => {
                    this.set((state: ChatStore) => {
                        const current = new Set(state.typingUsers);
                        current.delete(senderId);
                        typingTimeouts.delete(senderId);
                        return { typingUsers: current };
                    });
                }, 3000);

                typingTimeouts.set(senderId, timeout);

                return { typingUsers: newTypingUsers };
            });
        });

        socket.on("user_stop_typing", ({ senderId }: { senderId: string }) => {
            this.set((state: ChatStore) => {
                const newTypingUsers = new Set(state.typingUsers);
                newTypingUsers.delete(senderId);

                if (typingTimeouts.has(senderId)) {
                    clearTimeout(typingTimeouts.get(senderId));
                    typingTimeouts.delete(senderId);
                }

                return { typingUsers: newTypingUsers };
            });
        });

        // Friend Request Events
        socket.on("friend_request_accepted", () => {
            this.fetchFriends();
            this.fetchFriendRequests();
        });

        socket.on("new_notification", (notification: { type?: string; message?: string; title?: string; sender?: { _id: string; username: string }; newRequest?: unknown }) => {
            if (notification?.type === "FRIEND_REQUEST") {
                this.fetchFriendRequests();
            }
        });

        // Listen for Real-time Song Listeners events
        socket.on("song_listeners", ({ songId, count }: { songId: string; count: number }) => {
            // Only update if it matches current song? 
            // Actually, we trust the backend to only send relevant updates 
            // (since we join specific room).
            // But we should verify we are playing that song to be safe?
            // PlayerStore is global.
            // Import usePlayerStore inside the callback to avoid circular dep issues at module level?
            // "usePlayerStore" is exported from a store file.
            // Let's assume we can import it.
            import("@/stores/PlayerStore").then(({ usePlayerStore }) => {
                const currentSongId = usePlayerStore.getState().currentSong?._id;
                if (currentSongId === songId) {
                    usePlayerStore.getState().setActiveListeners(count);
                }
            });
        });

        this.set({ socket });
    }

    disconnectSocket() {
        const socket = this.get().socket;
        if (socket) {
            socket.disconnect();
            this.socket = null;
        }
        this.set({ socket: null });
    }

    sendMessage(receiverId: string, content: string) {
        if (!this.socket || !this.socket.connected) {
            toast.error("Chat not connected. Reconnecting...");
            // Attempt reconnection
            if (this.userId) this.initSocket(this.userId);
            return;
        }

        const senderId = this.userId;
        if (!senderId) return;

        // Optimistic UI Update
        const tempMessage: Message = {
            _id: `temp-${Date.now()}`,
            senderId,
            receiverId,
            content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        this.set((state: ChatStore) => ({
            messages: [...state.messages, tempMessage],
        }));

        this.socket.emit("send_message", { senderId, receiverId, content });
    }

    sendTyping(receiverId: string) {
        if (!this.socket) return;
        const senderId = this.userId;
        if (!senderId) return;
        this.socket.emit("typing", { senderId, receiverId });
    }

    sendStopTyping(receiverId: string) {
        if (!this.socket) return;
        const senderId = this.userId;
        if (!senderId) return;
        this.socket.emit("stop_typing", { senderId, receiverId });
    }

    updateActivity(activity: string) {
        if (!this.socket) return;
        const userId = this.userId;
        if (!userId) return;
        this.socket.emit("update_activity", { userId, activity });
    }

    // Friend Features
    async fetchFriends() {
        this.set({ isLoading: true });
        try {
            const response = await axiosInstance.get("/friends");
            this.set({ friends: response.data, isLoading: false });
        } catch (error) {
            console.error("Failed to fetch friends:", error);
            this.set({ isLoading: false });
        }
    }

    async fetchFriendRequests() {
        this.set({ isLoading: true });
        try {
            const response = await axiosInstance.get("/friends/requests");
            this.set({ friendRequests: response.data, isLoading: false });
        } catch (error) {
            console.error("Failed to fetch requests:", error);
            this.set({ isLoading: false });
        }
    }

    async sendFriendRequest(receiverId: string) {
        try {
            await axiosInstance.post("/friends/request", { receiverId });
            toast.success("Friend request sent");
        } catch (error) {
            const errorMsg = getErrorMessage(error, "Failed to send request");
            toast.error(errorMsg);
        }
    }

    async acceptFriendRequest(requestId: string) {
        try {
            await axiosInstance.post("/friends/accept", { requestId });
            toast.success("Friend request accepted");
            this.fetchFriends();
            this.fetchFriendRequests();
        } catch (error) {
            const errorMsg = getErrorMessage(error, "Failed to accept request");
            toast.error(errorMsg);
        }
    }

    async searchUsers(query: string) {
        if (!query) return;
        try {
            this.set({ isLoading: true });
            // Using existing /users endpoint for now
            const response = await axiosInstance.get("/users");
            const allUsers = Array.isArray(response.data) ? response.data : (Array.isArray(response.data?.data) ? response.data.data : []);
            const filtered = allUsers.filter((user: User) =>
                user.fullName.toLowerCase().includes(query.toLowerCase())
            );
            this.set({ searchResult: filtered, isLoading: false });
        } catch (error) {
            console.error(error);
            this.set({ isLoading: false });
        }
    }

    async fetchUsers() {
        this.set({ isLoading: true });
        try {
            const response = await axiosInstance.get("/users");
            const data = Array.isArray(response.data) ? response.data : (Array.isArray(response.data?.data) ? response.data.data : []);
            this.set({ users: data, isLoading: false });
        } catch (error) {
            console.error("Failed to fetch users:", error);
            toast.error("Failed to load users");
            this.set({ users: [], isLoading: false });
        }
    }

    async fetchMessages(userId: string) {
        this.set({ isLoading: true });
        try {
            const response = await axiosInstance.get(`/messages/${userId}`);
            const data = Array.isArray(response.data) ? response.data : (Array.isArray(response.data?.data) ? response.data.data : []);
            this.set({ messages: data, isLoading: false });
        } catch (error) {
            console.error("Failed to fetch messages:", error);
            this.set({ messages: [], isLoading: false });
        }
    }

    setSelectedUser(user: User | null) {
        this.set({ selectedUser: user, messages: [] });
        if (user) {
            this.fetchMessages(user.clerkId);
        }
    }
}
