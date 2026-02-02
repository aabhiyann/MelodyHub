import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useChatStore } from '@/stores/ChatStore';
import { axiosInstance } from '@/lib/axios';

// Mock axios
vi.mock('@/lib/axios', () => ({
  axiosInstance: {
    get: vi.fn(),
  },
}));

// Mock socket.io-client
vi.mock('socket.io-client', () => ({
  io: vi.fn(() => ({
    on: vi.fn(),
    emit: vi.fn(),
    disconnect: vi.fn(),
    connected: true,
  })),
}));

describe('ChatStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useChatStore.setState({
      messages: [],
      socket: null,
      onlineUsers: new Set(),
      activities: new Map(),
      users: [],
      selectedUser: null,
      isLoading: false,
    });
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = useChatStore.getState();

      expect(state.messages).toEqual([]);
      expect(state.socket).toBeNull();
      expect(state.onlineUsers).toBeInstanceOf(Set);
      expect(state.onlineUsers.size).toBe(0);
      expect(state.activities).toBeInstanceOf(Map);
      expect(state.activities.size).toBe(0);
      expect(state.users).toEqual([]);
      expect(state.selectedUser).toBeNull();
      expect(state.isLoading).toBe(false);
    });
  });

  describe('fetchUsers', () => {
    it('should fetch users successfully', async () => {
      const mockUsers = [
        { _id: '1', clerkId: 'user1', fullName: 'User One', imageUrl: 'url1' },
        { _id: '2', clerkId: 'user2', fullName: 'User Two', imageUrl: 'url2' },
      ];

      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockUsers });

      await useChatStore.getState().fetchUsers();

      expect(axiosInstance.get).toHaveBeenCalledWith('/users');
      expect(useChatStore.getState().users).toEqual(mockUsers);
      expect(useChatStore.getState().isLoading).toBe(false);
    });

    it('should handle fetch users error', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(axiosInstance.get).mockRejectedValueOnce(new Error('Network error'));

      await useChatStore.getState().fetchUsers();

      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch users:', expect.any(Error));
      expect(useChatStore.getState().isLoading).toBe(false);

      consoleErrorSpy.mockRestore();
    });

    it('should set loading state during fetch', async () => {
      vi.mocked(axiosInstance.get).mockImplementation(
        () =>
          new Promise((resolve) => {
            // Check loading state while promise is pending
            expect(useChatStore.getState().isLoading).toBe(true);
            setTimeout(() => resolve({ data: [] }), 100);
          })
      );

      await useChatStore.getState().fetchUsers();
      expect(useChatStore.getState().isLoading).toBe(false);
    });
  });

  describe('fetchMessages', () => {
    it('should fetch messages for a user', async () => {
      const mockMessages = [
        {
          _id: '1',
          senderId: 'user1',
          receiverId: 'user2',
          content: 'Hello',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: '2',
          senderId: 'user2',
          receiverId: 'user1',
          content: 'Hi there',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockMessages });

      await useChatStore.getState().fetchMessages('user2');

      expect(axiosInstance.get).toHaveBeenCalledWith('/messages/user2');
      expect(useChatStore.getState().messages).toEqual(mockMessages);
      expect(useChatStore.getState().isLoading).toBe(false);
    });

    it('should handle fetch messages error', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(axiosInstance.get).mockRejectedValueOnce(new Error('API error'));

      await useChatStore.getState().fetchMessages('user2');

      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch messages:', expect.any(Error));
      expect(useChatStore.getState().isLoading).toBe(false);

      consoleErrorSpy.mockRestore();
    });
  });

  describe('setSelectedUser', () => {
    it('should set selected user and clear messages', () => {
      const mockUser = { _id: '1', clerkId: 'user1', fullName: 'User One', imageUrl: 'url1' };

      // Set some initial messages
      useChatStore.setState({
        messages: [
          {
            _id: '1',
            senderId: 'old',
            receiverId: 'old',
            content: 'old',
            createdAt: '',
            updatedAt: '',
          },
        ],
      });

      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: [] });

      useChatStore.getState().setSelectedUser(mockUser);

      expect(useChatStore.getState().selectedUser).toEqual(mockUser);
      expect(useChatStore.getState().messages).toEqual([]);
    });

    it('should fetch messages when user is selected', async () => {
      const mockUser = { _id: '1', clerkId: 'user1', fullName: 'User One', imageUrl: 'url1' };
      const mockMessages = [
        {
          _id: '1',
          senderId: 'user1',
          receiverId: 'me',
          content: 'Hello',
          createdAt: '',
          updatedAt: '',
        },
      ];

      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockMessages });

      useChatStore.getState().setSelectedUser(mockUser);

      // Wait for async fetchMessages to complete (store uses user.clerkId)
      await vi.waitFor(() => {
        expect(axiosInstance.get).toHaveBeenCalledWith('/messages/user1');
      });
    });

    it('should clear selected user when null is passed', () => {
      const mockUser = { _id: '1', clerkId: 'user1', fullName: 'User One', imageUrl: 'url1' };

      useChatStore.setState({ selectedUser: mockUser });
      useChatStore.getState().setSelectedUser(null);

      expect(useChatStore.getState().selectedUser).toBeNull();
      expect(useChatStore.getState().messages).toEqual([]);
    });
  });

  describe('Socket Connection', () => {
    it('should initialize socket with user ID', () => {
      useChatStore.getState().initSocket('user123');

      // Check that socket was initialized
      const socket = useChatStore.getState().socket;
      expect(socket).toBeTruthy();
      expect(socket).not.toBeNull();
    });

    it('should disconnect socket', () => {
      const mockSocket = {
        disconnect: vi.fn(),
        on: vi.fn(),
        emit: vi.fn(),
      };

      useChatStore.setState({ socket: mockSocket as any });
      useChatStore.getState().disconnectSocket();

      expect(mockSocket.disconnect).toHaveBeenCalled();
      expect(useChatStore.getState().socket).toBeNull();
    });

    it('should handle null socket on disconnect', () => {
      useChatStore.setState({ socket: null });

      // Should not throw error
      expect(() => {
        useChatStore.getState().disconnectSocket();
      }).not.toThrow();

      expect(useChatStore.getState().socket).toBeNull();
    });
  });

  describe('SendMessage', () => {
    it('should not send message if socket is null', () => {
      useChatStore.setState({ socket: null });

      // Should not throw
      expect(() => {
        useChatStore.getState().sendMessage('receiver123', 'Hello');
      }).not.toThrow();
    });
  });
});
