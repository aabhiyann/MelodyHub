import Topbar from "@/components/layout/TopBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSocialStore } from "@/stores/useSocialStore";
import { useUser } from "@clerk/clerk-react";
import { Loader, Search, UserMinus, UserPlus, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { SectionErrorBoundary } from "@/components/shared/SectionErrorBoundary";

const CommunityPage = () => {
    const {
        users,
        friends,
        friendRequests,
        fetchUsers,
        fetchFriends,
        fetchFriendRequests,
        sendFriendRequest,
        removeFriend,
        cancelFriendRequest
    } = useSocialStore();

    const { user: currentUser } = useUser();
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (currentUser) {
            setIsLoading(true);
            Promise.all([fetchUsers(), fetchFriends(), fetchFriendRequests()])
                .finally(() => setIsLoading(false));
        }
    }, [currentUser, fetchUsers, fetchFriends, fetchFriendRequests]);

    const usersList = Array.isArray(users) ? users : [];

    // Fallback frontend deduplication by clerkId to handle stale backend cache
    const uniqueUsersMap = new Map();
    usersList.forEach(u => {
        if (u.clerkId && !uniqueUsersMap.has(u.clerkId)) {
            uniqueUsersMap.set(u.clerkId, u);
        }
    });
    const uniqueUsers = Array.from(uniqueUsersMap.values());

    const filteredUsers = uniqueUsers.filter((u: any) => {
        if (u.clerkId === currentUser?.id) return false;
        return u.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const requestsList = Array.isArray(friendRequests) ? friendRequests : [];
    const isFriend = (userId: string) => Array.isArray(friends) && friends.includes(userId);
    const isPending = (userId: string) => requestsList.some(r => {
        // senderId can be a populated object or a plain string ID
        const senderClerkId = typeof r.senderId === 'object' && r.senderId !== null
            ? (r.senderId as any).clerkId
            : r.senderId;
        return (senderClerkId === userId || r.to === userId) && r.status === 'pending';
    });

    const getPendingRequest = (userId: string) => requestsList.find(r => {
        const senderClerkId = typeof r.senderId === 'object' && r.senderId !== null
            ? (r.senderId as any).clerkId
            : r.senderId;
        return (senderClerkId === userId || r.to === userId) && r.status === 'pending';
    });

    const handleCancelRequest = (userId: string) => {
        const request = getPendingRequest(userId);
        if (request) {
            cancelFriendRequest(request._id);
        }
    };

    return (
        <main className="rounded-md overflow-hidden h-full bg-transparent">
            <Topbar />
            <ScrollArea className="h-[calc(100vh-180px)]">
                <div className="p-6 space-y-6">
                    {/* Header */}
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Community</h1>
                        <p className="text-zinc-400">Discover and connect with other music lovers</p>
                    </div>

                    {/* Search */}
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Find friends..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-10 pl-10 pr-4 rounded-full bg-surface-elevated/50 border border-white/10 focus:border-brand-primary/50 text-white placeholder-text-secondary transition-all outline-none"
                        />
                    </div>

                    {/* Users Grid */}
                    <SectionErrorBoundary sectionName="Community Users">
                        {isLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="h-24 rounded-xl bg-white/5 animate-pulse" />
                                ))}
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="text-center py-20 text-zinc-400">
                                <Users className="size-16 mx-auto mb-4 opacity-50" />
                                <p>No users found matching "{searchQuery}"</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredUsers.map((user) => (
                                    <div
                                        key={user._id}
                                        className="glass-panel p-4 rounded-xl flex items-center gap-4 hover:bg-surface-elevated/40 transition-colors group"
                                    >
                                        <Avatar className="size-16 border-2 border-white/10">
                                            <AvatarImage src={user.imageUrl} alt={user.fullName} />
                                            <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-white truncate">{user.fullName}</h3>
                                            <div className="mt-2">
                                                {isFriend(user.clerkId) ? (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 text-xs justify-start px-2"
                                                        onClick={() => removeFriend(user.clerkId)}
                                                    >
                                                        <UserMinus className="size-3.5 mr-2" />
                                                        Remove
                                                    </Button>
                                                ) : isPending(user.clerkId) ? (
                                                    <div className="space-y-1">
                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                            className="w-full h-8 text-xs bg-white/10 text-zinc-400 cursor-default"
                                                            disabled
                                                        >
                                                            <Loader className="size-3.5 mr-2 animate-spin" />
                                                            Pending
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            className="w-full text-zinc-400 hover:text-white hover:bg-white/5 h-8 text-xs justify-start px-2"
                                                            onClick={() => handleCancelRequest(user.clerkId)}
                                                        >
                                                            <X className="size-3.5 mr-2" />
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        className="w-full bg-brand-primary h-8 text-xs hover:bg-brand-primary/90"
                                                        onClick={() => sendFriendRequest(user.clerkId)}
                                                    >
                                                        <UserPlus className="size-3.5 mr-2" />
                                                        Connect
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </SectionErrorBoundary>
                </div>
            </ScrollArea>
        </main>
    );
};

export default CommunityPage;
