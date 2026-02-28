import { Bell, Heart, MessageCircle, UserPlus, Users, Music } from "lucide-react";
import { NotificationItem as NotificationItemType } from "@/stores/NotificationStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, formatRelativeTime } from "@/lib/utils";

const typeIcons: Record<string, typeof Bell> = {
    FRIEND_REQUEST: UserPlus,
    FRIEND_ACCEPT: Users,
    NEW_FOLLOWER: UserPlus,
    LIKE_SONG: Heart,
    PLAYLIST_INVITE: Music,
    NEW_MESSAGE: MessageCircle,
};

interface NotificationItemProps {
    item: NotificationItemType;
    onMarkRead: (id: string) => void;
    onDelete?: (id: string) => void;
}

export const NotificationItem = ({ item, onMarkRead }: NotificationItemProps) => {
    const Icon = typeIcons[item.type] ?? Bell;
    const senderImageUrl = item.metadata?.senderImageUrl as string | undefined;
    const senderName = item.metadata?.senderName as string | undefined;

    return (
        <div
            className={cn(
                "flex gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border-l-2 border-transparent",
                !item.read && "bg-[#22C55E]/10 border-l-[#22C55E]"
            )}
            onClick={() => !item.read && onMarkRead(item._id)}
        >
            <div className="flex-shrink-0">
                {senderImageUrl ? (
                    <Avatar className="size-9 ring-1 ring-white/10">
                        <AvatarImage src={senderImageUrl} alt={senderName} />
                        <AvatarFallback>{senderName?.[0] ?? "?"}</AvatarFallback>
                    </Avatar>
                ) : (
                    <div className="size-9 rounded-full bg-white/10 flex items-center justify-center p-2">
                        <Icon className="size-4 text-[#22C55E]" />
                    </div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{item.title}</p>
                {item.body ? (
                    <p className="text-xs text-zinc-400 truncate mt-0.5">{item.body}</p>
                ) : null}
                <p className="text-xs text-zinc-500 mt-1" title={new Date(item.createdAt).toLocaleString()}>
                    {formatRelativeTime(item.createdAt)}
                </p>
            </div>
        </div>
    );
};
