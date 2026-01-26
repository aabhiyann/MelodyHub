import mongoose, { Document, Schema } from "mongoose";

export interface IUserConnection extends Document {
    followerId: mongoose.Types.ObjectId;
    followingId: mongoose.Types.ObjectId;
    createdAt: Date;
}

const userConnectionSchema = new Schema<IUserConnection>(
    {
        followerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        followingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

// Ensure a user can only follow another user once
userConnectionSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

export const UserConnection = mongoose.model<IUserConnection>("UserConnection", userConnectionSchema);
