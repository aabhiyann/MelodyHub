import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ListMusic, Plus, Search } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";

interface AddToPlaylistDialogProps {
    songId: string;
    onClose?: () => void;
    children?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export const AddToPlaylistDialog = ({ songId, onClose, children, open: controlledOpen, onOpenChange: setControlledOpen }: AddToPlaylistDialogProps) => {
    const [internalOpen, setInternalOpen] = useState(false);

    // Derived state
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;
    const setOpen = isControlled ? setControlledOpen! : setInternalOpen;
    const [playlists, setPlaylists] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (open) {
            fetchPlaylists();
        }
    }, [open]);

    const fetchPlaylists = async () => {
        setIsLoading(true);
        try {
            const res = await axiosInstance.get("/social/playlists");
            setPlaylists(res.data.data);
        } catch (error) {
            console.error("Failed to fetch playlists", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Filter playlists based on search query
    const filteredPlaylists = useMemo(() => {
        return playlists.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [playlists, searchQuery]);

    const handleAddToPlaylist = async (playlistId: string) => {
        try {
            await axiosInstance.post(`/social/playlists/${playlistId}/songs`, {
                songId,
            });
            toast.success("Added to playlist!");
            setOpen(false);
            if (onClose) onClose();
        } catch (error) {
            toast.error("Failed to add to playlist");
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {!isControlled && (
                <DialogTrigger asChild>
                    {children || (
                        <button className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition-snap text-left">
                            <ListMusic className="h-4 w-4" />
                            Add to Playlist
                        </button>
                    )}
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800 text-white">
                <DialogHeader>
                    <DialogTitle>Add to Playlist</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Select a playlist to add this song to.
                    </DialogDescription>
                </DialogHeader>

                {/* Search Input */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search playlists..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 rounded-md bg-zinc-800/50 border border-zinc-700 focus:border-zinc-600 text-white placeholder-zinc-500 transition-all outline-none"
                    />
                </div>

                <div className="space-y-4 py-4">
                    {isLoading ? (
                        <div className="text-center text-sm text-zinc-500">Loading playlists...</div>
                    ) : playlists.length === 0 ? (
                        <div className="text-center text-sm text-zinc-500">No playlists found. Create one first!</div>
                    ) : filteredPlaylists.length === 0 ? (
                        <div className="text-center text-sm text-zinc-500 py-8">
                            No playlists match "{searchQuery}"
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                            {filteredPlaylists.map((playlist) => {
                                // Get playlist cover from first song or use fallback
                                const coverImage = playlist.songs?.[0]?.imageUrl;

                                return (
                                    <button
                                        key={playlist._id}
                                        onClick={() => handleAddToPlaylist(playlist._id)}
                                        className="w-full flex items-center p-3 rounded-md hover:bg-white/5 transition-colors text-left group"
                                    >
                                        {coverImage ? (
                                            <img
                                                src={coverImage}
                                                alt={playlist.name}
                                                className="h-12 w-12 object-cover rounded mr-3"
                                            />
                                        ) : (
                                            <div className="h-12 w-12 bg-zinc-800 rounded flex items-center justify-center mr-3 group-hover:bg-zinc-700">
                                                <ListMusic className="h-5 w-5 text-zinc-400" />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <p className="font-medium text-white">{playlist.name}</p>
                                            <p className="text-xs text-zinc-500">{playlist.songs?.length || 0} songs</p>
                                        </div>
                                        <Plus className="h-4 w-4 text-zinc-500 group-hover:text-white" />
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
