import { useRef, useEffect } from "react";
import { useNotificationStore } from "@/stores/NotificationStore";
import { NotificationItem } from "./NotificationItem";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NotificationDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    anchorRef: React.RefObject<HTMLElement | null>;
}

export const NotificationDropdown = ({ isOpen, onClose, anchorRef }: NotificationDropdownProps) => {
    const { items, fetchNotifications, markAsRead, markAllAsRead, isLoading } = useNotificationStore();
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
                ) : items.length === 0 ? (
                    <div className="p-6 text-center text-zinc-500 text-sm">No notifications yet</div>
                ) : (
                    <div className="p-2 space-y-1">
                        {items.map((item) => (
                            <NotificationItem key={item._id} item={item} onMarkRead={markAsRead} />
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    );
};
