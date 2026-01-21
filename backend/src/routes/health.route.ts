import { Router } from "express";
import { connectDB } from "../lib/db.js";
import { redisService } from "../services/redis.service.js";
import { Song } from "../models/song.model.js";
import { UserPreference } from "../models/userPreference.model.js";
import { Recommendation } from "../models/recommendation.model.js";

const router = Router();

/**
 * GET /health
 * Basic health check
 */
router.get("/", async (req, res) => {
    try {
        // Check MongoDB connection
        const mongoStatus = await checkMongoDB();

        // Check Redis connection
        const redisStatus = await checkRedis();

        const status = mongoStatus.connected && redisStatus.connected ? "healthy" : "degraded";

        return res.status(200).json({
            success: true,
            status,
            timestamp: new Date().toISOString(),
            services: {
                mongodb: mongoStatus,
                redis: redisStatus,
            },
            uptime: process.uptime(),
            memory: {
                used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + " MB",
                total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + " MB",
            },
        });
    } catch (error: any) {
        return res.status(503).json({
            success: false,
            status: "unhealthy",
            error: error.message,
        });
    }
});

/**
 * GET /health/cache
 * Cache performance statistics
 */
router.get("/cache", async (req, res) => {
    try {
        const stats = await redisService.getStats();

        return res.status(200).json({
            success: true,
            cache: stats,
            timestamp: new Date().toISOString(),
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Failed to get cache stats",
            error: error.message,
        });
    }
});

/**
 * GET /health/database
 * Database statistics
 */
router.get("/database", async (req, res) => {
    try {
        const [songCount, userPrefCount, recommendationCount] = await Promise.all([
            Song.countDocuments(),
            UserPreference.countDocuments(),
            Recommendation.countDocuments(),
        ]);

        return res.status(200).json({
            success: true,
            database: {
                connected: true,
                collections: {
                    songs: songCount,
                    userPreferences: userPrefCount,
                    recommendations: recommendationCount,
                },
            },
            timestamp: new Date().toISOString(),
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Failed to get database stats",
            error: error.message,
        });
    }
});

/**
 * Helper: Check MongoDB connection
 */
async function checkMongoDB(): Promise<{ connected: boolean; responseTime?: number }> {
    try {
        const start = Date.now();
        await Song.findOne().limit(1).lean();
        const responseTime = Date.now() - start;

        return { connected: true, responseTime };
    } catch (error) {
        return { connected: false };
    }
}

/**
 * Helper: Check Redis connection
 */
async function checkRedis(): Promise<{ connected: boolean; responseTime?: number; keyCount?: number }> {
    try {
        const start = Date.now();
        const stats = await redisService.getStats();
        const responseTime = Date.now() - start;

        return {
            connected: stats.connected,
            responseTime,
            keyCount: stats.keyCount,
        };
    } catch (error) {
        return { connected: false };
    }
}

export default router;
