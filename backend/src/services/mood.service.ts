import { UserPreference } from "../models/userPreference.model.js";
import { Song } from "../models/song.model.js";
import mongoose from "mongoose";

export type MoodLabel =
    | "happy"
    | "sad"
    | "energetic"
    | "chill"
    | "focused"
    | "romantic"
    | "neutral";

const MOOD_GENRE_MAP: Record<MoodLabel, string[]> = {
    happy: ["Pop", "Dance", "Indie Pop", "Reggae"],
    sad: ["Acoustic", "Ballad", "Indie", "Soul"],
    energetic: ["Rock", "Electronic", "Hip-Hop", "Metal", "Dance"],
    chill: ["Jazz", "Lo-Fi", "Ambient", "Acoustic", "Indie"],
    focused: ["Classical", "Ambient", "Lo-Fi", "Electronic"],
    romantic: ["R&B", "Soul", "Pop", "Acoustic"],
    neutral: ["Pop", "Rock", "Indie"],
};

/**
 * Detect current mood from recent listening (genre + time of day)
 */
export async function getCurrentMood(userId: string): Promise<{
    mood: MoodLabel;
    label: string;
    confidence: number;
    reason?: string;
}> {
    const userPref = await UserPreference.findOne({ userId }).populate("listeningHistory.songId");
    if (!userPref || userPref.listeningHistory.length === 0) {
        return { mood: "neutral", label: "Neutral", confidence: 0.3, reason: "No listening history yet" };
    }

    const recent = userPref.listeningHistory.slice(-20);
    const genreCounts: Record<string, number> = {};
    for (const h of recent) {
        const song = h.songId as any;
        const genre = song?.genre || "Unknown";
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    }
    const topGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Pop";

    const hour = new Date().getHours();
    let timeBias: MoodLabel = "neutral";
    if (hour >= 6 && hour < 12) timeBias = "energetic";
    else if (hour >= 12 && hour < 18) timeBias = "focused";
    else if (hour >= 18 && hour < 22) timeBias = "chill";
    else timeBias = "chill";

    const moodScores: Record<MoodLabel, number> = {
        happy: 0,
        sad: 0,
        energetic: 0,
        chill: 0,
        focused: 0,
        romantic: 0,
        neutral: 0.2,
    };
    for (const [mood, genres] of Object.entries(MOOD_GENRE_MAP)) {
        if (genres.some((g) => topGenre.toLowerCase().includes(g.toLowerCase()))) {
            moodScores[mood as MoodLabel] += 0.4;
        }
    }
    moodScores[timeBias] += 0.3;

    const best = Object.entries(moodScores).sort((a, b) => b[1] - a[1])[0];
    const mood = (best?.[0] as MoodLabel) || "neutral";
    const confidence = Math.min(0.95, (best?.[1] ?? 0.3) + 0.2);

    const labels: Record<MoodLabel, string> = {
        happy: "Happy",
        sad: "Melancholy",
        energetic: "Energetic",
        chill: "Chill",
        focused: "Focused",
        romantic: "Romantic",
        neutral: "Neutral",
    };
    return {
        mood,
        label: labels[mood],
        confidence,
        reason: `Based on your recent listens (${topGenre}) and time of day`,
    };
}

/**
 * Get playlist for a mood (songs matching mood genres)
 */
export async function getPlaylistForMood(
    mood: MoodLabel,
    limit: number = 20,
    userId?: string
): Promise<mongoose.Types.ObjectId[]> {
    const genres = MOOD_GENRE_MAP[mood] || MOOD_GENRE_MAP.neutral;
    const songs = await Song.find({
        genre: { $in: genres.map((g) => new RegExp(g, "i")) },
    })
        .sort({ playCount: -1, likeCount: -1 })
        .limit(limit)
        .select("_id")
        .lean();
    return songs.map((s) => s._id as mongoose.Types.ObjectId);
}
