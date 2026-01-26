import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { axiosInstance } from "@/lib/axios";
import { useMusicStore } from "@/stores/MusicStore";
import { Upload, Music } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Song } from "@/types";

interface SongDialogProps {
    mode?: "add" | "edit";
    songToEdit?: Song | null;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    trigger?: React.ReactNode;
}

interface NewSong {
    title: string;
    artist: string;
    album: string;
    duration: string;
}

const SongDialog = ({
    mode = "add",
    songToEdit,
    open: controlledOpen,
    onOpenChange: setControlledOpen,
    trigger
}: SongDialogProps) => {
    const { albums, fetchSongs } = useMusicStore();
    const [internalOpen, setInternalOpen] = useState(false);

    const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const onOpenChange = setControlledOpen || setInternalOpen;

    const [isLoading, setIsLoading] = useState(false);

    const [newSong, setNewSong] = useState<NewSong>({
        title: "",
        artist: "",
        album: "",
        duration: "0",
    });

    const [files, setFiles] = useState<{ audio: File | null; image: File | null }>({
        audio: null,
        image: null,
    });

    const audioInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (mode === "edit" && songToEdit) {
            setNewSong({
                title: songToEdit.title,
                artist: songToEdit.artist,
                album: songToEdit.albumId || "none",
                duration: songToEdit.duration.toString(),
            });
            // Reset files when editing logic differs (usually backend keeps old files unless replaced)
            setFiles({ audio: null, image: null });
        } else if (mode === "add") {
            setNewSong({
                title: "",
                artist: "",
                album: "",
                duration: "0",
            });
            setFiles({ audio: null, image: null });
        }
    }, [mode, songToEdit, isOpen]);

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            if (mode === "add" && (!files.audio || !files.image)) {
                return toast.error("Please upload both audio and image files");
            }

            const formData = new FormData();
            formData.append("title", newSong.title);
            formData.append("artist", newSong.artist);
            formData.append("duration", newSong.duration);
            if (newSong.album && newSong.album !== "none") {
                formData.append("albumId", newSong.album);
            }

            if (files.audio) formData.append("audioFile", files.audio);
            if (files.image) formData.append("imageFile", files.image);

            if (mode === "add") {
                await axiosInstance.post("/admin/songs", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toast.success("Song added successfully");

                // Reset form
                setNewSong({ title: "", artist: "", album: "", duration: "0" });
                setFiles({ audio: null, image: null });
            } else {
                // Edit mode
                await axiosInstance.put(`/admin/songs/${songToEdit?._id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toast.success("Song updated successfully");
            }

            fetchSongs(); // Refresh list
            onOpenChange(false);
        } catch (error: any) {
            toast.error(`Failed to ${mode} song: ` + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

            <DialogContent className='bg-zinc-900 border-zinc-800 max-h-[90vh] overflow-y-auto sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle className="text-white">{mode === "add" ? "Add New Song" : "Edit Song"}</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        {mode === "add" ? "Add a new song to the music library" : "Update song details"}
                    </DialogDescription>
                </DialogHeader>

                <div className='space-y-4 py-4'>
                    {/* Files only mandatory for ADD, optional for EDIT */}
                    <input
                        type='file'
                        accept='audio/*'
                        ref={audioInputRef}
                        hidden
                        onChange={(e) => setFiles((prev) => ({ ...prev, audio: e.target.files![0] }))}
                    />

                    <input
                        type='file'
                        ref={imageInputRef}
                        className='hidden'
                        accept='image/*'
                        onChange={(e) => setFiles((prev) => ({ ...prev, image: e.target.files![0] }))}
                    />

                    {/* image upload area */}
                    <div
                        className='flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer hover:border-zinc-500 transition-colors'
                        onClick={() => imageInputRef.current?.click()}
                    >
                        <div className='text-center'>
                            {files.image ? (
                                <div className='space-y-2'>
                                    <div className='text-sm text-emerald-400'>Image selected:</div>
                                    <div className='text-xs text-zinc-400'>{files.image.name.slice(0, 20)}...</div>
                                </div>
                            ) : (
                                <>
                                    <div className='p-3 bg-zinc-800 rounded-full inline-block mb-2'>
                                        <Upload className='h-6 w-6 text-zinc-400' />
                                    </div>
                                    <div className='font-semibold text-sm text-zinc-300 mb-1'>
                                        {mode === "edit" ? "Change cover image" : "Upload cover image"}
                                    </div>
                                    {mode === "edit" && <div className="text-xs text-zinc-500">(Optional)</div>}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Audio upload */}
                    <div className='space-y-2'>
                        <label className='text-sm font-medium text-zinc-300'>Audio File {mode === "edit" && "(Optional)"}</label>
                        <div className='flex items-center gap-2'>
                            <Button variant='outline' onClick={() => audioInputRef.current?.click()} className='w-full bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white'>
                                {files.audio ? (
                                    <span className="text-emerald-400 truncate">{files.audio.name}</span>
                                ) : (
                                    <span className="flex items-center gap-2"><Music className="size-4" /> {mode === "edit" ? "Change Audio" : "Choose Audio File"}</span>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Metadata fields */}
                    <div className='space-y-2'>
                        <label className='text-sm font-medium text-zinc-300'>Title</label>
                        <Input
                            value={newSong.title}
                            onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
                            className='bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-brand-primary'
                            placeholder='Enter song title'
                        />
                    </div>

                    <div className='space-y-2'>
                        <label className='text-sm font-medium text-zinc-300'>Artist</label>
                        <Input
                            value={newSong.artist}
                            onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
                            className='bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-brand-primary'
                            placeholder='Enter artist name'
                        />
                    </div>

                    <div className='space-y-2'>
                        <label className='text-sm font-medium text-zinc-300'>Duration (seconds)</label>
                        <Input
                            type='number'
                            min='0'
                            value={newSong.duration}
                            onChange={(e) => setNewSong({ ...newSong, duration: e.target.value || "0" })}
                            className='bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-brand-primary'
                        />
                    </div>

                    <div className='space-y-2'>
                        <label className='text-sm font-medium text-zinc-300'>Album</label>
                        <Select
                            value={newSong.album}
                            onValueChange={(value) => setNewSong({ ...newSong, album: value })}
                        >
                            <SelectTrigger className='bg-zinc-800 border-zinc-700 text-white focus:ring-brand-primary'>
                                <SelectValue placeholder='Select album' />
                            </SelectTrigger>
                            <SelectContent className='bg-zinc-800 border-zinc-700 text-white'>
                                <SelectItem className='hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer' value='none'>No Album (Single)</SelectItem>
                                {albums.map((album) => (
                                    <SelectItem className='hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer' key={album._id} value={album._id}>
                                        {album.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant='outline' onClick={() => onOpenChange(false)} disabled={isLoading} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading} className="bg-brand-primary hover:bg-brand-primary/90 text-white">
                        {isLoading ? "Saving..." : mode === "add" ? "Add Song" : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
export default SongDialog;
