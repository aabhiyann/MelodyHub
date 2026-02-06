
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSocialStore } from "@/stores/useSocialStore";
import { useUser } from "@clerk/clerk-react";
import { Clock, Headphones, Music, Users } from "lucide-react";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const FriendsActivity = () => {
    const { user } = useUser();
    const { onlineUsers } = useSocialStore();

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b border-white/5">
                <h3 className="font-semibold text-white flex items-center gap-2">
                    <Users className="size-4" />
                    Friend Activity
                </h3>
            </div>
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    <p className="text-sm text-zinc-500 text-center py-4">
                        Connect with friends to see what they're listening to!
                    </p>
                </div>
            </ScrollArea>
        </div>
    );
};
