import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { hybridRecommendations } from "../services/recommendation.service.js";
import { AuthenticatedRequest } from "../types/index.js";

const router = Router();

/**
 * GET /api/recommendations/personalized?limit=50
 * Hybrid personalized recommendations (collaborative + content-based)
 */
router.get("/personalized", protectRoute, async (req, res, next) => {
    try {
        const userId = (req as AuthenticatedRequest).auth?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Authentication required" });
        }
        const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
        const result = await hybridRecommendations(userId, limit);
        return res.status(200).json({
            success: true,
            data: result.songs,
            algorithm: result.algorithm,
            confidence: result.confidence,
        });
    } catch (error) {
        next(error);
    }
});

export default router;
