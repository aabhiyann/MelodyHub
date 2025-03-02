import { User } from "../models/user.model.js";
import { BaseController } from "./base.controller.js";

export class AuthController extends BaseController {
  async authCallback(req, res, next) {
    try {
      const { id, firstName, lastName, imageUrl } = req.body;
      const user = await User.findOne({ clerkId: id });

      if (!user) {
        await User.create({
          clerkId: id,
          fullName: `${firstName || ""} ${lastName || ""}`.trim(),
          imageUrl,
        });
      }

      this.handleSuccess(res, { success: true });
    } catch (error) {
      this.handleError(next, error);
    }
  }
}