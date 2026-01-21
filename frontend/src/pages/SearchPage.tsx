/**
 * SearchPage - Spotify-inspired search interface with working backend integration
 * Features: Real-time search, debouncing, categorized results
 */

import { useState, useEffect, useCallback } from 'react';
import { Search as SearchIcon, Clock, Loader, Music, Disc3, User2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import Topbar from '@/components/Topbar';
import { useMusicStore } from '@/stores/MusicStore';
import { usePlayerStore } from '@/stores/PlayerStore';
import type { Song } from '@/types';

const GENRES = [
    { name: 'Pop', color: 'from-pink-500 to-rose-500', emoji: '🎤' },
    { name: 'Rock', color: 'from-red-500 to-orange-500', emoji: '🎸' },
    { name: 'Hip Hop', color: 'from-purple-500 to-indigo-500', emoji: '🎵' },
    { name: 'Electronic', color: 'from-cyan-500 to-blue-500', emoji: '⚡' },
    { name: 'Jazz', color: 'from-amber-500 to-yellow-500', emoji: '🎷' },
    { name: 'Classical', color: 'from-violet-500 to-purple-500', emoji: '🎻' },
    { name: 'R&B', color: 'from-pink-600 to-purple-600', emoji: '💫' },
    { name: 'Country', color: 'from-orange-500 to-red-500', emoji: '🤠' },
    { name: 'Latin', color: 'from-red-500 to-pink-500', emoji: '💃' },
    { name: 'Indie', color: 'from-teal-500 to-green-500', emoji: '🌟' },
    { name: 'Metal', color: 'from-gray-600 to-black', emoji: '🎭' },
    { name: 'Folk', color: 'from-green-600 to-emerald-600', emoji: '🌲' },
];

const Search

Page = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<Song[]>([]);
    const { songs, albums } = useMusicStore();
    const { playAlbum } = usePlayerStore();

    // Debounced search
    const performSearch = useCallback(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        setSearching(true);
        const query = searchQuery.toLowerCase();

        // Search through songs
        const results = songs.filter(song =>
            song.title.toLowerCase().includes(query) ||
            song.artist.toLowerCase().includes(query) ||
            song.genre?.toLowerCase().includes(query)
        );

        setSearchResults(results);
        setSearching(false);
    }, [searchQuery, songs]);

    useEffect(() => {
        const timer = setTimeout(performSearch, 300);
        return () => clearTimeout(timer);
    }, [performSearch]);

    const handlePlaySong = (song: Song) => {
        const songIndex = songs.findIndex(s => s._id === song._id);
        playAlbum(songs, songIndex);
    };

    // Group results
    const songsResults = searchResults;
    const artistsResults = [...new Set(searchResults.map(s => s.artist))];
    const albumResults = albums.filter(album =>
        album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        album.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <main className='rounded-md overflow-hidden h-full bg-transparent'>
            <Topbar />
            <ScrollArea className='h-[calc(100vh-180px)]'>
                <div className='p-6 space-y-8'>
                    {/* Search Input */}
                    <div className='max-w-3xl'>
                        <div className='relative'>
                            <SearchIcon className='absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-400' />
                            <input
                                type='text'
                                placeholder='What do you want to listen to?'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className='w-full h-14 pl-12 pr-4 rounded-full bg-white/10 border-2 border-white/10 focus:border-white/30 text-white placeholder-zinc-400 text-base transition-all focus:ring-4 focus:ring-brand-primary/20 outline-none'
                                autoFocus
                            />
                            {searching && (
                                <Loader className='absolute right-4 top-1/2 -translate-y-1/2 size-5 text-brand-primary animate-spin' />
                            )}
                        </div>
                    </div>

                    {/* Empty State - Browse All */}
                    {!searchQuery && (
                        <>
                            {/* Browse All */}
                            <div>
                                <h2 className='text-2xl font-bold text-white mb-4'>Browse All</h2>
                                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
                                    {GENRES.map((genre) => (
                                        <button
                                            key={genre.name}
                                            onClick={() => setSearchQuery(genre.name)}
                                            className={`relative h-32 rounded-xl overflow-hidden bg-gradient-to-br ${genre.color} hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl group`}
                                        >
                                            <div className='absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors' />
                                            <div className='relative h-full p-4 flex flex-col justify-between'>
                                                <h3 className='text-xl font-bold text-white drop-shadow-lg'>
                                                    {genre.name}
                                                </h3>
                                                <div className='text-4xl opacity-80 group-hover:opacity-100 transition-opacity self-end transform rotate-12'>
                                                    {genre.emoji}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Search Results */}
                    {searchQuery && !searching && (
                        <div className='space-y-8'>
                            {searchResults.length === 0 ? (
                                <div className='text-center py-12'>
                                    <SearchIcon className='size-16 text-zinc-600 mx-auto mb-4' />
                                    <p className='text-zinc-400 text-lg'>
                                        No results found for "<span className='text-white font-semibold'>{searchQuery}</span>"
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Songs */}
                                    {songsResults.length > 0 && (
                                        <div>
                                            <div className='flex items-center gap-2 mb-4'>
                                                <Music className='size-6 text-brand-primary' />
                                                <h2 className='text-2xl font-bold text-white'>Songs</h2>
                                                <span className='text-zinc-400'>({songsResults.length})</span>
                                            </div>
                                            <div className='space-y-2'>
                                                {songsResults.slice(0, 10).map((song) => (
                                                    <div
                                                        key={song._id}
                                                        onClick={() => handlePlaySong(song)}
                                                        className='flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group'
                                                    >
                                                        <img
                                                            src={song.imageUrl}
                                                            alt={song.title}
                                                            className='size-14 rounded-md object-cover'
                                                        />
                                                        <div className='flex-1 min-w-0'>
                                                            <h3 className='text-white font-medium truncate group-hover:text-brand-primary transition-colors'>
                                                                {song.title}
                                                            </h3>
                                                            <p className='text-zinc-400 text-sm truncate'>{song.artist}</p>
                                                        </div>
                                                        {song.genre && (
                                                            <span className='px-3 py-1 rounded-full text-xs bg-white/10 text-zinc-300'>
                                                                {song.genre}
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Artists */}
                                    {artistsResults.length > 0 && (
                                        <div>
                                            <div className='flex items-center gap-2 mb-4'>
                                                <User2 className='size-6 text-brand-primary' />
                                                <h2 className='text-2xl font-bold text-white'>Artists</h2>
                                                <span className='text-zinc-400'>({artistsResults.length})</span>
                                            </div>
                                            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
                                                {artistsResults.slice(0, 12).map((artist) => {
                                                    const artistSong = songs.find(s => s.artist === artist);
                                                    return (
                                                        <button
                                                            key={artist}
                                                            onClick={() => setSearchQuery(artist)}
                                                            className='group text-center'
                                                        >
                                                            <div className='relative aspect-square mb-3 rounded-full overflow-hidden shadow-lg'>
                                                                {artistSong && (
                                                                    <img
                                                                        src={artistSong.imageUrl}
                                                                        alt={artist}
                                                                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                                                                    />
                                                                )}
                                                            </div>
                                                            <h3 className='font-semibold truncate text-sm group-hover:text-brand-primary transition-colors'>
                                                                {artist}
                                                            </h3>
                                                            <p className='text-xs text-text-secondary'>Artist</p>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Albums */}
                                    {albumResults.length > 0 && (
                                        <div>
                                            <div className='flex items-center gap-2 mb-4'>
                                                <Disc3 className='size-6 text-brand-primary' />
                                                <h2 className='text-2xl font-bold text-white'>Albums</h2>
                                                <span className='text-zinc-400'>({albumResults.length})</span>
                                            </div>
                                            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
                                                {albumResults.slice(0, 12).map((album) => (
                                                    <div
                                                        key={album._id}
                                                        className='group cursor-pointer'
                                                    >
                                                        <div className='relative aspect-square mb-3 rounded-lg overflow-hidden shadow-lg'>
                                                            <img
                                                                src={album.imageUrl}
                                                                alt={album.title}
                                                                className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                                                            />
                                                        </div>
                                                        <h3 className='font-semibold truncate text-sm'>
                                                            {album.title}
                                                        </h3>
                                                        <p className='text-xs text-text-secondary truncate'>
                                                            {album.artist}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </ScrollArea>
        </main>
    );
};

export default SearchPage;
