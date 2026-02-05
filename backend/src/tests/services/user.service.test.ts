import { UserService } from '../../services/user.service.js';
import { connect, closeDatabase, clearDatabase } from '../utils/testDb.js';
import { createTestUser } from '../utils/factories.js';

describe('UserService', () => {
    let userService: UserService;

    // Connect to test database before all tests
    beforeAll(async () => {
        await connect();
        userService = new UserService();
    });

    // Clear database after each test
    afterEach(async () => {
        await clearDatabase();
    });

    // Close database connection after all tests
    afterAll(async () => {
        await closeDatabase();
    });

    describe('findOrCreateByClerkId', () => {
        it('should create new user if not exists', async () => {
            const clerkId = 'test_clerk_123';
            const userData = {
                firstName: 'John',
                lastName: 'Doe',
                imageUrl: 'https://example.com/john.jpg',
            };

            const user = await userService.findOrCreateByClerkId(clerkId, userData);

            expect(user).toBeDefined();
            expect(user.clerkId).toBe(clerkId);
            expect(user.fullName).toBe('John Doe');
            expect(user.imageUrl).toBe(userData.imageUrl);
        });

        it('should update existing user', async () => {
            const clerkId = 'test_clerk_456';

            // Create user first
            await createTestUser({ clerkId, fullName: 'Old Name' });

            // Update user
            const updatedUser = await userService.findOrCreateByClerkId(clerkId, {
                firstName: 'New',
                lastName: 'Name',
                imageUrl: 'https://example.com/new.jpg',
            });

            expect(updatedUser.fullName).toBe('New Name');
            expect(updatedUser.imageUrl).toBe('https://example.com/new.jpg');
        });
    });

    describe('getByClerkId', () => {
        it('should return user by clerk ID', async () => {
            const testUser = await createTestUser({ clerkId: 'test_clerk_789' });

            const user = await userService.getByClerkId('test_clerk_789');

            expect(user).toBeDefined();
            expect(user?._id?.toString()).toBe(testUser._id?.toString());
        });

        it('should return null if user not found', async () => {
            const user = await userService.getByClerkId('nonexistent');

            expect(user).toBeNull();
        });
    });
});
