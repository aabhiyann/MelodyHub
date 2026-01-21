/**
 * MelodyHub Backend Tests
 * Comprehensive test suite for all backend functionality
 */

import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';

describe('MelodyHub Backend - Integration Tests', () => {
    const API_BASE = 'http://localhost:5001/api';

    beforeAll(async () => {
        // Wait for server to be ready
        await new Promise(resolve => setTimeout(resolve, 2000));
    });

    afterAll(async () => {
        // Cleanup
    });

    describe('Discovery Endpoints', () => {
        test('GET /songs/featured should return featured songs', async () => {
            const response = await fetch(`${API_BASE}/songs/featured`);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.success).toBe(true);
            expect(Array.isArray(data.data)).toBe(true);
        });

        test('GET /songs/trending should return trending songs', async () => {
            const response = await fetch(`${API_BASE}/songs/trending`);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.success).toBe(true);
            expect(Array.isArray(data.data)).toBe(true);
        });

        test('GET /songs/trending?period=7d should accept period parameter', async () => {
            const response = await fetch(`${API_BASE}/songs/trending?period=7d`);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.period).toBe('7d');
        });

        test('GET /songs/new-releases should return latest songs', async () => {
            const response = await fetch(`${API_BASE}/songs/new-releases`);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.success).toBe(true);
        });

        test('GET /songs/made-for-you without auth should return popular songs', async () => {
            const response = await fetch(`${API_BASE}/songs/made-for-you`);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.algorithm).toBe('popular');
        });
    });

    describe('Health Check', () => {
        test('GET /health should return server status', async () => {
            const response = await fetch(`${API_BASE}/health`);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.success || data.status).toBeDefined();
        });
    });

    describe('Caching', () => {
        test('Second request should return cached response', async () => {
            // First request (cache miss)
            await fetch(`${API_BASE}/songs/featured`);

            // Small delay to ensure cache is set
            await new Promise(resolve => setTimeout(resolve, 100));

            // Second request (cache hit)
            const response2 = await fetch(`${API_BASE}/songs/featured`);
            const data = await response2.json();

            // Check response is successful
            expect(response2.status).toBe(200);
            expect(data.success).toBe(true);

            // Check for cache metadata if Redis is enabled
            if (data._meta) {
                expect(data._meta.cached).toBe(true);
            }
        });
    });

    describe('API Documentation', () => {
        test('GET /api-docs should serve Swagger UI', async () => {
            const response = await fetch('http://localhost:5001/api-docs/', {
                redirect: 'manual'
            });

            expect(response.status).toBeLessThan(400);
        });
    });
});

// Export for running
export { };
