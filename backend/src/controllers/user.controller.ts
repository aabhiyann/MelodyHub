import { Request, Response, NextFunction } from 'express';
import { UserService } from "../services/user.service.js";
import { BaseController } from "./base.controller.js";
import { ActivityService } from "../services/activity.service.js";
import { ActivityType } from "../models/activity.model.js";
import { AuthenticatedRequest } from "../types/index.js";

export class UserController extends BaseController {
  private userService: UserService;
  private activityService: ActivityService;

  constructor() {
    super();
    this.userService = new UserService();
    this.activityService = new ActivityService();
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const currentUserId = (req as AuthenticatedRequest).auth.userId;
      const users = await this.userService.getAllExcept(currentUserId);
      this.handleSuccess(res, users, 200, true); // ← New format
    } catch (error) {
      this.handleError(next, error);
    }
  }

  async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const myId = (req as AuthenticatedRequest).auth.userId;
      const { userId } = req.params;
      const messages = await this.userService.getMessagesBetweenUsers(myId, userId as string);
      this.handleSuccess(res, messages, 200, true); // ← New format
    } catch (error) {
      this.handleError(next, error);
    }
  }

  async getMyProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).auth.userId;
      const user = await this.userService.getByClerkId(userId);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      const stats = await this.userService.getUserStats(user._id as string);

      this.handleSuccess(res, {
        success: true,
        data: {
          ...user.toObject(),
          ...stats
        }
      });
    } catch (error) {
      this.handleError(next, error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).auth.userId;
      const { bio, location, website, isPrivate, fullName } = req.body;
      const user = await this.userService.updateProfile(userId, { bio, location, website, isPrivate, fullName });

      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      this.handleSuccess(res, { success: true, data: user, message: "Profile updated" });
    } catch (error) {
      this.handleError(next, error);
    }
  }

  async getUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const currentUserId = (req as AuthenticatedRequest).auth?.userId; // Optional auth for public view

      // Target User
      let user = await this.userService.getByClerkId(id) as any;
      if (!user && id.match(/^[0-9a-fA-F]{24}$/)) {
        user = await this.userService.findById(id) as any;
      }
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      // Get Stats
      const stats = await this.userService.getUserStats(user._id as string);

      // Check Follow Status if logged in
      let isFollowing = false;
      if (currentUserId) {
        const currentUser = await this.userService.getByClerkId(currentUserId);
        if (currentUser) {
          isFollowing = await this.userService.getConnectionStatus(currentUser._id as string, user._id as string);
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
    } catch (error) {
      this.handleError(next, error);
    }
  }

  async followUser(req: Request, res: Response, next: NextFunction) {
    try {
      const followerId = (req as AuthenticatedRequest).auth.userId;
      const { id: followingId } = req.params;
      const followingIdStr = followingId as string;

      const follower = await this.userService.getByClerkId(followerId);
      let following = await this.userService.getByClerkId(followingIdStr) as any;

      if (!following && followingIdStr.match(/^[0-9a-fA-F]{24}$/)) {
        following = await this.userService.findById(followingIdStr) as any;
      }

      if (!follower || !following) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      await this.userService.followUser(follower._id as string, following._id as string);

      // Log activity
      await this.activityService.logActivity(
        follower._id as string,
        ActivityType.FOLLOW_USER,
        following._id as string
      );

      this.handleSuccess(res, { success: true, message: "Followed successfully" });
    } catch (error) {
      this.handleError(next, error);
    }
  }

  async unfollowUser(req: Request, res: Response, next: NextFunction) {
    try {
      const followerId = (req as AuthenticatedRequest).auth.userId;
      const { id: followingId } = req.params;
      const followingIdStr = followingId as string;

      const follower = await this.userService.getByClerkId(followerId);
      let following = await this.userService.getByClerkId(followingIdStr) as any;

      if (!following && followingIdStr.match(/^[0-9a-fA-F]{24}$/)) {
        following = await this.userService.findById(followingIdStr) as any;
      }

      if (!follower || !following) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      await this.userService.unfollowUser(follower._id as string, following._id as string);
      this.handleSuccess(res, { success: true, message: "Unfollowed successfully" });
    } catch (error) {
      this.handleError(next, error);
    }
  }
}
