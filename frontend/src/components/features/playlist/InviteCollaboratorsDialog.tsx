import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { axiosInstance } from "@/lib/axios";
import { toast } from "react-hot-toast";

interface Friend {
    _id: string; // Internal DB ID usually, but here likely the reference in friends array
    // Wait, getFriends returns populated users.
    // Let's check social.controller.ts or what getFriends returns.
    // social.controller.ts: `populate("friends", "fullName imageUrl clerkId isOnline")`
    // So it returns an array of User objects.
    fullName: string;
    imageUrl: string;
    clerkId: string;
}

interface InviteCollaboratorsDialogProps {
    playlistId: string;
    currentCollaborators: string[]; // IDs
}

export function InviteCollaboratorsDialog({ playlistId, currentCollaborators }: InviteCollaboratorsDialogProps) {
    const [open, setOpen] = useState(false);
    const [friends, setFriends] = useState<Friend[]>([]);
    const [selectedFriends, setSelectedFriends] = useState<string[]>([]); // Clerk IDs or Internal IDs?
    // Playlist stores Clerk IDs in owner/collaborators according to model?
    // Model: `owner: string; // Clerk user ID`, `collaborators: string[]`.
    // Friends list returns `clerkId`. So we should use `clerkId`.

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (open) {
            fetchFriends();
        }
    }, [open]);

    const fetchFriends = async () => {
        try {
            const res = await axiosInstance.get("/social/friends");
            setFriends(res.data);
        } catch (error) {
            console.error("Failed to fetch friends", error);
        }
    };

    const toggleSelection = (clerkId: string) => {
        if (selectedFriends.includes(clerkId)) {
            setSelectedFriends(prev => prev.filter(id => id !== clerkId));
        } else {
            setSelectedFriends(prev => [...prev, clerkId]);
        }
    };

    const handleInvite = async () => {
        if (selectedFriends.length === 0) return;
        setIsLoading(true);
        try {
            await axiosInstance.post(`/playlists/${playlistId}/share`, {
                userIds: selectedFriends,
                role: 'collaborator'
            });
            toast.success("Collaborators added!");
            setOpen(false);
            setSelectedFriends([]);
            // Ideally refresh playlist to show new collaborators
            window.location.reload(); // Simple refresh for now or invalidate query
        } catch (error) {
            console.error(error);
            toast.error("Failed to invite collaborators");
        } finally {
            setIsLoading(false);
        }
    };

    // Filter out friends who are already collaborators
    const availableFriends = friends.filter(f => !currentCollaborators.includes(f.clerkId));

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="text-zinc-400 hover:text-white border-white/10">
                    Invite Collaborators
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-zinc-800">
                <DialogHeader>
                    <DialogTitle>Invite Collaborators</DialogTitle>
                    <DialogDescription>
                        Select friends to let them add songs to this playlist.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <ScrollArea className="h-[300px] pr-4">
                        <div className="space-y-2">
                            {availableFriends.length === 0 ? (
                                <div className="text-center text-zinc-500 py-8">
                                    No friends available to invite. Add some friends first!
                                </div>
                            ) : (
                                availableFriends.map((friend) => (
                                    <div
                                        key={friend.clerkId}
                                        onClick={() => toggleSelection(friend.clerkId)}
                                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${selectedFriends.includes(friend.clerkId)
                                            ? "bg-brand-primary/20 ring-1 ring-brand-primary/50"
                                            : "hover:bg-zinc-800/50"
                                            }`}
                                    >
                                        <Avatar>
                                            <AvatarImage src={friend.imageUrl} />
                                            <AvatarFallback>{friend.fullName[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-white">{friend.fullName}</div>
                                        </div>
                                        {selectedFriends.includes(friend.clerkId) && (
                                            <div className="size-4 rounded-full bg-brand-primary" />
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </div>

                <div className="flex justify-end gap-3">
                    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleInvite}
                        disabled={selectedFriends.length === 0 || isLoading}
                        className="bg-brand-primary hover:bg-brand-primary/90"
                    >
                        {isLoading ? "Inviting..." : "Invite"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
