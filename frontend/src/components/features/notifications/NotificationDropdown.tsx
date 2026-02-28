import { useRef, useEffect } from "react";
import { useNotificationStore } from "@/stores/NotificationStore";
import { useChatStore } from "@/stores/ChatStore";
import { NotificationItem } from "./NotificationItem";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X } from "lucide-react";
import { FriendRequest } from "@/types";

interface NotificationDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    anchorRef: React.RefObject<HTMLElement | null>;
}

export const NotificationDropdown = ({ isOpen, onClose, anchorRef }: NotificationDropdownProps) => {
    const { items, fetchNotifications, markAsRead, markAllAsRead, isLoading } = useNotificationStore();
    const { friendRequests, acceptFriendRequest, rejectFriendRequest } = useChatStore();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) fetchNotifications();
    }, [isOpen, fetchNotifications]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                isOpen &&
                anchorRef.current &&
                !anchorRef.current.contains(e.target as Node) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onClose, anchorRef]);

    if (!isOpen) return null;

    const hasNoItems = items.length === 0 && friendRequests.length === 0;

    return (
        <div
            ref={dropdownRef}
            className="absolute right-0 top-full mt-2 w-[360px] max-h-[400px] rounded-xl bg-[#18181b] border border-white/10 shadow-xl z-[100] overflow-hidden flex flex-col"
        >
            <div className="flex items-center justify-between p-3 border-b border-white/10">
                <span className="text-sm font-semibold text-white">Notifications</span>
                {items.some((n) => !n.read) && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-brand-primary hover:text-brand-primary"
                        onClick={() => markAllAsRead()}
                    >
                        Mark all read
                    </Button>
                )}
            </div>
            <ScrollArea className="flex-1 max-h-[320px]">
                {isLoading ? (
                    <div className="p-6 text-center text-zinc-500 text-sm">Loading...</div>
                ) : hasNoItems ? (
                    <div className="p-6 text-center text-zinc-500 text-sm">You&apos;re all caught up</div>
                ) : (
                    <div className="p-2 space-y-1">
                        {/* Friend requests first (DESIGN_PLAN: primary Accept, outline Ignore) */}
                        {friendRequests.map((req: FriendRequest) => (
                            <div key={req._id} className="flex items-center gap-3 p-3 rounded-lg bg-[#101019] border border-[#1F2933] hover:bg-white/5 transition-colors">
                                <Avatar className="size-8 ring-1 ring-white/10">
                                    <AvatarImage src={req.senderId.imageUrl} />
                                    <AvatarFallback>{req.senderId.fullName[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-[#F9FAFB] truncate">{req.senderId.fullName}</p>
                                    <p className="text-xs text-[#9CA3AF] truncate">Sent you a friend request</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="size-8 rounded-full bg-[#22C55E] hover:bg-[#16A34A] text-[#020617]"
                                        onClick={() => acceptFriendRequest(req._id)}
                                        title="Accept"
                                    >
                                        <Check className="size-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="size-8 rounded-full border border-[#1F2933] text-[#9CA3AF] hover:bg-white/10"
                                        onClick={() => rejectFriendRequest(req._id)}
                                        title="Ignore"
                                    >
                                        <X className="size-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}

                        {/* Regular Notifications (exclude FRIEND_REQUEST — shown in block above) */}
                        {items
                            .filter((item) => item.type !== "FRIEND_REQUEST")
                            .map((item) => (
                                <NotificationItem key={item._id} item={item} onMarkRead={markAsRead} />
                            ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    );
};

