import mongoose, { Document, Schema } from "mongoose";

export enum ActivityType {
    LIKE_SONG = "like_song",
    CREATE_PLAYLIST = "create_playlist",
    FOLLOW_USER = "follow_user",
}

export interface IActivity extends Document {
    userId: mongoose.Types.ObjectId;
    type: ActivityType;
    targetId: mongoose.Types.ObjectId; // ID of Song, Playlist, or User
    createdAt: Date;
}

const activitySchema = new Schema<IActivity>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            enum: Object.values(ActivityType),
            required: true,
        },
        targetId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

export const Activity = mongoose.model<IActivity>("Activity", activitySchema);
