import { io, Socket } from "socket.io-client";
import { axiosInstance } from "@/lib/axios";
import {
	Message,
	User,
	ClientToServerEvents,
	ServerToClientEvents,
	SocketAuth,
} from "@/types";
import { StateCreator } from "zustand";

const baseURL = import.meta.env.VITE_API_URL;
/**
 * ChatManager handles all socket and async chat-related operations.
 */
export class ChatManager {
	private socket: Socket<ServerToClientEvents, ClientToServerEvents>;
	private set: Parameters<StateCreator<any>>[0];
	private get: Parameters<StateCreator<any>>[1];

	constructor(
		set: Parameters<StateCreator<any>>[0],
		get: Parameters<StateCreator<any>>[1]
	) {
		this.set = set;
		this.get = get;

		this.socket = io(baseURL, {
			autoConnect: false,
			withCredentials: true,
		});
	}

	/**
	 * Initializes socket connection and sets listeners.
	 */
	initSocket(userId: string): void {
		if (this.get().isConnected) return;

		this.socket.auth = { userId } as SocketAuth;
		this.socket.connect();
		this.socket.emit("user_connected", userId);

		this.registerListeners();
		this.set({ isConnected: true });
	}

	/**
	 * Registers all socket event listeners.
	 */
	private registerListeners(): void {
		this.socket.on("users_online", (users: string[]) => {
			this.set({ onlineUsers: new Set(users) });
		});

		this.socket.on("activities", (activities: [string, string][]) => {
			this.set({ userActivities: new Map(activities) });
		});

		this.socket.on("user_connected", (userId: string) => {
			this.set((state: any) => ({
				onlineUsers: new Set([...state.onlineUsers, userId]),
			}));
		});

		this.socket.on("user_disconnected", (userId: string) => {
			this.set((state: any) => {
				const updated = new Set(state.onlineUsers);
				updated.delete(userId);
				return { onlineUsers: updated };
			});
		});

		this.socket.on("receive_message", (message: Message) => {
			this.set((state: any) => ({
				messages: [...state.messages, message],
			}));
		});

		this.socket.on("message_sent", (message: Message) => {
			this.set((state: any) => ({
				messages: [...state.messages, message],
			}));
		});

		this.socket.on("activity_updated", ({ userId, activity }) => {
			this.set((state: any) => {
				const updated = new Map(state.userActivities);
				updated.set(userId, activity);
				return { userActivities: updated };
			});
		});
	}

	/**
	 * Disconnects socket and updates connection state.
	 */
	disconnectSocket(): void {
		if (this.get().isConnected) {
			this.socket.disconnect();
			this.set({ isConnected: false });
		}
	}

	/**
	 * Fetches all users from the backend.
	 */
	async fetchUsers(): Promise<void> {
		this.set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get<User[]>("/users");
			this.set({ users: response.data });
		} catch (error: any) {
			this.set({
				error: error.response?.data?.message || "Failed to fetch users",
			});
		} finally {
			this.set({ isLoading: false });
		}
	}

	/**
	 * Fetches messages with a specific user.
	 */
	async fetchMessages(userId: string): Promise<void> {
		this.set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get<Message[]>(
				`/users/messages/${userId}`
			);
			this.set({ messages: response.data });
		} catch (error: any) {
			this.set({
				error: error.response?.data?.message || "Failed to fetch messages",
			});
		} finally {
			this.set({ isLoading: false });
		}
	}

	/**
	 * Sends a message via socket.
	 */
	sendMessage(receiverId: string, senderId: string, content: string): void {
		this.socket.emit("send_message", { receiverId, senderId, content });
	}

	/**
	 * Returns the active socket instance.
	 */
	getSocket(): Socket<ServerToClientEvents, ClientToServerEvents> {
		return this.socket;
	}
}
