import { useState, useEffect } from "react";
import { WifiOff, Wifi } from "lucide-react";
import toast from "react-hot-toast";

export const OfflineIndicator = () => {
    const [isOnline, setIsOnline] = useState(
        typeof navigator !== "undefined" ? navigator.onLine : true
    );
    const [wasOffline, setWasOffline] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            if (wasOffline) {
                toast.success("Back online", { icon: <Wifi className="size-4" /> });
                setWasOffline(false);
            }
        };
        const handleOffline = () => {
            setIsOnline(false);
            setWasOffline(true);
            toast("You're offline", { icon: <WifiOff className="size-4" /> });
        };
        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);
        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, [wasOffline]);

    if (isOnline) return null;

    return (
        <div
            className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-center gap-2 py-2 px-4 bg-amber-500/90 text-black text-sm font-medium"
            role="status"
            aria-live="polite"
        >
            <WifiOff className="size-4 flex-shrink-0" />
            <span>You're offline. Some features may be unavailable.</span>
        </div>
    );
};
