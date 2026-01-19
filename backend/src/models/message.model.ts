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

// Indexes for query optimization
messageSchema.index({ senderId: 1, receiverId: 1 }); // For chat conversations
messageSchema.index({ createdAt: -1 }); // For recent messages
messageSchema.index({ receiverId: 1, createdAt: -1 }); // For fetching user's recent messages

export const Message = mongoose.model<IMessage>("Message", messageSchema);
