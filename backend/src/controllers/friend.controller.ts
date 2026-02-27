import { Request, Response, NextFunction } from "express";
import { FriendService } from "../services/friend.service.js";

const friendService = new FriendService();

export const sendFriendRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { receiverId } = req.body;
        const senderId = (req as any).auth.userId;

        const result = await friendService.sendFriendRequest(senderId, receiverId);

        res.status(201).json(result);
    } catch (error) {
        if ((error instanceof Error ? error.message : "Unknown error") === "Sender not found" || (error instanceof Error ? error.message : "Unknown error") === "User not found") {
            return res.status(404).json({ message: (error instanceof Error ? error.message : "Unknown error") });
        }
        if ((error instanceof Error ? error.message : "Unknown error") === "You cannot request yourself" ||
            (error instanceof Error ? error.message : "Unknown error") === "Request already exists" ||
            (error instanceof Error ? error.message : "Unknown error") === "Already friends") {
            return res.status(400).json({ message: (error instanceof Error ? error.message : "Unknown error") });
        }
        next(error);
    }
};

export const acceptFriendRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { requestId } = req.body;
        const userId = (req as any).auth.userId;

        await friendService.acceptFriendRequest(requestId, userId);

        res.status(200).json({ message: "Friend request accepted" });
    } catch (error) {
        if ((error instanceof Error ? error.message : "Unknown error") === "User not found" || (error instanceof Error ? error.message : "Unknown error") === "Request not found") {
            return res.status(404).json({ message: (error instanceof Error ? error.message : "Unknown error") });
        }
        if ((error instanceof Error ? error.message : "Unknown error") === "Not authorized") {
            return res.status(403).json({ message: (error instanceof Error ? error.message : "Unknown error") });
        }
        next(error);
    }
};

export const getFriendRequests = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).auth.userId;
        const requests = await friendService.getFriendRequests(userId);
        res.status(200).json(requests);
    } catch (error) {
        next(error);
    }
}

export const rejectFriendRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { requestId } = req.body;
        const userId = (req as any).auth.userId;

        await friendService.rejectFriendRequest(requestId, userId);

        res.status(200).json({ message: "Friend request rejected" });
    } catch (error) {
        if ((error instanceof Error ? error.message : "Unknown error") === "User not found" || (error instanceof Error ? error.message : "Unknown error") === "Request not found") {
            return res.status(404).json({ message: (error instanceof Error ? error.message : "Unknown error") });
        }
        if ((error instanceof Error ? error.message : "Unknown error") === "Not authorized") {
            return res.status(403).json({ message: (error instanceof Error ? error.message : "Unknown error") });
        }
        next(error);
    }
};

export const getFriends = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).auth.userId;
        const friends = await friendService.getFriends(userId);

        if (!friends) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json(friends);
    } catch (error) {
        if ((error instanceof Error ? error.message : "Unknown error") === "User not found") {
            return res.status(404).json({ message: (error instanceof Error ? error.message : "Unknown error") });
        }
        next(error);
    }
}
