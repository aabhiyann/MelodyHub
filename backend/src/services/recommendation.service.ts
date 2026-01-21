import { Song, ISong } from "../models/song.model.js";
import { UserPreference, IUserPreference } from "../models/userPreference.model.js";
import { Recommendation } from "../models/recommendation.model.js";
import mongoose from "mongoose";

/**
 * AI Recommendation Service
 * Provides collaborative and content-based filtering for personalized recommendations
 */

interface SongWithScore {
    song: ISong;
    score: number;
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) return 0;

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Content-Based Filtering: Recommend based on audio features
 */
export async function contentBasedRecommendations(
    userId: string,
    limit: number = 20
): Promise<ISong[]> {
    // Get user preferences
    const userPref = await UserPreference.findOne({ userId });
    if (!userPref || !userPref.audioPreferences) {
        return [];
    }

    const { tempo, energy, danceability, valence } = userPref.audioPreferences;

    // Build user preference vector
    const userVector = [
        tempo || 120,
        energy || 0.5,
        danceability || 0.5,
        valence || 0.5,
    ];

    // Get recently played and liked songs to exclude
    const recentSongIds = userPref.listeningHistory
        .slice(-50)
        .map((h) => h.songId);
    const excludedIds = [...recentSongIds, ...userPref.likedSongs];

    // Get candidate songs with audio features
    const candidates = await Song.find({
        _id: { $nin: excludedIds },
        "features.tempo": { $exists: true },
        "features.energy": { $exists: true },
    }).limit(500); // Get larger pool for better matching

    // Calculate similarity scores
    const scoredSongs: SongWithScore[] = candidates
        .map((song) => {
            if (!song.features) return null;

            const songVector = [
                song.features.tempo || 120,
                song.features.energy || 0.5,
                song.features.danceability || 0.5,
                song.features.valence || 0.5,
            ];

            const score = cosineSimilarity(userVector, songVector);
            return { song: song as ISong, score };
        })
        .filter((item) => item !== null) as SongWithScore[];

    // Sort by score and return top N
    return scoredSongs
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((item) => item.song);
}

/**
 * Collaborative Filtering: Recommend based on similar users
 */
export async function collaborativeFilteringRecommendations(
    userId: string,
    limit: number = 20
): Promise<ISong[]> {
    // Get current user's preferences
    const userPref = await UserPreference.findOne({ userId });
    if (!userPref || userPref.likedSongs.length < 3) {
        return [];
    }

    // Find users who liked similar songs
    const similarUsers = await UserPreference.find({
        userId: { $ne: userId },
        likedSongs: { $in: userPref.likedSongs },
    }).limit(20);

    if (similarUsers.length === 0) {
        return [];
    }

    // Calculate user similarity based on liked songs overlap
    const userSimilarities = similarUsers.map((otherUser) => {
        const overlap = userPref.likedSongs.filter((songId) =>
            otherUser.likedSongs.some((id) => id.equals(songId))
        ).length;

        const totalUnique = new Set([
            ...userPref.likedSongs.map((id) => id.toString()),
            ...otherUser.likedSongs.map((id) => id.toString()),
        ]).size;

        const similarity = overlap / totalUnique; // Jaccard similarity
        return { user: otherUser, similarity };
    });

    // Sort by similarity and get top similar users
    const topSimilarUsers = userSimilarities
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 5);

    // Collect songs liked by similar users (weighted by similarity)
    const songScores = new Map<string, number>();

    for (const { user, similarity } of topSimilarUsers) {
        for (const songId of user.likedSongs) {
            const songIdStr = songId.toString();
            // Skip if user already liked this song
            if (userPref.likedSongs.some((id) => id.toString() === songIdStr)) {
                continue;
            }

            const currentScore = songScores.get(songIdStr) || 0;
            songScores.set(songIdStr, currentScore + similarity);
        }
    }

    // Sort by score and get top song IDs
    const topSongIds = Array.from(songScores.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([songId]) => new mongoose.Types.ObjectId(songId));

    // Fetch and return the songs
    const songs = await Song.find({ _id: { $in: topSongIds } });

    // Re-order according to score
    return topSongIds
        .map((id) => songs.find((s) => (s._id as any).equals(id)))
        .filter((s) => s !== undefined) as ISong[];
}

/**
 * Hybrid Recommendations: Combine collaborative and content-based
 */
export async function hybridRecommendations(
    userId: string,
    limit: number = 20
): Promise<{
    songs: ISong[];
    algorithm: string;
    confidence: number;
}> {
    const userPref = await UserPreference.findOne({ userId });

    // Determine which algorithm to use based on user data
    const hasEnoughHistory = userPref && userPref.listeningHistory.length >= 10;
    const hasEnoughLikes = userPref && userPref.likedSongs.length >= 3;
    const hasAudioPreferences = userPref && userPref.audioPreferences.tempo;

    let songs: ISong[] = [];
    let algorithm = "popular";
    let confidence = 0.3;

    if (hasEnoughLikes && hasEnoughHistory) {
        // Use hybrid approach: 60% collaborative, 40% content-based
        const collaborativeLimit = Math.ceil(limit * 0.6);
        const contentLimit = Math.floor(limit * 0.4);

        const [collaborative, contentBased] = await Promise.all([
            collaborativeFilteringRecommendations(userId, collaborativeLimit),
            contentBasedRecommendations(userId, contentLimit),
        ]);

        // Combine and shuffle to avoid bias
        songs = [...collaborative, ...contentBased].sort(
            () => Math.random() - 0.5
        );
        algorithm = "hybrid";
        confidence = 0.85;
    } else if (hasAudioPreferences && hasEnoughHistory) {
        // Use content-based only
        songs = await contentBasedRecommendations(userId, limit);
        algorithm = "content-based";
        confidence = 0.7;
    } else if (hasEnoughLikes) {
        // Use collaborative only
        songs = await collaborativeFilteringRecommendations(userId, limit);
        algorithm = "collaborative";
        confidence = 0.65;
    } else {
        // Cold start: popular songs
        songs = await Song.find()
            .sort({ playCount: -1, likeCount: -1 })
            .limit(limit);
        algorithm = "popular";
        confidence = 0.4;
    }

    // Cache the recommendations
    if (songs.length > 0) {
        await Recommendation.findOneAndUpdate(
            { userId },
            {
                userId,
                songs: songs.map((s) => s._id),
                algorithm,
                confidence,
                expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours
            },
            { upsert: true, new: true }
        );
    }

    return { songs, algorithm, confidence };
}

/**
 * Update user audio preferences based on listening history
 */
export async function updateUserAudioPreferences(userId: string): Promise<void> {
    const userPref = await UserPreference.findOne({ userId });
    if (!userPref || userPref.listeningHistory.length < 10) {
        return;
    }

    // Get songs from listening history (only completed plays)
    const completedPlays = userPref.listeningHistory
        .filter((h) => h.completionRate > 0.7 && !h.skipped)
        .slice(-50);

    if (completedPlays.length === 0) return;

    const songIds = completedPlays.map((h) => h.songId);
    const songs = await Song.find({ _id: { $in: songIds } });

    // Calculate average audio features
    let tempo = 0,
        energy = 0,
        danceability = 0,
        valence = 0;
    let count = 0;

    for (const song of songs) {
        if (song.features) {
            tempo += song.features.tempo || 0;
            energy += song.features.energy || 0;
            danceability += song.features.danceability || 0;
            valence += song.features.valence || 0;
            count++;
        }
    }

    if (count > 0) {
        userPref.audioPreferences = {
            tempo: tempo / count,
            energy: energy / count,
            danceability: danceability / count,
            valence: valence / count,
        };

        await userPref.save();
    }
}

/**
 * Update favorite genres and artists based on listening history
 */
export async function updateUserFavorites(userId: string): Promise<void> {
    const userPref = await UserPreference.findOne({ userId });
    if (!userPref || userPref.listeningHistory.length < 10) {
        return;
    }

    const recentPlays = userPref.listeningHistory.slice(-100);
    const songIds = recentPlays.map((h) => h.songId);
    const songs = await Song.find({ _id: { $in: songIds } });

    // Count genre occurrences
    const genreCounts = new Map<string, number>();
    const artistCounts = new Map<string, number>();

    for (const song of songs) {
        if (song.genre) {
            genreCounts.set(song.genre, (genreCounts.get(song.genre) || 0) + 1);
        }
        artistCounts.set(song.artist, (artistCounts.get(song.artist) || 0) + 1);
    }

    // Calculate weights (normalize to 0-1)
    const totalPlays = songs.length;

    userPref.favoriteGenres = Array.from(genreCounts.entries())
        .map(([genre, count]) => ({
            genre,
            weight: count / totalPlays,
        }))
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 5);

    userPref.favoriteArtists = Array.from(artistCounts.entries())
        .map(([artist, count]) => ({
            artist,
            weight: count / totalPlays,
        }))
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 10);

    await userPref.save();
}
