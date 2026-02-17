import { jest, describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import { NextFunction, Request, Response } from 'express';

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

// 2. Mock User Model (for protectRoute)
const mockUserFindOne = jest.fn<any>();
jest.mock('../../models/user.model.js', () => ({
    User: {
        findOne: mockUserFindOne
    }
}));

// 3. Mock SharedPlaylist Model (for sharePlaylist endpoint)
const mockSharedPlaylistFindById = jest.fn();
const mockSharedPlaylistSave = jest.fn();

jest.mock('../../models/sharedPlaylist.model.js', () => ({
    SharedPlaylist: {
        findById: mockSharedPlaylistFindById
    }
}));

// 4. Mock Services
const mockSocialService = {
    sendFriendRequest: jest.fn<any>(),
    getFriends: jest.fn<any>(),
    getFriendRequests: jest.fn<any>(),
    acceptFriendRequest: jest.fn<any>(),
    rejectFriendRequest: jest.fn<any>(),
    cancelFriendRequest: jest.fn<any>(),
    removeFriend: jest.fn<any>(),
    getFriendActivity: jest.fn<any>()
};

jest.mock('../../services/social.service.js', () => ({
    SocialService: jest.fn().mockImplementation(() => mockSocialService)
}));

const mockPlaylistService = {
    createPlaylist: jest.fn<any>(),
    getAllPlaylists: jest.fn<any>(),
    getPlaylistById: jest.fn<any>(),
    addSong: jest.fn<any>(),
    updatePlaylist: jest.fn<any>(),
    deletePlaylist: jest.fn<any>()
};

jest.mock('../../services/playlist.service.js', () => ({
    PlaylistService: jest.fn().mockImplementation(() => mockPlaylistService)
}));

const mockActivityService = {
    logActivity: jest.fn()
};

jest.mock('../../services/activity.service.js', () => ({
    ActivityService: jest.fn().mockImplementation(() => mockActivityService)
}));

// Mock Cache Middleware (needed because app.ts imports song/album routes)
// Mock Cache Middleware
jest.mock('../../middleware/cache.middleware.js', () => {
    const mockMiddleware = (req: Request, res: Response, next: NextFunction) => next();
    return {
        CacheStrategies: {
            featured: mockMiddleware,
            trending: mockMiddleware,
            recommendations: mockMiddleware,
            newReleases: mockMiddleware,
            genre: mockMiddleware,
            userPreferences: mockMiddleware,
            albumsList: mockMiddleware,
            albumById: mockMiddleware,
            stats: mockMiddleware,
        }
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

import { app } from '../../app.js';

describe('Social & Playlist Routes Integration', () => {

    beforeAll(async () => {
        const { redisService } = await import('../../services/redis.service.js');
        await redisService.connect();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        mockUserFindOne.mockResolvedValue({ _id: 'u1', clerkId: 'clerk_test_user' });
    });

    describe('POST /api/social/playlists', () => {
        it('should create a new playlist', async () => {
            const mockPlaylist = { id: 'p1', name: 'New Playlist', userId: 'clerk_test_user' };
            mockPlaylistService.createPlaylist.mockResolvedValue(mockPlaylist);

            const response = await request(app)
                .post('/api/social/playlists')
                .send({ name: 'New Playlist', description: 'Desc', isPublic: true });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toEqual(mockPlaylist);
            expect(mockPlaylistService.createPlaylist).toHaveBeenCalledWith('clerk_test_user', {
                name: 'New Playlist',
                description: 'Desc',
                isPublic: true
            });
            expect(mockActivityService.logActivity).toHaveBeenCalled();
        });
    });

    describe('GET /api/social/playlists', () => {
        it('should return user playlists', async () => {
            const mockPlaylists = [{ id: 'p1', name: 'My Playlist' }];
            mockPlaylistService.getAllPlaylists.mockResolvedValue(mockPlaylists);

            const response = await request(app).get('/api/social/playlists');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toEqual(mockPlaylists);
        });
    });

    describe('POST /api/social/friend-request', () => {
        it('should send friend request', async () => {
            const mockFriendship = { _id: 'f1', status: 'pending' };
            mockSocialService.sendFriendRequest.mockResolvedValue(mockFriendship);

            const response = await request(app)
                .post('/api/social/friend-request')
                .send({ friendId: 'friend_1' });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(mockSocialService.sendFriendRequest).toHaveBeenCalledWith('clerk_test_user', 'friend_1');
        });

        it('should handle invalid input', async () => {
            const response = await request(app)
                .post('/api/social/friend-request')
                .send({}); // missing friendId

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('Friend ID is required');
        });
    });

    describe('GET /api/social/friends', () => {
        it('should return friends list', async () => {
            const mockFriends = ['f1', 'f2'];
            mockSocialService.getFriends.mockResolvedValue(mockFriends);

            const response = await request(app).get('/api/social/friends');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toEqual(mockFriends);
        });
    });
});
