import { motion } from 'framer-motion';
import { Play, Save, RefreshCw, Share2, ListMusic, Music, Clock } from 'lucide-react';
import { useAIStore } from '@/stores/useAIStore';
import { usePlayerStore } from '@/stores/PlayerStore';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/OptimizedImage';
import { formatDuration } from '@/utils/formatTime';
import { toast } from 'react-hot-toast';
import { Song } from '@/types';

export const StageResults = () => {
    const { generatedPlaylist, reset, closeModal, savePlaylist, isLoading } = useAIStore();
    const { playAlbum, currentSong, isPlaying } = usePlayerStore();

    if (!generatedPlaylist) return null;

    const songs = generatedPlaylist.songs || [];

    const handlePlayPlaylist = () => {
        if (songs.length > 0) {
            const { initializeQueue } = usePlayerStore.getState();
            initializeQueue(songs);
            closeModal();
        }
    };

    const handlePlaySong = (index: number) => {
        if (songs.length > 0) {
            playAlbum(songs, index);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-3xl mx-auto flex flex-col min-h-0"
        >
            {/* Playlist Hero - aligned with PlaylistPage */}
            <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="flex-shrink-0">
                    <div className="w-[200px] h-[200px] shadow-2xl rounded-xl ring-1 ring-white/10 bg-gradient-to-br from-brand-primary/40 to-background-elevated flex items-center justify-center">
                        <ListMusic className="size-16 text-white/50" />
                    </div>
                </div>

                <div className="flex flex-col justify-end flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-secondary uppercase tracking-wider">AI Playlist</p>
                    <h2 className="text-3xl md:text-4xl font-bold text-text-primary mt-1 mb-2 tracking-tight">
                        {generatedPlaylist.name}
                    </h2>
                    {generatedPlaylist.description && (
                        <p className="text-text-secondary text-sm mb-4 max-w-xl line-clamp-2">
                            {generatedPlaylist.description}
                        </p>
                    )}
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-sm text-text-secondary">{songs.length} songs</span>
                        <span className="w-1 h-1 rounded-full bg-text-tertiary" />
                        <span className="text-sm text-text-secondary">~{Math.round(songs.length * 3.5)} min</span>
                        <span className="w-1 h-1 rounded-full bg-text-tertiary" />
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-brand-primary/20 text-brand-primary">
                            AI Curated
                        </span>
                    </div>
                    <div className="mt-4">
                        <Button
                            onClick={handlePlayPlaylist}
                            size="icon"
                            disabled={songs.length === 0}
                            className="w-14 h-14 rounded-full bg-brand-primary hover:bg-brand-primary/90 hover:scale-105 transition-smooth shadow-lg shadow-brand-primary/25"
                        >
                            <Play className="h-7 w-7 text-white ml-0.5" fill="currentColor" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Song List - PlaylistSongRow style grid */}
            <div className="flex-1 min-h-[200px] overflow-hidden flex flex-col">
                <div className="bg-background-elevated/20 backdrop-blur-sm rounded-xl border border-border-subtle overflow-hidden">
                    {/* Table header */}
                    <div
                        className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 md:px-6 py-2 text-sm text-text-secondary border-b border-border-subtle uppercase tracking-wider"
                    >
                        <div>#</div>
                        <div>Title</div>
                        <div>Artist</div>
                        <div><Clock className="size-4" /></div>
                    </div>

                    {/* Song rows */}
                    <div className="max-h-[280px] overflow-y-auto custom-scrollbar">
                        {songs.length > 0 ? (
                            songs.map((song: Song, index: number) => {
                                const isCurrentSong = currentSong?._id === song._id;
                                return (
                                    <motion.div
                                        key={song._id || index}
                                        onClick={() => handlePlaySong(index)}
                                        className={`grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 md:px-6 py-2 text-sm rounded-md group cursor-pointer transition-smooth
                                            ${isCurrentSong ? 'bg-brand-primary/10' : 'hover:bg-white/5'}`}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="flex items-center justify-center">
                                            {isCurrentSong && isPlaying ? (
                                                <Music className="size-4 text-brand-primary animate-pulse" />
                                            ) : (
                                                <>
                                                    <span className="group-hover:hidden text-text-tertiary font-mono">
                                                        {index + 1}
                                                    </span>
                                                    <Play className="h-4 w-4 hidden group-hover:block text-brand-primary" fill="currentColor" />
                                                </>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded overflow-hidden bg-surface-card flex-shrink-0">
                                                {song.imageUrl ? (
                                                    <OptimizedImage
                                                        src={song.imageUrl}
                                                        alt={song.title}
                                                        className="size-10 object-cover"
                                                        size="thumbnail"
                                                    />
                                                ) : (
                                                    <img
                                                        src={`https://api.dicebear.com/7.x/shapes/svg?seed=${index}`}
                                                        alt={song.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </div>
                                            <span
                                                className={`font-medium truncate ${isCurrentSong ? 'text-brand-primary' : 'text-text-primary'}`}
                                            >
                                                {song.title}
                                            </span>
                                        </div>

                                        <div className="text-text-secondary truncate flex items-center">
                                            {song.artist}
                                        </div>

                                        <div className="text-text-tertiary text-right flex items-center justify-end">
                                            {song.duration ? formatDuration(song.duration) : '—'}
                                        </div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-text-tertiary text-sm">
                                <p>No songs in this playlist.</p>
                                <p className="text-xs mt-1 text-text-tertiary/80">Try regenerating with a different prompt.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Buttons - clear hierarchy */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button
                    onClick={handlePlayPlaylist}
                    className="flex-1 h-12 bg-white text-black hover:bg-zinc-200 font-bold rounded-xl transition-smooth order-1"
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
                    className="flex-1 h-12 bg-white/10 text-text-primary border border-border-medium hover:bg-white/20 font-semibold rounded-xl disabled:opacity-50 transition-smooth order-2"
                >
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? "Saving..." : "Save to Library"}
                </Button>

                <div className="flex gap-3 order-3 sm:flex-1 sm:justify-end">
                    <Button
                        onClick={reset}
                        variant="outline"
                        className="h-12 px-4 border-border-medium hover:bg-white/5 text-text-secondary font-medium rounded-xl transition-smooth"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Regenerate
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-12 w-12 rounded-xl border border-border-medium hover:bg-white/5 text-text-tertiary hover:text-text-primary transition-smooth"
                        aria-label="Share playlist"
                    >
                        <Share2 className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};
