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
	},
	{ timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
