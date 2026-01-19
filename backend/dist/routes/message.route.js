import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { UserController } from "../controllers/user.controller.js";
const router = Router();
const controller = new UserController();
// GET /api/messages/:userId - Get messages between current user and specified user
router.get("/:userId", protectRoute, controller.getMessages.bind(controller));
export default router;
