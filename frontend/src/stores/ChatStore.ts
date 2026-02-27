import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Socket } from "socket.io-client";
import { Message, User, FriendRequest } from "@/types";
import { ChatManager } from "@/providers/ChatManager";

export interface ChatState {
	messages: Message[];
	socket: Socket | null;
	onlineUsers: Set<string>;
	activities: Map<string, string>;
	users: User[];
	selectedUser: User | null;
	isLoading: boolean;
	typingUsers: Set<string>;
	friends: User[];
	friendRequests: FriendRequest[];
	searchResult: User[];
}

export interface ChatActions {
	initSocket: (userId: string) => void;
	disconnectSocket: () => void;
	sendMessage: (receiverId: string, content: string) => void;
	sendTyping: (receiverId: string) => void;
	sendStopTyping: (receiverId: string) => void;
	fetchUsers: () => Promise<void>;
	fetchMessages: (userId: string) => Promise<void>;
	setSelectedUser: (user: User | null) => void;
	fetchFriends: () => Promise<void>;
	fetchFriendRequests: () => Promise<void>;
	sendFriendRequest: (receiverId: string) => Promise<void>;
	acceptFriendRequest: (requestId: string) => Promise<void>;
	rejectFriendRequest: (requestId: string) => Promise<void>;
	searchUsers: (query: string) => Promise<void>;
	updateActivity: (activity: string) => void;
}

export type ChatStore = ChatState & ChatActions;

const initialState: ChatState = {
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
};

export const useChatStore = create<ChatStore>()(
	devtools(
		(set, get) => {
			const manager = new ChatManager(set, get);

			return {
				...initialState,

				// Delegated to ChatManager
				initSocket: manager.initSocket.bind(manager),
				disconnectSocket: manager.disconnectSocket.bind(manager),
				sendMessage: manager.sendMessage.bind(manager),
				sendTyping: manager.sendTyping.bind(manager),
				sendStopTyping: manager.sendStopTyping.bind(manager),
				updateActivity: manager.updateActivity.bind(manager),

				fetchUsers: manager.fetchUsers.bind(manager),
				fetchMessages: manager.fetchMessages.bind(manager),
				setSelectedUser: manager.setSelectedUser.bind(manager),

				fetchFriends: manager.fetchFriends.bind(manager),
				fetchFriendRequests: manager.fetchFriendRequests.bind(manager),
				sendFriendRequest: manager.sendFriendRequest.bind(manager),
				acceptFriendRequest: manager.acceptFriendRequest.bind(manager),
				rejectFriendRequest: manager.rejectFriendRequest.bind(manager),
				searchUsers: manager.searchUsers.bind(manager),
			};
		},
		{ name: "ChatStore" }
	)
);
