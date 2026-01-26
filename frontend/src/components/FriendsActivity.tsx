import { ScrollArea } from "@/components/ui/scroll-area";
import { useSocialStore } from "@/stores/useSocialStore";
import { useUser } from "@clerk/clerk-react";
import { Clock, Headphones, Music, UserPlus, Users } from "lucide-react";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const FriendsActivity = () => {
    const { activity, users, fetchFriendActivity, fetchUsers, friends, isLoading } = useSocialStore();
    const { user } = useUser();

    useEffect(() => {
        if (user) {
            fetchFriendActivity();
            fetchUsers();
        }
    }, [user, fetchFriendActivity, fetchUsers]);

    return (
        <div className="h-full bg-surface-elevated/20 border-l border-white/5 p-4 flex flex-col w-[280px] hidden xl:flex">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                    <Users className="size-4" />
                    Friend Activity
                </h3>
            </div>

            <ScrollArea className="flex-1 -mx-4 px-4">
                <div className="space-y-4">
                    {isLoading ? (
                        // Skeleton
                        [1, 2, 3].map(i => (
                            <div key={i} className="flex gap-3 animate-pulse">
                                <div className="size-8 rounded-full bg-white/10" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 w-2/3 bg-white/10 rounded" />
                                    <div className="h-3 w-1/2 bg-white/10 rounded" />
                                </div>
                            </div>
                        ))
                    ) : activity.length === 0 ? (
                        <div className="text-center py-8">
                            <Headphones className="size-10 text-zinc-600 mx-auto mb-3" />
                            <h4 className="text-sm font-medium text-white mb-1">It's quiet here</h4>
                            <p className="text-xs text-zinc-500 mb-4">
                                Connect with friends to see what they're listening to.
                            </p>
                        </div>
                    ) : (
                        activity.map((item) => (
                            <div key={item._id} className="glass-panel p-3 rounded-lg hover:bg-white/5 transition-colors group">
                                <div className="flex gap-3">
                                    <Avatar className="size-8 border border-white/10">
                                        <AvatarImage src={item.userId.imageUrl} alt={item.userId.fullName} />
                                        <AvatarFallback>{item.userId.fullName[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white truncate">
                                            <span className="font-medium">{item.userId.fullName}</span>
                                        </p>
                                        <p className="text-xs text-zinc-400 truncate mt-0.5">
                                            {item.type === "like_song" && "Liked a song"}
                                            {item.type === "create_playlist" && "Created a playlist"}
                                            {item.type === "follow_user" && "Followed a user"}
                                        </p>
                                    </div>
                                </div>
                                {item.targetId && (item.type === "like_song" || item.type === "create_playlist") && (
                                    <div className="mt-2 flex items-center gap-2 p-2 rounded bg-white/5 text-xs">
                                        <Music className="size-3 text-brand-primary" />
                                        <div className="flex-1 truncate">
                                            <p className="text-white truncate font-medium">{item.targetId.title || item.targetId.name || "Unknown Song"}</p>
                                            <p className="text-zinc-400 truncate">{item.targetId.artist || "Unknown Artist"}</p>
                                        </div>
                                    </div>
                                )}
                                <div className="mt-2 flex items-center gap-1 text-[10px] text-zinc-500">
                                    <Clock className="size-3" />
                                    {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    );
};

export default FriendsActivity;
