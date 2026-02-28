import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotificationStore } from "@/stores/NotificationStore";
import { useChatStore } from "@/stores/ChatStore";
import { NotificationDropdown } from "./NotificationDropdown";

export const NotificationBell = () => {
    const { user } = useUser();
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLDivElement>(null);
    const { unreadCount, fetchNotifications, subscribeToSocket } = useNotificationStore();
    const { friendRequests, fetchFriendRequests } = useChatStore();

    useEffect(() => {
        if (user) {
            fetchNotifications();
            fetchFriendRequests();
        }
    }, [user?.id, fetchNotifications, fetchFriendRequests]);

    useEffect(() => {
        const socket = useChatStore.getState().socket;
        if (socket) {
            const unsub = subscribeToSocket();
            return unsub;
        }
    }, [subscribeToSocket]);

    if (!user) return null;

    const totalUnread = unreadCount + friendRequests.length;

    return (
        <div className="relative overflow-visible shrink-0" ref={anchorRef}>
            <Button
                variant="ghost"
                size="icon"
                className="text-text-secondary hover:text-text-primary relative size-10 min-w-10 min-h-10"
                onClick={() => setOpen((o) => !o)}
                title="Notifications"
                aria-label={totalUnread > 0 ? `${totalUnread} unread notifications` : "Notifications"}
            >
                <Bell className="size-5" />
                {totalUnread > 0 && (
                    <span className="absolute top-0 right-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-[#18181b] px-1">
                        {totalUnread > 99 ? "99+" : totalUnread}
                    </span>
                )}
            </Button>
            <NotificationDropdown isOpen={open} onClose={() => setOpen(false)} anchorRef={anchorRef} />
        </div>
    );
};
