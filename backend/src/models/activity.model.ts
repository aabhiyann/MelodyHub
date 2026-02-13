import mongoose, { Document, Schema } from "mongoose";

export enum ActivityType {
    LIKE_SONG = "like_song",
    CREATE_PLAYLIST = "create_playlist",
    FOLLOW_USER = "follow_user",
}

export interface IActivity extends Document {
    userId: string;
    type: ActivityType;
    targetId: string; // ID of Song, Playlist, or User
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
            enum: Object.values(ActivityType),
            required: true,
        },
        targetId: {
            type: String,
            required: true,
        },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

export const Activity = mongoose.model<IActivity>("Activity", activitySchema);

