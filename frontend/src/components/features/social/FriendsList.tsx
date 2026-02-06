import { useChatStore } from "@/stores/ChatStore";
import { useAuthStore } from "@/stores/AuthStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, UserPlus, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { FriendRequest, User } from "@/types";
import { VirtualScrollList } from "@/components/shared/VirtualScrollList";

interface FriendsListProps {
    onSelectFriend: (friend: User) => void;
}

export const FriendsList = ({ onSelectFriend }: FriendsListProps) => {
    const {
        friends,
        friendRequests,
        searchResult,
        isLoading,
        selectedUser,
        setSelectedUser,
        fetchFriends,
        fetchFriendRequests,
        sendFriendRequest,
        acceptFriendRequest,
        searchUsers,
        onlineUsers
    } = useChatStore();

    const { authUser } = useAuthStore();
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchFriends();
        fetchFriendRequests();
    }, [fetchFriends, fetchFriendRequests]);

    const handleSearch = () => {
        searchUsers(searchQuery);
    }

    // Filter out self and already friends from search results
    const filteredSearch = searchResult.filter(u =>
        u.clerkId !== authUser?.clerkId &&
        !friends.some(f => f.clerkId === u.clerkId)
    );

    return (
        <div className="border-r border-white/5 flex flex-col h-full bg-background-elevated/40 backdrop-blur-md">
            <div className="p-4 border-b border-white/5 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                        Social
                    </h2>
                </div>

                <Tabs defaultValue="friends" className="w-full flex flex-col h-full">
                    <TabsList className="grid w-full grid-cols-2 bg-background-base/50 mb-4 h-10 p-1 flex-shrink-0">
                        <TabsTrigger
                            value="friends"
                            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-text-secondary rounded-md transition-all text-xs font-medium uppercase tracking-wide"
                        >
                            Friends
                        </TabsTrigger>
                        <TabsTrigger
                            value="find"
                            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-text-secondary rounded-md transition-all text-xs font-medium uppercase tracking-wide"
                        >
                            Find
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="friends" className="mt-0 flex-1 min-h-0 flex flex-col data-[state=inactive]:hidden">
                        {/* Friend Requests Section */}
                        {friendRequests.length > 0 && (
                            <div className="mb-4 flex-shrink-0">
                                <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 px-1">Requests</h3>
                                <div className="space-y-2">
                                    {friendRequests.map((req: FriendRequest) => (
                                        <div key={req._id} className="flex items-center gap-3 p-2 rounded-lg bg-background-base/40 border border-white/5 shadow-sm hover:bg-white/5 transition-colors">
                                            <Avatar className="size-8 ring-1 ring-white/10">
                                                <AvatarImage src={req.senderId.imageUrl} />
                                                <AvatarFallback>{req.senderId.fullName[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-text-primary truncate">{req.senderId.fullName}</p>
                                            </div>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="size-7 text-success hover:text-success/80 hover:bg-success/10 rounded-full"
                                                onClick={() => acceptFriendRequest(req._id)}
                                            >
                                                <Check className="size-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex-1 -mr-4 pr-4 min-h-0" ref={(el) => {
                            if (el) {
                                // Simple auto-height check, ideally resize observer, but keeping it simple for now
                                // We can use a ResizeObserver if needed, but for now let's default to a hook or just rendering
                                // Since react-window needs a number, let's use a wrapper that measures.
                            }
                        }}>
                            {/* We need a way to measure height... let's defer the full measure logic to a separate component or hook if possible, or just inline it */}
                            {/* Replacing ScrollArea with VirtualScrollList directly is tricky without exact height in number */}
                            {/* Let's use a fixed height calculation assuming typical screen or 100% of parent if possible */}
                            {/* Actually, react-window requires explicit number for height. */}
                            {/* For now, I will use a simple "useMeasure" style implementation inside FriendsList or just hardcode a calculated height */}
                            {/* Let's try to stick to the plan: "Virtualize FriendsList". */}
                            {/* I will add `useMeasure` hook logic in the file for now. */}
                            <VirtualScrollList
                                items={friends}
                                height={600} // Temporary fixed height, will optimize to dynamic in next step if needed, or if I can add the hook now.
                                itemHeight={72} // Approx height of friend row
                                className="no-scrollbar" // Hide default scrollbar if we want custom look, but Native is fine
                                renderItem={(friend, index) => (
                                    <div
                                        key={friend._id}
                                        onClick={() => setSelectedUser(friend)}
                                        className={`
                                            flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200
                                            group border border-transparent
                                            ${selectedUser?.clerkId === friend.clerkId
                                                ? "bg-white/10 border-white/10 shadow-lg ring-1 ring-white/5 backdrop-blur-md"
                                                : "hover:bg-white/5 hover:border-white/5"
                                            }
                                        `}
                                    >
                                        <div className="relative">
                                            <Avatar className="size-10 border border-white/10">
                                                <AvatarImage src={friend.imageUrl} />
                                                <AvatarFallback>{friend.fullName[0]}</AvatarFallback>
                                            </Avatar>
                                            {onlineUsers.has(friend.clerkId) && (
                                                <span className="absolute bottom-0 right-0 size-3 bg-success rounded-full ring-2 ring-background-elevated shadow-sm" />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <span className={`font-medium truncate transition-colors ${selectedUser?.clerkId === friend.clerkId ? "text-white" : "text-text-primary"}`}>
                                                    {friend.fullName}
                                                </span>
                                            </div>
                                            <div className="text-xs text-text-secondary truncate group-hover:text-text-primary transition-colors">
                                                {onlineUsers.has(friend.clerkId) ? "Online" : "Offline"}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="find" className="mt-0 flex-1 min-h-0 flex flex-col data-[state=inactive]:hidden">
                        <div className="flex gap-2 mb-4 flex-shrink-0">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-secondary" />
                                <Input
                                    placeholder="Search users..."
                                    className="bg-background-base/50 border-white/10 pl-9 focus-visible:ring-brand-primary/50 transition-shadow h-9 rounded-full"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                            <Button size="sm" variant="secondary" onClick={handleSearch} className="h-9 px-3 bg-white/10 hover:bg-white/20 border border-white/5 text-text-primary rounded-full">
                                Find
                            </Button>
                        </div>

                        <ScrollArea className="flex-1 -mr-4 pr-4">
                            <div className="space-y-2 pb-4">
                                {isLoading ? (
                                    <div className="text-center py-4 text-text-secondary">Loading...</div>
                                ) : filteredSearch.map((user) => (
                                    <div key={user._id} className="flex items-center justify-between p-3 rounded-lg bg-background-base/30 hover:bg-background-base/50 border border-white/5 transition-all group">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="size-9 ring-1 ring-white/5">
                                                <AvatarImage src={user.imageUrl} />
                                                <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm font-medium text-text-primary">{user.fullName}</span>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-text-secondary hover:text-white hover:bg-white/10 rounded-full size-8 p-0"
                                            onClick={() => sendFriendRequest(user._id)}
                                        >
                                            <UserPlus className="size-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

