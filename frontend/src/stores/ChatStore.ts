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
	typingUsers: Set<string>; // Set of userIds who are typing

	// Friend System
	friends: User[];
	friendRequests: any[];
	searchResult: User[];

	// Actions
	initSocket: (userId: string) => void;
	disconnectSocket: () => void;
	sendMessage: (receiverId: string, content: string) => void;
	sendTyping: (receiverId: string) => void;
	fetchUsers: () => Promise<void>;
	fetchMessages: (userId: string) => Promise<void>;
	setSelectedUser: (user: User | null) => void;

	// Friend Actions
	fetchFriends: () => Promise<void>;
	fetchFriendRequests: () => Promise<void>;
	sendFriendRequest: (receiverId: string) => Promise<void>;
	acceptFriendRequest: (requestId: string) => Promise<void>;
	searchUsers: (query: string) => Promise<void>;
	updateActivity: (activity: string) => void;
}

const BASE_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || (import.meta.env.MODE === "development" ? "http://localhost:5001" : "/");

// Map to store timeouts for clearing typing status
const typingTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

export const useChatStore = create<ChatStore>((set, get) => ({
	messages: [],
	socket: null,
	onlineUsers: new Set(),
	activities: new Map(),
	users: [],
	selectedUser: null,
	isLoading: false,
	typingUsers: new Set(),
	friends: [],
	friendRequests: [],
	searchResult: [],

	// Friends Implementation
	fetchFriends: async () => {
		set({ isLoading: true });
		try {
			const response = await axiosInstance.get("/friends");
			set({ friends: response.data, isLoading: false });
		} catch (error) {
			console.error("Failed to fetch friends:", error);
			set({ isLoading: false });
		}
	},

	fetchFriendRequests: async () => {
		set({ isLoading: true });
		try {
			const response = await axiosInstance.get("/friends/requests");
			set({ friendRequests: response.data, isLoading: false });
		} catch (error) {
			console.error("Failed to fetch requests:", error);
			set({ isLoading: false });
		}
	},

	sendFriendRequest: async (receiverId: string) => {
		try {
			await axiosInstance.post("/friends/request", { receiverId });
			import("react-hot-toast").then(({ toast }) => toast.success("Friend request sent"));
		} catch (error: any) {
			import("react-hot-toast").then(({ toast }) => toast.error(error.response?.data?.message || "Failed to send request"));
		}
	},

	acceptFriendRequest: async (requestId: string) => {
		try {
			await axiosInstance.post("/friends/accept", { requestId });
			import("react-hot-toast").then(({ toast }) => toast.success("Friend request accepted"));
			get().fetchFriends();
			get().fetchFriendRequests();
		} catch (error: any) {
			import("react-hot-toast").then(({ toast }) => toast.error(error.response?.data?.message || "Failed to accept request"));
		}
	},

	searchUsers: async (query: string) => {
		if (!query) return;
		try {
			// We can reuse the getAllUsers but filter locally or add search endpoint
			// For now, let's just fetch all and filter clientside for simplicity or implementation 
			// Ideally we should have a search endpoint.
			// Let's implement client side filtering on the 'users' list if we have it, 
			// but 'users' list from /users endpoint was the "all users" list we are moving away from.
			// So we actually need a dedicated search endpoint or use the ALL users payload if small.
			// Let's assume we use the existing /users endpoint but treat it as search for now.
			set({ isLoading: true });
			const response = await axiosInstance.get("/users");
			const allUsers = response.data;
			const filtered = allUsers.filter((user: User) =>
				user.fullName.toLowerCase().includes(query.toLowerCase())
			);
			set({ searchResult: filtered, isLoading: false });
		} catch (error) {
			console.error(error);
			set({ isLoading: false });
		}
	},

	fetchUsers: async () => {
		set({ isLoading: true });
		try {
			const response = await axiosInstance.get("/users");
			set({ users: response.data, isLoading: false });
		} catch (error) {
			console.error("Failed to fetch users:", error);
			import("react-hot-toast").then(({ toast }) => toast.error("Failed to load friends"));
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
			get().fetchMessages(user.clerkId);
		}
	},

	initSocket: (userId: string) => {
		const socket = io(BASE_URL, {
			auth: { userId },
		});

		socket.on("connect", () => {
			console.log("Socket connected", socket.id);
			socket.emit("user_connected", userId);
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

		socket.on("user_typing", ({ senderId }) => {
			set((state) => {
				const newTypingUsers = new Set(state.typingUsers);
				newTypingUsers.add(senderId);

				// Clear existing timeout if any
				if (typingTimeouts.has(senderId)) {
					clearTimeout(typingTimeouts.get(senderId));
				}

				// Set new timeout to remove user after 3 seconds
				const timeout = setTimeout(() => {
					set((state) => {
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

		// Optimistic UI Update
		const tempMessage: Message = {
			_id: `temp-${Date.now()}`,
			senderId,
			receiverId,
			content,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		set((state) => ({
			messages: [...state.messages, tempMessage],
		}));

		socket.emit("send_message", { senderId, receiverId, content });
	},

	sendTyping: (receiverId: string) => {
		const socket = get().socket;
		if (!socket) return;
		const senderId = useAuthStore.getState().authUser?.clerkId;
		if (!senderId) return;
		socket.emit("typing", { senderId, receiverId });
	},

	updateActivity: (activity: string) => {
		const socket = get().socket;
		if (!socket) return;
		const userId = useAuthStore.getState().authUser?.clerkId;
		if (!userId) return;
		socket.emit("update_activity", { userId, activity });
	},
}));
