import { Request, Response, NextFunction } from 'express';
import { BaseController } from "./base.controller.js";
import { UserService } from "../services/user.service.js";

const userService = new UserService();

export class AuthController extends BaseController {
  async authCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, firstName, lastName, imageUrl } = req.body;

      // Delegate to user service
      const user = await userService.findOrCreateByClerkId(id, {
        firstName,
        lastName,
        imageUrl
      });

      this.handleSuccess(res, user, 200, true);
    } catch (error) {
      this.handleError(next, error);
    }
  }
}
