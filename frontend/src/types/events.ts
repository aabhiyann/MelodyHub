// Socket and Event Types
import { Message } from './models';

export interface SocketAuth {
    userId: string;
}

export interface ServerToClientEvents {
    users_online: (users: string[]) => void;
    activities: (activities: [string, string][]) => void;
    user_connected: (userId: string) => void;
    user_disconnected: (userId: string) => void;
    receive_message: (message: Message) => void;
    message_sent: (message: Message) => void;
    activity_updated: (data: { userId: string; activity: string }) => void;
    user_typing: (data: { senderId: string }) => void;
}

export interface ClientToServerEvents {
    send_message: (data: { receiverId: string; senderId: string; content: string }) => void;
    typing: (data: { senderId: string; receiverId: string }) => void;
    update_activity: (data: { userId: string; activity: string }) => void;
    user_connected: (userId: string) => void;
}
