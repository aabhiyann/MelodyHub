import { User } from '../models/user.model.js';
import { DailyChallenge } from '../models/dailyChallenge.model.js';

export class GamificationService {
    // Check and update streaks for all users (to be run via cron)
    static async updateStreaks(): Promise<void> {
        try {
            const users = await User.find({});
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            yesterday.setHours(0, 0, 0, 0);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            for (const user of users) {
                // Skip if user has no gamification data
                if (!user.gamification) continue;

                const lastListen = user.gamification.lastListenDate
                    ? new Date(user.gamification.lastListenDate)
                    : null;

                if (lastListen) {
                    lastListen.setHours(0, 0, 0, 0);
                }

                // If user listened today, streak is already handled/safe
                if (lastListen && lastListen.getTime() === today.getTime()) {
                    continue;
                }

                // If user listened yesterday, streak is safe (for now)
                // But this cron runs at midnight for the *next* day effectively?
                // Actually, this should run at midnight to check who MISSED yesterday.

                // Let's assume this runs at 00:01 AM
                // We check if lastListen was yesterday. If so, good.
                // If lastListen was BEFORE yesterday, streak is broken.

                // Wait, if I listened yesterday (Oct 25), and now it's Oct 26 00:01.
                // lastListen = Oct 25. 
                // difference = 1 day. Streak continues? No, streak is 'active' but not incremented for today yet.

                // Real concern: Did they miss YESTERDAY?
                // If today is Oct 26.
                // If lastListen < Oct 25, then they missed Oct 25. Streak resets.
                // Unless they have a freeze.

                // Logic:
                // If (today - lastListen) > 1 day:
                //   Check for freeze.
                //   If freeze > 0:
                //     Use freeze, decrement count, keep streak.
                //   Else:
                //     Reset streak to 0.

                if (lastListen) {
                    const diffTime = Math.abs(today.getTime() - lastListen.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    if (diffDays > 1) {
                        // User missed yesterday (and possibly more)
                        // Check for freeze if it's exactly 2 days (missed 1 day)
                        // If they missed multiple days, one freeze might not be enough? 
                        // Duolingo uses 1 freeze for the first missed day. 

                        if (user.gamification.streakFreezes > 0) {
                            // Use freeze
                            user.gamification.streakFreezes -= 1;
                            user.gamification.lastFreezeUsed = new Date();
                            // Streak is kept (but not incremented)
                            console.log(`User ${user.fullName} used a streak freeze.`);
                        } else {
                            // Reset streak
                            user.gamification.streak = 0;
                            console.log(`User ${user.fullName} lost their streak.`);
                        }
                        await user.save();
                    }
                }
            }
        } catch (error) {
            console.error('Error updating streaks:', error);
        }
    }

    // Generate daily challenges for all users
    static async generateDailyChallenges(): Promise<void> {
        try {
            const users = await User.find({});
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            for (const user of users) {
                const existing = await DailyChallenge.findOne({
                    userId: user._id,
                    date: today
                });

                if (!existing) {
                    await DailyChallenge.create({
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
                                progress: 0,
                                completed: false,
                                reward: { xp: 5, gems: 5 }
                            }
                        ]
                    });
                }
            }
        } catch (error) {
            console.error('Error generating daily challenges:', error);
        }
    }

    /**
     * Get user gamification stats (non-static, for controller use)
     */
    async getUserStats(userId: string) {
        const user = await User.findOne({ clerkId: userId });
        if (!user) {
            throw new Error("User not found");
        }

        // Initialize gamification if it doesn't exist
        if (!user.gamification) {
            user.gamification = {
                xp: 0,
                level: 1,
                gems: 0,
                streak: 0,
                streakFreezes: 0,
                achievements: [],
                lastListenDate: undefined,
                lastFreezeUsed: undefined
            };
            await user.save();
        }

        // Get or create today's challenges
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let dailyChallenges = await DailyChallenge.findOne({
            userId: user._id,
            date: today
        });

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
        }

        return {
            gamification: user.gamification,
            dailyChallenges: dailyChallenges.challenges
        };
    }

    /**
     * Award XP to a user
     */
    async awardXP(userId: string, amount: number, source: string) {
        const user = await User.findOne({ clerkId: userId });
        if (!user) {
            throw new Error("User not found");
        }

        // Initialize gamification if it doesn't exist
        if (!user.gamification) {
            user.gamification = {
                xp: 0,
                level: 1,
                gems: 0,
                streak: 0,
                streakFreezes: 0,
                achievements: [],
                lastListenDate: undefined,
                lastFreezeUsed: undefined
            };
        }

        user.gamification.xp += amount;

        // Simple level progression logic
        const currentLevel = user.gamification.level;
        let xpNeeded = 100;
        if (currentLevel > 10) xpNeeded = 150;
        if (currentLevel > 25) xpNeeded = 200;
        if (currentLevel > 50) xpNeeded = 300;
        if (currentLevel > 75) xpNeeded = 500;

        // Future: implement level-up logic based on total XP

        await user.save();

        return {
            xp: user.gamification.xp,
            level: user.gamification.level
        };
    }
}
