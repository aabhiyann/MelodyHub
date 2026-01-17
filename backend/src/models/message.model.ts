import mongoose, { Document } from "mongoose";

export interface IMessage extends Document {
	senderId: string;
	receiverId: string;
	content: string;
	createdAt: Date;
	updatedAt: Date;
}

const messageSchema = new mongoose.Schema(
	{
		senderId: { type: String, required: true }, // Clerk user ID
		receiverId: { type: String, required: true }, // Clerk user ID
		content: { type: String, required: true },
	},
	{ timestamps: true }
);

export const Message = mongoose.model<IMessage>("Message", messageSchema);
