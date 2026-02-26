import { Song } from "../models/song.model.js";

export class DiscoveryService {
    /**
     * Get featured songs
     */
    async getFeaturedSongs(limit: number = 20): Promise<any[]> {
        return await Song.find({ isFeatured: true })
            .sort({ playCount: -1, createdAt: -1 })
            .limit(limit)
            .select("-__v")
            .lean();
    }

    /**
     * Get trending songs based on recent popularity
     */
    async getTrendingSongs(limit: number = 20, period: string = "24h"): Promise<any[]> {
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

        return await Song.find({
            $or: [
                { isTrending: true },
                { createdAt: { $gte: dateThreshold }, playCount: { $gte: 10 } },
            ],
        })
            .sort({ playCount: -1, likeCount: -1 })
            .limit(limit)
            .select("-__v")
            .lean();
    }

    /**
     * Get new releases
     */
    async getNewReleases(limit: number = 20): Promise<any[]> {
        return await Song.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .select("-__v")
            .lean();
    }

    /**
     * Get songs by genre
     */
    async getSongsByGenre(genre: string, limit: number = 20, sort: string = "popular"): Promise<any[]> {
        let sortQuery: Record<string, 1 | -1> = { playCount: -1 };

        if (sort === "recent") {
            sortQuery = { createdAt: -1 };
        } else if (sort === "liked") {
            sortQuery = { likeCount: -1 };
        }

        return await Song.find({ genre })
            .sort(sortQuery)
            .limit(limit)
            .select("-__v")
            .lean();
    }
}
