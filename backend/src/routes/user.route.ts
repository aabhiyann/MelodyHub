import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";

const router = Router();
const controller = new UserController();

router.get("/profile", controller.getMyProfile.bind(controller));
router.put("/profile", controller.updateProfile.bind(controller));
router.get("/:id", controller.getUserProfile.bind(controller));

// We don't have this in original user.route.ts (it was generic users), but we might want it.
// Original user.route.ts (if any) was replaced. I need to make sure I don't break existing routes if they rely on index.ts import.
// index.ts: import userRoutes from './routes/user.route.js'; -> app.use("/api/users", userRoutes);
// This seems correct.

export default router;
