import { Home, Search, Library, Sparkles, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const MobileNav = () => {
    const location = useLocation();

    const tabs = [
        { name: "Home", icon: Home, path: "/home" },
        { name: "Search", icon: Search, path: "/search" },
        { name: "Library", icon: Library, path: "/library" },
        { name: "AI", icon: Sparkles, path: "/ai-playlist" },
        { name: "Profile", icon: User, path: "/profile" }, // Assuming a profile route or user route
    ];

    const handleVibrate = () => {
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] h-[72px] pb-[env(safe-area-inset-bottom)] bg-[rgba(18,18,18,0.95)] backdrop-blur-[40px] border-t border-white/10 shadow-[0_-4px_24px_rgba(0,0,0,0.4)]">
            <div className="flex h-full items-center justify-around px-2">
                {tabs.map((tab) => {
                    // Check if active: Exact match or starts with path (except home to avoid false positives if root)
                    const isActive =
                        location.pathname === tab.path ||
                        (tab.path !== "/home" && location.pathname.startsWith(tab.path));

                    const Icon = tab.icon;

                    return (
                        <Link
                            key={tab.name}
                            to={tab.path}
                            onClick={handleVibrate}
                            className="flex w-1/5 flex-col items-center justify-center py-2 transition-all active:scale-90"
                        >
                            <div className="relative mb-1">
                                <Icon
                                    className={cn(
                                        "size-6 transition-colors duration-200",
                                        isActive ? "text-brand-primary" : "text-white/50"
                                    )}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                                {/* Active Indicator Dot (Optional) */}
                                {/* {isActive && (
                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-primary rounded-full shadow-[0_0_8px_var(--brand-primary)]" />
                                )} */}
                            </div>
                            <span
                                className={cn(
                                    "text-[10px] font-medium transition-colors duration-200",
                                    isActive ? "text-white" : "text-white/50"
                                )}
                            >
                                {tab.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default MobileNav;
