import { UserService } from '../../services/user.service.js';
import { connect, closeDatabase, clearDatabase } from '../utils/testDb.js';
import { createTestUser, createTestUsers } from '../utils/factories.js';

describe('UserService', () => {
  let userService: UserService;

  beforeAll(async () => {
    await connect();
    userService = new UserService();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('findOrCreateByClerkId', () => {
    it('should create new user if not exists', async () => {
      const clerkId = 'test_clerk_123';
      const user = await userService.findOrCreateByClerkId(clerkId, {
        firstName: 'John',
        lastName: 'Doe',
        imageUrl: 'https://example.com/john.jpg',
      });

      expect(user).toBeDefined();
      expect(user.clerkId).toBe(clerkId);
      expect(user.fullName).toBe('John Doe');
    });

    it('should update existing user', async () => {
      const clerkId = 'test_clerk_456';
      await createTestUser({ clerkId });

      const updated = await userService.findOrCreateByClerkId(clerkId, {
        firstName: 'New',
        lastName: 'Name',
        imageUrl: 'https://example.com/updated.jpg',
      });

      expect(updated.fullName).toBe('New Name');
    });
  });

  describe('getByClerkId', () => {
    it('should return user by clerk ID', async () => {
      await createTestUser({ clerkId: 'test_clerk_789' });
      const user = await userService.getByClerkId('test_clerk_789');
      expect(user).toBeDefined();
    });

    it('should return null if user not found', async () => {
      const user = await userService.getByClerkId('nonexistent');
      expect(user).toBeNull();
    });
  });

  describe('getAllExcept', () => {
    it('should return all users except current user', async () => {
      await createTestUser({ clerkId: 'current_user' });
      await createTestUsers(3);

      const users = await userService.getAllExcept('current_user');
      expect(users.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('followUser', () => {
    it('should create follow connection', async () => {
      const user1 = await createTestUser();
      const user2 = await createTestUser();

      const id1 = String(user1._id || '');
      const id2 = String(user2._id || '');

      const connection = await userService.followUser(id1, id2);

      expect(connection).toBeDefined();
    });

    it('should not allow self-follow', async () => {
      const user = await createTestUser();
      const id = String(user._id || '');

      await expect(
        userService.followUser(id, id)
      ).rejects.toThrow('Cannot follow yourself');
    });
  });

  describe('getUserStats', () => {
    it('should return followers and following counts', async () => {
      const user1 = await createTestUser();
      const user2 = await createTestUser();
      const user3 = await createTestUser();

      const id1 = String(user1._id || '');
      const id2 = String(user2._id || '');
      const id3 = String(user3._id || '');

      await userService.followUser(id2, id1);
      await userService.followUser(id3, id1);
      await userService.followUser(id1, id2);

      const stats = await userService.getUserStats(id1);

      expect(stats.followersCount).toBe(2);
      expect(stats.followingCount).toBe(1);
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      await createTestUser({ clerkId: 'test_clerk' });

      const updated = await userService.updateProfile('test_clerk', {
        fullName: 'Updated Name',
      });

      expect(updated?.fullName).toBe('Updated Name');
    });
  });
});
