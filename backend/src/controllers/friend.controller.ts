import { Request, Response, NextFunction } from "express";
import { FriendService } from "../services/friend.service.js";

const friendService = new FriendService();

export const sendFriendRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { receiverId } = req.body;
        const senderId = (req as any).auth.userId;

        const result = await friendService.sendFriendRequest(senderId, receiverId);

        res.status(201).json(result);
    } catch (error: any) {
        if (error.message === "Sender not found" || error.message === "User not found") {
            return res.status(404).json({ message: error.message });
        }
        if (error.message === "You cannot request yourself" ||
            error.message === "Request already exists" ||
            error.message === "Already friends") {
            return res.status(400).json({ message: error.message });
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
    } catch (error: any) {
        if (error.message === "User not found" || error.message === "Request not found") {
            return res.status(404).json({ message: error.message });
        }
        if (error.message === "Not authorized") {
            return res.status(403).json({ message: error.message });
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

export const getFriends = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).auth.userId;
        const friends = await friendService.getFriends(userId);

        if (!friends) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json(friends);
    } catch (error: any) {
        if (error.message === "User not found") {
            return res.status(404).json({ message: error.message });
        }
        next(error);
    }
}
