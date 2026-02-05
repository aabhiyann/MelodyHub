import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { NotificationController } from "../controllers/notification.controller.js";

const router = Router();

// All notification routes require authentication
router.get("/", protectRoute, NotificationController.getNotifications);
router.put("/:id/read", protectRoute, NotificationController.markAsRead);
router.put("/read-all", protectRoute, NotificationController.markAllAsRead);
router.delete("/:id", protectRoute, NotificationController.deleteNotification);

export default router;
