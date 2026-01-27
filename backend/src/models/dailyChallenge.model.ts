import mongoose, { Document, Schema } from "mongoose";

export interface IDailyChallenge extends Document {
    userId: mongoose.Types.ObjectId;
    date: Date; // The date this challenge set belongs to (normalized to midnight)
    challenges: {
        id: string;
        type: string; // 'listen_count', 'genre_explore', 'share', etc.
        target: number;
        progress: number;
        completed: boolean;
        reward: {
            xp: number;
            gems: number;
        };
    }[];
}

const dailyChallengeSchema = new Schema<IDailyChallenge>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        challenges: [
            {
                id: { type: String, required: true },
                type: { type: String, required: true },
                target: { type: Number, required: true },
                progress: { type: Number, default: 0 },
                completed: { type: Boolean, default: false },
                reward: {
                    xp: { type: Number, required: true },
                    gems: { type: Number, required: true },
                },
            },
        ],
    },
    { timestamps: true }
);

// Index for quick lookup of today's challenges for a user
dailyChallengeSchema.index({ userId: 1, date: 1 }, { unique: true });

export const DailyChallenge = mongoose.model<IDailyChallenge>(
    "DailyChallenge",
    dailyChallengeSchema
);
