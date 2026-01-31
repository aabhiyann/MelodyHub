import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Upload, Image as ImageIcon, Music, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useMusicStore } from '@/stores/MusicStore';

interface SongUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface SongFormData {
    title: string;
    artist: string;
    album: string;
    genre: string;
    duration: number;
}

export const SongUploadModal = ({ isOpen, onClose }: SongUploadModalProps) => {
    const [isUploading, setIsUploading] = useState(false);
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<SongFormData>();
    const { addSong } = useMusicStore();

    const handleAudioDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setAudioFile(file);
    };

    const handleCoverDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverFile(file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (data: SongFormData) => {
        if (!audioFile || !coverFile) {
            toast.error("Please provide both an audio file and a cover image.");
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('artist', data.artist);
            formData.append('audioFile', audioFile);
            formData.append('imageFile', coverFile);
            formData.append('duration', '0'); // Backend should invoke duration check, or we calc it. for now Mock.
            if (data.album) formData.append('albumId', data.album);

            await addSong(formData);

            onClose();
        } catch (error) {
            // Toast handled in store
        } finally {
            setIsUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-white/10 sticky top-0 bg-white dark:bg-zinc-900 z-10">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Upload New Song</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                    >
                        <X size={20} className="text-zinc-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    {/* File Upload Area */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Audio File */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Audio File <span className="text-red-500">*</span>
                            </label>
                            <div
                                className="relative border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-colors cursor-pointer min-h-[160px]"
                                onClick={() => document.getElementById('audio-upload')?.click()}
                            >
                                <input
                                    id="audio-upload"
                                    type="file"
                                    accept="audio/*"
                                    hidden
                                    onChange={handleAudioDrop}
                                />
                                {audioFile ? (
                                    <div className="flex flex-col items-center gap-2 text-brand-primary animate-in fade-in">
                                        <div className="size-12 rounded-full bg-brand-primary/10 flex items-center justify-center">
                                            <Music size={24} />
                                        </div>
                                        <p className="text-sm font-medium truncate max-w-[180px]">{audioFile.name}</p>
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); setAudioFile(null); }}
                                            className="text-xs text-red-500 hover:text-red-600 font-medium"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-zinc-500">
                                        <Upload size={32} className="opacity-50" />
                                        <p className="text-sm font-medium">Click to upload audio</p>
                                        <p className="text-xs opacity-70">MP3, WAV up to 50MB</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Cover Image */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Cover Art <span className="text-red-500">*</span>
                            </label>
                            <div
                                className="relative border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-1 flex flex-col items-center justify-center text-center hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-colors cursor-pointer aspect-square min-h-[160px]"
                                onClick={() => document.getElementById('cover-upload')?.click()}
                            >
                                <input
                                    id="cover-upload"
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={handleCoverDrop}
                                />
                                {coverPreview ? (
                                    <div className="relative w-full h-full rounded-lg overflow-hidden group">
                                        <img src={coverPreview} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <p className="text-white text-sm font-medium">Change Cover</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-zinc-500 p-6">
                                        <ImageIcon size={32} className="opacity-50" />
                                        <p className="text-sm font-medium">Upload Cover</p>
                                        <p className="text-xs opacity-70">500x500px Min</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Song Title</label>
                            <input
                                {...register('title', { required: true })}
                                className="w-full h-10 px-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:border-brand-primary outline-none transition-all"
                                placeholder="Enter title"
                            />
                            {errors.title && <span className="text-xs text-red-500">Required</span>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Artist Name</label>
                            <input
                                {...register('artist', { required: true })}
                                className="w-full h-10 px-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:border-brand-primary outline-none transition-all"
                                placeholder="Enter artist"
                            />
                            {errors.artist && <span className="text-xs text-red-500">Required</span>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Album Name</label>
                            <input
                                {...register('album')}
                                className="w-full h-10 px-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:border-brand-primary outline-none transition-all"
                                placeholder="Single (if empty)"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Genre</label>
                            <select
                                {...register('genre', { required: true })}
                                className="w-full h-10 px-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:border-brand-primary outline-none transition-all"
                            >
                                <option value="">Select genre</option>
                                <option value="pop">Pop</option>
                                <option value="rock">Rock</option>
                                <option value="hip-hop">Hip Hop</option>
                                <option value="electronic">Electronic</option>
                            </select>
                            {errors.genre && <span className="text-xs text-red-500">Required</span>}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-4 border-t border-zinc-200 dark:border-white/10 flex justify-end gap-3 sticky bottom-0 bg-white dark:bg-zinc-900 pb-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isUploading}
                            className="flex items-center gap-2 px-6 py-2 text-sm font-bold text-white bg-brand-primary hover:bg-brand-secondary rounded-lg transition-all shadow-lg shadow-brand-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                "Upload Song"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
