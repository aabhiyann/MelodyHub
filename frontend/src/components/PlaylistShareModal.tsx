import { useState } from 'react';
import { X, Copy, Globe, Lock, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { axiosInstance } from '@/lib/axios';
import toast from 'react-hot-toast';

interface PlaylistShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    playlistId: string;
    playlistName: string;
    isPublicInitial: boolean;
}

export const PlaylistShareModal = ({
    isOpen,
    onClose,
    playlistId,
    playlistName,
    isPublicInitial
}: PlaylistShareModalProps) => {
    const [isPublic, setIsPublic] = useState(isPublicInitial);
    const [isLoading, setIsLoading] = useState(false);

    const shareUrl = `${window.location.origin}/playlists/${playlistId}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard!');
    };

    const togglePublic = async () => {
        setIsLoading(true);
        try {
            const newStatus = !isPublic;
            await axiosInstance.put(`/social/playlists/${playlistId}`, { isPublic: newStatus });
            setIsPublic(newStatus);
            toast.success(newStatus ? 'Playlist is now Public' : 'Playlist is now Private');
        } catch (err) {
            toast.error('Failed to update privacy settings');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Share2 className="size-5 text-brand-primary" />
                            Share Playlist
                        </h2>
                        <p className="text-xs text-zinc-400 mt-1">
                            {playlistName}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Public Toggle (Top implementation) */}
                    <div className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-lg border border-zinc-800/50">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${isPublic ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-500/20 text-zinc-400'}`}>
                                {isPublic ? <Globe className="size-5" /> : <Lock className="size-5" />}
                            </div>
                            <div>
                                <p className="font-medium text-white">
                                    {isPublic ? 'Public Playlist' : 'Private Playlist'}
                                </p>
                                <p className="text-xs text-zinc-500">
                                    {isPublic ? 'Anyone with the link can view' : 'Only you can view'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={togglePublic}
                            disabled={isLoading}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-zinc-900 ${isPublic ? 'bg-brand-primary' : 'bg-zinc-700'}`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPublic ? 'translate-x-6' : 'translate-x-1'}`}
                            />
                        </button>
                    </div>

                    {/* Share Link */}
                    {isPublic && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                            <label className="text-sm font-medium text-zinc-400">Public Link</label>
                            <div className="flex items-center gap-2 bg-zinc-950 p-2 rounded-lg border border-zinc-800">
                                <input
                                    type="text"
                                    readOnly
                                    value={shareUrl}
                                    className="bg-transparent border-none text-white text-sm w-full focus:outline-none px-2"
                                />
                                <button
                                    onClick={handleCopy}
                                    className="p-2 hover:bg-white/10 rounded-md text-zinc-400 hover:text-white transition-colors"
                                >
                                    <Copy className="size-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
