import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
	fullName: string;
	imageUrl: string;
	clerkId: string;
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
	},
	{ timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
