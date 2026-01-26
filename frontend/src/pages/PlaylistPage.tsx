import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePlaylistStore } from "@/stores/PlaylistStore";
import { usePlayerStore } from "@/stores/PlayerStore";
import { Clock, Pause, Play, Music, ListMusic } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { formatDuration } from "./AlbumPage"; // Reuse utility or move to utils
import { useUser } from "@clerk/clerk-react";
import { InviteCollaboratorsDialog } from "@/components/InviteCollaboratorsDialog";

const PlaylistPage = () => {
    const { id } = useParams();
    const { fetchPlaylistById, currentPlaylist, isLoading } = usePlaylistStore();
    const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();
    const { user } = useUser();

    useEffect(() => {
        if (id) fetchPlaylistById(id);
    }, [fetchPlaylistById, id]);

    if (isLoading) return null; // Or skeleton

    const handlePlayPlaylist = () => {
        if (!currentPlaylist) return;

        const isCurrentPlaylistPlaying = currentPlaylist?.songs.some((song) => song._id === currentSong?._id);
        if (isCurrentPlaylistPlaying) togglePlay();
        else {
            // start playing the playlist from the beginning
            playAlbum(currentPlaylist?.songs, 0);
        }
    };

    const handlePlaySong = (index: number) => {
        if (!currentPlaylist) return;

        playAlbum(currentPlaylist?.songs, index);
    };

    return (
        <div className='h-full bg-transparent'>
            <ScrollArea className='h-full rounded-md'>
                {/* Main Content */}
                <div className='relative min-h-full'>
                    {/* bg gradient - Reduced for cleaner glass look */}
                    <div
                        className='absolute inset-0 bg-gradient-to-b from-brand-primary/20 via-transparent to-transparent pointer-events-none'
                        aria-hidden='true'
                    />

                    {/* Content */}
                    <div className='relative z-10'>
                        <div className='flex p-6 gap-6 pb-8'>
                            {/* Playlist Cover - Fallback to gradient if no image (playlists might not have images yet) */}
                            <div className="w-[240px] h-[240px] shadow-2xl rounded-lg ring-1 ring-white/10 bg-gradient-to-br from-brand-primary/40 to-background-elevated flex items-center justify-center">
                                <ListMusic className="size-20 text-white/50" />
                            </div>

                            <div className='flex flex-col justify-end'>
                                <p className='text-sm font-medium text-text-secondary uppercase tracking-wider'>Playlist</p>
                                <h1 className='text-5xl md:text-7xl font-bold my-4 text-white tracking-tight'>{currentPlaylist?.name}</h1>
                                {currentPlaylist?.description && (
                                    <p className="text-text-secondary text-sm mb-4 max-w-lg">{currentPlaylist.description}</p>
                                )}
                                <div className='flex items-center gap-2 text-sm text-text-secondary'>
                                    <span className='font-medium text-white'>Created by User (Owner ID: {currentPlaylist?.owner.slice(0, 8)}...)</span>
                                    <span className="flex items-center text-text-secondary"><span className="w-1 h-1 rounded-full bg-zinc-600 mx-2" /> {currentPlaylist?.songs.length} songs</span>

                                    {user?.id === currentPlaylist?.owner && currentPlaylist && (
                                        <div className="ml-4">
                                            <InviteCollaboratorsDialog
                                                playlistId={currentPlaylist._id}
                                                currentCollaborators={currentPlaylist.collaborators}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* play button */}
                        <div className='px-6 pb-6 flex items-center gap-6'>
                            <Button
                                onClick={handlePlayPlaylist}
                                size='icon'
                                disabled={!currentPlaylist?.songs.length}
                                className='w-14 h-14 rounded-full bg-brand-primary hover:bg-brand-primary/90 hover:scale-105 transition-all shadow-lg'
                            >
                                {isPlaying && currentPlaylist?.songs.some((song) => song._id === currentSong?._id) ? (
                                    <Pause className='h-7 w-7 text-white' />
                                ) : (
                                    <Play className='h-7 w-7 text-white ml-1' />
                                )}
                            </Button>
                        </div>

                        {/* Table Section */}
                        <div className='bg-background-elevated/20 backdrop-blur-sm'>
                            {/* table header */}
                            <div
                                className='grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm 
            text-text-secondary border-b border-white/5 uppercase tracking-wider'
                            >
                                <div>#</div>
                                <div>Title</div>
                                <div>Artist</div>
                                <div>
                                    <Clock className='h-4 w-4' />
                                </div>
                            </div>

                            {/* songs list */}

                            <div className='px-6'>
                                <div className='space-y-2 py-4'>
                                    {currentPlaylist?.songs.length === 0 && (
                                        <div className="text-center py-10 text-text-secondary">
                                            This playlist is empty. Add songs from the library or player!
                                        </div>
                                    )}
                                    {currentPlaylist?.songs.map((song, index) => {
                                        const isCurrentSong = currentSong?._id === song._id;
                                        return (
                                            <div
                                                key={`${song._id}-${index}`}
                                                onClick={() => handlePlaySong(index)}
                                                className={`grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm 
                       rounded-md group cursor-pointer transition-all duration-200 ease-out
                       hover:scale-[1.01] active:scale-[0.99]
                       ${isCurrentSong ? "bg-brand-primary/10 ring-1 ring-brand-primary/20" : "hover:bg-white/5"}
                       `}
                                            >
                                                <div className='flex items-center justify-center'>
                                                    {isCurrentSong && isPlaying ? (
                                                        <Music className='size-4 text-brand-primary animate-pulse' />
                                                    ) : (
                                                        <span className='group-hover:hidden text-text-secondary'>{index + 1}</span>
                                                    )}
                                                    {!isCurrentSong && (
                                                        <Play className='h-4 w-4 hidden group-hover:block text-white' />
                                                    )}
                                                </div>

                                                <div className='flex items-center gap-3'>
                                                    <img src={song.imageUrl} alt={song.title} className='size-10 rounded shadow' />

                                                    <div>
                                                        <div className={`font-medium ${isCurrentSong ? "text-brand-primary" : "text-text-primary"}`}>{song.title}</div>

                                                    </div>
                                                </div>
                                                <div className="text-text-secondary">{song.artist}</div>
                                                <div className='flex items-center text-text-secondary'>{formatDuration(song.duration)}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
};
export default PlaylistPage;
