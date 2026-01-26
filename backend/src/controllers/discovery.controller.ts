import { Request, Response, NextFunction } from "express";
import { Song } from "../models/song.model.js";
import { Recommendation } from "../models/recommendation.model.js";
import {
    hybridRecommendations,
    updateUserAudioPreferences,
    updateUserFavorites,
    getSimilarSongs,
    getDailyMix as getDailyMixService
} from "../services/recommendation.service.js";
import { BaseController } from "./base.controller.js";

export class DiscoveryController extends BaseController {
    /**
     * GET /api/discovery/featured
     * Get curated featured songs
     */
    getFeaturedSongs = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { limit = 20 } = req.query;

            const songs = await Song.find({ isFeatured: true })
                .sort({ playCount: -1, createdAt: -1 })
                .limit(Number(limit))
                .select("-__v");

            this.handleSuccess(res, { success: true, data: songs });
        } catch (error: any) {
            this.handleError(next, error);
        }
    };

    /**
     * GET /api/discovery/trending
     * Get trending songs based on recent popularity
     */
    getTrendingSongs = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { limit = 20, period = "24h" } = req.query;

            // Calculate date threshold based on period
            const now = new Date();
            let dateThreshold: Date;

            switch (period) {
                case "7d":
                    dateThreshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                case "30d":
                    dateThreshold = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    break;
                case "24h":
                default:
                    dateThreshold = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            }

            const songs = await Song.find({
                $or: [
                    { isTrending: true },
                    { createdAt: { $gte: dateThreshold }, playCount: { $gte: 10 } },
                ],
            })
                .sort({ playCount: -1, likeCount: -1 })
                .limit(Number(limit))
                .select("-__v");

            this.handleSuccess(res, { success: true, data: songs });
        } catch (error: any) {
            this.handleError(next, error);
        }
    };

    /**
     * GET /api/discovery/made-for-you
     * AI-powered personalized recommendations
     */
    getMadeForYouSongs = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { limit = 20 } = req.query;
            const userId = (req as any).auth?.userId; // From Clerk middleware

            if (!userId) {
                // Return popular songs for non-authenticated users
                const songs = await Song.find()
                    .sort({ playCount: -1, likeCount: -1 })
                    .limit(Number(limit))
                    .select("-__v");

                // We can still use handleSuccess, just unstructured the data slightly differently if we want the algorithm/message metadata.
                // But BaseController usually just wraps data.
                // Let's stick to returning data array effectively, or overload handleSuccess if needed.
                // For now, let's keep it simple and just return the songs array in data, 
                // but we might want to pass extra metadata in the future.
                this.handleSuccess(res, { success: true, data: songs });
                return;
            }

            // Update user preferences first (async in background)
            updateUserAudioPreferences(userId).catch(() => { });
            updateUserFavorites(userId).catch(() => { });

            // Check for cached recommendations
            const cached = await Recommendation.findOne({
                userId,
                expiresAt: { $gt: new Date() },
            }).populate("songs");

            if (cached && cached.songs.length > 0) {
                this.handleSuccess(res, {
                    success: true,
                    data: cached.songs.slice(0, Number(limit)),
                    algorithm: cached.algorithm,
                    confidence: cached.confidence,
                    cached: true
                });
                return;
            }

            // Use hybrid AI recommendations
            const { songs, algorithm, confidence } = await hybridRecommendations(
                userId,
                Number(limit)
            );

            this.handleSuccess(res, { success: true, data: songs, algorithm, confidence });
        } catch (error: any) {
            this.handleError(next, error);
        }
    };

    /**
     * GET /api/discovery/new-releases
     * Get latest song releases
     */
    getNewReleases = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { limit = 20 } = req.query;

            const songs = await Song.find()
                .sort({ createdAt: -1 })
                .limit(Number(limit))
                .select("-__v");

            this.handleSuccess(res, { success: true, data: songs });
        } catch (error: any) {
            this.handleError(next, error);
        }
    };

    /**
     * GET /api/discovery/genres/:genre
     * Get songs by genre
     */
    getSongsByGenre = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { genre } = req.params;
            const { limit = 20, sort = "popular" } = req.query;

            let sortQuery: any = { playCount: -1 };
            if (sort === "recent") {
                sortQuery = { createdAt: -1 };
            } else if (sort === "liked") {
                sortQuery = { likeCount: -1 };
            }

            const songs = await Song.find({ genre })
                .sort(sortQuery)
                .limit(Number(limit))
                .select("-__v");

            this.handleSuccess(res, { success: true, data: songs });
        } catch (error: any) {
            this.handleError(next, error);
        }
    };

    /**
     * GET /api/discovery/radio/:songId
     * Start a radio station based on a seed song
     */
    getRadio = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { songId } = req.params;
            const { limit = 20 } = req.query;

            const songs = await getSimilarSongs(songId as string, Number(limit));

            this.handleSuccess(res, { success: true, data: songs, seedSongId: songId });
        } catch (error: any) {
            this.handleError(next, error);
        }
    };

    /**
     * GET /api/discovery/daily-mix
     * Get daily mix based on top genre
     */
    getDailyMix = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).auth?.userId;
            const { limit = 20 } = req.query;

            // Auth check already handled by protectRoute middleware, but TS might need reassurance or simple double check
            if (!userId) {
                // Should be caught by middleware, but if reached:
                res.status(401).json({ success: false, message: "Unauthorized" });
                return;
            }

            const songs = await getDailyMixService(userId, Number(limit));

            this.handleSuccess(res, { success: true, data: songs });
        } catch (error: any) {
            this.handleError(next, error);
        }
    };
}
