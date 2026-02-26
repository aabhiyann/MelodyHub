import { UserPreference } from "../models/userPreference.model.js";
import { Song } from "../models/song.model.js";
import mongoose from "mongoose";

/**
 * Advanced Analytics Service
 * Provides user insights and listening patterns
 */

export interface UserDashboard {
    totalListeningTime: number; // in seconds
    totalPlays: number;
    totalLikes: number;
    topArtists: Array<{ artist: string; playCount: number }>;
    topSongs: Array<{ songId: mongoose.Types.ObjectId; title: string; artist: string; playCount: number }>;
    topGenres: Array<{ genre: string; percentage: number }>;
    discoveryRate: number; // percentage of new vs. repeated songs
    skipRate: number; // percentage
    listeningByDay: Array<{ date: string; plays: number }>; // last 30 days for chart
}

export interface ListeningPatterns {
    hourOfDay: Array<{ hour: number; playCount: number }>;
    dayOfWeek: Array<{ day: string; playCount: number }>;
    mostActiveTime: string;
}

/**
 * Get user dashboard statistics
 */
export async function getUserDashboard(userId: string, period: 'week' | 'month' | 'year' | 'all' = 'all'): Promise<UserDashboard> {
    const userPref = await UserPreference.findOne({ userId }).populate('listeningHistory.songId');

    if (!userPref) {
        return {
            totalListeningTime: 0,
            totalPlays: 0,
            totalLikes: 0,
            topArtists: [],
            topSongs: [],
            topGenres: [],
            discoveryRate: 0,
            skipRate: 0,
            listeningByDay: [],
        };
    }

    // Filter by period
    let filteredHistory = userPref.listeningHistory;
    if (period !== 'all') {
        const now = new Date();
        const periodMap = { week: 7, month: 30, year: 365 };
        const daysAgo = periodMap[period];
        const cutoff = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

        filteredHistory = userPref.listeningHistory.filter(h => h.playedAt >= cutoff);
    }

    // Calculate total listening time (assume average song length 3 mins)
    const totalPlays = filteredHistory.length;
    const totalListeningTime = filteredHistory.reduce((sum, play) => {
        const completion = play.completionRate || 1;
        return sum + (180 * completion); // 3 mins * completion rate
    }, 0);

    // Top artists
    const artistCounts: Record<string, number> = {};
    for (const play of filteredHistory) {
        const song = play.songId as any;
        if (song?.artist) {
            artistCounts[song.artist] = (artistCounts[song.artist] || 0) + 1;
        }
    }
    const topArtists: Array<{ artist: string; playCount: number }> = Object.entries(artistCounts)
        .map(([artist, playCount]) => ({ artist, playCount }))
        .sort((a, b) => b.playCount - a.playCount)
        .slice(0, 10);

    // Top songs
    const songCounts: Record<string, { songId: mongoose.Types.ObjectId; title: string; artist: string; playCount: number }> = {};
    for (const play of filteredHistory) {
        const song = play.songId as any;
        if (song) {
            const key = song._id.toString();
            if (!songCounts[key]) {
                songCounts[key] = { songId: song._id, title: song.title, artist: song.artist, playCount: 0 };
            }
            songCounts[key].playCount++;
        }
    }
    const topSongs = Object.values(songCounts)
        .sort((a, b) => b.playCount - a.playCount)
        .slice(0, 5);

    // Top genres (from user preferences)
    const totalGenreWeight = userPref.favoriteGenres.reduce((sum, g) => sum + g.weight, 0);
    const topGenres = userPref.favoriteGenres
        .map(g => ({ genre: g.genre, percentage: (g.weight / totalGenreWeight) * 100 }))
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 5);

    // Discovery rate
    const uniqueSongs = new Set(filteredHistory.map(h => (h.songId as any)?._id?.toString()));
    const discoveryRate = totalPlays > 0 ? (uniqueSongs.size / totalPlays) * 100 : 0;

    // Skip rate
    const skipped = filteredHistory.filter(h => h.skipped).length;
    const skipRate = totalPlays > 0 ? (skipped / totalPlays) * 100 : 0;

    // Listening by day (last 30 days) for chart
    const now = new Date();
    const listeningByDay: Array<{ date: string; plays: number }> = [];
    for (let d = 29; d >= 0; d--) {
        const day = new Date(now);
        day.setDate(day.getDate() - d);
        day.setHours(0, 0, 0, 0);
        const nextDay = new Date(day);
        nextDay.setDate(nextDay.getDate() + 1);
        const plays = userPref.listeningHistory.filter(
            h => h.playedAt >= day && h.playedAt < nextDay
        ).length;
        listeningByDay.push({
            date: day.toISOString().slice(0, 10),
            plays,
        });
    }

    return {
        totalListeningTime: Math.round(totalListeningTime),
        totalPlays,
        totalLikes: userPref.likedSongs.length,
        topArtists,
        topSongs,
        topGenres,
        discoveryRate: Math.round(discoveryRate),
        skipRate: Math.round(skipRate),
        listeningByDay,
    };
}

/**
 * Get listening history with pagination
 */
export async function getListeningHistoryPaginated(
    userId: string,
    page: number = 1,
    limit: number = 20
): Promise<{ data: unknown[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> {
    const userPref = await UserPreference.findOne({ userId })
        .populate('listeningHistory.songId')
        .lean();

    if (!userPref || !userPref.listeningHistory?.length) {
        return {
            data: [],
            pagination: { page, limit, total: 0, totalPages: 0 },
        };
    }

    const total = userPref.listeningHistory.length;
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;
    const data = (userPref.listeningHistory as any[])
        .slice()
        .reverse()
        .slice(skip, skip + limit);

    return {
        data,
        pagination: { page, limit, total, totalPages },
    };
}

/**
 * Get listening patterns
 */
export async function getListeningPatterns(userId: string): Promise<ListeningPatterns> {
    const userPref = await UserPreference.findOne({ userId });

    if (!userPref || userPref.listeningHistory.length === 0) {
        return {
            hourOfDay: [],
            dayOfWeek: [],
            mostActiveTime: 'No data',
        };
    }

    // Hour of day distribution
    const hourCounts: number[] = new Array(24).fill(0);
    const dayCounts: Record<string, number> = {
        Sunday: 0,
        Monday: 0,
        Tuesday: 0,
        Wednesday: 0,
        Thursday: 0,
        Friday: 0,
        Saturday: 0,
    };

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    for (const play of userPref.listeningHistory) {
        const date = new Date(play.playedAt);
        const hour = date.getHours();
        const day = dayNames[date.getDay()];

        hourCounts[hour]++;
        dayCounts[day]++;
    }

    const hourOfDay = hourCounts.map((count, hour) => ({ hour, playCount: count }));
    const dayOfWeek = Object.entries(dayCounts).map(([day, playCount]) => ({ day, playCount }));

    // Find most active time
    const maxHour = hourCounts.indexOf(Math.max(...hourCounts));
    const mostActiveTime = `${maxHour}:00 - ${maxHour + 1}:00`;

    return {
        hourOfDay,
        dayOfWeek,
        mostActiveTime,
    };
}

/**
 * Track a song play
 */
export async function trackPlay(
    userId: string,
    songId: string,
    completionRate: number = 0,
    skipped: boolean = false
): Promise<void> {
    let userPref = await UserPreference.findOne({ userId });

    if (!userPref) {
        userPref = new UserPreference({
            userId,
            listeningHistory: [],
            likedSongs: [],
            favoriteGenres: [],
            favoriteArtists: [],
            audioPreferences: {},
            explicitContent: false
        });
    }

    // Add to listening history (keep last 100)
    userPref.listeningHistory.push({
        songId: new mongoose.Types.ObjectId(songId),
        playedAt: new Date(),
        completionRate: completionRate || 0,
        skipped: skipped || false
    });

    // Keep only last 100 plays
    if (userPref.listeningHistory.length > 100) {
        userPref.listeningHistory = userPref.listeningHistory.slice(-100);
    }

    await userPref.save();
}

/**
 * Like or unlike a song
 */
export async function toggleLikeSong(
    userId: string,
    songId: string,
    liked: boolean
): Promise<{ likedSongs: mongoose.Types.ObjectId[] }> {
    // Import activity service here to avoid circular dependency
    const { ActivityService } = await import("./activity.service.js");
    const { ActivityType } = await import("../models/activity.model.js");
    const activityService = new ActivityService();

    let userPref = await UserPreference.findOne({ userId });

    if (!userPref) {
        userPref = new UserPreference({
            userId,
            listeningHistory: [],
            likedSongs: [],
            favoriteGenres: [],
            favoriteArtists: [],
            audioPreferences: {},
            explicitContent: false
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
    return { likedSongs: userPref.likedSongs };
}
