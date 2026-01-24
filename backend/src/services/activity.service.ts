import { Activity, ActivityType, IActivity } from "../models/activity.model.js";
import { UserConnection } from "../models/user.connection.model.js";
import { User } from "../models/user.model.js";
import { Song } from "../models/song.model.js";
import { SharedPlaylist } from "../models/sharedPlaylist.model.js";
import mongoose from "mongoose";

export class ActivityService {
    /**
     * Log a new activity
     */
    async logActivity(userId: string, type: ActivityType, targetId: string) {
        return await Activity.create({
            userId,
            type,
            targetId,
        });
    }

    /**
     * Get activity feed for a user (activities of people they follow)
     */
    async getFeed(userId: string, limit: number = 20) {
        // 1. Get list of users followed by current user
        const connections = await UserConnection.find({ followerId: userId });
        const followingIds = connections.map((c) => c.followingId);

        // 2. Fetch activities from these users
        const activities = await Activity.find({ userId: { $in: followingIds } })
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate("userId", "fullName imageUrl clerkId") // Actor details
            .lean();

        // 3. Enrich activities with target details (Song, Playlist, User)
        // This manual enrichment is needed because targetId is polymorphic
        const enrichedActivities = await Promise.all(
            activities.map(async (activity) => {
                let target = null;

                try {
                    switch (activity.type) {
                        case ActivityType.LIKE_SONG:
                            target = await Song.findById(activity.targetId).select("title artist imageUrl");
                            break;
                        case ActivityType.CREATE_PLAYLIST:
                            target = await SharedPlaylist.findById(activity.targetId).select("name");
                            break;
                        case ActivityType.FOLLOW_USER:
                            target = await User.findById(activity.targetId).select("fullName imageUrl clerkId");
                            break;
                    }
                } catch (err) {
                    console.error(`Failed to fetch target for activity ${activity._id}`, err);
                }

                return {
                    ...activity,
                    target: target || null, // If target deleted, return null
                };
            })
        );

        // Filter out activities where target content is missing (e.g. deleted song)
        return enrichedActivities.filter((a) => a.target !== null);
    }
}
