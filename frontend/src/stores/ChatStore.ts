import { io, Socket } from "socket.io-client";
import { create } from "zustand";
import { useAuthStore } from "./AuthStore";
import { axiosInstance } from "@/lib/axios";
import { Message, User } from "@/types";

interface ChatStore {
	messages: Message[];
	socket: Socket | null;
	onlineUsers: Set<string>;
	activities: Map<string, string>;
	users: User[];
	selectedUser: User | null;
	isLoading: boolean;

	initSocket: (userId: string) => void;
	disconnectSocket: () => void;
	sendMessage: (receiverId: string, content: string) => void;
	fetchUsers: () => Promise<void>;
	fetchMessages: (userId: string) => Promise<void>;
	setSelectedUser: (user: User | null) => void;
}

const BASE_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || (import.meta.env.MODE === "development" ? "http://localhost:5001" : "/");

export const useChatStore = create<ChatStore>((set, get) => ({
	messages: [],
	socket: null,
	onlineUsers: new Set(),
	activities: new Map(),
	users: [],
	selectedUser: null,
	isLoading: false,

	fetchUsers: async () => {
		set({ isLoading: true });
		try {
			const response = await axiosInstance.get("/users");
			set({ users: response.data, isLoading: false });
		} catch (error) {
			console.error("Failed to fetch users:", error);
			set({ isLoading: false });
		}
	},

	fetchMessages: async (userId: string) => {
		set({ isLoading: true });
		try {
			const response = await axiosInstance.get(`/messages/${userId}`);
			set({ messages: response.data, isLoading: false });
		} catch (error) {
			console.error("Failed to fetch messages:", error);
			set({ isLoading: false });
		}
	},

	setSelectedUser: (user: User | null) => {
		set({ selectedUser: user, messages: [] });
		if (user) {
			get().fetchMessages(user._id);
		}
	},

	initSocket: (userId: string) => {
		const socket = io(BASE_URL, {
			auth: { userId },
		});

		socket.on("connect", () => {
			console.log("Socket connected", socket.id);
		});

		socket.on("receive_message", (message) => {
			set((state) => ({
				messages: [...state.messages, message],
			}));
		});

		socket.on("message_sent", (message) => {
			set((state) => ({
				messages: [...state.messages, message],
			}));
		});

		socket.on("activity_updated", ({ userId, activity }) => {
			set((state) => {
				const newActivities = new Map(state.activities);
				newActivities.set(userId, activity);
				return { activities: newActivities };
			});
		});

		socket.on("users_online", (users: string[]) => {
			set({ onlineUsers: new Set(users) });
		});

		socket.on("activities", (activities: [string, string][]) => {
			set({ activities: new Map(activities) });
		});

		socket.on("user_connected", (userId) => {
			set((state) => {
				const newOnlineUsers = new Set(state.onlineUsers);
				newOnlineUsers.add(userId);
				return { onlineUsers: newOnlineUsers };
			});
		});

		socket.on("user_disconnected", (userId) => {
			set((state) => {
				const newOnlineUsers = new Set(state.onlineUsers);
				newOnlineUsers.delete(userId);
				return { onlineUsers: newOnlineUsers };
			});
		});

		set({ socket });
	},

	disconnectSocket: () => {
		const socket = get().socket;
		if (socket) socket.disconnect();
		set({ socket: null });
	},

	sendMessage: (receiverId: string, content: string) => {
		const socket = get().socket;
		if (!socket) return;

		const senderId = useAuthStore.getState().authUser?.clerkId;
		if (!senderId) return;

		socket.emit("send_message", { senderId, receiverId, content });
	},
}));
