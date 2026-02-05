import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/index.js";
import * as analyticsService from "../services/analytics.service.js";

export class AnalyticsController {
    /**
     * POST /api/analytics/track-play
     * Track song play for recommendations
     */
    static async trackPlay(req: Request, res: Response) {
        try {
            const { songId, completionRate, skipped } = req.body;
            const userId = (req as AuthenticatedRequest).auth?.userId;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required",
                });
            }

            // Delegate to service
            await analyticsService.trackPlay(userId, songId, completionRate, skipped);

            return res.status(200).json({
                success: true,
                message: "Play tracked successfully",
            });
        } catch (error: any) {
            console.error("Error in trackPlay:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to track play",
                error: error.message,
            });
        }
    }

    /**
     * POST /api/analytics/like-song
     * Like/unlike a song
     */
    static async likeSong(req: Request, res: Response) {
        try {
            const { songId, liked } = req.body;
            const userId = (req as AuthenticatedRequest).auth?.userId;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required",
                });
            }

            // Delegate to service
            const result = await analyticsService.toggleLikeSong(userId, songId, liked);

            return res.status(200).json({
                success: true,
                message: liked ? "Song liked" : "Song unliked",
                likedSongs: result.likedSongs,
            });
        } catch (error: any) {
            console.error("Error in likeSong:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to like/unlike song",
                error: error.message,
            });
        }
    }

    /**
     * GET /api/analytics/user-preferences
     * Get user's preferences and stats
     */
    static async getUserPreferences(req: Request, res: Response) {
        try {
            const userId = (req as AuthenticatedRequest).auth?.userId;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required",
                });
            }

            // Delegate to service for detailed dashboard
            const dashboard = await analyticsService.getUserDashboard(userId);

            return res.status(200).json({
                success: true,
                data: dashboard,
            });
        } catch (error: any) {
            console.error("Error in getUserPreferences:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch preferences",
                error: error.message,
            });
        }
    }

    /**
     * GET /api/analytics/dashboard
     * Overall user stats (listening time, plays, top artists, etc.)
     */
    static async getDashboard(req: Request, res: Response) {
        try {
            const userId = (req as AuthenticatedRequest).auth?.userId;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }

            const period = (req.query.period as 'week' | 'month' | 'year' | 'all') || 'all';
            const dashboard = await analyticsService.getUserDashboard(userId, period);

            return res.status(200).json({
                success: true,
                data: dashboard
            });
        } catch (error: any) {
            console.error("Error in getDashboard:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch dashboard",
                error: error.message
            });
        }
    }

    /**
     * GET /api/analytics/listening-history
     * Recent plays with pagination
     */
    static async getListeningHistory(req: Request, res: Response) {
        try {
            const userId = (req as AuthenticatedRequest).auth?.userId;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }

            const page = parseInt(req.query.page as string) || 1;
            const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
            const result = await analyticsService.getListeningHistoryPaginated(userId, page, limit);

            return res.status(200).json({
                success: true,
                ...result
            });
        } catch (error: any) {
            console.error("Error in getListeningHistory:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch history",
                error: error.message
            });
        }
    }

    /**
     * GET /api/analytics/top-artists
     * Top 10 artists by play count
     */
    static async getTopArtists(req: Request, res: Response) {
        try {
            const userId = (req as AuthenticatedRequest).auth?.userId;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }

            const period = (req.query.period as 'week' | 'month' | 'year' | 'all') || 'all';
            const dashboard = await analyticsService.getUserDashboard(userId, period);

            return res.status(200).json({
                success: true,
                data: dashboard.topArtists
            });
        } catch (error: any) {
            console.error("Error in getTopArtists:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch top artists",
                error: error.message
            });
        }
    }

    /**
     * GET /api/analytics/top-genres
     * Top 5 genres
     */
    static async getTopGenres(req: Request, res: Response) {
        try {
            const userId = (req as AuthenticatedRequest).auth?.userId;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }

            const period = (req.query.period as 'week' | 'month' | 'year' | 'all') || 'all';
            const dashboard = await analyticsService.getUserDashboard(userId, period);

            return res.status(200).json({
                success: true,
                data: dashboard.topGenres
            });
        } catch (error: any) {
            console.error("Error in getTopGenres:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch top genres",
                error: error.message
            });
        }
    }

    /**
     * GET /api/analytics/listening-patterns
     * Hour/day distribution
     */
    static async getListeningPatterns(req: Request, res: Response) {
        try {
            const userId = (req as AuthenticatedRequest).auth?.userId;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }

            const patterns = await analyticsService.getListeningPatterns(userId);

            return res.status(200).json({
                success: true,
                data: patterns
            });
        } catch (error: any) {
            console.error("Error in getListeningPatterns:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch patterns",
                error: error.message
            });
        }
    }
}
