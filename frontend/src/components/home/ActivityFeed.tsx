import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Music, User, Heart, ListMusic } from "lucide-react";
import { Link } from "react-router-dom";
import { useChatStore } from "@/stores/ChatStore";

import { Activity, ActivityType, isSongTarget, isPlaylistTarget, isUserTarget } from "@/types";

const ActivityFeedSkeleton = () => (
    <div className="w-full h-full bg-surface-elevated border-l border-border-subtle hidden lg:flex lg:flex-col lg:w-72 xl:w-80 p-4">
        <div className="border-b border-border-subtle pb-4 mb-4">
            <div className="h-5 w-32 rounded bg-white/10 animate-pulse" />
        </div>
        <div className="space-y-3 flex-1">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl">
                    <div className="size-10 rounded-full bg-white/10 animate-pulse shrink-0" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 rounded bg-white/10 animate-pulse" />
                        <div className="h-3 w-1/2 rounded bg-white/10 animate-pulse" />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export const ActivityFeed = () => {
    const { onlineUsers, activities: userActivities } = useChatStore();
    const { data: activities, isLoading } = useQuery({
        queryKey: ["activities"],
        queryFn: async () => {
            const response = await axiosInstance.get("/activities");
            return Array.isArray(response.data) ? response.data as Activity[] : [];
        },
        refetchInterval: 30000,
    });

    if (isLoading) {
        return <ActivityFeedSkeleton />;
    }

    const getActivityIcon = (type: ActivityType) => {
        switch (type) {
            case "like_song": return <Heart className="size-3 text-pink-500 fill-pink-500" />;
            case "create_playlist": return <ListMusic className="size-3 text-emerald-500" />;
            case "follow_user": return <User className="size-3 text-blue-500" />;
            default: return <Music className="size-3 text-text-tertiary" />;
        }
    };

    const getActivityText = (activity: Activity) => {
        const target = activity.target as import("@/types").ActivityTarget; // Safely cast here as legacy shape should match compatible props if present
        if (!target) return "did something";

        if (activity.type === 'like_song' && isSongTarget(target)) {
            return (
                <span>
                    liked <span className="font-medium text-white">{String(target.title)}</span> by {String(target.artist)}
                </span>
            );
        }

        if (activity.type === 'create_playlist' && isPlaylistTarget(target)) {
            return (
                <span>
                    created a new playlist <span className="font-medium text-white">{String(target.name)}</span>
                </span>
            );
        }

        if (activity.type === 'follow_user' && isUserTarget(target)) {
            return (
                <span>
                    followed <span className="font-medium text-white">{String(target.fullName)}</span>
                </span>
            );
        }

        return "performed an action";
    };

    if (!activities || activities.length === 0) {
        return (
            <div className="w-full h-full bg-surface-elevated border-l border-border-subtle hidden lg:flex lg:flex-col lg:w-72 xl:w-80 p-4">
                <div className="border-b border-border-subtle pb-4 mb-4">
                    <h3 className="font-semibold text-text-secondary">Friend Activity</h3>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 opacity-60">
                    <div className="bg-surface-glass-strong p-3 rounded-full">
                        <User className="size-6 text-text-tertiary" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-text-secondary font-medium text-sm">No recent activity</p>
                        <p className="text-xs text-text-tertiary max-w-[200px]">
                            Follow friends and artists to see what they are listening to.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-surface-elevated border-l border-border-subtle hidden lg:flex lg:flex-col lg:w-72 xl:w-80">
            <div className="p-4 border-b border-border-subtle">
                <h3 className="font-semibold text-text-secondary">Friend Activity</h3>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                    {activities.map((activity: Activity) => {
                        const user = activity.userId;
                        if (typeof user === 'string') return null; // Should be populated

                        const isOnline = onlineUsers.has(user.clerkId);
                        const currentActivity = userActivities.get(user.clerkId);
                        const displayActivity = isOnline && currentActivity && currentActivity !== "Idle"
                            ? currentActivity
                            : null;

                        return (
                            <div key={activity._id} className="flex gap-3 relative group">
                                {/* Avatar */}
                                <Link to={`/user/${user.clerkId}`} className="shrink-0 mt-1 relative">
                                    <Avatar className="size-8 border border-border-subtle">
                                        <AvatarImage src={user.imageUrl} alt={user.fullName} />
                                        <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                                    </Avatar>
                                    {/* Online Indicator */}
                                    {isOnline && (
                                        <div className="absolute top-0 right-0 size-3 bg-green-500 rounded-full border-2 border-surface-base" />
                                    )}
                                    {/* Activity Icon Badge */}
                                    <div className="absolute -bottom-1 -right-1 bg-surface-base rounded-full p-0.5 border border-border-subtle">
                                        <div className="bg-zinc-800 rounded-full p-1">
                                            {getActivityIcon(activity.type)}
                                        </div>
                                    </div>
                                </Link>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm text-text-tertiary leading-snug">
                                        <Link to={`/user/${user.clerkId}`} className="font-medium text-text-secondary hover:underline hover:text-white transition-colors">
                                            {user.fullName}
                                        </Link>{" "}
                                        {displayActivity ? (
                                            <span className="text-brand-primary truncate block font-medium">{displayActivity}</span>
                                        ) : (
                                            getActivityText(activity)
                                        )}
                                    </div>
                                    {!displayActivity && (
                                        <div className="text-xs text-text-tertiary mt-1">
                                            {new Date(activity.createdAt).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>
        </div>
    );
};
