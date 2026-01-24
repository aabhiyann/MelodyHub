import { Request, Response, NextFunction } from 'express';
import { UserService } from "../services/user.service.js";
import { BaseController } from "./base.controller.js";

interface AuthRequest extends Request {
  auth: {
    userId: string;
  };
}

export class UserController extends BaseController {
  private userService: UserService;

  constructor() {
    super();
    this.userService = new UserService();
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const currentUserId = (req as AuthRequest).auth.userId;
      const users = await this.userService.getAllExcept(currentUserId);
      this.handleSuccess(res, users);
    } catch (error) {
      this.handleError(next, error);
    }
  }

  async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const myId = (req as AuthRequest).auth.userId;
      const { userId } = req.params;
      const messages = await this.userService.getMessagesBetweenUsers(myId, userId as string);
      this.handleSuccess(res, messages);
    } catch (error) {
      this.handleError(next, error);
    }
  }

  async getMyProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthRequest).auth.userId;
      const user = await this.userService.getByClerkId(userId);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });
      this.handleSuccess(res, { success: true, data: user });
    } catch (error) {
      this.handleError(next, error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthRequest).auth.userId;
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
      // Try clerkId first
      let user = await this.userService.getByClerkId(id);
      // If not found, try mongoId
      if (!user && id.match(/^[0-9a-fA-F]{24}$/)) {
        user = await this.userService.findById(id);
      }
      if (!user) return res.status(404).json({ success: false, message: "User not found" });
      this.handleSuccess(res, { success: true, data: user });
    } catch (error) {
      this.handleError(next, error);
    }
  }
}
