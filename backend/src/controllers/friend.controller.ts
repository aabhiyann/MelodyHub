import { Request, Response, NextFunction } from "express";
import { FriendRequest } from "../models/friendRequest.model.js";
import { User } from "../models/user.model.js";

export const sendFriendRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { receiverId } = req.body;
        const senderId = (req as any).auth.userId;

        // Resolve receiverId if it's a Clerk ID (not a valid ObjectId)
        if (!receiverId.match(/^[0-9a-fA-F]{24}$/)) {
            const receiverUser = await User.findOne({ clerkId: receiverId });
            if (!receiverUser) {
                return res.status(404).json({ message: "User not found" });
            }
            receiverId = receiverUser._id;
        }

        const sender = await User.findOne({ clerkId: senderId });
        if (!sender) {
            return res.status(404).json({ message: "Sender not found" });
        }

        if (sender.clerkId === req.body.receiverId || sender._id.toString() === receiverId.toString()) {
            return res.status(400).json({ message: "You cannot request yourself" });
        }

        const existingRequest = await FriendRequest.findOne({
            $or: [
                { senderId: sender._id, receiverId },
                { senderId: receiverId, receiverId: sender._id },
            ],
            status: 'pending'
        });

        if (existingRequest) {
            return res.status(400).json({ message: "Request already exists" });
        }

        // Check if already friends
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({ message: "User not found" });
        }

        if (sender.friends.includes(receiver._id as any)) {
            return res.status(400).json({ message: "Already friends" });
        }

        const newRequest = await FriendRequest.create({
            senderId: sender._id,
            receiverId,
            status: "pending",
        });

        res.status(201).json(newRequest);
    } catch (error) {
        next(error);
    }
};

export const acceptFriendRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { requestId } = req.body;
        const userId = (req as any).auth.userId;
        const user = await User.findOne({ clerkId: userId });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const request = await FriendRequest.findById(requestId);

        if (!request) {
            res.status(404).json({ message: "Request not found" });
            return;
        }

        if (request.receiverId.toString() !== user._id.toString()) {
            res.status(403).json({ message: "Not authorized" });
            return;
        }

        request.status = "accepted";
        await request.save();

        // Add to friends lists
        await User.findByIdAndUpdate(request.senderId, { $addToSet: { friends: request.receiverId } });
        await User.findByIdAndUpdate(request.receiverId, { $addToSet: { friends: request.senderId } });

        res.status(200).json({ message: "Friend request accepted" });
    } catch (error) {
        next(error);
    }
};

export const getFriendRequests = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).auth.userId;
        const user = await User.findOne({ clerkId: userId });
        if (!user) return;

        const requests = await FriendRequest.find({ receiverId: user._id, status: "pending" })
            .populate("senderId", "fullName imageUrl username");

        res.status(200).json(requests);
    } catch (error) {
        next(error);
    }
}

export const getFriends = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).auth.userId;
        const user = await User.findOne({ clerkId: userId }).populate("friends", "fullName imageUrl clerkId isOnline");

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json(user.friends);
    } catch (error) {
        next(error);
    }
}
