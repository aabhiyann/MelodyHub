/**
 * Advanced Database Utilities
 * Query optimization, pagination, aggregation pipelines
 */

import { FilterQuery, SortOrder } from 'mongoose';

/**
 * Cursor-based pagination (better than offset for large datasets)
 */
export interface CursorPaginationOptions<T> {
    limit?: number;
    cursor?: string; // Base64 encoded cursor
    sortField?: keyof T;
    sortOrder?: 'asc' | 'desc';
}

export interface CursorPaginationResult<T> {
    data: T[];
    nextCursor: string | null;
    hasMore: boolean;
    total?: number;
}

/**
 * Create cursor-based pagination
 */
export function createCursorPagination<T extends { _id: any }>(
    query: FilterQuery<T>,
    options: CursorPaginationOptions<T> = {}
): {
    query: FilterQuery<T>;
    limit: number;
    sort: { [key: string]: SortOrder };
} {
    const {
        limit = 20,
        cursor,
        sortField = '_id' as keyof T,
        sortOrder = 'desc',
    } = options;

    // Decode cursor
    let cursorValue: any = null;
    if (cursor) {
        try {
            const decoded = Buffer.from(cursor, 'base64').toString('utf-8');
            cursorValue = JSON.parse(decoded);
        } catch (error) {
            console.error('Invalid cursor:', error);
        }
    }

    // Build query with cursor
    const paginatedQuery: FilterQuery<T> = { ...query };
    if (cursorValue) {
        const operator = sortOrder === 'desc' ? '$lt' : '$gt';
        paginatedQuery[sortField as string] = { [operator]: cursorValue };
    }

    // Build sort
    const sort: { [key: string]: SortOrder } = {
        [sortField as string]: sortOrder === 'desc' ? -1 : 1,
    };

    return {
        query: paginatedQuery,
        limit: limit + 1, // Fetch one extra to determine hasMore
        sort,
    };
}

/**
 * Create next cursor from result
 */
export function createNextCursor<T extends { _id: any }>(
    data: T[],
    limit: number,
    sortField: keyof T = '_id' as keyof T
): string | null {
    if (data.length <= limit) return null;

    const lastItem = data[limit - 1];
    const cursorValue = lastItem[sortField];

    return Buffer.from(JSON.stringify(cursorValue)).toString('base64');
}

/**
 * Batch operations helper
 */
export async function batchOperation<T, R>(
    items: T[],
    batchSize: number,
    operation: (batch: T[]) => Promise<R>
): Promise<R[]> {
    const results: R[] = [];

    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const result = await operation(batch);
        results.push(result);
    }

    return results;
}

/**
 * Common aggregation pipelines
 */
export const AggregationPipelines = {
    /**
     * Get trending songs with play count
     */
    trendingSongs: (period: '24h' | '7d' | '30d' = '24h') => {
        const hoursMap = { '24h': 24, '7d': 168, '30d': 720 };
        const hours = hoursMap[period];
        const dateThreshold = new Date(Date.now() - hours * 60 * 60 * 1000);

        return [
            {
                $match: {
                    $or: [
                        { isTrending: true },
                        {
                            createdAt: { $gte: dateThreshold },
                            playCount: { $gte: 10 },
                        },
                    ],
                },
            },
            {
                $addFields: {
                    trendingScore: {
                        $add: [
                            { $multiply: ['$playCount', 1] },
                            { $multiply: ['$likeCount', 2] },
                            { $divide: [{ $subtract: [Date.now(), '$createdAt'] }, 3600000] }, // Recency bonus
                        ],
                    },
                },
            },
            {
                $sort: { trendingScore: -1 },
            },
            {
                $project: {
                    trendingScore: 0,
                    __v: 0,
                },
            },
        ];
    },

    /**
     * Get popular songs by genre
     */
    popularByGenre: (limit: number = 10) => [
        {
            $match: {
                genre: { $exists: true, $ne: null },
            },
        },
        {
            $group: {
                _id: '$genre',
                songs: {
                    $push: {
                        _id: '$_id',
                        title: '$title',
                        artist: '$artist',
                        playCount: '$playCount',
                    },
                },
                totalPlays: { $sum: '$playCount' },
            },
        },
        {
            $sort: { totalPlays: -1 },
        },
        {
            $limit: limit,
        },
        {
            $project: {
                genre: '$_id',
                songs: { $slice: ['$songs', 5] }, // Top 5 songs per genre
                totalPlays: 1,
            },
        },
    ],

    /**
     * Get user listening stats
     */
    userStats: (userId: string) => [
        {
            $match: { userId },
        },
        {
            $project: {
                totalPlays: { $size: '$listeningHistory' },
                totalLikes: { $size: '$likedSongs' },
                topGenres: { $slice: ['$favoriteGenres', 3] },
                topArtists: { $slice: ['$favoriteArtists', 5] },
            },
        },
    ],

    /**
     * Get recommendations for similar users
     */
    similarUsers: (likedSongIds: string[], limit: number = 10) => [
        {
            $match: {
                likedSongs: { $in: likedSongIds },
            },
        },
        {
            $addFields: {
                overlap: {
                    $size: {
                        $setIntersection: ['$likedSongs', likedSongIds],
                    },
                },
            },
        },
        {
            $sort: { overlap: -1 },
        },
        {
            $limit: limit,
        },
    ],
};

/**
 * Query performance logger
 */
export function logQueryPerformance(queryName: string) {
    const start = Date.now();

    return () => {
        const duration = Date.now() - start;
        if (duration > 100) {
            console.warn(`⚠️  Slow query [${queryName}]: ${duration}ms`);
        } else {
            console.log(`✅ Query [${queryName}]: ${duration}ms`);
        }
    };
}
