import { ChevronLeft, Bell, Settings } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/clerk-react";

const MobileHeader = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const isHome = location.pathname === "/home" || location.pathname === "/";

    // Simple helper to get title based on path
    const getPageTitle = () => {
        if (location.pathname.startsWith("/search")) return "Search";
        if (location.pathname.startsWith("/library")) return "Your Library";
        if (location.pathname.startsWith("/ai-playlist")) return "AI Magic";
        if (location.pathname.startsWith("/profile")) return "Profile";
        if (location.pathname.startsWith("/album")) return "Album";
        if (location.pathname.startsWith("/playlist")) return "Playlist";
        if (location.pathname.startsWith("/artist")) return "Artist";
        return "";
    };

    return (
        <div className="fixed top-0 left-0 right-0 z-[90] h-[56px] pt-[env(safe-area-inset-top)] bg-[rgba(18,18,18,0.8)] backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 transition-colors">
            {/* Left Section */}
            <div className="flex items-center min-w-[40px]">
                {isHome ? (
                    <div className="flex items-center gap-2">
                        {/* Logo or Brand Name */}
                        <div className="size-8 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center">
                            <span className="text-white font-bold text-xs">M</span>
                        </div>
                        <span className="font-bold text-lg tracking-tight text-white">MelodyHub</span>
                    </div>
                ) : (
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 -ml-2 text-white/80 hover:text-white active:scale-90 transition-transform"
                    >
                        <ChevronLeft className="size-6" />
                    </button>
                )}
            </div>

            {/* Center Section - Dynamic Title */}
            {!isHome && (
                <div className="absolute left-1/2 -translate-x-1/2 font-semibold text-[17px] text-white truncate max-w-[50%]">
                    {getPageTitle()}
                </div>
            )}

            {/* Right Section */}
            <div className="flex items-center gap-3 min-w-[40px] justify-end">
                {isHome ? (
                    <div className="flex items-center gap-4">
                        <button className="relative text-white/70 hover:text-white transition-colors">
                            <Bell className="size-6" />
                            {/* Notification Dot */}
                            {/* <div className="absolute top-0 right-0 size-2 bg-red-500 rounded-full border border-zinc-900" /> */}
                        </button>
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: "w-8 h-8 ring-2 ring-white/10"
                                }
                            }}
                        />
                    </div>
                ) : (
                    // Contextual actions could go here
                    <div className="w-8"></div> // Placeholder for balance
                )}
            </div>
        </div>
    );
};

export default MobileHeader;
