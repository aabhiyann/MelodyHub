import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { useChatStore } from "./ChatStore";

export type NotificationType =
    | "FRIEND_REQUEST"
    | "FRIEND_ACCEPT"
    | "NEW_FOLLOWER"
    | "LIKE_SONG"
    | "PLAYLIST_INVITE"
    | "NEW_MESSAGE";

export interface NotificationItem {
    _id: string;
    userId: string;
    type: NotificationType;
    title: string;
    body?: string;
    read: boolean;
    metadata?: Record<string, unknown>;
    createdAt: string;
}

interface NotificationStore {
    items: NotificationItem[];
    unreadCount: number;
    isLoading: boolean;
    fetchNotifications: (unreadOnly?: boolean) => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    deleteNotification: (id: string) => Promise<void>;
    subscribeToSocket: () => () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
    items: [],
    unreadCount: 0,
    isLoading: false,

    fetchNotifications: async (unreadOnly = false) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get(`/notifications?unreadOnly=${unreadOnly}&limit=30`);
            const data = res.data as { success?: boolean; data?: NotificationItem[]; unreadCount?: number };
            if (data.success) {
                set({
                    items: data.data ?? [],
                    unreadCount: data.unreadCount ?? 0,
                });
            }
        } catch (e) {
            console.error("Failed to fetch notifications", e);
        } finally {
            set({ isLoading: false });
        }
    },

    markAsRead: async (id: string) => {
        try {
            await axiosInstance.put(`/notifications/${id}/read`);
            set((s) => ({
                items: s.items.map((n) => (n._id === id ? { ...n, read: true } : n)),
                unreadCount: Math.max(0, s.unreadCount - 1),
            }));
        } catch (e) {
            console.error("Failed to mark notification as read", e);
        }
    },

    markAllAsRead: async () => {
        try {
            await axiosInstance.put("/notifications/read-all");
            set((s) => ({
                items: s.items.map((n) => ({ ...n, read: true })),
                unreadCount: 0,
            }));
        } catch (e) {
            console.error("Failed to mark all as read", e);
        }
    },

    deleteNotification: async (id: string) => {
        try {
            await axiosInstance.delete(`/notifications/${id}`);
            set((s) => {
                const item = s.items.find((n) => n._id === id);
                return {
                    items: s.items.filter((n) => n._id !== id),
                    unreadCount: item && !item.read ? Math.max(0, s.unreadCount - 1) : s.unreadCount,
                };
            });
        } catch (e) {
            console.error("Failed to delete notification", e);
        }
    },

    subscribeToSocket: () => {
        const socket = useChatStore.getState().socket;
        if (!socket) return () => { };
        const onNew = (notification: NotificationItem) => {
            set((s) => ({
                items: [notification, ...s.items],
                unreadCount: s.unreadCount + 1,
            }));
        };
        socket.on("new_notification", onNew);
        return () => {
            socket.off("new_notification", onNew);
        };
    },
}));
