import { jest, describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import { NextFunction, Request, Response } from 'express';

const mockAuthUser = { userId: 'clerk_test_user' };

// 1. Mock Redis (Mock FIRST)
jest.mock('redis', () => {
    const mockClient = {
        on: jest.fn((event: string, cb: any) => {
            if (event === 'connect') cb();
        }),
        connect: jest.fn(),
        quit: jest.fn(),
        info: () => Promise.resolve('used_memory_human:1M'),
        dbSize: () => Promise.resolve(0),
        get: jest.fn(),
        set: jest.fn(),
        del: jest.fn(),
    };
    return {
        createClient: jest.fn(() => mockClient),
    };
});

// Mock User Model (for protectRoute dependency)
const mockUserFindOne = jest.fn<any>();
jest.mock('../../models/user.model.js', () => ({
    User: {
        findOne: mockUserFindOne
    }
}));
// 3. Mock Services
const mockGetAllExcept = jest.fn<any>();
const mockGetByClerkId = jest.fn<any>();
const mockFollowUser = jest.fn<any>();
const mockGetUserStats = jest.fn<any>();

jest.mock('../../services/user.service.js', () => {
    return {
        UserService: jest.fn().mockImplementation(() => ({
            getAllExcept: mockGetAllExcept,
            getByClerkId: mockGetByClerkId,
            followUser: mockFollowUser,
            getUserStats: mockGetUserStats,
            findById: jest.fn<any>(),
            getConnectionStatus: jest.fn<any>().mockResolvedValue(false)
        }))
    };
});

const mockLogActivity = jest.fn<any>();
jest.mock('../../services/activity.service.js', () => {
    return {
        ActivityService: jest.fn().mockImplementation(() => ({
            logActivity: mockLogActivity
        }))
    };
});

// Mock Clerk Middleware
jest.mock('@clerk/express', () => ({
    clerkMiddleware: () => (req: Request, res: Response, next: NextFunction) => {
        (req as any).auth = (req as any).auth || { userId: 'clerk_test_user' };
        next();
    },
    requireAuth: () => (req: Request, res: Response, next: NextFunction) => next(),
}));

// Import app AFTER mocks
import { app } from '../../app.js';

beforeAll(async () => {
    const { redisService } = await import('../../services/redis.service.js');
    await redisService.connect();
});

afterAll(() => {
    jest.restoreAllMocks();
});

beforeEach(() => {
    jest.clearAllMocks();
    // Default User.findOne to null (not found -> guest/standard user)
    mockUserFindOne.mockResolvedValue(null);
});



// ...

// Mock Services

// ...

describe('GET /api/users', () => {
    it('should return list of users excluding current user', async () => {


        const mockUsers = [
            { _id: 'u1', fullName: 'User 1' },
            { _id: 'u2', fullName: 'User 2' }
        ];
        mockGetAllExcept.mockResolvedValue(mockUsers);

        const response = await request(app).get('/api/users');


        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(2);
        expect(mockGetAllExcept).toHaveBeenCalledWith(mockAuthUser.userId);
    });
});

describe('GET /api/users/profile', () => {
    it('should return current user profile', async () => {
        const mockUser = {
            _id: 'my_id',
            clerkId: mockAuthUser.userId,
            toObject: () => ({ _id: 'my_id', clerkId: mockAuthUser.userId })
        };
        mockGetByClerkId.mockResolvedValue(mockUser);
        mockGetUserStats.mockResolvedValue({ followersCount: 0, followingCount: 0 });

        const response = await request(app).get('/api/users/profile');

        // If the route logic is broken (missing protectRoute), this will likely default to 500
        if (response.status !== 200) {
            console.log('GET /profile Status:', response.status);
            console.log('GET /profile Body:', JSON.stringify(response.body, null, 2));
        }

        // We expect 200 if everything is correct. If 500, we'll see it in logs/failure.
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data._id).toBe('my_id');
    });
});

describe('POST /api/users/follow/:id', () => {
    it('should follow user and log activity', async () => {
        const targetId = 'target_clerk_id';
        const mockFollower = { _id: 'follower_id' };
        const mockFollowing = { _id: 'following_id' };

        // Mock getByClerkId to return both users (follower and following)
        mockGetByClerkId
            .mockResolvedValueOnce(mockFollower) // First call: follower
            .mockResolvedValueOnce(mockFollowing); // Second call: following

        mockFollowUser.mockResolvedValue(true);
        mockLogActivity.mockResolvedValue(true);

        const response = await request(app).post(`/api/users/follow/${targetId}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(mockFollowUser).toHaveBeenCalledWith('follower_id', 'following_id');
        expect(mockLogActivity).toHaveBeenCalled();
    });
});

