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

    useEffect(() => {
        if (user) fetchNotifications();
    }, [user?.id, fetchNotifications]);

    useEffect(() => {
        const socket = useChatStore.getState().socket;
        if (socket) {
            const unsub = subscribeToSocket();
            return unsub;
        }
    }, [subscribeToSocket]);

    if (!user) return null;

    return (
        <div className="relative" ref={anchorRef}>
            <Button
                variant="ghost"
                size="icon"
                className="text-text-secondary hover:text-text-primary relative"
                onClick={() => setOpen((o) => !o)}
                title="Notifications"
            >
                <Bell className="size-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-primary text-[10px] font-bold text-white">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </Button>
            <NotificationDropdown isOpen={open} onClose={() => setOpen(false)} anchorRef={anchorRef} />
        </div>
    );
};
