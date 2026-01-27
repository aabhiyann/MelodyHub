import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Music, User, Heart, ListMusic } from "lucide-react";
import { Link } from "react-router-dom";
import { useChatStore } from "@/stores/useChatStore";

type ActivityType = "like_song" | "create_playlist" | "follow_user";

interface Activity {
    _id: string;
    type: ActivityType;
    userId: {
        _id: string;
        fullName: string;
        imageUrl: string;
        clerkId: string;
    };
    target: any;
    createdAt: string;
}

export const ActivityFeed = () => {
    const { onlineUsers, userActivities } = useChatStore();
    const { data: activities } = useQuery({
        queryKey: ["activities"],
        queryFn: async () => {
            const response = await axiosInstance.get("/activities");
            return response.data as Activity[];
        },
        refetchInterval: 30000,
    });

    const getActivityIcon = (type: ActivityType) => {
        switch (type) {
            case "like_song": return <Heart className="size-3 text-pink-500 fill-pink-500" />;
            case "create_playlist": return <ListMusic className="size-3 text-violet-500" />;
            case "follow_user": return <User className="size-3 text-blue-500" />;
            default: return <Music className="size-3 text-zinc-500" />;
        }
    };

    const getActivityText = (activity: Activity) => {
        const target = activity.target;
        if (!target) return "did something";

        switch (activity.type) {
            case "like_song":
                return (
                    <span>
                        liked <span className="font-medium text-white">{target.title}</span> by {target.artist}
                    </span>
                );
            case "create_playlist":
                return (
                    <span>
                        created a new playlist <span className="font-medium text-white">{target.name}</span>
                    </span>
                );
            case "follow_user":
                return (
                    <span>
                        followed <span className="font-medium text-white">{target.fullName}</span>
                    </span>
                );
            default:
                return "performed an action";
        }
    };

    if (!activities || activities.length === 0) {
        return (
            <div className="w-full h-full bg-zinc-900/50 border-l border-zinc-800 hidden lg:flex lg:flex-col lg:w-72 xl:w-80 p-4">
                <div className="border-b border-zinc-800 pb-4 mb-4">
                    <h3 className="font-semibold text-zinc-200">Friend Activity</h3>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 opacity-60">
                    <div className="bg-zinc-800 p-3 rounded-full">
                        <User className="size-6 text-zinc-400" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-zinc-300 font-medium text-sm">No recent activity</p>
                        <p className="text-xs text-zinc-500 max-w-[200px]">
                            Follow friends and artists to see what they are listening to.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-zinc-900/50 border-l border-zinc-800 hidden lg:flex lg:flex-col lg:w-72 xl:w-80">
            <div className="p-4 border-b border-zinc-800">
                <h3 className="font-semibold text-zinc-200">Friend Activity</h3>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                    {activities.map((activity: Activity) => {
                        const isOnline = onlineUsers.includes(activity.userId.clerkId);
                        const currentActivity = userActivities.get(activity.userId.clerkId);
                        const displayActivity = isOnline && currentActivity && currentActivity !== "Idle"
                            ? currentActivity
                            : null;

                        return (
                            <div key={activity._id} className="flex gap-3 relative group">
                                {/* Avatar */}
                                <Link to={`/user/${activity.userId.clerkId}`} className="shrink-0 mt-1 relative">
                                    <Avatar className="size-8 border border-zinc-800">
                                        <AvatarImage src={activity.userId.imageUrl} alt={activity.userId.fullName} />
                                        <AvatarFallback>{activity.userId.fullName[0]}</AvatarFallback>
                                    </Avatar>
                                    {/* Online Indicator */}
                                    {isOnline && (
                                        <div className="absolute top-0 right-0 size-3 bg-green-500 rounded-full border-2 border-zinc-900" />
                                    )}
                                    {/* Activity Icon Badge - Only show if not displaying real-time status? Or keep it? */}
                                    <div className="absolute -bottom-1 -right-1 bg-zinc-900 rounded-full p-0.5 border border-zinc-800">
                                        <div className="bg-zinc-800 rounded-full p-1">
                                            {getActivityIcon(activity.type)}
                                        </div>
                                    </div>
                                </Link>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm text-zinc-400 leading-snug">
                                        <Link to={`/user/${activity.userId.clerkId}`} className="font-medium text-zinc-200 hover:underline hover:text-white transition-colors">
                                            {activity.userId.fullName}
                                        </Link>{" "}
                                        {displayActivity ? (
                                            <span className="text-brand-primary truncate block font-medium">{displayActivity}</span>
                                        ) : (
                                            getActivityText(activity)
                                        )}
                                    </div>
                                    {!displayActivity && (
                                        <div className="text-xs text-zinc-500 mt-1">
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
