import { Router } from "express";
import { acceptFriendRequest, getFriendRequests, getFriends, rejectFriendRequest, sendFriendRequest } from "../controllers/friend.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protectRoute);

router.get("/", getFriends);
router.get("/requests", getFriendRequests);
router.post("/request", sendFriendRequest);
router.post("/accept", acceptFriendRequest);
router.post("/reject", rejectFriendRequest);

export default router;
