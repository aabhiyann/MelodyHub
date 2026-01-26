/**
 * SearchPage - Spotify-inspired search interface with working backend integration
 * Features: Real-time search, debouncing, categorized results, advanced filters
 */

import { useState, useEffect, useCallback } from 'react';
import { Search as SearchIcon, Loader, Music, Disc3, User2, SlidersHorizontal, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import Topbar from '@/components/Topbar';
import { useMusicStore } from '@/stores/MusicStore';
import { usePlayerStore } from '@/stores/PlayerStore';
import type { Song } from '@/types';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const GENRES = [
    { name: 'All Genres', value: 'all' },
    { name: 'Pop', value: 'pop', color: 'from-pink-500 to-rose-500', emoji: '🎤' },
    { name: 'Rock', value: 'rock', color: 'from-red-500 to-orange-500', emoji: '🎸' },
    { name: 'K-Pop', value: 'k-pop', color: 'from-purple-500 to-pink-500', emoji: '💜' },
    { name: 'Hip Hop', value: 'hip hop', color: 'from-purple-500 to-indigo-500', emoji: '🎵' },
    { name: 'Electronic', value: 'electronic', color: 'from-cyan-500 to-blue-500', emoji: '⚡' },
    { name: 'Jazz', value: 'jazz', color: 'from-amber-500 to-yellow-500', emoji: '🎷' },
    { name: 'Classical', value: 'classical', color: 'from-violet-500 to-purple-500', emoji: '🎻' },
    { name: 'R&B', value: 'r&b', color: 'from-pink-600 to-purple-600', emoji: '💫' },
    { name: 'Country', value: 'country', color: 'from-orange-500 to-red-500', emoji: '🤠' },
    { name: 'Latin', value: 'latin', color: 'from-red-500 to-pink-500', emoji: '💃' },
    { name: 'Indie', value: 'indie', color: 'from-teal-500 to-green-500', emoji: '🌟' },
    { name: 'Metal', value: 'metal', color: 'from-gray-600 to-black', emoji: '🎭' },
    { name: 'Folk', value: 'folk', color: 'from-green-600 to-emerald-600', emoji: '🌲' },
];

const SORT_OPTIONS = [
    { name: 'Relevance', value: 'relevance' },
    { name: 'Most Popular', value: 'popularity' },
    { name: 'Recently Added', value: 'date' },
    { name: 'Title (A-Z)', value: 'title' },
    { name: 'Artist (A-Z)', value: 'artist' },
];

const SearchPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<Song[]>([]);
    const [selectedGenre, setSelectedGenre] = useState('all');
    const [sortBy, setSortBy] = useState('relevance');
    const [showFilters, setShowFilters] = useState(false);
    const { songs, albums, fetchSongs, fetchAlbums, isLoading } = useMusicStore();
    const { playAlbum } = usePlayerStore();

    useEffect(() => {
        if (songs.length === 0 || albums.length === 0) {
            fetchSongs();
            fetchAlbums();
        }
    }, [fetchSongs, fetchAlbums, songs.length, albums.length]);

    // Debounced search with filters
    const performSearch = useCallback(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        setSearching(true);
        const query = searchQuery.toLowerCase();

        // Search through songs
        let results = songs.filter(song =>
            song.title.toLowerCase().includes(query) ||
            song.artist.toLowerCase().includes(query) ||
            song.genre?.toLowerCase().includes(query)
        );

        // Apply genre filter
        if (selectedGenre !== 'all') {
            results = results.filter(song =>
                song.genre?.toLowerCase() === selectedGenre.toLowerCase()
            );
        }

        // Apply sorting
        switch (sortBy) {
            case 'popularity':
                results.sort((a, b) => (b.playCount || 0) - (a.playCount || 0));
                break;
            case 'date':
                results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
            case 'title':
                results.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'artist':
                results.sort((a, b) => a.artist.localeCompare(b.artist));
                break;
            // 'relevance' is default order from filter
        }

        setSearchResults(results);
        setSearching(false);
    }, [searchQuery, songs, selectedGenre, sortBy]);

    useEffect(() => {
        const timer = setTimeout(performSearch, 300);
        return () => clearTimeout(timer);
    }, [performSearch]);

    const handlePlaySong = (song: Song) => {
        const songIndex = songs.findIndex(s => s._id === song._id);
        playAlbum(songs, songIndex);
    };

    const handleClearFilters = () => {
        setSelectedGenre('all');
        setSortBy('relevance');
    };

    const hasActiveFilters = selectedGenre !== 'all' || sortBy !== 'relevance';

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
                                className='w-full h-14 pl-12 pr-4 rounded-full bg-surface-elevated/50 backdrop-blur-md border border-white/10 focus:border-brand-primary/50 text-white placeholder-text-secondary text-base transition-all focus:ring-4 focus:ring-brand-primary/20 outline-none shadow-lg'
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
                                    {GENRES.filter(g => g.value !== 'all').map((genre) => (
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

                    {/* Filter Bar */}
                    {searchQuery && (
                        <div className='flex flex-wrap items-center gap-3 p-4 rounded-xl glass-panel bg-surface-card/40'>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className='flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors'
                            >
                                <SlidersHorizontal className='size-4' />
                                <span>Filters</span>
                            </button>

                            <div className='flex-1' />

                            <div className='flex gap-2'>
                                {/* Genre Filter */}
                                <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                                    <SelectTrigger className='w-40 bg-white/10 border-white/10 text-white'>
                                        <SelectValue placeholder='Genre' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {GENRES.map((genre) => (
                                            <SelectItem key={genre.value} value={genre.value}>
                                                {genre.emoji && `${genre.emoji} `}{genre.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* Sort Dropdown */}
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className='w-48 bg-white/10 border-white/10 text-white'>
                                        <SelectValue placeholder='Sort by' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SORT_OPTIONS.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* Clear Filters */}
                                {hasActiveFilters && (
                                    <button
                                        onClick={handleClearFilters}
                                        className='flex items-center gap-1 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors'
                                    >
                                        <X className='size-4' />
                                        <span className='hidden md:inline'>Clear</span>
                                    </button>
                                )}
                            </div>
                        </div>
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
                                                            className='group relative p-4 rounded-xl bg-surface-card/40 hover:bg-surface-elevated/60 backdrop-blur-md border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:shadow-xl text-center'
                                                        >
                                                            <div className='relative aspect-square mb-3 rounded-full overflow-hidden shadow-lg border border-white/5 group-hover:border-brand-primary/30 transition-colors'>
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
                                                        className='group relative p-4 rounded-xl bg-surface-card/40 hover:bg-surface-elevated/60 backdrop-blur-md border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:shadow-xl cursor-pointer'
                                                    >
                                                        <div className='relative aspect-square mb-3 rounded-lg overflow-hidden shadow-lg'>
                                                            <img
                                                                src={album.imageUrl}
                                                                alt={album.title}
                                                                className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                                                            />
                                                        </div>
                                                        <h3 className='font-semibold truncate text-sm text-text-primary group-hover:text-brand-primary transition-colors'>
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
