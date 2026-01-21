import mongoose, { Document } from "mongoose";

export interface IRecommendation extends Document {
    userId: string; // Clerk user ID

    // Recommended song IDs
    songs: mongoose.Types.ObjectId[];

    // Recommendation metadata
    algorithm: "collaborative" | "content-based" | "hybrid" | "popular";
    confidence: number; // 0-1 (how confident the algorithm is)

    // Cache expiry
    expiresAt: Date;

    createdAt: Date;
    updatedAt: Date;
}

const recommendationSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },
        songs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Song",
            },
        ],
        algorithm: {
            type: String,
            enum: ["collaborative", "content-based", "hybrid", "popular"],
            required: true,
        },
        confidence: {
            type: Number,
            min: 0,
            max: 1,
            default: 0.5,
        },
        expiresAt: {
            type: Date,
            required: true,
            index: true, // For automatic cleanup
        },
    },
    { timestamps: true }
);

// Indexes
recommendationSchema.index({ userId: 1, expiresAt: 1 });
recommendationSchema.index({ expiresAt: 1 }); // For TTL cleanup

// Auto-delete expired recommendations
recommendationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Recommendation = mongoose.model<IRecommendation>(
    "Recommendation",
    recommendationSchema
);
