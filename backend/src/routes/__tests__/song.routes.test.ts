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

// 2. Mock User Model (for protectRoute dependency)
const mockUserFindOne = jest.fn<any>();
jest.mock('../../models/user.model.js', () => ({
    User: {
        findOne: mockUserFindOne
    }
}));

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

// 3. Mock Services
const mockGetAllSongs = jest.fn<any>();
const mockGetFeaturedSongs = jest.fn<any>();
const mockGetMadeForYouSongs = jest.fn<any>();
const mockGetTrendingSongs = jest.fn<any>();
const mockGetRandomSongs = jest.fn<any>();

jest.mock('../../services/song.service.js', () => {
    return {
        SongService: jest.fn().mockImplementation(() => ({
            getAllSongs: mockGetAllSongs,
            getFeaturedSongs: mockGetFeaturedSongs,
            getMadeForYouSongs: mockGetMadeForYouSongs,
            getTrendingSongs: mockGetTrendingSongs,
            getRandomSongs: mockGetRandomSongs
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

describe('Song Routes Integration', () => {

    beforeAll(async () => {
        const { redisService } = await import('../../services/redis.service.js');
        await redisService.connect();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        mockUserFindOne.mockResolvedValue(null);
    });

    describe('GET /api/songs', () => {
        it('should return paginated list of songs', async () => {
            const mockSongs = [
                { _id: 's1', title: 'Song 1' },
                { _id: 's2', title: 'Song 2' }
            ];
            mockGetAllSongs.mockResolvedValue(mockSongs);

            const response = await request(app).get('/api/songs?page=1&limit=10');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveLength(2);
            expect(mockGetAllSongs).toHaveBeenCalledWith(1, 10);
        });
    });

    describe('GET /api/songs/featured', () => {
        it('should return featured songs', async () => {
            const mockSongs = [{ _id: 's1', title: 'Featured Song' }];
            mockGetFeaturedSongs.mockResolvedValue(mockSongs);

            const response = await request(app).get('/api/songs/featured');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveLength(1);
            expect(mockGetFeaturedSongs).toHaveBeenCalled();
        });
    });

    describe('GET /api/songs/made-for-you', () => {
        it('should return made-for-you songs', async () => {
            const mockSongs = [{ _id: 's2', title: 'For You Song' }];
            mockGetMadeForYouSongs.mockResolvedValue(mockSongs);

            const response = await request(app).get('/api/songs/made-for-you');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveLength(1);
            expect(mockGetMadeForYouSongs).toHaveBeenCalled();
        });
    });

    describe('GET /api/songs/trending', () => {
        it('should return trending songs', async () => {
            const mockSongs = [{ _id: 's3', title: 'Trending Song' }];
            mockGetTrendingSongs.mockResolvedValue(mockSongs);

            const response = await request(app).get('/api/songs/trending');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveLength(1);
            expect(mockGetTrendingSongs).toHaveBeenCalled();
        });
    });

    describe('GET /api/songs/random', () => {
        it('should return random songs', async () => {
            const mockSongs = [{ _id: 's4', title: 'Random Song' }];
            mockGetRandomSongs.mockResolvedValue(mockSongs);

            const response = await request(app).get('/api/songs/random');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveLength(1);
            expect(mockGetRandomSongs).toHaveBeenCalled(); // limit check might be tricky if default
        });
    });
});
