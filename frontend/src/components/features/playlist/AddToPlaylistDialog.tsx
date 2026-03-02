import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ListMusic, Plus, Search, FolderPlus, X } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { usePlaylistStore } from "@/stores/PlaylistStore";

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
    const [isCreating, setIsCreating] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState("");

    const { createPlaylist } = usePlaylistStore();

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

    const handleCreatePlaylist = async () => {
        if (!newPlaylistName.trim()) {
            toast.error("Please enter a playlist name");
            return;
        }

        try {
            setIsLoading(true);
            const newPlaylist = await createPlaylist(newPlaylistName.trim(), "", true);

            if (newPlaylist) {
                // Add song to the newly created playlist
                await axiosInstance.post(`/social/playlists/${newPlaylist._id}/songs`, {
                    songId,
                });

                toast.success(`Created "${newPlaylistName}" and added song!`);
                setOpen(false);
                if (onClose) onClose();
            } else {
                toast.error("Failed to create playlist");
            }
        } catch (error) {
            toast.error("Failed to create playlist");
            console.error(error);
        } finally {
            setIsLoading(false);
            setIsCreating(false);
            setNewPlaylistName("");
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

                {/* Create New Playlist Section */}
                {isCreating ? (
                    <div className="p-3 bg-zinc-800/50 rounded-md border border-zinc-700">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Playlist name..."
                                value={newPlaylistName}
                                onChange={(e) => setNewPlaylistName(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleCreatePlaylist()}
                                className="flex-1 h-9 px-3 rounded bg-zinc-900 border border-zinc-700 focus:border-zinc-600 text-white placeholder-zinc-500 transition-all outline-none text-sm"
                                autoFocus
                            />
                            <button
                                onClick={handleCreatePlaylist}
                                disabled={isLoading}
                                className="px-3 h-9 bg-white text-black rounded hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                            >
                                Create
                            </button>
                            <button
                                onClick={() => {
                                    setIsCreating(false);
                                    setNewPlaylistName("");
                                }}
                                className="p-2 h-9 w-9 hover:bg-white/5 rounded transition-colors"
                            >
                                <X className="h-4 w-4 text-zinc-400" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="w-full flex items-center gap-3 p-3 rounded-md bg-zinc-800/50 hover:bg-zinc-800 border border-dashed border-zinc-700 hover:border-zinc-600 transition-colors text-left group"
                    >
                        <div className="h-12 w-12 bg-zinc-800 rounded flex items-center justify-center group-hover:bg-zinc-700">
                            <FolderPlus className="h-5 w-5 text-zinc-400 group-hover:text-white" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-white">Create New Playlist</p>
                            <p className="text-xs text-zinc-500">Add song to a new playlist</p>
                        </div>
                    </button>
                )}

                <div className="space-y-4 py-4">\n                    {isLoading ? (
                    <div className="text-center text-sm text-zinc-500">Loading playlists...</div>
                ) : playlists.length === 0 ? (
                    <div className="text-center text-sm text-zinc-500">No playlists found. Create one first!</div>
                ) : filteredPlaylists.length === 0 ? (
                    <div className="text-center text-sm text-zinc-500 py-8">
                        No playlists match "{searchQuery}"
                    </div>
                ) : (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto overflow-x-hidden touch-scroll">
                        {filteredPlaylists.map((playlist) => {
                            // Get playlist cover from first song or use fallback
                            const coverImage = playlist.songs?.[0]?.imageUrl;

                            return (
                                <button
                                    key={playlist._id}
                                    onClick={() => handleAddToPlaylist(playlist._id)}
                                    className="w-full flex items-center min-h-[44px] p-3 rounded-md hover:bg-white/5 transition-colors text-left group"
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
