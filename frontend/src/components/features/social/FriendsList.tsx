import { useChatStore } from "@/stores/ChatStore";
import { useAuthStore } from "@/stores/AuthStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { VirtualScrollList } from "@/components/shared/VirtualScrollList";
import { motion } from "framer-motion";

export const FriendsList = () => {
    const {
        friends,
        searchResult,
        isLoading,
        selectedUser,
        setSelectedUser,
        fetchFriends,
        fetchFriendRequests,
        sendFriendRequest,
        searchUsers,
        onlineUsers
    } = useChatStore();

    const { authUser } = useAuthStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("friends");

    useEffect(() => {
        fetchFriends();
        fetchFriendRequests();
    }, [fetchFriends, fetchFriendRequests]);

    const handleSearch = () => {
        searchUsers(searchQuery);
    }

    // Deduplicate search results by clerkId to prevent seed duplication bugs
    const uniqueSearch = Array.from(new Map(searchResult.map(user => [user.clerkId || user._id, user])).values());

    // Filter out self and already friends from search results
    const filteredSearch = uniqueSearch.filter(u =>
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

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col h-full">
                    <TabsList className="grid w-full grid-cols-2 bg-background-base/50 mb-4 h-10 p-1 flex-shrink-0 relative">
                        <TabsTrigger
                            value="friends"
                            className="relative z-10 data-[state=active]:text-white text-text-secondary rounded-md transition-colors text-xs font-medium uppercase tracking-wide bg-transparent data-[state=active]:bg-transparent"
                        >
                            Friends
                            {activeTab === "friends" && (
                                <motion.div
                                    layoutId="activeTabIndicator"
                                    className="absolute inset-0 bg-white/10 rounded-md -z-10"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                        </TabsTrigger>
                        <TabsTrigger
                            value="find"
                            className="relative z-10 data-[state=active]:text-white text-text-secondary rounded-md transition-colors text-xs font-medium uppercase tracking-wide bg-transparent data-[state=active]:bg-transparent"
                        >
                            Find
                            {activeTab === "find" && (
                                <motion.div
                                    layoutId="activeTabIndicator"
                                    className="absolute inset-0 bg-white/10 rounded-md -z-10"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="friends" className="mt-0 flex-1 min-h-0 flex flex-col data-[state=inactive]:hidden">

                        <div className="flex-1 -mr-4 pr-4 min-h-0">
                            <VirtualScrollList
                                items={friends}
                                height={'100%'}
                                itemHeight={72} // Approx height of friend row
                                className="no-scrollbar" // Hide default scrollbar if we want custom look, but Native is fine
                                renderItem={(friend) => (
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

