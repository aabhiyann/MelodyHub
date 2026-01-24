import { Request, Response } from "express";
import { UserPreference } from "../models/userPreference.model.js";
import mongoose from "mongoose";
import { ActivityService } from "../services/activity.service.js";
import { ActivityType } from "../models/activity.model.js";

const activityService = new ActivityService();

/**
 * POST /api/analytics/track-play
 * Track song play for recommendations
 */
export const trackPlay = async (req: Request, res: Response) => {
    try {
        const { songId, completionRate, skipped } = req.body;
        const userId = (req as any).auth?.userId;

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
        const userId = (req as any).auth?.userId;

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
        const userId = (req as any).auth?.userId;

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
