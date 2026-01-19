import { io, Socket } from "socket.io-client";
import { create } from "zustand";
import { useAuthStore } from "./AuthStore";

interface ChatStore {
	messages: any[];
	socket: Socket | null;
	onlineUsers: Set<string>;
	activities: Map<string, string>;
	initSocket: (userId: string) => void;
	disconnectSocket: () => void;
	sendMessage: (receiverId: string, content: string) => void;
}

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

export const ChatStore = create<ChatStore>((set, get) => ({
	messages: [],
	socket: null,
	onlineUsers: new Set(),
	activities: new Map(),

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
