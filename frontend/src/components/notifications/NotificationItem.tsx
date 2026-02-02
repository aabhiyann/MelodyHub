import { Bell, Heart, MessageCircle, UserPlus, Users, Music } from "lucide-react";
import { NotificationItem as NotificationItemType } from "@/stores/NotificationStore";
import { cn } from "@/lib/utils";

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
    return (
        <div
            className={cn(
                "flex gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer",
                !item.read && "bg-brand-primary/10"
            )}
            onClick={() => !item.read && onMarkRead(item._id)}
        >
            <div className="flex-shrink-0 p-2 rounded-full bg-white/10">
                <Icon className="size-4 text-brand-primary" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{item.title}</p>
                {item.body ? (
                    <p className="text-xs text-zinc-400 truncate mt-0.5">{item.body}</p>
                ) : null}
                <p className="text-xs text-zinc-500 mt-1">
                    {new Date(item.createdAt).toLocaleDateString()}
                </p>
            </div>
        </div>
    );
};
