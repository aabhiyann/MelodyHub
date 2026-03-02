import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ListMusic, Search, X, Loader2, Check } from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { usePlaylistStore } from "@/stores/PlaylistStore";
import { useMusicStore } from "@/stores/MusicStore";
import { Playlist } from "@/types";
import { debounce } from "@/lib/utils";
import toast from "react-hot-toast";
import { OptimizedImage } from "@/components/shared/OptimizedImage";

type SaveStatus = "idle" | "saving" | "saved";

/** Minimal playlist shape for create/edit (Library and PlaylistPage may pass different shapes) */
export type PlaylistForModal = { _id: string; name?: string; description?: string; imageUrl?: string; songs?: (Playlist["songs"][number] | string)[] };

interface CreateEditPlaylistModalProps {
    open: boolean;
    onClose: () => void;
    mode: "create" | "edit";
    playlist?: PlaylistForModal | null;
    onSuccess?: () => void;
}

export function CreateEditPlaylistModal({
    open,
    onClose,
    mode,
    playlist,
    onSuccess,
}: CreateEditPlaylistModalProps) {
    const { createPlaylist, updatePlaylist, addSongToPlaylist, removeSongFromPlaylist } = usePlaylistStore();
    const { songs: catalogSongs } = useMusicStore();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const playlistId = mode === "edit" ? playlist?._id : null;
    const currentSongs = (mode === "edit" ? playlist?.songs : []) ?? [];

    useEffect(() => {
        if (!open) return;
        if (mode === "edit" && playlist) {
            setName(playlist.name ?? "");
            setDescription(playlist.description ?? "");
            setImageUrl(playlist.imageUrl ?? "");
        } else {
            setName("");
            setDescription("");
            setImageUrl("");
        }
        setSearchQuery("");
        setSaveStatus("idle");
    }, [open, mode, playlist]);

    const persistEdit = useCallback(
        (updates: { name?: string; description?: string; imageUrl?: string }) => {
            if (!playlistId) return;
            setSaveStatus("saving");
            updatePlaylist(playlistId, updates).then(() => {
                setSaveStatus("saved");
                setTimeout(() => setSaveStatus("idle"), 2000);
            });
        },
        [playlistId, updatePlaylist]
    );

    const debouncedPersist = useMemo(
        () =>
            debounce((vals: { name: string; description: string; imageUrl: string }) => {
                if (!playlistId) return;
                persistEdit(vals);
            }, 600),
        [playlistId, persistEdit]
    );

    useEffect(() => {
        if (mode !== "edit" || !playlistId || saveStatus === "saving") return;
        debouncedPersist({ name, description, imageUrl });
    }, [name, description, imageUrl, mode, playlistId, debouncedPersist]);

    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return catalogSongs.slice(0, 20);
        const q = searchQuery.toLowerCase();
        return catalogSongs.filter(
            (s) =>
                s.title?.toLowerCase().includes(q) ||
                s.artist?.toLowerCase().includes(q)
        ).slice(0, 20);
    }, [catalogSongs, searchQuery]);

    const currentSongIds = useMemo(() => new Set(currentSongs.map((s) => (typeof s === "string" ? s : s._id))), [currentSongs]);

    const handleCreate = async () => {
        if (!name.trim()) {
            toast.error("Enter a playlist name");
            return;
        }
        setIsSubmitting(true);
        try {
            const created = await createPlaylist(name.trim(), description.trim() || undefined, true);
            if (created) {
                if (imageUrl.trim()) {
                    await updatePlaylist(created._id, { imageUrl: imageUrl.trim() });
                }
                toast.success("Playlist created");
                onSuccess?.();
                onClose();
            }
        } catch {
            toast.error("Failed to create playlist");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddSong = async (songId: string) => {
        if (!playlistId) return;
        try {
            await addSongToPlaylist(playlistId, songId);
            toast.success("Added to playlist");
            onSuccess?.();
        } catch {
            toast.error("Failed to add song");
        }
    };

    const handleRemoveSong = async (songId: string) => {
        if (!playlistId) return;
        try {
            await removeSongFromPlaylist(playlistId, songId);
            toast.success("Removed from playlist");
            onSuccess?.();
        } catch {
            toast.error("Failed to remove song");
        }
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
            <DialogContent className="sm:max-w-lg bg-[#101019] border-[#1F2933] text-[#F9FAFB]">
                <DialogHeader>
                    <DialogTitle className="text-[#F9FAFB]">
                        {mode === "create" ? "Create playlist" : "Edit playlist"}
                    </DialogTitle>
                    <DialogDescription className="text-[#9CA3AF]">
                        {mode === "create"
                            ? "Add a name, optional cover and description, then add songs."
                            : "Change details or add/remove songs. Changes save automatically."}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Cover URL */}
                    <div className="space-y-2">
                        <Label className="text-[#9CA3AF]">Cover image URL</Label>
                        <div className="flex gap-3 items-center">
                            <div className="w-20 h-20 rounded-lg bg-[#1F2933] flex items-center justify-center overflow-hidden flex-shrink-0">
                                {imageUrl.trim() ? (
                                    <img src={imageUrl} alt="Cover" className="w-full h-full object-cover" loading="lazy" onError={(e) => { e.currentTarget.src = '/placeholder-album.svg'; }} />
                                ) : (
                                    <ListMusic className="size-8 text-[#6B7280]" />
                                )}
                            </div>
                            <Input
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="https://..."
                                className="bg-[#1F2933] border-[#1F2933] text-[#F9FAFB] placeholder:text-[#6B7280] focus-visible:ring-[#22C55E]"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[#9CA3AF]">Name</Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Playlist name"
                            className="bg-[#1F2933] border-[#1F2933] text-[#F9FAFB] placeholder:text-[#6B7280] focus-visible:ring-[#22C55E]"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[#9CA3AF]">Description</Label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Optional description"
                            rows={2}
                            className="bg-[#1F2933] border-[#1F2933] text-[#F9FAFB] placeholder:text-[#6B7280] focus-visible:ring-[#22C55E] resize-none"
                        />
                    </div>

                    {mode === "edit" && (
                        <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
                            {saveStatus === "saving" && (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    <span>Saving…</span>
                                </>
                            )}
                            {saveStatus === "saved" && (
                                <>
                                    <Check className="size-4 text-[#22C55E]" />
                                    <span>Saved</span>
                                </>
                            )}
                        </div>
                    )}

                    {/* Add songs (edit mode or after create we could refetch and show) */}
                    {(mode === "edit" && playlistId) && (
                        <div className="space-y-2">
                            <Label className="text-[#9CA3AF]">Add songs</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#6B7280]" />
                                <Input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by title or artist..."
                                    className="pl-9 bg-[#1F2933] border-[#1F2933] text-[#F9FAFB] placeholder:text-[#6B7280] focus-visible:ring-[#22C55E]"
                                />
                            </div>
                            <div className="max-h-40 overflow-y-auto overflow-x-hidden rounded-lg border border-[#1F2933] bg-[#0f0f14] touch-scroll">
                                {searchResults.length === 0 ? (
                                    <p className="p-3 text-sm text-[#6B7280]">No matching songs. Try a different search or add from Browse.</p>
                                ) : (
                                    <ul className="p-1">
                                        {searchResults.map((song) => {
                                            const inList = currentSongIds.has(song._id);
                                            return (
                                                <li key={song._id} className="flex items-center gap-2 p-2 rounded-md hover:bg-white/5">
                                                    <OptimizedImage src={song.imageUrl} alt="" className="size-8 rounded flex-shrink-0" size="thumbnail" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-[#F9FAFB] truncate">{song.title}</p>
                                                        <p className="text-xs text-[#9CA3AF] truncate">{song.artist}</p>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        disabled={inList}
                                                        onClick={() => handleAddSong(song._id)}
                                                        className="bg-[#22C55E] hover:bg-[#16A34A] text-[#020617]"
                                                    >
                                                        {inList ? "Added" : "Add"}
                                                    </Button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
                            {currentSongs.length > 0 && (
                                <div className="mt-2">
                                    <p className="text-xs text-[#9CA3AF] mb-1">In playlist ({currentSongs.length})</p>
                                    <ul className="max-h-24 overflow-y-auto overflow-x-hidden space-y-1 touch-scroll">
                                        {currentSongs.map((s) => {
                                            const song = typeof s === "object" ? s : { _id: s, title: "—", artist: "" };
                                            return (
                                                <li key={song._id} className="flex items-center gap-2 py-1 px-2 rounded bg-[#1F2933]/50">
                                                    <span className="text-sm text-[#F9FAFB] truncate flex-1">{song.title}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveSong(song._id)}
                                                        className="p-1 rounded hover:bg-white/10 text-[#9CA3AF] hover:text-red-400"
                                                        aria-label="Remove"
                                                    >
                                                        <X className="size-4" />
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={handleClose} className="border-[#1F2933] text-[#9CA3AF] hover:bg-[#1F2933] hover:text-[#F9FAFB]">
                        {mode === "edit" ? "Close" : "Cancel"}
                    </Button>
                    {mode === "create" && (
                        <Button onClick={handleCreate} disabled={isSubmitting} isLoading={isSubmitting} className="bg-[#22C55E] hover:bg-[#16A34A] text-[#020617]">
                            Create
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
