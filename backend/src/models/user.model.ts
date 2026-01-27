import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
	fullName: string;
	imageUrl: string;
	clerkId: string;
	bio?: string;
	location?: string;
	website?: string;
	isPrivate: boolean;
	friends: mongoose.Types.ObjectId[];
	gamification: {
		xp: number;
		level: number;
		gems: number;
		streak: number;
		lastListenDate?: Date;
		streakFreezes: number;
		lastFreezeUsed?: Date;
		achievements: string[];
	};
	createdAt: Date;
	updatedAt: Date;
}

const userSchema = new mongoose.Schema(
	{
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
	},
	{ timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
