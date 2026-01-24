/**
 * LibraryPage - User's music collection
 * Features: Playlists/Artists/Albums/Liked tabs with full functionality
 */

import { useState, useEffect } from 'react';
import { Heart, ListMusic, Mic2, Disc3, Grid3x3, List, SlidersHorizontal, Plus, Pencil, Trash2, Share2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import Topbar from '@/components/Topbar';
import { useMusicStore } from '@/stores/MusicStore';
import { usePlayerStore } from '@/stores/PlayerStore';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { axiosInstance } from '@/lib/axios';
import { Song } from '@/types';
import toast from 'react-hot-toast';
import { PlaylistShareModal } from '@/components/PlaylistShareModal';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type TabType = 'playlists' | 'artists' | 'albums' | 'liked';
type ViewType = 'grid' | 'list';

interface Playlist {
    _id: string;
    name: string;
    description?: string;
    songs: Song[];
    createdAt: string;
    isPublic?: boolean;
}

const LibraryPage = () => {
    const [activeTab, setActiveTab] = useState<TabType>('playlists');
    const [viewType, setViewType] = useState<ViewType>('grid');
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [likedSongs, setLikedSongs] = useState<Song[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Edit/Delete/Share state
    const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
    const [deletingPlaylist, setDeletingPlaylist] = useState<Playlist | null>(null);
    const [sharingPlaylist, setSharingPlaylist] = useState<Playlist | null>(null);
    const [editName, setEditName] = useState('');

    // Create state
    const [isCreating, setIsCreating] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');

    const { albums, songs } = useMusicStore();
    const { playAlbum } = usePlayerStore();

    const tabs = [
        { id: 'playlists', label: 'Playlists', icon: ListMusic },
        { id: 'artists', label: 'Artists', icon: Mic2 },
        { id: 'albums', label: 'Albums', icon: Disc3 },
        { id: 'liked', label: 'Liked Songs', icon: Heart },
    ];

    // Fetch playlists
    useEffect(() => {
        if (activeTab === 'playlists') {
            fetchPlaylists();
        }
    }, [activeTab]);

    // Fetch liked songs
    useEffect(() => {
        if (activeTab === 'liked') {
            fetchLikedSongs();
        }
    }, [activeTab]);

    const fetchPlaylists = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get('/social/playlists');
            setPlaylists(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch playlists:', error);
            setPlaylists([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchLikedSongs = async () => {
        setIsLoading(true);
        try {
            const liked = songs.filter(song => song.likeCount && song.likeCount > 0);
            setLikedSongs(liked);
        } catch (error) {
            console.error('Failed to fetch liked songs:', error);
            setLikedSongs([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreatePlaylist = () => {
        setIsCreating(true);
        setNewPlaylistName('');
    };

    const confirmCreatePlaylist = async () => {
        if (!newPlaylistName.trim()) return;

        try {
            await axiosInstance.post('/social/playlists', { name: newPlaylistName.trim() });
            toast.success('Playlist created!');
            setIsCreating(false);
            fetchPlaylists();
        } catch (error) {
            toast.error('Failed to create playlist');
        }
    };

    const handleEditPlaylist = async () => {
        if (!editingPlaylist || !editName.trim()) return;

        try {
            await axiosInstance.put(`/social/playlists/${editingPlaylist._id}`, {
                name: editName.trim()
            });
            toast.success('Playlist updated!');
            setEditingPlaylist(null);
            setEditName('');
            fetchPlaylists();
        } catch (error) {
            toast.error('Failed to update playlist');
        }
    };

    const handleDeletePlaylist = async () => {
        if (!deletingPlaylist) return;

        try {
            await axiosInstance.delete(`/social/playlists/${deletingPlaylist._id}`);
            toast.success('Playlist deleted!');
            setDeletingPlaylist(null);
            fetchPlaylists();
        } catch (error) {
            toast.error('Failed to delete playlist');
        }
    };

    // Group songs by artist
    const artistsData = songs.reduce((acc, song) => {
        if (!acc[song.artist]) {
            acc[song.artist] = {
                name: song.artist,
                songs: [],
                imageUrl: song.imageUrl
            };
        }
        acc[song.artist].songs.push(song);
        return acc;
    }, {} as Record<string, { name: string; songs: Song[]; imageUrl: string }>);

    const artists = Object.values(artistsData);

    const handlePlaySongs = (songsList: Song[], index = 0) => {
        playAlbum(songsList, index);
    };

    return (
        <main className='rounded-md overflow-hidden h-full bg-transparent'>
            <Topbar />
            <ScrollArea className='h-[calc(100vh-180px)]'>
                <div className='p-6 space-y-6'>
                    {/* Header */}
                    <div>
                        <h1 className='text-4xl md:text-5xl font-bold text-white mb-2'>Your Library</h1>
                        <p className='text-zinc-400'>All your music in one place</p>
                    </div>

                    {/* Tabs */}
                    <div className='flex items-center gap-2 border-b border-white/10 overflow-x-auto pb-2'>
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as TabType)}
                                    className={cn(
                                        'flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap',
                                        activeTab === tab.id
                                            ? 'bg-white/10 text-white font-semibold'
                                            : 'text-zinc-400 hover:text-white hover:bg-white/5'
                                    )}
                                >
                                    <Icon className='size-4' />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Controls */}
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                            {activeTab === 'playlists' && (
                                <button
                                    onClick={handleCreatePlaylist}
                                    className='flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-primary hover:bg-brand-primary/90 text-white transition-colors'
                                >
                                    <Plus className='size-4' />
                                    <span className='hidden md:inline'>New Playlist</span>
                                </button>
                            )}
                            <button className='flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors'>
                                <SlidersHorizontal className='size-4' />
                                <span className='hidden md:inline'>Filter</span>
                            </button>
                        </div>

                        {/* View Toggle */}
                        <div className='flex items-center gap-1 bg-white/5 rounded-lg p-1'>
                            <button
                                onClick={() => setViewType('grid')}
                                className={cn(
                                    'p-2 rounded-md transition-colors',
                                    viewType === 'grid'
                                        ? 'bg-white/20 text-white'
                                        : 'text-zinc-400 hover:text-white'
                                )}
                            >
                                <Grid3x3 className='size-4' />
                            </button>
                            <button
                                onClick={() => setViewType('list')}
                                className={cn(
                                    'p-2 rounded-md transition-colors',
                                    viewType === 'list'
                                        ? 'bg-white/20 text-white'
                                        : 'text-zinc-400 hover:text-white'
                                )}
                            >
                                <List className='size-4' />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div>
                        {/* Playlists Tab */}
                        {activeTab === 'playlists' && (
                            <div>
                                {isLoading ? (
                                    <div className='text-center py-12 text-zinc-400'>Loading...</div>
                                ) : playlists.length === 0 ? (
                                    <div className='text-center py-16'>
                                        <div className='inline-flex items-center justify-center size-20 rounded-full bg-white/10 mb-4'>
                                            <ListMusic className='size-10 text-zinc-400' />
                                        </div>
                                        <h3 className='text-xl font-semibold text-white mb-2'>No Playlists Yet</h3>
                                        <p className='text-zinc-400'>Create your first playlist to see it here</p>
                                    </div>
                                ) : viewType === 'grid' ? (
                                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
                                        {playlists.map((playlist) => (
                                            <div
                                                key={playlist._id}
                                                className='group space-y-3'
                                            >
                                                <div
                                                    className='relative aspect-square rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 cursor-pointer'
                                                    onClick={() => playlist.songs && handlePlaySongs(playlist.songs)}
                                                >
                                                    <div className='w-full h-full flex items-center justify-center'>
                                                        <ListMusic className='size-16 text-brand-primary' />
                                                    </div>
                                                    {/* Edit/Delete/Share buttons */}
                                                    <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1'>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSharingPlaylist(playlist);
                                                            }}
                                                            className='p-2 rounded-lg bg-zinc-900/50 hover:bg-zinc-900/80 backdrop-blur-sm'
                                                            title="Share Playlist"
                                                        >
                                                            <Share2 className='size-4 text-white' />
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setEditingPlaylist(playlist);
                                                                setEditName(playlist.name);
                                                            }}
                                                            className='p-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm'
                                                            title="Edit Playlist"
                                                        >
                                                            <Pencil className='size-4 text-white' />
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setDeletingPlaylist(playlist);
                                                            }}
                                                            className='p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 backdrop-blur-sm'
                                                            title="Delete Playlist"
                                                        >
                                                            <Trash2 className='size-4 text-red-400' />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className='font-semibold text-white truncate'>{playlist.name}</p>
                                                    <p className='text-sm text-zinc-400 truncate'>{playlist.songs?.length || 0} songs</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className='space-y-2'>
                                        {playlists.map((playlist) => (
                                            <div
                                                key={playlist._id}
                                                className='flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 transition-colors group'
                                            >
                                                <div
                                                    className='size-14 rounded-md bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 flex items-center justify-center cursor-pointer'
                                                    onClick={() => playlist.songs && handlePlaySongs(playlist.songs)}
                                                >
                                                    <ListMusic className='size-6 text-brand-primary' />
                                                </div>
                                                <div className='flex-1 min-w-0'>
                                                    <p className='font-semibold text-white truncate'>{playlist.name}</p>
                                                    <p className='text-sm text-zinc-400 truncate'>Playlist • {playlist.songs?.length || 0} songs</p>
                                                </div>
                                                {/* Edit/Delete/Share buttons */}
                                                <div className='opacity-0 group-hover:opacity-100 transition-opacity flex gap-2'>
                                                    <button
                                                        onClick={() => setSharingPlaylist(playlist)}
                                                        className='p-2 rounded-lg bg-white/10 hover:bg-white/20'
                                                        title="Share Playlist"
                                                    >
                                                        <Share2 className='size-4 text-white' />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setEditingPlaylist(playlist);
                                                            setEditName(playlist.name);
                                                        }}
                                                        className='p-2 rounded-lg bg-white/10 hover:bg-white/20'
                                                        title="Edit Playlist"
                                                    >
                                                        <Pencil className='size-4 text-white' />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeletingPlaylist(playlist)}
                                                        className='p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20'
                                                        title="Delete Playlist"
                                                    >
                                                        <Trash2 className='size-4 text-red-400' />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Artists Tab */}
                        {activeTab === 'artists' && (
                            <div>
                                {artists.length === 0 ? (
                                    <div className='text-center py-16'>
                                        <div className='inline-flex items-center justify-center size-20 rounded-full bg-white/10 mb-4'>
                                            <Mic2 className='size-10 text-zinc-400' />
                                        </div>
                                        <h3 className='text-xl font-semibold text-white mb-2'>No Artists Found</h3>
                                        <p className='text-zinc-400'>Play some music to see artists here</p>
                                    </div>
                                ) : viewType === 'grid' ? (
                                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
                                        {artists.map((artist) => (
                                            <div
                                                key={artist.name}
                                                className='group space-y-3 cursor-pointer'
                                                onClick={() => handlePlaySongs(artist.songs)}
                                            >
                                                <div className='relative aspect-square rounded-full overflow-hidden shadow-lg hover:shadow-2xl transition-shadow'>
                                                    <img
                                                        src={artist.imageUrl}
                                                        alt={artist.name}
                                                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                                                    />
                                                </div>
                                                <div className='text-center'>
                                                    <p className='font-semibold text-white truncate'>{artist.name}</p>
                                                    <p className='text-sm text-zinc-400'>Artist • {artist.songs.length} songs</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className='space-y-2'>
                                        {artists.map((artist) => (
                                            <div
                                                key={artist.name}
                                                className='flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 transition-colors group cursor-pointer'
                                                onClick={() => handlePlaySongs(artist.songs)}
                                            >
                                                <img
                                                    src={artist.imageUrl}
                                                    alt={artist.name}
                                                    className='size-14 rounded-full object-cover'
                                                />
                                                <div className='flex-1 min-w-0'>
                                                    <p className='font-semibold text-white truncate'>{artist.name}</p>
                                                    <p className='text-sm text-zinc-400 truncate'>Artist • {artist.songs.length} songs</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Albums Tab */}
                        {activeTab === 'albums' && (
                            <>
                                {viewType === 'grid' ? (
                                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
                                        {albums.map((album) => (
                                            <Link
                                                key={album._id}
                                                to={`/albums/${album._id}`}
                                                className='group space-y-3'
                                            >
                                                <div className='relative aspect-square rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow'>
                                                    <img
                                                        src={album.imageUrl}
                                                        alt={album.title}
                                                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                                                    />
                                                </div>
                                                <div>
                                                    <p className='font-semibold text-white truncate'>{album.title}</p>
                                                    <p className='text-sm text-zinc-400 truncate'>{album.artist}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className='space-y-2'>
                                        {albums.map((album) => (
                                            <Link
                                                key={album._id}
                                                to={`/albums/${album._id}`}
                                                className='flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 transition-colors group'
                                            >
                                                <img
                                                    src={album.imageUrl}
                                                    alt={album.title}
                                                    className='size-14 rounded-md object-cover'
                                                />
                                                <div className='flex-1 min-w-0'>
                                                    <p className='font-semibold text-white truncate'>{album.title}</p>
                                                    <p className='text-sm text-zinc-400 truncate'>Album • {album.artist}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                        {/* Liked Songs Tab */}
                        {activeTab === 'liked' && (
                            <div>
                                {isLoading ? (
                                    <div className='text-center py-12 text-zinc-400'>Loading...</div>
                                ) : likedSongs.length === 0 ? (
                                    <div className='text-center py-16'>
                                        <div className='inline-flex items-center justify-center size-20 rounded-full bg-white/10 mb-4'>
                                            <Heart className='size-10 text-zinc-400' />
                                        </div>
                                        <h3 className='text-xl font-semibold text-white mb-2'>No Liked Songs</h3>
                                        <p className='text-zinc-400'>Like songs to build your collection</p>
                                    </div>
                                ) : (
                                    <div className='space-y-2'>
                                        {likedSongs.map((song, index) => (
                                            <div
                                                key={song._id}
                                                onClick={() => handlePlaySongs(likedSongs, index)}
                                                className='flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group'
                                            >
                                                <img
                                                    src={song.imageUrl}
                                                    alt={song.title}
                                                    className='size-14 rounded-md object-cover'
                                                />
                                                <div className='flex-1 min-w-0'>
                                                    <p className='font-semibold text-white truncate group-hover:text-brand-primary transition-colors'>
                                                        {song.title}
                                                    </p>
                                                    <p className='text-sm text-zinc-400 truncate'>{song.artist}</p>
                                                </div>
                                                <Heart className='size-5 text-brand-primary fill-brand-primary' />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </ScrollArea>

            {/* Share Playlist Modal */}
            {sharingPlaylist && (
                <PlaylistShareModal
                    isOpen={!!sharingPlaylist}
                    onClose={() => setSharingPlaylist(null)}
                    playlistId={sharingPlaylist._id}
                    playlistName={sharingPlaylist.name}
                    isPublicInitial={sharingPlaylist.isPublic || false}
                />
            )}

            {/* Create Playlist Dialog */}
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Playlist</DialogTitle>
                        <DialogDescription>
                            Enter a name for your playlist
                        </DialogDescription>
                    </DialogHeader>
                    <Input
                        value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                        placeholder="Playlist name"
                        onKeyDown={(e) => e.key === 'Enter' && confirmCreatePlaylist()}
                    />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreating(false)}>
                            Cancel
                        </Button>
                        <Button onClick={confirmCreatePlaylist}>Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Playlist Dialog */}
            <Dialog open={!!editingPlaylist} onOpenChange={() => setEditingPlaylist(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Playlist</DialogTitle>
                        <DialogDescription>
                            Update your playlist name
                        </DialogDescription>
                    </DialogHeader>
                    <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Playlist name"
                        onKeyDown={(e) => e.key === 'Enter' && handleEditPlaylist()}
                    />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingPlaylist(null)}>
                            Cancel
                        </Button>
                        <Button onClick={handleEditPlaylist}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deletingPlaylist} onOpenChange={() => setDeletingPlaylist(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Playlist?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{deletingPlaylist?.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeletePlaylist} className="bg-red-600 hover:bg-red-700">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </main>
    );
};

export default LibraryPage;
