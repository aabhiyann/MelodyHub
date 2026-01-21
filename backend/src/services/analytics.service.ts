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
    const topArtists: = Object.entries(artistCounts)
        .map(([artist, playCount]) => ({ artist, playCount }))
        .sort((a, b) => b.playCount - a.playCount)
        .slice(0, 5);

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

    return {
        totalListeningTime: Math.round(totalListeningTime),
        totalPlays,
        totalLikes: userPref.likedSongs.length,
        topArtists,
        topSongs,
        topGenres,
        discoveryRate: Math.round(discoveryRate),
        skipRate: Math.round(skipRate),
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
