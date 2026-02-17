import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { UserService } from '../user.service';
import { User } from '../../models/user.model';

// Mock Redis Service
jest.mock('../redis.service', () => ({
    redisService: {
        get: jest.fn(),
        set: jest.fn(),
        del: jest.fn(),
    },
}));

describe('UserService', () => {
    let userService: UserService;

    beforeEach(() => {
        userService = new UserService();
        jest.clearAllMocks();
    });

    describe('findOrCreateByClerkId', () => {
        it('should create a new user if not exists', async () => {
            const clerkId = 'clerk_new_123';
            const userData = { firstName: 'John', lastName: 'Doe', imageUrl: 'http://example.com/pic.jpg' };

            const user = await userService.findOrCreateByClerkId(clerkId, userData);

            expect(user).toBeDefined();
            expect(user.clerkId).toBe(clerkId);
            expect(user.fullName).toBe('John Doe');
            expect(user.imageUrl).toBe(userData.imageUrl);

            // Verify DB persistence
            const dbUser = await User.findOne({ clerkId });
            expect(dbUser).toBeDefined();
            expect(dbUser?.clerkId).toBe(clerkId);
        });

        it('should update existing user', async () => {
            // Create user first
            const clerkId = 'clerk_update_123';
            await User.create({
                clerkId,
                fullName: 'Old Name',
                imageUrl: 'old.jpg'
            });

            const userData = { firstName: 'New', lastName: 'Name', imageUrl: 'new.jpg' };
            const user = await userService.findOrCreateByClerkId(clerkId, userData);

            expect(user.fullName).toBe('New Name');
            expect(user.imageUrl).toBe('new.jpg');

            // Verify DB update
            const dbUser = await User.findOne({ clerkId });
            expect(dbUser?.fullName).toBe('New Name');
        });
    });

    describe('getByClerkId', () => {
        it('should return user from DB if not in cache', async () => {
            const clerkId = 'clerk_get_123';
            await User.create({
                clerkId,
                fullName: 'Test User',
                imageUrl: 'test.jpg'
            });

            const user = await userService.getByClerkId(clerkId);
            expect(user).toBeDefined();
            expect(user?.clerkId).toBe(clerkId);
        });

        it('should return null if user does not exist', async () => {
            const user = await userService.getByClerkId('non_existent');
            expect(user).toBeNull();
        });
    });
});
