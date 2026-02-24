import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePlaylistStore } from "@/stores/PlaylistStore";
import { usePlayerStore } from "@/stores/PlayerStore";
import { Clock, Pause, Play, ListMusic } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { InviteCollaboratorsDialog } from "@/components/features/playlist/InviteCollaboratorsDialog";
import { PlaylistSongRow } from "@/components/features/playlist/PlaylistSongRow";

import Topbar from "@/components/layout/TopBar";

const PlaylistPage = () => {
    const { id } = useParams();
    const { fetchPlaylistById, currentPlaylist, isLoading, error } = usePlaylistStore();
    const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();
    const { user } = useUser();

    const isReady = currentPlaylist?._id === id;

    useEffect(() => {
        if (id && currentPlaylist?._id !== id) {
            fetchPlaylistById(id);
        }
    }, [fetchPlaylistById, id, currentPlaylist?._id]);

    if (isLoading || (!isReady && !error)) {
        return (
            <main className="h-full flex items-center justify-center p-8 flex-col bg-transparent">
                <Topbar />
                <div className="flex-1 w-full flex items-center justify-center">
                    <div className="animate-pulse space-y-4 w-full max-w-lg">
                        <div className="h-48 w-48 bg-white/10 mx-auto rounded-lg" />
                        <div className="h-8 bg-white/10 w-3/4 mx-auto rounded" />
                        <div className="h-4 bg-white/10 w-1/2 mx-auto rounded" />
                    </div>
                </div>
            </main>
        );
    }

    if (error || !currentPlaylist) {
        return (
            <main className="h-full flex items-center justify-center text-center p-8 flex-col bg-transparent">
                <Topbar />
                <div className="flex-1 w-full flex items-center justify-center">
                    <div>
                        <ListMusic className="size-16 mx-auto mb-4 text-white/20" />
                        <h2 className="text-xl font-semibold text-white mb-2">Playlist not found</h2>
                        <p className="text-text-secondary text-sm">This playlist may have been deleted or doesn't exist.</p>
                    </div>
                </div>
            </main>
        );
    }

    const getOwnerName = () => {
        if (!currentPlaylist?.owner) return 'Unknown';
        if (typeof currentPlaylist.owner === 'string') {
            return currentPlaylist.owner === user?.id ? 'You' : 'Another user';
        }
        // Populated owner object
        const owner = currentPlaylist.owner as { _id?: string; clerkId?: string; fullName?: string };
        if (owner.clerkId === user?.id) return 'You';
        return owner.fullName ?? 'Another user';
    };

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
        <main className='rounded-md overflow-hidden h-full bg-transparent flex flex-col'>
            <Topbar />
            <ScrollArea className='flex-1 rounded-md'>
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
                                    <span className='font-medium text-white'>Created by {getOwnerName()}</span>
                                    <span className="flex items-center text-text-secondary"><span className="w-1 h-1 rounded-full bg-text-tertiary mx-2" /> {currentPlaylist?.songs.length} songs</span>

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
                                            <PlaylistSongRow
                                                key={`${song._id}-${index}`}
                                                song={song}
                                                index={index}
                                                isCurrentSong={isCurrentSong}
                                                isPlaying={isPlaying}
                                                onClick={() => handlePlaySong(index)}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </main>
    );
};
export default PlaylistPage;
