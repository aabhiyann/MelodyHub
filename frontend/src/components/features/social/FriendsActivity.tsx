import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/ChatStore";
import { useUser } from "@clerk/clerk-react";
import { Headphones, Music, Users } from "lucide-react";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const FriendsActivity = () => {
    const { user } = useUser();
    const { users, fetchUsers, onlineUsers, activities } = useChatStore();

    useEffect(() => {
        if (user) fetchUsers();
    }, [user?.id, fetchUsers]);

    // Filter out current user - guard against non-array data from API errors
    const usersList = Array.isArray(users) ? users : [];
    const friends = Array.from(
        new Map(
            usersList
                .filter((u) => u.clerkId !== user?.id && u.fullName !== "Admin")
                .map((u) => [u._id, u])
        ).values()
    );

    return (
        <div className='h-full flex flex-col'>
            <div className='p-4 border-b border-white/5'>
                <h3 className='font-semibold text-white flex items-center gap-2'>
                    <Users className='size-5 text-brand-primary' />
                    Community Activity
                </h3>
            </div>
            <ScrollArea className='flex-1 p-4'>
                <div className='space-y-4'>
                    {friends.map((friend) => {
                        const isOnline = onlineUsers.has(friend.clerkId);
                        const activity = activities.get(friend.clerkId) || "Idle";

                        return (
                            <div
                                key={friend._id}
                                className='flex items-start gap-3 p-3 rounded-xl bg-background-elevated/40 hover:bg-background-elevated/60 transition-colors cursor-pointer group'
                            >
                                <div className='relative'>
                                    <Avatar className='size-10 border border-white/10'>
                                        <AvatarImage
                                            src={friend.imageUrl}
                                            alt={friend.fullName}
                                        />
                                        <AvatarFallback>{friend.fullName[0]}</AvatarFallback>
                                    </Avatar>
                                    <div
                                        className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-background-base ${isOnline ? "bg-green-500" : "bg-zinc-500"
                                            }`}
                                    />
                                </div>

                                <div className='flex-1 min-w-0'>
                                    <div className='flex items-center justify-between'>
                                        <h4 className='font-medium text-sm text-white truncate'>
                                            {friend.fullName}
                                        </h4>
                                        {isOnline && (
                                            <span className='text-[10px] text-green-400 font-medium px-1.5 py-0.5 bg-green-500/10 rounded-full'>
                                                Online
                                            </span>
                                        )}
                                    </div>

                                    {isOnline && activity !== "Idle" ? (
                                        <div className='flex items-center gap-1.5 mt-1 text-xs text-brand-secondary/80'>
                                            <Headphones className='size-3 shrink-0 animate-pulse' />
                                            <span className='truncate'>{activity.replace("Playing ", "")}</span>
                                        </div>
                                    ) : (
                                        <div className='flex items-center gap-1.5 mt-1 text-xs text-text-secondary'>
                                            <Music className='size-3 shrink-0' />
                                            <span className='truncate'>{isOnline ? "Idle" : "Offline"}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {friends.length === 0 && (
                        <div className="text-center py-8 text-text-secondary">
                            <p>No friends found.</p>
                            <p className="text-xs mt-1">Start following people to see their activity!</p>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
};
