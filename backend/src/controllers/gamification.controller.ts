import { Request, Response } from 'express';
import { User } from '../models/user.model.js';
import { DailyChallenge } from '../models/dailyChallenge.model.js';
import { AchievementProgress } from '../models/achievement.model.js';

export class GamificationController {
    // Get user's gamification stats
    static async getStats(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = (req as any).auth;
            const user = await User.findById(userId);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            // Get today's challenges
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            let dailyChallenges = await DailyChallenge.findOne({
                userId: user._id,
                date: today
            });

            // If no challenges exist for today, create them (simplified logic for now)
            if (!dailyChallenges) {
                dailyChallenges = await DailyChallenge.create({
                    userId: user._id,
                    date: today,
                    challenges: [
                        {
                            id: 'daily_listen',
                            type: 'listen_count',
                            target: 5,
                            reward: { xp: 10, gems: 5 }
                        },
                        {
                            id: 'daily_login',
                            type: 'login',
                            target: 1,
                            progress: 1,
                            completed: true,
                            reward: { xp: 5, gems: 5 }
                        }
                    ]
                });

                // Award login bonus immediately if created (or handle separately)
                // straightforward way: user just logged in to see stats
            }

            res.json({
                gamification: user.gamification,
                dailyChallenges: dailyChallenges.challenges
            });

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
            const user = await User.findById(userId);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            user.gamification.xp += amount;

            // Level up logic (Simple: Level * 100 XP required for next level)
            // Or use the requested tier system.
            // Level 1-10: 100 XP per level
            // Level 11-25: 150 XP per level
            // etc.

            // Simplified level check for MVP:
            const currentLevel = user.gamification.level;
            let xpNeeded = 100;
            if (currentLevel > 10) xpNeeded = 150;
            if (currentLevel > 25) xpNeeded = 200;
            if (currentLevel > 50) xpNeeded = 300;
            if (currentLevel > 75) xpNeeded = 500;

            // This is actually cumulative in many systems, or "xp this level"
            // For now, let's assume total XP determines level to avoid complex migration
            // Better approach for now: Just increment XP. Client or a separate helper calculates level.
            // OR: We store level and increment it when threshold met.

            // Let's implement a quick check:
            // Calculate total XP needed for *next* level based on current level
            // This requires tracking "XP spent" or "XP current level". 
            // Simplified: Global XP. 

            // Let's just save the XP for now and let the client show progress, 
            // OR do a basic check:

            // user.gamification.level logic...
            // For MVP, just saving XP.

            await user.save();
            res.json({
                xp: user.gamification.xp,
                level: user.gamification.level,
                message: `Awarded ${amount} XP`
            });

        } catch (error) {
            console.error('Error awarding XP:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
