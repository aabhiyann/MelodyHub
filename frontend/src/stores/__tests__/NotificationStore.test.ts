import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useNotificationStore } from '../NotificationStore';
import { axiosInstance } from '@/lib/axios';
import { useChatStore } from '../ChatStore';

// Mock axios
vi.mock('@/lib/axios', () => ({
    axiosInstance: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    }
}));

// Mock ChatStore specifically for socket access
vi.mock('../ChatStore', () => ({
    useChatStore: {
        getState: vi.fn(),
        setState: vi.fn(),
        subscribe: vi.fn(),
    }
}));

describe('NotificationStore', () => {
    const mockSocket = {
        on: vi.fn(),
        off: vi.fn(),
        emit: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        useNotificationStore.setState({
            items: [],
            unreadCount: 0,
            isLoading: false
        });

        // Setup ChatStore mock return
        (useChatStore.getState as any).mockReturnValue({
            socket: mockSocket
        });
    });

    it('initial state is correct', () => {
        const state = useNotificationStore.getState();
        expect(state.items).toEqual([]);
        expect(state.unreadCount).toBe(0);
        expect(state.isLoading).toBe(false);
    });

    describe('fetchNotifications', () => {
        it('fetches notifications successfully', async () => {
            const mockData = {
                success: true,
                data: [{ _id: '1', title: 'Test', read: false }],
                unreadCount: 5
            };
            (axiosInstance.get as any).mockResolvedValue({ data: mockData });

            await useNotificationStore.getState().fetchNotifications();

            const state = useNotificationStore.getState();
            expect(state.items).toEqual(mockData.data);
            expect(state.unreadCount).toBe(5);
            expect(state.isLoading).toBe(false);
            expect(axiosInstance.get).toHaveBeenCalledWith('/notifications?unreadOnly=false&limit=30');
        });

        it('handles fetch error gracefully', async () => {
            (axiosInstance.get as any).mockRejectedValue(new Error('Failed'));
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

            await useNotificationStore.getState().fetchNotifications();

            expect(useNotificationStore.getState().isLoading).toBe(false);
            expect(consoleSpy).toHaveBeenCalled();
        });
    });

    describe('markAsRead', () => {
        it('marks a notification as read optimistically', async () => {
            // Setup initial state
            useNotificationStore.setState({
                items: [{ _id: '1', title: 'Test', read: false } as any],
                unreadCount: 1
            });
            (axiosInstance.put as any).mockResolvedValue({});

            await useNotificationStore.getState().markAsRead('1');

            const state = useNotificationStore.getState();
            expect(state.items[0].read).toBe(true);
            expect(state.unreadCount).toBe(0);
            expect(axiosInstance.put).toHaveBeenCalledWith('/notifications/1/read');
        });

        it('handles API error', async () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
            (axiosInstance.put as any).mockRejectedValue(new Error('Failed'));

            await useNotificationStore.getState().markAsRead('1');

            expect(consoleSpy).toHaveBeenCalled();
        });
    });

    describe('markAllAsRead', () => {
        it('marks all notifications as read', async () => {
            useNotificationStore.setState({
                items: [
                    { _id: '1', read: false } as any,
                    { _id: '2', read: false } as any
                ],
                unreadCount: 2
            });
            (axiosInstance.put as any).mockResolvedValue({});

            await useNotificationStore.getState().markAllAsRead();

            const state = useNotificationStore.getState();
            expect(state.items.every(i => i.read)).toBe(true);
            expect(state.unreadCount).toBe(0);
            expect(axiosInstance.put).toHaveBeenCalledWith('/notifications/read-all');
        });
    });

    describe('deleteNotification', () => {
        it('deletes a notification and updates unread count if needed', async () => {
            useNotificationStore.setState({
                items: [{ _id: '1', read: false } as any],
                unreadCount: 1
            });
            (axiosInstance.delete as any).mockResolvedValue({});

            await useNotificationStore.getState().deleteNotification('1');

            const state = useNotificationStore.getState();
            expect(state.items).toHaveLength(0);
            expect(state.unreadCount).toBe(0);
        });
    });

    describe('subscribeToSocket', () => {
        it('subscribes to new_notification event', () => {
            const unsubscribe = useNotificationStore.getState().subscribeToSocket();

            expect(mockSocket.on).toHaveBeenCalledWith('new_notification', expect.any(Function));

            // Test event handler
            const handler = mockSocket.on.mock.calls[0][1];
            const newNotification = { _id: '99', title: 'New', read: false };

            handler(newNotification);

            const state = useNotificationStore.getState();
            expect(state.items[0]).toEqual(newNotification);
            expect(state.unreadCount).toBe(1);

            // Test unsubscribe
            unsubscribe();
            expect(mockSocket.off).toHaveBeenCalledWith('new_notification', handler);
        });

        it('does nothing if socket is null', () => {
            (useChatStore.getState as any).mockReturnValue({ socket: null });
            useNotificationStore.getState().subscribeToSocket();
            expect(mockSocket.on).not.toHaveBeenCalled();
        });
    });
});
