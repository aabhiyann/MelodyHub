import { Friendship, IFriendship } from "../models/friendship.model.js";
import { Activity } from "../models/activity.model.js";
import { User } from "../models/user.model.js";

export class SocialService {
    /**
     * Send friend request
     */
    async sendFriendRequest(userId: string, friendId: string): Promise<IFriendship> {
        // Validate input
        if (userId === friendId) {
            throw new Error("Cannot send friend request to yourself");
        }

        // Validate both users exist
        const [user, friend] = await Promise.all([
            User.findOne({ clerkId: userId }),
            User.findOne({ clerkId: friendId })
        ]);

        if (!user || !friend) {
            throw new Error("User not found");
        }

        // Check if friendship already exists
        const [user1, user2] = [userId, friendId].sort();
        const existing = await Friendship.findOne({ user1, user2 });

        if (existing) {
            throw new Error(`Friend request already ${existing.status}`);
        }

        // Create friendship
        const friendship = await Friendship.create({
            user1,
            user2,
            initiator: userId,
            status: 'pending',
        });


        // Create activity
        await Activity.create({
            userId,
            type: 'follow_user',
            targetId: friendId,
        });

        return friendship;
    }

    /**
     * Accept friend request
     */
    async acceptFriendRequest(requestId: string, userId: string): Promise<IFriendship> {
        const friendship = await Friendship.findById(requestId);

        if (!friendship) {
            throw new Error("Friend request not found");
        }

        // Verify user is the recipient
        if (friendship.user1 !== userId && friendship.user2 !== userId) {
            throw new Error("Unauthorized");
        }

        // Verify request is pending
        if (friendship.status !== 'pending') {
            throw new Error(`Request is already ${friendship.status}`);
        }

        // Accept request
        friendship.status = 'accepted';
        await friendship.save();

        return friendship;
    }

    /**
     * Reject friend request
     */
    async rejectFriendRequest(requestId: string, userId: string): Promise<void> {
        const friendship = await Friendship.findById(requestId);

        if (!friendship) {
            throw new Error("Friend request not found");
        }

        // Verify user is the recipient
        if (friendship.user1 !== userId && friendship.user2 !== userId) {
            throw new Error("Unauthorized");
        }

        // Delete the request
        await Friendship.findByIdAndDelete(requestId);
    }

    /**
     * Get user's friends
     */
    async getFriends(userId: string): Promise<string[]> {
        const friendships = await Friendship.find({
            $or: [{ user1: userId }, { user2: userId }],
            status: 'accepted',
        });

        // Extract friend IDs
        const friendIds = friendships.map(f =>
            f.user1 === userId ? f.user2 : f.user1
        );

        return friendIds;
    }

    /**
     * Get pending friend requests
     */
    async getFriendRequests(userId: string): Promise<IFriendship[]> {
        return await Friendship.find({
            $or: [{ user1: userId }, { user2: userId }],
            status: 'pending',
        });
    }

    /**
     * Remove a friend
     */
    async removeFriend(userId: string, friendId: string): Promise<boolean> {
        const [user1, user2] = [userId, friendId].sort();
        const friendship = await Friendship.findOneAndDelete({
            user1,
            user2,
            status: 'accepted',
        });

        return !!friendship;
    }

    /**
     * Get friends' activity feed
     */
    async getFriendActivity(userId: string, limit: number = 20): Promise<any[]> {
        // Get all friends
        const friendIds = await this.getFriends(userId);

        // Fetch activities for these friends
        const activities = await Activity.find({ userId: { $in: friendIds } })
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate("userId", "fullName imageUrl")
            .populate("targetId");

        return activities;
    }
}
