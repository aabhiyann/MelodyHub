import { FriendService } from '../../services/friend.service.js';
import { connect, closeDatabase, clearDatabase } from '../utils/testDb.js';
import { createTestUser } from '../utils/factories.js';
import { FriendRequest } from '../../models/friendRequest.model.js';

describe('FriendService', () => {
  let friendService: FriendService;
  let originalCreateNotification: any;
  let originalEmitToUser: any;

  beforeAll(async () => {
    await connect();
    
    // Mock notification service
    const notif = await import('../../services/notification.service.js');
    originalCreateNotification = notif.createNotification;
    (notif as any).createNotification = async () => ({ _id: 'mock-notification' });
    
    // Mock socket
    const socket = await import('../../lib/socket.js');
    originalEmitToUser = socket.emitToUser;
    (socket as any).emitToUser = () => {};
    
    friendService = new FriendService();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    // Restore mocks
    const notif = await import('../../services/notification.service.js');
    (notif as any).createNotification = originalCreateNotification;
    
    const socket = await import('../../lib/socket.js');
    (socket as any).emitToUser = originalEmitToUser;
    
    await closeDatabase();
  });

  describe('sendFriendRequest', () => {
    it('should send friend request successfully', async () => {
      await createTestUser({ clerkId: 'sender_123' });
      await createTestUser({ clerkId: 'receiver_456' });

      const request = await friendService.sendFriendRequest('sender_123', 'receiver_456');

      expect(request).toBeDefined();
      expect(request.status).toBe('pending');
    });

    it('should throw error if sender not found', async () => {
      await createTestUser({ clerkId: 'receiver_456' });

      await expect(
        friendService.sendFriendRequest('nonexistent', 'receiver_456')
      ).rejects.toThrow('Sender not found');
    });

    it('should prevent self-friending', async () => {
      await createTestUser({ clerkId: 'user_123' });

      await expect(
        friendService.sendFriendRequest('user_123', 'user_123')
      ).rejects.toThrow('You cannot request yourself');
    });

    it('should throw error if request already exists', async () => {
      await createTestUser({ clerkId: 'sender_123' });
      await createTestUser({ clerkId: 'receiver_456' });

      await friendService.sendFriendRequest('sender_123', 'receiver_456');

      await expect(
        friendService.sendFriendRequest('sender_123', 'receiver_456')
      ).rejects.toThrow('Request already exists');
    });
  });

  describe('acceptFriendRequest', () => {
    it('should accept friend request', async () => {
      await createTestUser({ clerkId: 'sender_123' });
      await createTestUser({ clerkId: 'receiver_456' });

      const request = await friendService.sendFriendRequest('sender_123', 'receiver_456');

      await friendService.acceptFriendRequest(String(request._id || ''), 'receiver_456');

      const updatedRequest = await FriendRequest.findById(request._id);
      expect(updatedRequest?.status).toBe('accepted');
    });
  });

  describe('getFriendRequests', () => {
    it('should return pending friend requests', async () => {
      await createTestUser({ clerkId: 'sender_123' });
      await createTestUser({ clerkId: 'receiver_456' });

      await friendService.sendFriendRequest('sender_123', 'receiver_456');

      const requests = await friendService.getFriendRequests('receiver_456');

      expect(requests.length).toBeGreaterThan(0);
    });
  });

  describe('getFriends', () => {
    it('should return user friends list', async () => {
      await createTestUser({ clerkId: 'user_123' });

      const friends = await friendService.getFriends('user_123');

      expect(Array.isArray(friends)).toBe(true);
    });
  });
});
