import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/index.js";
import { SocialService } from "../services/social.service.js";

const socialService = new SocialService();

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

        const friendship = await socialService.sendFriendRequest(userId, friendId);

        return res.status(201).json({
            success: true,
            data: friendship,
            message: "Friend request sent",
        });
    } catch (error: unknown) {
        console.error("Error sending friend request:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        if (errorMessage.includes("Cannot send friend request to yourself")) {
            return res.status(400).json({ success: false, message: errorMessage });
        }
        if (errorMessage.includes("already")) {
            return res.status(400).json({ success: false, message: errorMessage });
        }

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

        const friendship = await socialService.acceptFriendRequest(String(id), userId);

        return res.status(200).json({
            success: true,
            data: friendship,
            message: "Friend request accepted",
        });
    } catch (error: unknown) {
        console.error("Error accepting friend request:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        if (errorMessage === "Friend request not found") {
            return res.status(404).json({ success: false, message: errorMessage });
        }
        if (errorMessage === "Unauthorized") {
            return res.status(403).json({ success: false, message: errorMessage });
        }
        if (errorMessage.includes("already")) {
            return res.status(400).json({ success: false, message: errorMessage });
        }

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

        await socialService.rejectFriendRequest(String(id), userId);

        return res.status(200).json({
            success: true,
            message: "Friend request rejected",
        });
    } catch (error: unknown) {
        console.error("Error rejecting friend request:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        if (errorMessage === "Friend request not found") {
            return res.status(404).json({ success: false, message: errorMessage });
        }
        if (errorMessage === "Unauthorized") {
            return res.status(403).json({ success: false, message: errorMessage });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to reject friend request",
            error: errorMessage,
        });
    }
};

/**
 * DELETE /social/friend-request/:id
 * Cancel a friend request (by initiator)
 */
export const cancelFriendRequest = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthenticatedRequest).auth?.userId;
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        await socialService.cancelFriendRequest(String(id), userId);

        return res.status(200).json({
            success: true,
            message: "Friend request cancelled",
        });
    } catch (error: unknown) {
        console.error("Error cancelling friend request:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        if (errorMessage === "Friend request not found") {
            return res.status(404).json({ success: false, message: errorMessage });
        }
        if (errorMessage.includes("Only the initiator")) {
            return res.status(403).json({ success: false, message: errorMessage });
        }
        if (errorMessage.includes("Cannot cancel")) {
            return res.status(400).json({ success: false, message: errorMessage });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to cancel friend request",
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

        const friendIds = await socialService.getFriends(userId);

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

        const requests = await socialService.getFriendRequests(userId);

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

        const removed = await socialService.removeFriend(userId, String(friendId));

        if (!removed) {
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

/**
 * GET /social/activity
 * Get friends' activity feed
 */
export const getFriendActivity = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthenticatedRequest).auth?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const activities = await socialService.getFriendActivity(userId);

        return res.status(200).json({
            success: true,
            data: activities,
        });
    } catch (error: unknown) {
        console.error("Error getting friend activity:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get friend activity",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
