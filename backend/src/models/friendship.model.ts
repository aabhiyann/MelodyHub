import mongoose, { Document, Schema } from "mongoose";

export interface IFriendship extends Document {
    user1: string; // Clerk user ID
    user2: string; // Clerk user ID
    status: 'pending' | 'accepted' | 'rejected';
    initiator: string; // Who sent the request
    createdAt: Date;
    updatedAt: Date;
}

const friendshipSchema = new Schema<IFriendship>(
    {
        user1: {
            type: String,
            required: true,
            index: true,
        },
        user2: {
            type: String,
            required: true,
            index: true,
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending',
            required: true,
        },
        initiator: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for efficient friend lookups
friendshipSchema.index({ user1: 1, user2: 1 });
friendshipSchema.index({ user1: 1, status: 1 });
friendshipSchema.index({ user2: 1, status: 1 });

// Ensure user1 and user2 are in consistent order
friendshipSchema.pre('save', function (next) {
    if (this.user1 > this.user2) {
        [this.user1, this.user2] = [this.user2, this.user1];
    }
    next();
});

export const Friendship = mongoose.model<IFriendship>("Friendship", friendshipSchema);
