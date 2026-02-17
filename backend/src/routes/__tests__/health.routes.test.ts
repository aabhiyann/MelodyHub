import { jest, describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';

// Mock redis package
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

import { app } from '../../app.js';

describe('Health Check Integration', () => {

    beforeAll(async () => {
        // We import redisService dynamically to ensure mock is applied first
        // And calling connect() sets isConnected=true via our mock 'on' handler
        const { redisService } = await import('../../services/redis.service.js');
        await redisService.connect();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    it('GET /api/health should return 200 and healthy status', async () => {
        const response = await request(app).get('/api/health');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status', 'healthy');
        expect(response.body.services.mongodb).toHaveProperty('connected', true);
        expect(response.body.services.redis).toHaveProperty('connected', true);
    });
});
