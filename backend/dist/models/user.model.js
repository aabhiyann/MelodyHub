import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    clerkId: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    bio: {
        type: String,
        default: "",
    },
    location: {
        type: String,
        default: "",
    },
    website: {
        type: String,
        default: "",
    },
    isPrivate: {
        type: Boolean,
        default: false,
    },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    gamification: {
        xp: { type: Number, default: 0 },
        level: { type: Number, default: 1 },
        gems: { type: Number, default: 0 },
        streak: { type: Number, default: 0 },
        lastListenDate: { type: Date, default: null },
        streakFreezes: { type: Number, default: 0 },
        lastFreezeUsed: { type: Date, default: null },
        achievements: [{ type: String }], // Store achievement IDs
    },
}, { timestamps: true });
export const User = mongoose.model("User", userSchema);
