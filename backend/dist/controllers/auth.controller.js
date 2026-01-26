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
            else {
                // Update user info if existing
                user.fullName = `${firstName || ""} ${lastName || ""}`.trim();
                user.imageUrl = imageUrl;
                await user.save();
            }
            this.handleSuccess(res, user);
        }
        catch (error) {
            this.handleError(next, error);
        }
    }
}
