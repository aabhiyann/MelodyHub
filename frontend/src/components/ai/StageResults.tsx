import { motion } from 'framer-motion';
import { Play, Save, RefreshCw, Share2, Heart, X } from 'lucide-react';
import { useAIStore } from '@/stores/useAIStore';
import { usePlayerStore } from '@/stores/PlayerStore';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

export const StageResults = () => {
    const { generatedPlaylist, reset, closeModal, savePlaylist, isLoading } = useAIStore();

    if (!generatedPlaylist) return null;

    const songs = generatedPlaylist.songs || []; // Ensure songs is an array

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-3xl mx-auto flex flex-col h-full"
        >
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-3">
                    {generatedPlaylist.name}
                </h2>
                <p className="text-zinc-400 text-lg max-w-xl mx-auto">
                    {generatedPlaylist.description}
                </p>
            </div>

            {/* Stats Row */}
            <div className="flex justify-center gap-6 mb-8 text-sm text-zinc-500 font-medium">
                <span>{songs.length} songs</span>
                <span>•</span>
                <span>~{Math.round(songs.length * 3.5)} min duration</span>
                <span>•</span>
                <span>AI Curated</span>
            </div>

            {/* Song List Preview */}
            <div className="flex-1 overflow-y-auto min-h-[300px] bg-black/20 rounded-xl border border-white/5 p-2 mb-8 custom-scrollbar">
                {songs.length > 0 ? (
                    songs.map((song, index) => (
                        <div
                            key={index}
                            className="group flex items-center gap-4 p-3 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                        >
                            <span className="w-6 text-center text-zinc-600 font-mono text-sm group-hover:hidden">
                                {index + 1}
                            </span>
                            <button className="w-6 hidden group-hover:flex items-center justify-center text-brand-primary">
                                <Play size={14} fill="currentColor" />
                            </button>

                            <div className="w-10 h-10 rounded overflow-hidden bg-zinc-800 flex-shrink-0">
                                {/* Use placeholder if generated songs don't have real images yet */}
                                <img
                                    src={song.imageUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${index}`}
                                    alt={song.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className="text-white font-medium truncate">{song.title}</h4>
                                <p className="text-zinc-500 text-xs truncate">{song.artist}</p>
                            </div>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 text-zinc-400 hover:text-white transition-colors">
                                    <Heart size={16} />
                                </button>
                                <button className="p-2 text-zinc-400 hover:text-red-400 transition-colors">
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-500 py-12">
                        <p>Simulated playlist generation complete.</p>
                        <p className="text-xs mt-2 text-zinc-600">Real song data will appear here.</p>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex flex-col md:flex-row gap-4">
                <Button
                    onClick={() => {
                        const { initializeQueue } = usePlayerStore.getState();
                        if (generatedPlaylist.songs.length > 0) {
                            initializeQueue(generatedPlaylist.songs);
                            closeModal();
                        }
                    }}
                    className="flex-1 h-12 bg-white text-black hover:bg-zinc-200 font-bold rounded-xl"
                >
                    <Play className="w-4 h-4 mr-2" fill="currentColor" />
                    Play Now
                </Button>

                <Button
                    onClick={async () => {
                        try {
                            await savePlaylist();
                            toast.success("Playlist saved to your library!");
                            closeModal();
                        } catch (err) {
                            toast.error("Failed to save playlist");
                        }
                    }}
                    disabled={isLoading}
                    className="flex-1 h-12 bg-white/10 text-white border border-white/10 hover:bg-white/20 font-bold rounded-xl disabled:opacity-50"
                >
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? "Saving..." : "Save to Library"}
                </Button>

                <Button
                    onClick={reset}
                    variant="outline"
                    className="flex-1 h-12 border-white/10 hover:bg-white/5 text-white font-medium rounded-xl"
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerate
                </Button>

                <Button
                    variant="ghost"
                    className="h-12 w-12 rounded-xl border border-white/10 hover:bg-white/5 mx-auto md:mx-0"
                >
                    <Share2 className="w-5 h-5 text-zinc-400" />
                </Button>
            </div>
        </motion.div>
    );
};
