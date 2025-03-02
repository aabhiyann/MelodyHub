import { create } from "zustand";
import { ChatManager } from "@/providers/chatManager";
import { Message, User } from "@/types";

// Zustand store interface
interface ChatStore {
	users: User[];
	isLoading: boolean;
	error: string | null;
	isConnected: boolean;
	onlineUsers: Set<string>;
	userActivities: Map<string, string>;
	messages: Message[];
	selectedUser: User | null;

	initSocket: (userId: string) => void;
	disconnectSocket: () => void;
	sendMessage: (receiverId: string, senderId: string, content: string) => void;
	fetchUsers: () => Promise<void>;
	fetchMessages: (userId: string) => Promise<void>;
	setSelectedUser: (user: User | null) => void;
	socket: ReturnType<ChatManager["getSocket"]>;
}

export const ChatStore = create<ChatStore>((set, get) => {
	const manager = new ChatManager(set, get);

	return {
		users: [],
		isLoading: false,
		error: null,
		isConnected: false,
		onlineUsers: new Set(),
		userActivities: new Map(),
		messages: [],
		selectedUser: null,

		socket: manager.getSocket(),
		initSocket: manager.initSocket.bind(manager),
		disconnectSocket: manager.disconnectSocket.bind(manager),
		sendMessage: manager.sendMessage.bind(manager),
		fetchUsers: manager.fetchUsers.bind(manager),
		fetchMessages: manager.fetchMessages.bind(manager),
		setSelectedUser: (user) => set({ selectedUser: user }),
	};
});
