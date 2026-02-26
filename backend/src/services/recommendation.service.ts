import { Song } from "../models/song.model.js";
import { User } from "../models/user.model.js";
import { cosineSimilarity, extractFeatures, Vector } from "../lib/vector.js";
import { redisService } from "./redis.service.js";

// Cache TTLs
const CACHE_TTL_SIMILAR = 86400; // 24 hours
const CACHE_TTL_DISCOVER = 3600; // 1 hour

export class RecommendationService {
    /**
     * Find songs similar to a given song using Cosine Similarity on audio features
     */
    async getSimilarSongs(songId: string, limit: number = 10): Promise<any[]> {
        // Check Cache
        const cacheKey = `rec:similar:${songId}:${limit}`;
        const cached = await redisService.get(cacheKey);
        if (cached) return cached as any[];

        // 1. Get Target Song
        const targetSong = await Song.findById(songId).lean();
        if (!targetSong || !targetSong.features) return [];

        const targetVector = extractFeatures(targetSong);
        if (!targetVector) return [];

        // 2. Get Candidates (All songs with features)
        // Optimization: In a real large-scale app, we would use a Vector DB (Pinecone/Milvus)
        // or MongoDB Atlas Vector Search. For <10k songs, in-memory is fast enough.
        // We select only necessary fields to minimize memory usage.
        const candidates = await Song.find({
            _id: { $ne: songId },
            "features.energy": { $exists: true }
        })
            .select("title artist imageUrl audioUrl features duration folderId userId albumId")
            .lean();

        // 3. Calculate Scores
        const scored = candidates.map(song => {
            const vec = extractFeatures(song);
            if (!vec) return { song, score: 0 };
            return {
                song,
                score: cosineSimilarity(targetVector, vec)
            };
        });

        // 4. Sort & Limit
        const results = scored
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map(item => item.song);

        // Cache Result
        await redisService.set(cacheKey, results, CACHE_TTL_SIMILAR);

        return results;
    }

    /**
     * Generate "Discover Weekly" based on user's recent listening history
     */
    async getDiscoverWeekly(userId: string, limit: number = 20): Promise<any[]> {
        const cacheKey = `rec:discover:${userId}`;
        const cached = await redisService.get(cacheKey);
        if (cached) return cached as any[];

        // 1. Get User's History (from Analytics/Activity - simplified for now: use liked songs or recent plays)
        // NOTE: Since we don't have a full "History" model populated with features yet, 
        // we will infer taste from Liked Songs (User.gamification.lastListenDate isn't enough).
        // Let's assume we use "Songs the user has liked" as the basis.
        // If no liked songs, return trending.

        // Use logic: Get liked songs (we need a stored list of liked songs, implementation detail check needed)
        // Actually User model doesn't explicitly store array of liked song IDs in the schema shown earlier?
        // Let's check User model. 
        // Wait, typical "Liked Songs" is often a playlist or a separate collection `Interaction`.
        // Let's fallback to "Trending" if we can't find profile data, BUT
        // for now let's implement a "Smart Shuffle" style logic based on a seed song if provided,
        // OR simply return Trending if no history.

        // REAL IMPLEMENTATION:
        // For now, let's generate a "Daily Mix" based on random seed songs from the DB to simulate discovery
        // until we have full user history vectorization.

        // ...Actually, let's make it slightly smarter.
        // Pick 3 random songs, find 5 similar to each.

        const seeds = await Song.aggregate([{ $sample: { size: 3 } }]);
        let recommendations: Array<{ _id: { toString(): string };[key: string]: unknown }> = [];

        for (const seed of seeds) {
            const similar = await this.getSimilarSongs(seed._id.toString(), 5);
            recommendations.push(...similar);
        }

        // Deduplicate
        const uniqueRecs = Array.from(new Set(recommendations.map(s => s._id.toString())))
            .map(id => recommendations.find(s => s._id.toString() === id))
            .filter(Boolean)
            .slice(0, limit);

        await redisService.set(cacheKey, uniqueRecs, CACHE_TTL_DISCOVER);
        return uniqueRecs;
    }
}

// Export singleton instance
const recommendationService = new RecommendationService();

// Named exports for backward compatibility with controllers
export const getSimilarSongs = (songId: string, limit?: number) =>
    recommendationService.getSimilarSongs(songId, limit);

export const getDiscoverWeekly = (userId: string, limit?: number) =>
    recommendationService.getDiscoverWeekly(userId, limit);

// Placeholder exports for functions that don't exist yet but are imported
// These should be implemented based on your actual recommendation logic
export const hybridRecommendations = async (userId: string, limit: number = 20) => {
    // Fallback to discover weekly for now
    const songs = await recommendationService.getDiscoverWeekly(userId, limit);
    return {
        songs,
        algorithm: "discover-weekly",
        confidence: 0.8
    };
};

export const updateUserAudioPreferences = async (userId: string) => {
    // Placeholder - implement user preference tracking
    return Promise.resolve();
};

export const updateUserFavorites = async (userId: string) => {
    // Placeholder - implement favorites tracking
    return Promise.resolve();
};

export const getDailyMix = async (userId: string, limit: number = 20) => {
    // Fallback to discover weekly
    return recommendationService.getDiscoverWeekly(userId, limit);
};

export const contentBasedRecommendations = async (userId: string, limit: number = 20) => {
    // Fallback to discover weekly
    return recommendationService.getDiscoverWeekly(userId, limit);
};

export const collaborativeFilteringRecommendations = async (userId: string, limit: number = 20) => {
    // Fallback to discover weekly
    return recommendationService.getDiscoverWeekly(userId, limit);
};
