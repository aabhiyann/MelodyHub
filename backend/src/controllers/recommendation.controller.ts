import { Request, Response, NextFunction } from 'express';
import { RecommendationService } from "../services/recommendation.service.js";
import { BaseController } from "./base.controller.js";

export class RecommendationController extends BaseController {
    private recommendationService: RecommendationService;

    constructor() {
        super();
        this.recommendationService = new RecommendationService();
    }

    async getSimilarSongs(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const songId = Array.isArray(id) ? id[0] : id;
            const limit = parseInt((Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit) as string) || 10;

            const songs = await this.recommendationService.getSimilarSongs(songId, limit);
            this.handleSuccess(res, songs);
        } catch (error) {
            this.handleError(next, error);
        }
    }

    async getDiscoverWeekly(req: Request, res: Response, next: NextFunction) {
        try {
            // User ID from auth middleware (if authenticated)
            // For now, let's assume authenticated user or fallback.
            const userId = (req as any).auth?.userId;

            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const limit = parseInt((Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit) as string) || 20;
            const songs = await this.recommendationService.getDiscoverWeekly(userId, limit);
            this.handleSuccess(res, songs);
        } catch (error) {
            this.handleError(next, error);
        }
    }
}
