import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";
import { authCallbackSchema } from "../lib/validators.js";

const router = Router();

const authController = new AuthController();

router.post("/callback", validate(authCallbackSchema), authController.authCallback.bind(authController));
export default router;
