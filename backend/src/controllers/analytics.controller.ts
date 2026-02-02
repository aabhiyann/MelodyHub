import { Request, Response } from "express";
import { UserPreference } from "../models/userPreference.model.js";
import mongoose from "mongoose";
import { ActivityService } from "../services/activity.service.js";
import { ActivityType } from "../models/activity.model.js";
import { AuthenticatedRequest } from "../types/index.js";
import * as analyticsService from "../services/analytics.service.js";

const activityService = new ActivityService();

/**
 * POST /api/analytics/track-play
 * Track song play for recommendations
 */
export const trackPlay = async (req: Request, res: Response) => {
    try {
        const { songId, completionRate, skipped } = req.body;
        const userId = (req as AuthenticatedRequest).auth?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        // Find or create user preference
        let userPref = await UserPreference.findOne({ userId });

        if (!userPref) {
            userPref = new UserPreference({
                userId,
                listeningHistory: [],
                likedSongs: [],
                favoriteGenres: [],
                favoriteArtists: [],
                audioPreferences: {},
                explicitContent: false,
            });
        }

        // Add to listening history (keep last 100)
        userPref.listeningHistory.push({
            songId: new mongoose.Types.ObjectId(songId),
            playedAt: new Date(),
            completionRate: completionRate || 0,
            skipped: skipped || false,
        });

        // Keep only last 100 plays
        if (userPref.listeningHistory.length > 100) {
            userPref.listeningHistory = userPref.listeningHistory.slice(-100);
        }

        await userPref.save();

        return res.status(200).json({
            success: true,
            message: "Play tracked successfully",
        });
    } catch (error: any) {
        console.error("Error tracking play:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to track play",
            error: error.message,
        });
    }
};

/**
 * POST /api/analytics/like-song
 * Like/unlike a song
 */
export const likeSong = async (req: Request, res: Response) => {
    try {
        const { songId, liked } = req.body;
        const userId = (req as AuthenticatedRequest).auth?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        let userPref = await UserPreference.findOne({ userId });

        if (!userPref) {
            userPref = new UserPreference({
                userId,
                listeningHistory: [],
                likedSongs: [],
                favoriteGenres: [],
                favoriteArtists: [],
                audioPreferences: {},
                explicitContent: false,
            });
        }

        const songObjectId = new mongoose.Types.ObjectId(songId);

        if (liked) {
            // Add to liked songs if not already liked
            if (!userPref.likedSongs.some((id) => id.equals(songObjectId))) {
                userPref.likedSongs.push(songObjectId);

                // Log activity
                await activityService.logActivity(userId, ActivityType.LIKE_SONG, songId);
            }
        } else {
            // Remove from liked songs
            userPref.likedSongs = userPref.likedSongs.filter(
                (id) => !id.equals(songObjectId)
            );
        }

        await userPref.save();

        return res.status(200).json({
            success: true,
            message: liked ? "Song liked" : "Song unliked",
            likedSongs: userPref.likedSongs,
        });
    } catch (error: any) {
        console.error("Error liking song:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to like/unlike song",
            error: error.message,
        });
    }
};

/**
 * GET /api/analytics/user-preferences
 * Get user's preferences and stats
 */
export const getUserPreferences = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthenticatedRequest).auth?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const userPref = await UserPreference.findOne({ userId }).populate(
            "likedSongs listeningHistory.songId"
        );

        if (!userPref) {
            return res.status(200).json({
                success: true,
                data: null,
                message: "No preferences found",
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                favoriteGenres: userPref.favoriteGenres,
                favoriteArtists: userPref.favoriteArtists,
                audioPreferences: userPref.audioPreferences,
                likedSongsCount: userPref.likedSongs.length,
                totalPlays: userPref.listeningHistory.length,
                listeningHistory: userPref.listeningHistory,
            },
        });
    } catch (error: any) {
        console.error("Error fetching user preferences:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch preferences",
            error: error.message,
        });
    }
};

/**
 * GET /api/analytics/dashboard
 * Overall user stats (listening time, plays, top artists, etc.)
 */
export const getDashboard = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthenticatedRequest).auth?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Authentication required" });
        }
        const period = (req.query.period as 'week' | 'month' | 'year' | 'all') || 'all';
        const dashboard = await analyticsService.getUserDashboard(userId, period);
        return res.status(200).json({ success: true, data: dashboard });
    } catch (error: any) {
        console.error("Error fetching dashboard:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch dashboard", error: error.message });
    }
};

/**
 * GET /api/analytics/listening-history
 * Recent plays with pagination
 */
export const getListeningHistory = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthenticatedRequest).auth?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Authentication required" });
        }
        const page = parseInt(req.query.page as string) || 1;
        const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
        const result = await analyticsService.getListeningHistoryPaginated(userId, page, limit);
        return res.status(200).json({ success: true, ...result });
    } catch (error: any) {
        console.error("Error fetching listening history:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch history", error: error.message });
    }
};

/**
 * GET /api/analytics/top-artists
 * Top 10 artists by play count
 */
export const getTopArtists = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthenticatedRequest).auth?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Authentication required" });
        }
        const period = (req.query.period as 'week' | 'month' | 'year' | 'all') || 'all';
        const dashboard = await analyticsService.getUserDashboard(userId, period);
        return res.status(200).json({ success: true, data: dashboard.topArtists });
    } catch (error: any) {
        console.error("Error fetching top artists:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch top artists", error: error.message });
    }
};

/**
 * GET /api/analytics/top-genres
 * Top 5 genres
 */
export const getTopGenres = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthenticatedRequest).auth?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Authentication required" });
        }
        const period = (req.query.period as 'week' | 'month' | 'year' | 'all') || 'all';
        const dashboard = await analyticsService.getUserDashboard(userId, period);
        return res.status(200).json({ success: true, data: dashboard.topGenres });
    } catch (error: any) {
        console.error("Error fetching top genres:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch top genres", error: error.message });
    }
};

/**
 * GET /api/analytics/listening-patterns
 * Hour/day distribution
 */
export const getListeningPatterns = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthenticatedRequest).auth?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Authentication required" });
        }
        const patterns = await analyticsService.getListeningPatterns(userId);
        return res.status(200).json({ success: true, data: patterns });
    } catch (error: any) {
        console.error("Error fetching listening patterns:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch patterns", error: error.message });
    }
};
