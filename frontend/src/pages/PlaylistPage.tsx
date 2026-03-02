import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePlaylistStore } from "@/stores/PlaylistStore";
import { usePlayerStore } from "@/stores/PlayerStore";
import { Clock, Pause, Play, ListMusic, Shuffle, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { InviteCollaboratorsDialog } from "@/components/features/playlist/InviteCollaboratorsDialog";
import { PlaylistSongRow } from "@/components/features/playlist/PlaylistSongRow";
import { CreateEditPlaylistModal } from "@/components/features/playlist/CreateEditPlaylistModal";
import { OptimizedImage } from "@/components/shared/OptimizedImage";
import { formatDuration } from "@/lib/utils";
import { useDominantColor } from "@/hooks/useDominantColor";

import Topbar from "@/components/layout/TopBar";
import { SectionErrorBoundary } from "@/components/shared/SectionErrorBoundary";
import { EmptyState } from "@/components/shared/EmptyState";

const PlaylistPage = () => {
    const { id } = useParams();
    const { fetchPlaylistById, currentPlaylist, isLoading, error, removeSongFromPlaylist, reorderSongs } = usePlaylistStore();
    const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();
    const { user } = useUser();

    const coverImageUrlForBg = currentPlaylist?.imageUrl ?? (currentPlaylist?.songs?.[0] as { imageUrl?: string } | undefined)?.imageUrl;
    const dominantColor = useDominantColor(coverImageUrlForBg);

    const isReady = currentPlaylist?._id === id;
    const [editModalOpen, setEditModalOpen] = useState(false);

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
                        <p className="text-[#9CA3AF] text-sm">This playlist may have been deleted or doesn't exist.</p>
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

    const handleShuffle = () => {
        if (!currentPlaylist?.songs.length) return;
        const shuffled = [...currentPlaylist.songs].sort(() => Math.random() - 0.5);
        playAlbum(shuffled, 0);
    };

    const coverImageUrl = currentPlaylist?.imageUrl ?? (currentPlaylist?.songs?.[0] as { imageUrl?: string } | undefined)?.imageUrl;
    const totalDurationSeconds = currentPlaylist?.songs?.reduce((acc, s) => acc + (s.duration ?? 0), 0) ?? 0;

    const isOwner = Boolean(
        id && currentPlaylist && (typeof currentPlaylist.owner === "string" ? user?.id === currentPlaylist.owner : (currentPlaylist.owner as { clerkId?: string })?.clerkId === user?.id)
    );

    const handleRemoveSong = (songId: string) => {
        if (!id) return;
        removeSongFromPlaylist(id, songId);
    };

    const handleMoveUp = (index: number) => {
        if (!currentPlaylist?.songs.length || !id || index <= 0) return;
        const songs = [...currentPlaylist.songs];
        [songs[index - 1], songs[index]] = [songs[index], songs[index - 1]];
        reorderSongs(id, songs.map((s) => s._id));
    };

    const handleMoveDown = (index: number) => {
        if (!currentPlaylist?.songs.length || !id || index >= currentPlaylist.songs.length - 1) return;
        const songs = [...currentPlaylist.songs];
        [songs[index], songs[index + 1]] = [songs[index + 1], songs[index]];
        reorderSongs(id, songs.map((s) => s._id));
    };

    return (
        <main className='rounded-md overflow-hidden h-full bg-transparent flex flex-col'>
            <Topbar />
            <ScrollArea className='flex-1 rounded-md'>
                <SectionErrorBoundary sectionName="Playlist">
                {/* Main Content */}
                <div className='relative min-h-full'>
                    {/* Background gradient from cover art or neutral */}
                    <div
                        className='absolute inset-0 pointer-events-none'
                        aria-hidden='true'
                        style={{
                            background: dominantColor
                                ? `linear-gradient(180deg, ${dominantColor}22 0%, transparent 40%, transparent 70%, rgba(0,0,0,0.85) 100%)`
                                : "linear-gradient(180deg, rgba(31,41,51,0.4) 0%, transparent 40%, transparent 70%, rgba(0,0,0,0.85) 100%)",
                        }}
                    />

                    {/* Content */}
                    <div className='relative z-10'>
                        <div className='flex flex-col md:flex-row p-6 gap-6 pb-8 items-center md:items-end'>
                            {/* Playlist Cover */}
                            <div className="w-[208px] h-[208px] md:w-[240px] md:h-[240px] flex-shrink-0 shadow-2xl rounded-xl ring-1 ring-white/10 overflow-hidden bg-gradient-to-br from-[#1F2933] to-[#101019] flex items-center justify-center">
                                {coverImageUrl ? (
                                    <OptimizedImage src={coverImageUrl} alt={currentPlaylist?.name ?? "Playlist"} className="w-full h-full object-cover" size="large" />
                                ) : (
                                    <ListMusic className="size-20 text-[#6B7280]" />
                                )}
                            </div>

                            <div className='flex flex-col justify-end text-center md:text-left flex-1 min-w-0'>
                                <p className='text-sm font-medium text-[#9CA3AF] uppercase tracking-wider'>Playlist</p>
                                <h1 className='text-3xl md:text-5xl lg:text-7xl font-bold my-2 md:my-4 text-[#F9FAFB] tracking-tight truncate max-w-full'>{currentPlaylist?.name}</h1>
                                {currentPlaylist?.description && (
                                    <p className="text-[#9CA3AF] text-sm mb-2 md:mb-4 max-w-lg">{currentPlaylist.description}</p>
                                )}
                                <div className='flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[#9CA3AF] justify-center md:justify-start'>
                                    <span className='font-medium text-[#F9FAFB]'>Created by {getOwnerName()}</span>
                                    <span className="flex items-center"><span className="w-1 h-1 rounded-full bg-[#6B7280] mx-2" /> {currentPlaylist?.songs.length} songs</span>
                                    {totalDurationSeconds > 0 && (
                                        <>
                                            <span className="w-1 h-1 rounded-full bg-[#6B7280] mx-1" aria-hidden />
                                            <span>{formatDuration(totalDurationSeconds)}</span>
                                        </>
                                    )}
                                    {((typeof currentPlaylist?.owner === "string" && user?.id === currentPlaylist?.owner) || ((currentPlaylist?.owner as { clerkId?: string })?.clerkId === user?.id)) && currentPlaylist && (
                                        <div className="ml-2">
                                            <InviteCollaboratorsDialog
                                                playlistId={currentPlaylist._id}
                                                currentCollaborators={currentPlaylist.collaborators}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Play All + Shuffle + Edit (owner) */}
                        <div className='px-6 pb-6 flex items-center gap-3 flex-wrap'>
                            <Button
                                onClick={handlePlayPlaylist}
                                size='icon'
                                disabled={!currentPlaylist?.songs.length}
                                className='w-14 h-14 rounded-full bg-[#22C55E] hover:bg-[#16A34A] hover:scale-105 transition-all shadow-lg text-[#020617]'
                            >
                                {isPlaying && currentPlaylist?.songs.some((song) => song._id === currentSong?._id) ? (
                                    <Pause className='h-7 w-7' />
                                ) : (
                                    <Play className='h-7 w-7 ml-1' />
                                )}
                            </Button>
                            <Button
                                onClick={handleShuffle}
                                variant="outline"
                                disabled={!currentPlaylist?.songs.length}
                                className="h-12 px-6 rounded-full border-[#1F2933] text-[#F9FAFB] hover:bg-[#1F2933] hover:border-[#22C55E]/50 hover:text-[#22C55E]"
                            >
                                <Shuffle className="h-5 w-5 mr-2" />
                                Shuffle
                            </Button>
                            {isOwner && (
                                <Button
                                    onClick={() => setEditModalOpen(true)}
                                    variant="outline"
                                    className="h-12 px-5 rounded-full border-[#1F2933] text-[#F9FAFB] hover:bg-[#1F2933] hover:border-[#22C55E]/50 hover:text-[#22C55E]"
                                >
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Edit playlist
                                </Button>
                            )}
                        </div>

                        <CreateEditPlaylistModal
                            open={editModalOpen}
                            onClose={() => setEditModalOpen(false)}
                            mode="edit"
                            playlist={currentPlaylist ?? undefined}
                            onSuccess={() => id && fetchPlaylistById(id)}
                        />

                        {/* Table Section */}
                        <div className='bg-[#101019]/20 backdrop-blur-sm'>
                            {/* table header */}
                            <div
                                className='grid grid-cols-[16px_1fr_2fr_80px_40px] md:grid-cols-[16px_4fr_2fr_1fr_48px] gap-2 md:gap-4 px-3 md:px-4 py-2 text-sm 
            text-[#9CA3AF] border-b border-white/5 uppercase tracking-wider'
                            >
                                <div>#</div>
                                <div>Title</div>
                                <div>Artist</div>
                                <div className="flex justify-end md:justify-start">
                                    <Clock className='h-4 w-4' />
                                </div>
                                <div aria-hidden />
                            </div>

                            {/* songs list */}

                            <div className='px-6'>
                                <div className='space-y-2 py-4'>
                                    {currentPlaylist?.songs.length === 0 && (
                                        <EmptyState
                                            message="This playlist is empty"
                                            secondary="Add songs from Browse or Library to get started."
                                        />
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
                                                isOwner={isOwner}
                                                onRemove={() => handleRemoveSong(song._id)}
                                                onMoveUp={() => handleMoveUp(index)}
                                                onMoveDown={() => handleMoveDown(index)}
                                                canMoveUp={index > 0}
                                                canMoveDown={index < (currentPlaylist?.songs?.length ?? 0) - 1}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </SectionErrorBoundary>
            </ScrollArea>
        </main>
    );
};
export default PlaylistPage;
