import { UserService } from "../services/user.service.js";
import { BaseController } from "./base.controller.js";

export class UserController extends BaseController {
  constructor() {
    super();
    this.userService = new UserService();
  }

  async getAllUsers(req, res, next) {
    try {
      const currentUserId = req.auth.userId;
      const users = await this.userService.getAllExcept(currentUserId);
      this.handleSuccess(res, users);
    } catch (error) {
      this.handleError(next, error);
    }
  }

  async getMessages(req, res, next) {
    try {
      const myId = req.auth.userId;
      const { userId } = req.params;
      const messages = await this.userService.getMessagesBetweenUsers(myId, userId);
      this.handleSuccess(res, messages);
    } catch (error) {
      this.handleError(next, error);
    }
  }
}