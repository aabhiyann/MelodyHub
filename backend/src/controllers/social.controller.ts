import { Request, Response } from "express";
import { Friendship } from "../models/friendship.model.js";
import { Activity } from "../models/activity.model.js";
import { AuthenticatedRequest } from "../types/index.js";

/**
 * POST /social/friend-request
 * Send a friend request
 */
export const sendFriendRequest = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthenticatedRequest).auth?.userId;
        const { friendId } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        if (!friendId) {
            return res.status(400).json({
                success: false,
                message: "Friend ID is required",
            });
        }

        if (userId === friendId) {
            return res.status(400).json({
                success: false,
                message: "Cannot send friend request to yourself",
            });
        }

        // Check if friendship already exists
        const [user1, user2] = [userId, friendId].sort();
        const existing = await Friendship.findOne({ user1, user2 });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: `Friend request already ${existing.status}`,
            });
        }

        // Create friendship
        const friendship = new Friendship({
            user1,
            user2,
            initiator: userId,
            status: 'pending',
        });

        await friendship.save();

        // Create activity
        await Activity.create({
            userId,
            type: 'friend_add',
            metadata: { friendId },
        });

        return res.status(201).json({
            success: true,
            data: friendship,
            message: "Friend request sent",
        });
    } catch (error: unknown) {
        console.error("Error sending friend request:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return res.status(500).json({
            success: false,
            message: "Failed to send friend request",
            error: errorMessage,
        });
    }
};

/**
 * PUT /social/friend-request/:id/accept
 * Accept a friend request
 */
export const acceptFriendRequest = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthenticatedRequest).auth?.userId;
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const friendship = await Friendship.findById(id);

        if (!friendship) {
            return res.status(404).json({
                success: false,
                message: "Friend request not found",
            });
        }

        // Verify user is the recipient
        if (friendship.user1 !== userId && friendship.user2 !== userId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }

        // Verify request is pending
        if (friendship.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: `Request is already ${friendship.status}`,
            });
        }

        // Accept request
        friendship.status = 'accepted';
        await friendship.save();

        return res.status(200).json({
            success: true,
            data: friendship,
            message: "Friend request accepted",
        });
    } catch (error: unknown) {
        console.error("Error accepting friend request:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return res.status(500).json({
            success: false,
            message: "Failed to accept friend request",
            error: errorMessage,
        });
    }
};

/**
 * PUT /social/friend-request/:id/reject
 * Reject a friend request
 */
export const rejectFriendRequest = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthenticatedRequest).auth?.userId;
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const friendship = await Friendship.findById(id);

        if (!friendship) {
            return res.status(404).json({
                success: false,
                message: "Friend request not found",
            });
        }

        // Verify user is the recipient
        if (friendship.user1 !== userId && friendship.user2 !== userId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }

        // Delete the request
        await Friendship.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Friend request rejected",
        });
    } catch (error: unknown) {
        console.error("Error rejecting friend request:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return res.status(500).json({
            success: false,
            message: "Failed to reject friend request",
            error: errorMessage,
        });
    }
};

/**
 * GET /social/friends
 * Get user's friends
 */
export const getFriends = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthenticatedRequest).auth?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const friendships = await Friendship.find({
            $or: [{ user1: userId }, { user2: userId }],
            status: 'accepted',
        });

        // Extract friend IDs
        const friendIds = friendships.map(f =>
            f.user1 === userId ? f.user2 : f.user1
        );

        return res.status(200).json({
            success: true,
            data: friendIds,
            count: friendIds.length,
        });
    } catch (error: unknown) {
        console.error("Error getting friends:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return res.status(500).json({
            success: false,
            message: "Failed to get friends",
            error: errorMessage,
        });
    }
};

/**
 * GET /social/friend-requests
 * Get pending friend requests
 */
export const getFriendRequests = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthenticatedRequest).auth?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const requests = await Friendship.find({
            $or: [{ user1: userId }, { user2: userId }],
            status: 'pending',
        });

        return res.status(200).json({
            success: true,
            data: requests,
            count: requests.length,
        });
    } catch (error: unknown) {
        console.error("Error getting friend requests:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return res.status(500).json({
            success: false,
            message: "Failed to get friend requests",
            error: errorMessage,
        });
    }
};

/**
 * DELETE /social/friends/:id
 * Remove a friend
 */
export const removeFriend = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthenticatedRequest).auth?.userId;
        const { id: friendId } = req.params;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const [user1, user2] = [userId, friendId].sort();
        const friendship = await Friendship.findOneAndDelete({
            user1,
            user2,
            status: 'accepted',
        });

        if (!friendship) {
            return res.status(404).json({
                success: false,
                message: "Friendship not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Friend removed",
        });
    } catch (error: unknown) {
        console.error("Error removing friend:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return res.status(500).json({
            success: false,
            message: "Failed to remove friend",
            error: errorMessage,
        });
    }
};
