import { Request, Response } from 'express';
import { GamificationService } from '../services/gamification.service.js';

const gamificationService = new GamificationService();

export class GamificationController {
    // Get user's gamification stats
    static async getStats(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = (req as any).auth;

            // Delegate to service
            const stats = await gamificationService.getUserStats(userId);

            res.json(stats);
        } catch (error) {
            console.error('Error fetching gamification stats:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // Award XP (e.g., after listening to a song)
    static async awardXP(req: Request, res: Response): Promise<void> {
        try {
            const { amount, source } = req.body;
            const { userId } = (req as any).auth;

            // Delegate to service
            const result = await gamificationService.awardXP(userId, amount, source);

            res.json({
                ...result,
                message: `Awarded ${amount} XP`
            });
        } catch (error) {
            console.error('Error awarding XP:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
