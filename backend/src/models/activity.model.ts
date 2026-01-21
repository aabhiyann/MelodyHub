import mongoose, { Document, Schema } from "mongoose";

export type ActivityType =
    | 'play'
    | 'like'
    | 'playlist_create'
    | 'playlist_share'
    | 'friend_add';

export interface IActivity extends Document {
    userId: string; // Clerk user ID
    type: ActivityType;
    metadata: {
        songId?: mongoose.Types.ObjectId;
        songTitle?: string;
        artistName?: string;
        playlistId?: mongoose.Types.ObjectId;
        playlistName?: string;
        friendId?: string;
        friendName?: string;
    };
    createdAt: Date;
}

const activitySchema = new Schema<IActivity>(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: ['play', 'like', 'playlist_create', 'playlist_share', 'friend_add'],
            required: true,
        },
        metadata: {
            type: Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
activitySchema.index({ userId: 1, createdAt: -1 });
activitySchema.index({ createdAt: -1 }); // For activity feed

// TTL index - auto-delete activities older than 30 days
activitySchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

export const Activity = mongoose.model<IActivity>("Activity", activitySchema);
