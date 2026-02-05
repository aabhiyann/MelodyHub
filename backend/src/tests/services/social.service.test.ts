import { SocialService } from '../../services/social.service.js';
import { connect, closeDatabase, clearDatabase } from '../utils/testDb.js';
import { createTestUser } from '../utils/factories.js';

describe('SocialService', () => {
  let socialService: SocialService;
  let originalActivityCreate: any;

  beforeAll(async () => {
    await connect();
    
    // Mock Activity model to avoid validation issues in tests
    const Activity = (await import('../../models/activity.model.js')).Activity;
    originalActivityCreate = Activity.create;
    Activity.create = async () => ({ _id: 'mock-activity' }) as any;
    
    socialService = new SocialService();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    // Restore Activity create
    const Activity = (await import('../../models/activity.model.js')).Activity;
    Activity.create = originalActivityCreate;
    
    await closeDatabase();
  });

  describe('sendFriendRequest', () => {
    it('should send friend request', async () => {
      const user1 = await createTestUser();
      const user2 = await createTestUser();
      const userId1 = String(user1._id || '');
      const userId2 = String(user2._id || '');

      const friendship = await socialService.sendFriendRequest(userId1, userId2);

      expect(friendship).toBeDefined();
      expect(friendship.status).toBe('pending');
    });

    it('should prevent self friend request', async () => {
      const user = await createTestUser();
      const userId = String(user._id || '');

      await expect(
        socialService.sendFriendRequest(userId, userId)
      ).rejects.toThrow('Cannot send friend request to yourself');
    });

    it('should prevent duplicate requests', async () => {
      const user1 = await createTestUser();
      const user2 = await createTestUser();
      const userId1 = String(user1._id || '');
      const userId2 = String(user2._id || '');

      await socialService.sendFriendRequest(userId1, userId2);

      await expect(
        socialService.sendFriendRequest(userId1, userId2)
      ).rejects.toThrow('Friend request already');
    });
  });

  describe('acceptFriendRequest', () => {
    it('should accept friend request', async () => {
      const user1 = await createTestUser();
      const user2 = await createTestUser();
      const userId1 = String(user1._id || '');
      const userId2 = String(user2._id || '');

      const request = await socialService.sendFriendRequest(userId1, userId2);

      const accepted = await socialService.acceptFriendRequest(
        String(request._id || ''),
        userId2
      );

      expect(accepted.status).toBe('accepted');
    });
  });

  describe('rejectFriendRequest', () => {
    it('should reject friend request', async () => {
      const user1 = await createTestUser();
      const user2 = await createTestUser();
      const userId1 = String(user1._id || '');
      const userId2 = String(user2._id || '');

      const request = await socialService.sendFriendRequest(userId1, userId2);

      await socialService.rejectFriendRequest(String(request._id || ''), userId2);

      const requests = await socialService.getFriendRequests(userId2);
      expect(requests).toHaveLength(0);
    });
  });

  describe('getFriends', () => {
    it('should return friends list', async () => {
      const user1 = await createTestUser();
      const user2 = await createTestUser();
      const userId1 = String(user1._id || '');
      const userId2 = String(user2._id || '');

      const request = await socialService.sendFriendRequest(userId1, userId2);
      await socialService.acceptFriendRequest(String(request._id || ''), userId2);

      const friends = await socialService.getFriends(userId1);

      expect(friends).toHaveLength(1);
      expect(friends[0]).toBe(userId2);
    });
  });

  describe('removeFriend', () => {
    it('should remove friend', async () => {
      const user1 = await createTestUser();
      const user2 = await createTestUser();
      const userId1 = String(user1._id || '');
      const userId2 = String(user2._id || '');

      const request = await socialService.sendFriendRequest(userId1, userId2);
      await socialService.acceptFriendRequest(String(request._id || ''), userId2);

      const removed = await socialService.removeFriend(userId1, userId2);

      expect(removed).toBe(true);

      const friends = await socialService.getFriends(userId1);
      expect(friends).toHaveLength(0);
    });
  });

  describe('getFriendActivity', () => {
    it('should return friend activity feed', async () => {
      const user = await createTestUser();
      const userId = String(user._id || '');

      const activities = await socialService.getFriendActivity(userId);

      expect(Array.isArray(activities)).toBe(true);
    });
  });
});
