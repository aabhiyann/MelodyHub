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

// 2. Mock Services
const mockGetAllAlbums = jest.fn<any>();
const mockGetAlbumById = jest.fn<any>();

jest.mock('../../services/album.service.js', () => {
    return {
        AlbumService: jest.fn().mockImplementation(() => ({
            getAllAlbums: mockGetAllAlbums,
            getAlbumById: mockGetAlbumById
        }))
    };
});

// Mock Clerk Middleware (not strictly used by Album Routes but good for stability)
jest.mock('@clerk/express', () => ({
    clerkMiddleware: () => (req: Request, res: Response, next: NextFunction) => {
        (req as any).auth = (req as any).auth || { userId: 'clerk_test_user' };
        next();
    },
    requireAuth: () => (req: Request, res: Response, next: NextFunction) => next(),
}));

// Import app AFTER mocks
import { app } from '../../app.js';

describe('Album Routes Integration', () => {

    beforeAll(async () => {
        const { redisService } = await import('../../services/redis.service.js');
        await redisService.connect();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/albums', () => {
        it('should return paginated list of albums', async () => {
            const mockAlbums = [
                { _id: 'a1', title: 'Album 1' },
                { _id: 'a2', title: 'Album 2' }
            ];
            mockGetAllAlbums.mockResolvedValue(mockAlbums);

            const response = await request(app).get('/api/albums?page=1&limit=10');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveLength(2);
            expect(mockGetAllAlbums).toHaveBeenCalledWith(1, 10);
        });

        it('should handle invalid pagination', async () => {
            const response = await request(app).get('/api/albums?page=-1&limit=10');
            expect(response.status).toBe(400);
        });
    });

    describe('GET /api/albums/:albumId', () => {
        it('should return album by id', async () => {
            const mockAlbum = { _id: 'a1', title: 'Album 1' };
            mockGetAlbumById.mockResolvedValue(mockAlbum);

            const response = await request(app).get('/api/albums/a1');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data._id).toBe('a1');
            expect(mockGetAlbumById).toHaveBeenCalledWith('a1');
        });

        it('should return 404 if album not found', async () => {
            mockGetAlbumById.mockRejectedValue(new Error("Album not found"));

            const response = await request(app).get('/api/albums/non_existent');

            expect(response.status).toBe(404);
            expect(response.body.message).toBe("Album not found");
        });
    });
});
