import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { UserController } from "../controllers/user.controller.js";
const router = Router();
const controller = new UserController();

router.get("/", protectRoute, controller.getAllUsers.bind(controller));
router.get("/messages/:userId", protectRoute, controller.getMessages.bind(controller));

export default router;