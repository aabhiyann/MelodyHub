import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service.js";
import { AuthenticatedRequest } from "../types/index.js";

const userService = new UserService();

/**
 * Resolve user id (Clerk ID or ObjectId) to MongoDB ObjectId string
 */
async function resolveUserId(id: string): Promise<string | null> {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const user = await userService.findById(id);
        return user ? (user._id as any).toString() : null;
    }
    const user = await userService.getByClerkId(id);
    return user ? (user._id as any).toString() : null;
}

/**
 * GET /api/users/:id/followers
 * Get followers list with pagination
 */
export const getFollowers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const targetId = (req.params.id as string) || (req.params.userId as string);
        const userId = await resolveUserId(targetId);
        if (!userId) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const page = parseInt(req.query.page as string) || 1;
        const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
        const result = await userService.getFollowersPaginated(userId, page, limit);
        return res.status(200).json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/users/:id/following
 * Get following list with pagination
 */
export const getFollowing = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const targetId = (req.params.id as string) || (req.params.userId as string);
        const userId = await resolveUserId(targetId);
        if (!userId) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const page = parseInt(req.query.page as string) || 1;
        const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
        const result = await userService.getFollowingPaginated(userId, page, limit);
        return res.status(200).json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/users/:id/mutual-friends
 * Get mutual friends between current user and target user
 */
export const getMutualFriends = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const currentUserId = (req as AuthenticatedRequest).auth?.userId;
        if (!currentUserId) {
            return res.status(401).json({ success: false, message: "Authentication required" });
        }
        const targetId = req.params.id as string;
        const targetUserId = await resolveUserId(targetId);
        if (!targetUserId) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const currentUser = await userService.getByClerkId(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ success: false, message: "Current user not found" });
        }
        const mutual = await userService.getMutualFriends((currentUser._id as any).toString(), targetUserId);
        return res.status(200).json({ success: true, data: mutual });
    } catch (error) {
        next(error);
    }
};
