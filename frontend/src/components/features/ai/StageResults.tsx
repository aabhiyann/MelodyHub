import { motion } from 'framer-motion';
import { Play, Save, RefreshCw, Share2, ListMusic, Music, Clock } from 'lucide-react';
import { useAIStore } from '@/stores/useAIStore';
import { usePlayerStore } from '@/stores/PlayerStore';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/shared/OptimizedImage';
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
                    <div className="w-[200px] h-[200px] shadow-2xl rounded-xl ring-1 ring-white/10 bg-gradient-to-br from-[#22C55E]/30 to-[#101019] flex items-center justify-center">
                        <ListMusic className="size-16 text-white/50" />
                    </div>
                </div>

                <div className="flex flex-col justify-end flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#9CA3AF] uppercase tracking-wider">AI Playlist</p>
                    <h2 className="text-3xl md:text-4xl font-bold text-[#F9FAFB] mt-1 mb-2 tracking-tight">
                        {generatedPlaylist.name}
                    </h2>
                    {generatedPlaylist.description && (
                        <p className="text-[#9CA3AF] text-sm mb-4 max-w-xl line-clamp-2">
                            {generatedPlaylist.description}
                        </p>
                    )}
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-sm text-[#9CA3AF]">{songs.length} songs</span>
                        <span className="w-1 h-1 rounded-full bg-[#6B7280]" />
                        <span className="text-sm text-[#9CA3AF]">~{Math.round(songs.length * 3.5)} min</span>
                        <span className="w-1 h-1 rounded-full bg-[#6B7280]" />
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#22C55E]/20 text-[#22C55E]">
                            AI Curated
                        </span>
                    </div>
                    <div className="mt-4">
                        <Button
                            onClick={handlePlayPlaylist}
                            size="icon"
                            disabled={songs.length === 0}
                            className="w-14 h-14 rounded-full bg-[#22C55E] hover:bg-[#16A34A] hover:scale-105 transition-all shadow-lg shadow-[#22C55E]/25"
                        >
                            <Play className="h-7 w-7 text-white ml-0.5" fill="currentColor" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Song List - PlaylistSongRow style grid */}
            <div className="flex-1 min-h-[200px] overflow-hidden flex flex-col">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
                    {/* Table header */}
                    <div
                        className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 md:px-6 py-2 text-sm text-[#9CA3AF] border-b border-white/10 uppercase tracking-wider"
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
                                        className={`grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 md:px-6 py-2 text-sm rounded-md group cursor-pointer transition-colors
                                            ${isCurrentSong ? 'bg-[#22C55E]/10' : 'hover:bg-white/5'}`}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="flex items-center justify-center">
                                            {isCurrentSong && isPlaying ? (
                                                <Music className="size-4 text-[#22C55E] animate-pulse" />
                                            ) : (
                                                <>
                                                    <span className="group-hover:hidden text-[#6B7280] font-mono">
                                                        {index + 1}
                                                    </span>
                                                    <Play className="h-4 w-4 hidden group-hover:block text-[#22C55E]" fill="currentColor" />
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
                                                className={`font-medium truncate ${isCurrentSong ? 'text-[#22C55E]' : 'text-[#F9FAFB]'}`}
                                            >
                                                {song.title}
                                            </span>
                                        </div>

                                        <div className="text-[#9CA3AF] truncate flex items-center">
                                            {song.artist}
                                        </div>

                                        <div className="text-[#6B7280] text-right flex items-center justify-end">
                                            {song.duration ? formatDuration(song.duration) : '—'}
                                        </div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-[#9CA3AF] text-sm">
                                <p>No songs in this playlist.</p>
                                <p className="text-xs mt-1 text-[#6B7280]">Try regenerating with a different prompt.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Buttons - clear hierarchy */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button
                    onClick={handlePlayPlaylist}
                    className="flex-1 h-12 bg-[#22C55E] text-white hover:bg-[#16A34A] font-bold rounded-xl transition-colors order-1"
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
                    isLoading={isLoading}
                    className="flex-1 h-12 bg-white/10 text-[#F9FAFB] border border-white/20 hover:bg-white/20 font-semibold rounded-xl disabled:opacity-50 transition-colors order-2"
                >
                    <Save className="w-4 h-4 mr-2" />
                    Save to Library
                </Button>

                <div className="flex gap-3 order-3 sm:flex-1 sm:justify-end">
                    <Button
                        onClick={reset}
                        variant="outline"
                        className="h-12 px-4 border-white/20 hover:bg-white/5 text-[#9CA3AF] font-medium rounded-xl transition-colors"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Regenerate
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-12 w-12 rounded-xl border border-white/20 hover:bg-white/5 text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors"
                        aria-label="Share playlist"
                    >
                        <Share2 className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};
