import { Request, Response, NextFunction } from "express";
import * as moodService from "../services/mood.service.js";
import { Song } from "../models/song.model.js";
import { AuthenticatedRequest } from "../types/index.js";

export class MoodController {
    /**
     * GET /api/mood/current
     * Detect current mood from listening patterns
     */
    static async getCurrentMood(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as AuthenticatedRequest).auth?.userId;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }

            const result = await moodService.getCurrentMood(userId);

            return res.status(200).json({
                success: true,
                data: result
            });
        } catch (error: any) {
            console.error("Error in getCurrentMood:", error);
            next(error);
        }
    }

    /**
     * GET /api/mood/playlist?mood=happy&limit=20
     * Get playlist for a mood
     */
    static async getPlaylistForMood(req: Request, res: Response, next: NextFunction) {
        try {
            const mood = (req.query.mood as moodService.MoodLabel) || "neutral";
            const validMoods: moodService.MoodLabel[] = [
                "happy",
                "sad",
                "energetic",
                "chill",
                "focused",
                "romantic",
                "neutral",
            ];
            const moodKey = validMoods.includes(mood) ? mood : "neutral";
            const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
            const userId = (req as AuthenticatedRequest).auth?.userId;

            const songIds = await moodService.getPlaylistForMood(moodKey, limit, userId);
            const songs = await Song.find({ _id: { $in: songIds } }).lean();

            // Order songs by the recommendation order
            const orderMap = new Map(songIds.map((id, i) => [id.toString(), i]));
            const ordered = songs.sort(
                (a, b) => (orderMap.get((a as any)._id.toString()) ?? 0) - (orderMap.get((b as any)._id.toString()) ?? 0)
            );

            return res.status(200).json({
                success: true,
                data: ordered
            });
        } catch (error: any) {
            console.error("Error in getPlaylistForMood:", error);
            next(error);
        }
    }
}
