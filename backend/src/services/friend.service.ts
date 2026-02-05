import { FriendRequest, IFriendRequest } from "../models/friendRequest.model.js";
import { User } from "../models/user.model.js";
import * as notificationService from "./notification.service.js";
import { emitToUser } from "../lib/socket.js";

export class FriendService {
    /**
     * Resolve user ID (Clerk ID or MongoDB ObjectId) to MongoDB ObjectId
     */
    private async resolveUserId(id: string): Promise<string | null> {
        // If it's already a MongoDB ObjectId
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            return id;
        }

        // It's a Clerk ID, resolve to MongoDB ObjectId
        const user = await User.findOne({ clerkId: id });
        return user ? (user._id as any).toString() : null;
    }

    /**
     * Send friend request
     */
    async sendFriendRequest(senderClerkId: string, receiverIdOrClerkId: string): Promise<any> {
        // Get sender
        const sender = await User.findOne({ clerkId: senderClerkId });
        if (!sender) {
            throw new Error("Sender not found");
        }

        // Resolve receiver ID
        const receiverId = await this.resolveUserId(receiverIdOrClerkId);
        if (!receiverId) {
            throw new Error("User not found");
        }

        // Check self-friending
        if ((sender._id as any).toString() === receiverId) {
            throw new Error("You cannot request yourself");
        }

        // Check existing request
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { senderId: sender._id, receiverId },
                { senderId: receiverId, receiverId: sender._id },
            ],
            status: 'pending'
        });

        if (existingRequest) {
            throw new Error("Request already exists");
        }

        // Check if already friends
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            throw new Error("User not found");
        }

        if (sender.friends.includes(receiver._id as any)) {
            throw new Error("Already friends");
        }

        // Special handling for Melody Bot
        if (receiver.clerkId === "melody-bot") {
            return await this.handleMelodyBotFriend(sender._id as any, receiver._id as any);
        }

        // Create friend request
        const newRequest = await FriendRequest.create({
            senderId: sender._id,
            receiverId,
            status: "pending",
        });

        // Notify receiver
        if (receiver.clerkId) {
            const notification = await notificationService.createNotification({
                userId: receiver.clerkId,
                type: "FRIEND_REQUEST",
                title: "New friend request",
                body: `${(sender as any).fullName} sent you a friend request`,
                metadata: { senderId: (sender._id as any).toString(), requestId: (newRequest._id as any).toString() },
            });
            emitToUser(receiver.clerkId, "new_notification", notification);
        }

        return newRequest;
    }

    /**
     * Handle Melody Bot friend request (auto-accept)
     */
    private async handleMelodyBotFriend(senderId: any, botId: any): Promise<any> {
        // Update both users' friends lists
        await User.findByIdAndUpdate(senderId, { $addToSet: { friends: botId } });
        await User.findByIdAndUpdate(botId, { $addToSet: { friends: senderId } });

        // Create accepted request record
        const newRequest = await FriendRequest.create({
            senderId,
            receiverId: botId,
            status: "accepted",
        });

        return { status: "accepted", message: "Friend request accepted automatically", request: newRequest };
    }

    /**
     * Accept friend request
     */
    async acceptFriendRequest(requestId: string, userClerkId: string): Promise<void> {
        const user = await User.findOne({ clerkId: userClerkId });
        if (!user) {
            throw new Error("User not found");
        }

        const request = await FriendRequest.findById(requestId);
        if (!request) {
            throw new Error("Request not found");
        }

        if (request.receiverId.toString() !== (user._id as any).toString()) {
            throw new Error("Not authorized");
        }

        request.status = "accepted";
        await request.save();

        // Add to friends lists
        await User.findByIdAndUpdate(request.senderId, { $addToSet: { friends: request.receiverId } });
        await User.findByIdAndUpdate(request.receiverId, { $addToSet: { friends: request.senderId } });
    }

    /**
     * Get pending friend requests for a user
     */
    async getFriendRequests(userClerkId: string): Promise<IFriendRequest[]> {
        const user = await User.findOne({ clerkId: userClerkId });
        if (!user) {
            return [];
        }

        return await FriendRequest.find({ receiverId: user._id, status: "pending" })
            .populate("senderId", "fullName imageUrl username");
    }

    /**
     * Get user's friends list
     */
    async getFriends(userClerkId: string): Promise<any[]> {
        const user = await User.findOne({ clerkId: userClerkId }).populate("friends", "fullName imageUrl clerkId isOnline");

        if (!user) {
            throw new Error("User not found");
        }

        return user.friends as any[];
    }
}
