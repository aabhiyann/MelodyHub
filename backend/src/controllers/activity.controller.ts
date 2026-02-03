import { Request, Response, NextFunction } from "express";
import { BaseController } from "./base.controller.js";
import { ActivityService } from "../services/activity.service.js";

interface AuthRequest extends Request {
    auth: {
        userId: string;
    };
}

export class ActivityController extends BaseController {
    private activityService: ActivityService;

    constructor() {
        super();
        this.activityService = new ActivityService();
    }

    async getFeed(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as AuthRequest).auth.userId;
            const user = (req as any).user; // Mongoose user object attached by auth middleware if available, or fetch it

            // Note: middleware usually attaches auth { userId: clerkId }, but service uses MongoID for UserConnection.
            // We need to resolve ClerkId to MongoId if not already done. 
            // Assumption: auth middleware or previous step populates req.user with Mongo document. 
            // If not, we fetch it. BaseController/Service usually handle this, but let's be safe.
            // Actually, in previous steps we saw UserController doing this lookup.

            // Let's assume we need to look up the mongo ID first.
            // Importing UserService here might create circular dependency if not careful, 
            // but Controller-to-Controller dependency is bad. Controller-to-Service is fine.
            // We can just query User model directly or use UserService.

            // Wait, looking at UserService, it has getByClerkId.
            // Let's assume we have the mongo ID. 
            // The activityService.getFeed expects a userId string. 
            // If UserConnection uses Mongo ObjectID strings, we need that.

            // Checking UserConnection model: followerId is ObjectId. 
            // So we need the Mongo _id of the current user.

            // For now, let's assume we fetch the user here to get the ID.

            // Reuse logic to find user by ClerkID
            const { User } = await import("../models/user.model.js"); // Dynamic import to avoid cycles if any
            const currentUser = await User.findOne({ clerkId: userId });

            if (!currentUser) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            const feed = await this.activityService.getFeed(currentUser._id as string);
            this.handleSuccess(res, feed, 200, true); // ← New format
        } catch (error) {
            this.handleError(next, error);
        }
    }
}
