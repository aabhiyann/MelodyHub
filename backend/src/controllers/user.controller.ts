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
}
