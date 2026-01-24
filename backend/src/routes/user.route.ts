import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";

const router = Router();
const controller = new UserController();

// ... imports

router.get("/profile", controller.getMyProfile.bind(controller));
router.put("/profile", controller.updateProfile.bind(controller));
router.get("/:id", controller.getUserProfile.bind(controller));

router.post("/follow/:id", controller.followUser.bind(controller));
router.post("/unfollow/:id", controller.unfollowUser.bind(controller));

// ... export
// Original user.route.ts (if any) was replaced. I need to make sure I don't break existing routes if they rely on index.ts import.
// index.ts: import userRoutes from './routes/user.route.js'; -> app.use("/api/users", userRoutes);
// This seems correct.

export default router;
