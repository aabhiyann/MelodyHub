import { Request, Response, NextFunction } from 'express';
import { redisService } from '../services/redis.service.js';

/**
 * Cache Middleware
 * Automatically cache GET requests with configurable TTL
 */
export interface CacheOptions {
    ttl?: number; // TTL in seconds
    key?: (req: Request) => string; // Custom key generator
    condition?: (req: Request) => boolean; // When to cache
}

/**
 * Create cache middleware with options
 */
export const cacheMiddleware = (options: CacheOptions = {}) => {
    const {
        ttl = 3600, // Default 1 hour
        key = (req) => `cache:${req.method}:${req.originalUrl}`,
        condition = () => true,
    } = options;

    return async (req: Request, res: Response, next: NextFunction) => {
        // Only cache GET requests
        if (req.method !== 'GET') {
            return next();
        }

        // Check condition
        if (!condition(req)) {
            return next();
        }

        // Generate cache key
        const cacheKey = key(req);

        try {
            // Try to get from cache
            const cached = await redisService.get(cacheKey);

            if (cached) {
                // Cache hit
                console.log(`✅ Cache HIT: ${cacheKey}`);
                // Ensure cached value is an object before spreading
                const cachedData = typeof cached === 'object' && cached !== null ? cached : { data: cached };
                return res.status(200).json({
                    ...cachedData,
                    cached: true,
                    _meta: {
                        cached: true,
                        key: cacheKey,
                        ttl: await redisService.ttl(cacheKey),
                    },
                });
            }

            // Cache miss - intercept response
            console.log(`❌ Cache MISS: ${cacheKey}`);

            // Store original json method
            const originalJson = res.json.bind(res);

            // Override json method to cache response
            res.json = function (body: any) {
                // Only cache successful responses
                if (res.statusCode === 200) {
                    redisService.set(cacheKey, body, ttl).catch((err) => {
                        console.error('Failed to cache response:', err);
                    });
                }

                return originalJson(body);
            };

            next();
        } catch (error) {
            console.error('Cache middleware error:', error);
            next();
        }
    };
};

/**
 * Cache invalidation middleware
 * Automatically invalidate cache on POST/PUT/DELETE
 */
export const cacheInvalidationMiddleware = (patterns: string[] | ((req: Request) => string[])) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Only invalidate on mutation requests
        if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
            return next();
        }

        // Store original send method
        const originalSend = res.send.bind(res);

        // Override send to invalidate cache after successful response
        res.send = function (body: any) {
            // Only invalidate on successful responses
            if (res.statusCode >= 200 && res.statusCode < 300) {
                const patternsToInvalidate = typeof patterns === 'function' ? patterns(req) : patterns;

                // Invalidate in background
                Promise.all(
                    patternsToInvalidate.map((pattern) =>
                        redisService.delPattern(pattern)
                    )
                ).catch((err) => {
                    console.error('Failed to invalidate cache:', err);
                });
            }

            return originalSend(body);
        };

        next();
    };
};

/**
 * User-specific cache key generator
 */
export const userCacheKey = (req: Request, prefix: string = 'user') => {
    const userId = (req as any).auth?.userId || 'anonymous';
    return `cache:${prefix}:${userId}:${req.originalUrl}`;
};

/**
 * Predefined cache strategies
 */
export const CacheStrategies = {
    // Featured songs - 1 hour TTL
    featured: cacheMiddleware({
        ttl: 3600,
        key: (req) => 'cache:songs:featured',
    }),

    // Trending songs - 15 minutes TTL (frequent updates)
    trending: cacheMiddleware({
        ttl: 900,
        key: (req) => {
            const period = req.query.period || '24h';
            return `cache:songs:trending:${period}`;
        },
    }),

    // Recommendations - 6 hours TTL, user-specific
    recommendations: cacheMiddleware({
        ttl: 21600,
        key: (req) => userCacheKey(req, 'recommendations'),
        condition: (req) => !!(req as any).auth?.userId, // Only cache for authenticated users
    }),

    // New releases - 30 minutes TTL
    newReleases: cacheMiddleware({
        ttl: 1800,
        key: (req) => 'cache:songs:new-releases',
    }),

    // Genre songs - 30 minutes TTL
    genre: cacheMiddleware({
        ttl: 1800,
        key: (req) => {
            const genre = req.params.genre || 'unknown';
            const sort = req.query.sort || 'popular';
            return `cache:songs:genre:${genre}:${sort}`;
        },
    }),

    // User preferences - 1 hour TTL
    userPreferences: cacheMiddleware({
        ttl: 3600,
        key: (req) => userCacheKey(req, 'preferences'),
        condition: (req) => !!(req as any).auth?.userId,
    }),

    // Albums list - 30 minutes TTL
    albumsList: cacheMiddleware({
        ttl: 1800,
        key: () => 'cache:albums:list',
    }),

    // Album by ID - 30 minutes TTL
    albumById: cacheMiddleware({
        ttl: 1800,
        key: (req) => `cache:album:${req.params.albumId || 'unknown'}`,
    }),

    // Stats (admin) - 5 minutes TTL
    stats: cacheMiddleware({
        ttl: 300,
        key: () => 'cache:stats',
    }),
};

/**
 * Cache invalidation strategies
 */
export const InvalidationStrategies = {
    // Invalidate all song caches when songs are modified
    songs: cacheInvalidationMiddleware([
        'cache:songs:*',
        'cache:recommendations:*',
    ]),

    // Invalidate user-specific caches
    user: cacheInvalidationMiddleware((req) => {
        const userId = (req as any).auth?.userId;
        return userId ? [`cache:user:${userId}:*`, `cache:recommendations:${userId}:*`] : [];
    }),

    // Invalidate all caches (use sparingly)
    all: cacheInvalidationMiddleware(['cache:*']),
};
