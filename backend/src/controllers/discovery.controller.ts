/**
 * Update the made-for-you endpoint to use advanced AI recommendations
 * Replace simple content-based with hybrid AI algorithm
 */

import { Request, Response } from "express";
import { Song } from "../models/song.model.js";
import { UserPreference } from "../models/userPreference.model.js";
import { Recommendation } from "../models/recommendation.model.js";
import { hybridRecommendations, updateUserAudioPreferences, updateUserFavorites } from "../services/recommendation.service.js";

/**
 * GET /songs/featured
 * Get curated featured songs
 */
export const getFeaturedSongs = async (req: Request, res: Response) => {
    try {
        const { limit = 20 } = req.query;

        const songs = await Song.find({ isFeatured: true })
            .sort({ playCount: -1, createdAt: -1 })
            .limit(Number(limit))
            .select("-__v");

        return res.status(200).json({
            success: true,
            data: songs,
            count: songs.length,
        });
    } catch (error: any) {
        console.error("Error fetching featured songs:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch featured songs",
            error: error.message,
        });
    }
};

/**
 * GET /songs/trending
 * Get trending songs based on recent popularity
 */
export const getTrendingSongs = async (req: Request, res: Response) => {
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

        return res.status(200).json({
            success: true,
            data: songs,
            count: songs.length,
            period,
        });
    } catch (error: any) {
        console.error("Error fetching trending songs:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch trending songs",
            error: error.message,
        });
    }
};

/**
 * GET /songs/made-for-you
 * AI-powered personalized recommendations
 */
export const getMadeForYouSongs = async (req: Request, res: Response) => {
    try {
        const { limit = 20 } = req.query;
        const userId = (req as any).auth?.userId; // From Clerk middleware

        if (!userId) {
            // Return popular songs for non-authenticated users
            const songs = await Song.find()
                .sort({ playCount: -1, likeCount: -1 })
                .limit(Number(limit))
                .select("-__v");

            return res.status(200).json({
                success: true,
                data: songs,
                count: songs.length,
                algorithm: "popular",
                message: "Sign in for personalized recommendations",
            });
        }

        // Update user preferences first (async in background)
        updateUserAudioPreferences(userId).cat ch(() => { });
        updateUserFavorites(userId).catch(() => { });

        // Check for cached recommendations
        const cached = await Recommendation.findOne({
            userId,
            expiresAt: { $gt: new Date() },
        }).populate("songs");

        if (cached && cached.songs.length > 0) {
            return res.status(200).json({
                success: true,
                data: cached.songs.slice(0, Number(limit)),
                count: cached.songs.length,
                algorithm: cached.algorithm,
                confidence: cached.confidence,
                cached: true,
            });
        }

        // Use hybrid AI recommendations
        const { songs, algorithm, confidence } = await hybridRecommendations(
            userId,
            Number(limit)
        );

        return res.status(200).json({
            success: true,
            data: songs,
            count: songs.length,
            algorithm,
            confidence,
            cached: false,
        });
    } catch (error: any) {
        console.error("Error fetching personalized songs:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch personalized songs",
            error: error.message,
        });
    }
};

/**
 * GET /songs/new-releases
 * Get latest song releases
 */
export const getNewReleases = async (req: Request, res: Response) => {
    try {
        const { limit = 20 } = req.query;

        const songs = await Song.find()
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .select("-__v");

        return res.status(200).json({
            success: true,
            data: songs,
            count: songs.length,
        });
    } catch (error: any) {
        console.error("Error fetching new releases:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch new releases",
            error: error.message,
        });
    }
};

/**
 * GET /songs/genres/:genre
 * Get songs by genre
 */
export const getSongsByGenre = async (req: Request, res: Response) => {
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

        return res.status(200).json({
            success: true,
            data: songs,
            count: songs.length,
            genre,
        });
    } catch (error: any) {
        console.error("Error fetching songs by genre:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch songs by genre",
            error: error.message,
        });
    }
};
