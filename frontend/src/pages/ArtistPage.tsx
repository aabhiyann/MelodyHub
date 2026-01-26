/**
 * ArtistPage - Artist profile page
 * Features: Artist info, top tracks, albums
 */

import { ScrollArea } from '@/components/ui/scroll-area';
import Topbar from '@/components/Topbar';
import { Music, Play, Heart, Disc3 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useMusicStore } from '@/stores/MusicStore';
import { usePlayerStore } from '@/stores/PlayerStore';
import { useEffect, useMemo } from 'react';

const ArtistPage = () => {
    const { artistId } = useParams();
    const { songs, albums, fetchSongs, fetchAlbums, isLoading } = useMusicStore();
    const { playAlbum } = usePlayerStore();

    // Assuming artistId in URL is the Artist Name (decoded)
    const artistName = artistId ? decodeURIComponent(artistId) : '';

    useEffect(() => {
        fetchSongs();
        fetchAlbums();
    }, [fetchSongs, fetchAlbums]);

    const artistSongs = useMemo(() => {
        return songs.filter(song => song.artist === artistName);
    }, [songs, artistName]);

    const artistAlbums = useMemo(() => {
        return albums.filter(album => album.artist === artistName);
    }, [albums, artistName]);

    const handlePlayArtist = () => {
        if (artistSongs.length > 0) {
            playAlbum(artistSongs, 0);
        }
    };

    if (isLoading) return null;

    if (!artistName) return <div>Artist not found</div>;

    const artistImage = artistSongs[0]?.imageUrl || artistAlbums[0]?.imageUrl;

    return (
        <main className='rounded-md relative overflow-hidden h-full bg-transparent'>
            {/* Blurred Background */}
            <div className='absolute inset-0 z-0'>
                <div
                    className='absolute inset-0 bg-cover bg-center blur-3xl opacity-50'
                    style={{ backgroundImage: `url(${artistImage})` }}
                />
                <div className='absolute inset-0 bg-gradient-to-b from-black/20 via-black/80 to-black' />
            </div>

            {/* Content */}
            <div className='relative z-10'>
                <Topbar />
                <ScrollArea className='h-[calc(100vh-180px)]'>
                    <div className='p-6 space-y-8'>
                        {/* Artist Header */}
                        <div className='flex flex-col md:flex-row items-center gap-8'>
                            <div className='size-56 rounded-full overflow-hidden shadow-2xl border-4 border-white/10'>
                                {artistImage ? (
                                    <img
                                        src={artistImage}
                                        alt={artistName}
                                        className='w-full h-full object-cover'
                                    />
                                ) : (
                                    <div className='w-full h-full bg-gradient-to-br from-brand-primary to-purple-600 flex items-center justify-center'>
                                        <Music className='size-24 text-white' />
                                    </div>
                                )}
                            </div>

                            <div className='flex-1 text-center md:text-left space-y-4'>
                                <div>
                                    <p className='text-sm text-zinc-300 font-medium uppercase tracking-widest mb-2'>Artist</p>
                                    <h1 className='text-5xl md:text-8xl font-black text-white tracking-tight mb-4 drop-shadow-lg'>
                                        {artistName}
                                    </h1>
                                </div>
                                <div className='flex items-center gap-4 justify-center md:justify-start text-zinc-300'>
                                    <span className='text-lg'>{artistSongs.length} Songs • {artistAlbums.length} Albums</span>
                                </div>

                                {/* Actions */}
                                <div className='flex items-center gap-4 justify-center md:justify-start pt-2'>
                                    <button
                                        onClick={handlePlayArtist}
                                        disabled={artistSongs.length === 0}
                                        className='flex items-center gap-2 px-8 py-4 rounded-full bg-brand-primary hover:bg-brand-primary/90 text-white font-bold transition-all hover:scale-105 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed'
                                    >
                                        <Play className='size-5 fill-current' />
                                        <span>Play</span>
                                    </button>
                                    <button className='p-4 rounded-full border border-white/20 hover:border-white/40 hover:bg-white/10 transition-all'>
                                        <Heart className='size-6 text-white' />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Content Sections */}
                        <div className='grid gap-12 mt-8'>
                            {/* Top Tracks */}
                            <div className='space-y-4'>
                                <h2 className='text-2xl font-bold text-white flex items-center gap-3'>
                                    <Music className='size-6 text-brand-primary' />
                                    Popular Tracks
                                </h2>
                                {artistSongs.length === 0 ? (
                                    <p className='text-zinc-400'>No tracks found for this artist.</p>
                                ) : (
                                    <div className='bg-white/5 rounded-xl border border-white/5 overflow-hidden'>
                                        {artistSongs.map((song, index) => (
                                            <div
                                                key={song._id}
                                                onClick={() => playAlbum(artistSongs, index)}
                                                className='group flex items-center gap-4 p-4 hover:bg-white/10 transition-colors cursor-pointer border-b border-white/5 last:border-0'
                                            >
                                                <span className='text-zinc-500 font-medium w-6 text-center group-hover:hidden'>{index + 1}</span>
                                                <Play className='size-4 text-white hidden group-hover:block w-6' />

                                                <img
                                                    src={song.imageUrl}
                                                    alt={song.title}
                                                    className='size-12 rounded-md object-cover shadow-sm'
                                                />

                                                <div className='flex-1 min-w-0'>
                                                    <p className='font-semibold text-white truncate group-hover:text-brand-primary transition-colors'>{song.title}</p>
                                                    <p className='text-sm text-zinc-400 truncate'>{song.albumId || 'Single'}</p>
                                                </div>

                                                <span className='text-sm text-zinc-500 hover:text-white transition-colors'>
                                                    {/* Duration would go here */}
                                                    3:45
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Albums */}
                            <div className='space-y-4'>
                                <h2 className='text-2xl font-bold text-white flex items-center gap-3'>
                                    <Disc3 className='size-6 text-brand-primary' />
                                    Discography
                                </h2>
                                {artistAlbums.length === 0 ? (
                                    <div className='p-8 rounded-xl bg-white/5 border border-white/5 text-center'>
                                        <p className='text-zinc-400'>No albums found.</p>
                                    </div>
                                ) : (
                                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6'>
                                        {artistAlbums.map((album) => (
                                            <div key={album._id} className='group cursor-pointer space-y-3'>
                                                <div className='relative aspect-square rounded-xl overflow-hidden shadow-lg bg-zinc-800'>
                                                    <img
                                                        src={album.imageUrl}
                                                        alt={album.title}
                                                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                                                    />
                                                    <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                                                        <div className='p-3 bg-brand-primary rounded-full shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform'>
                                                            <Play className='size-6 fill-white text-white' />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className='font-bold text-white truncate group-hover:text-brand-primary transition-colors'>{album.title}</p>
                                                    <p className='text-sm text-zinc-400'>Album • {album.releaseYear}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </div>
        </main>
    );
};

export default ArtistPage;
