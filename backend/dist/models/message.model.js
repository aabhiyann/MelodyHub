import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
    senderId: { type: String, required: true }, // Clerk user ID
    receiverId: { type: String, required: true }, // Clerk user ID
    content: { type: String, required: true },
}, { timestamps: true });
// Indexes for query optimization
messageSchema.index({ senderId: 1, receiverId: 1 }); // For chat conversations
messageSchema.index({ createdAt: -1 }); // For recent messages
messageSchema.index({ receiverId: 1, createdAt: -1 }); // For fetching user's recent messages
export const Message = mongoose.model("Message", messageSchema);
