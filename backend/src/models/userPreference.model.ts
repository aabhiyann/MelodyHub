import mongoose, { Document } from "mongoose";

export interface IUserPreference extends Document {
    userId: string; // Clerk user ID

    // Listening history (last 100 songs)
    listeningHistory: {
        songId: mongoose.Types.ObjectId;
        playedAt: Date;
        completionRate: number; // 0-1 (how much of song was played)
        skipped: boolean;
    }[];

    // Liked songs
    likedSongs: mongoose.Types.ObjectId[];

    // Favorite genres (auto-calculated)
    favoriteGenres: {
        genre: string;
        weight: number; // Preference weight 0-1
    }[];

    // Favorite artists (auto-calculated)
    favoriteArtists: {
        artist: string;
        weight: number;
    }[];

    // Audio feature preferences (learned from listening)
    audioPreferences: {
        tempo?: number; // Preferred BPM
        energy?: number; // 0-1
        danceability?: number; // 0-1
        valence?: number; // 0-1
    };

    // Settings
    explicitContent: boolean;

    createdAt: Date;
    updatedAt: Date;
}

const userPreferenceSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        listeningHistory: [
            {
                songId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Song",
                    required: true,
                },
                playedAt: {
                    type: Date,
                    default: Date.now,
                },
                completionRate: {
                    type: Number,
                    min: 0,
                    max: 1,
                    default: 0,
                },
                skipped: {
                    type: Boolean,
                    default: false,
                },
            },
        ],
        likedSongs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Song",
            },
        ],
        favoriteGenres: [
            {
                genre: { type: String, required: true },
                weight: { type: Number, min: 0, max: 1, required: true },
            },
        ],
        favoriteArtists: [
            {
                artist: { type: String, required: true },
                weight: { type: Number, min: 0, max: 1, required: true },
            },
        ],
        audioPreferences: {
            tempo: { type: Number, default: null },
            energy: { type: Number, min: 0, max: 1, default: null },
            danceability: { type: Number, min: 0, max: 1, default: null },
            valence: { type: Number, min: 0, max: 1, default: null },
        },
        explicitContent: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// Indexes
userPreferenceSchema.index({ userId: 1 });
userPreferenceSchema.index({ "listeningHistory.playedAt": -1 }); // Recent history
userPreferenceSchema.index({ likedSongs: 1 });

export const UserPreference = mongoose.model<IUserPreference>(
    "UserPreference",
    userPreferenceSchema
);
