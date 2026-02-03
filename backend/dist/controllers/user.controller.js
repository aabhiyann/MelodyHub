import { UserService } from "../services/user.service.js";
import { BaseController } from "./base.controller.js";
import { ActivityService } from "../services/activity.service.js";
import { ActivityType } from "../models/activity.model.js";
export class UserController extends BaseController {
    userService;
    activityService;
    constructor() {
        super();
        this.userService = new UserService();
        this.activityService = new ActivityService();
    }
    async getAllUsers(req, res, next) {
        try {
            const currentUserId = req.auth.userId;
            const users = await this.userService.getAllExcept(currentUserId);
            this.handleSuccess(res, users, 200, true); // ← New format
        }
        catch (error) {
            this.handleError(next, error);
        }
    }
    async getMessages(req, res, next) {
        try {
            const myId = req.auth.userId;
            const { userId } = req.params;
            const messages = await this.userService.getMessagesBetweenUsers(myId, userId);
            this.handleSuccess(res, messages, 200, true); // ← New format
        }
        catch (error) {
            this.handleError(next, error);
        }
    }
    async getMyProfile(req, res, next) {
        try {
            const userId = req.auth.userId;
            const user = await this.userService.getByClerkId(userId);
            if (!user)
                return res.status(404).json({ success: false, message: "User not found" });
            const stats = await this.userService.getUserStats(user._id);
            this.handleSuccess(res, {
                success: true,
                data: {
                    ...user.toObject(),
                    ...stats
                }
            });
        }
        catch (error) {
            this.handleError(next, error);
        }
    }
    async updateProfile(req, res, next) {
        try {
            const userId = req.auth.userId;
            const { bio, location, website, isPrivate, fullName } = req.body;
            const user = await this.userService.updateProfile(userId, { bio, location, website, isPrivate, fullName });
            if (!user)
                return res.status(404).json({ success: false, message: "User not found" });
            this.handleSuccess(res, { success: true, data: user, message: "Profile updated" });
        }
        catch (error) {
            this.handleError(next, error);
        }
    }
    async getUserProfile(req, res, next) {
        try {
            const id = req.params.id;
            const currentUserId = req.auth?.userId; // Optional auth for public view
            // Target User
            let user = await this.userService.getByClerkId(id);
            if (!user && id.match(/^[0-9a-fA-F]{24}$/)) {
                user = await this.userService.findById(id);
            }
            if (!user)
                return res.status(404).json({ success: false, message: "User not found" });
            // Get Stats
            const stats = await this.userService.getUserStats(user._id);
            // Check Follow Status if logged in
            let isFollowing = false;
            if (currentUserId) {
                const currentUser = await this.userService.getByClerkId(currentUserId);
                if (currentUser) {
                    isFollowing = await this.userService.getConnectionStatus(currentUser._id, user._id);
                }
            }
            this.handleSuccess(res, {
                success: true,
                data: {
                    ...user.toObject(),
                    ...stats,
                    isFollowing
                }
            });
        }
        catch (error) {
            this.handleError(next, error);
        }
    }
    async followUser(req, res, next) {
        try {
            const followerId = req.auth.userId;
            const { id: followingId } = req.params;
            const followingIdStr = followingId;
            const follower = await this.userService.getByClerkId(followerId);
            let following = await this.userService.getByClerkId(followingIdStr);
            if (!following && followingIdStr.match(/^[0-9a-fA-F]{24}$/)) {
                following = await this.userService.findById(followingIdStr);
            }
            if (!follower || !following) {
                return res.status(404).json({ success: false, message: "User not found" });
            }
            await this.userService.followUser(follower._id, following._id);
            // Log activity
            await this.activityService.logActivity(follower._id, ActivityType.FOLLOW_USER, following._id);
            this.handleSuccess(res, { success: true, message: "Followed successfully" });
        }
        catch (error) {
            this.handleError(next, error);
        }
    }
    async unfollowUser(req, res, next) {
        try {
            const followerId = req.auth.userId;
            const { id: followingId } = req.params;
            const followingIdStr = followingId;
            const follower = await this.userService.getByClerkId(followerId);
            let following = await this.userService.getByClerkId(followingIdStr);
            if (!following && followingIdStr.match(/^[0-9a-fA-F]{24}$/)) {
                following = await this.userService.findById(followingIdStr);
            }
            if (!follower || !following) {
                return res.status(404).json({ success: false, message: "User not found" });
            }
            await this.userService.unfollowUser(follower._id, following._id);
            this.handleSuccess(res, { success: true, message: "Unfollowed successfully" });
        }
        catch (error) {
            this.handleError(next, error);
        }
    }
}
