import mongoose, { Document, Schema } from "mongoose";

export interface IAchievementProgress extends Document {
    userId: mongoose.Types.ObjectId;
    achievementId: string;
    progress: number;
    unlockedAt?: Date;
}

const achievementProgressSchema = new Schema<IAchievementProgress>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        achievementId: {
            type: String,
            required: true,
        },
        progress: {
            type: Number,
            default: 0,
        },
        unlockedAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

// Index for unique user-achievement pair
achievementProgressSchema.index({ userId: 1, achievementId: 1 }, { unique: true });

export const AchievementProgress = mongoose.model<IAchievementProgress>(
    "AchievementProgress",
    achievementProgressSchema
);
