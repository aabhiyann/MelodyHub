/**
 * SearchPage - Spotify-inspired search interface with working backend integration
 * Features: Real-time search, debouncing, categorized results, advanced filters
 */

import { useState, useEffect, useCallback } from 'react';
import {
  Search as SearchIcon,
  Loader,
  Music,
  Disc3,
  User2,
  Users,
  SlidersHorizontal,
  X,
  Play,
  ListPlus,
} from 'lucide-react';

import { ScrollArea } from '@/components/ui/scroll-area';
import { CategoryCard } from '@/components/ui/CategoryCard';
import Topbar from '@/components/layout/TopBar';
import { useMusicStore } from '@/stores/MusicStore';
import { usePlayerStore } from '@/stores/PlayerStore';
import { axiosInstance } from '@/lib/axios';
import type { Song } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SearchResultsSkeleton } from '@/components/shared/LoadingSkeletons';
import { EmptyState } from '@/components/shared/EmptyState';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AddToPlaylistDialog } from '@/components/features/playlist/AddToPlaylistDialog';


const GENRES = [
  { name: 'All Genres', value: 'all' },
  { name: 'Pop', value: 'pop', color: 'from-pink-500 to-rose-500', emoji: '🎤' },
  { name: 'Rock', value: 'rock', color: 'from-red-500 to-orange-500', emoji: '🎸' },
  { name: 'K-Pop', value: 'k-pop', color: 'from-rose-500 to-pink-500', emoji: '💜' },
  { name: 'Hip Hop', value: 'hip hop', color: 'from-amber-500 to-orange-500', emoji: '🎵' },
  { name: 'Electronic', value: 'electronic', color: 'from-cyan-500 to-blue-500', emoji: '⚡' },
  { name: 'Jazz', value: 'jazz', color: 'from-amber-500 to-yellow-500', emoji: '🎷' },
  { name: 'Classical', value: 'classical', color: 'from-indigo-600 to-slate-700', emoji: '🎻' },
  { name: 'R&B', value: 'r&b', color: 'from-fuchsia-600 to-pink-600', emoji: '💫' },
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
  const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState<string | null>(null);
  const { songs, albums, fetchSongs, fetchAlbums } = useMusicStore();
  const { setCurrentSong } = usePlayerStore();
  const navigate = useNavigate();

  interface AppUser { _id: string; clerkId: string; fullName: string; imageUrl?: string; }
  const [allUsers, setAllUsers] = useState<AppUser[]>([]);

  useEffect(() => {
    axiosInstance.get('/users').then(res => {
      const data = res.data?.data ?? res.data ?? [];
      setAllUsers(Array.isArray(data) ? data : []);
    }).catch(() => { });
  }, []);

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
    let results = songs.filter(
      (song) =>
        song.title.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query) ||
        song.genre?.toLowerCase().includes(query)
    );

    // Apply genre filter
    if (selectedGenre !== 'all') {
      results = results.filter((song) => song.genre?.toLowerCase() === selectedGenre.toLowerCase());
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

  const handleGenreClick = async (genreName: string) => {
    setSearchQuery(genreName);

    // Track genre click event
    try {
      await axiosInstance.post('/analytics/track-event', {
        event: 'genre_click',
        properties: {
          genre: genreName,
          page: 'search',
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error('Failed to track genre click:', error);
    }
  };

  const handlePlaySong = (song: Song) => {
    setCurrentSong(song);
  };

  const handleClearFilters = () => {
    setSelectedGenre('all');
    setSortBy('relevance');
  };

  const hasActiveFilters = selectedGenre !== 'all' || sortBy !== 'relevance';

  // Group results
  const songsResults = searchResults;
  const artistsResults = [...new Set(searchResults.map((s) => s.artist))];
  const albumResults = albums.filter(
    (album) =>
      album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      album.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const userResults = searchQuery.trim()
    ? allUsers.filter((u) => u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <main className="rounded-md overflow-hidden h-full bg-transparent">
      <Topbar />
      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="p-6 space-y-8">
          {/* Search Input */}
          <div className="max-w-3xl">
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-400" />
              <input
                type="text"
                placeholder="What do you want to listen to?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-full bg-white/5 hover:bg-white/10 focus:bg-white/10 backdrop-blur-md border border-white/10 focus:border-white/20 text-white placeholder-text-secondary text-sm transition-all focus:ring-2 focus:ring-brand-primary/30 outline-none shadow-lg"
                autoFocus
              />
              {searching && (
                <Loader className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-brand-primary animate-spin" />
              )}
            </div>
          </div>

          {/* Empty State - Browse All */}
          {!searchQuery && (
            <>
              {/* Browse All */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Browse All</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  {GENRES.filter((g) => g.value !== 'all').map((genre, index) => (
                    <CategoryCard
                      key={genre.name}
                      title={genre.name}
                      gradient={`bg-gradient-to-br ${genre.color}`}
                      icon={genre.emoji}
                      index={index}
                      onClick={() => handleGenreClick(genre.name)}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Filter Bar */}
          {searchQuery && (
            <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl glass-panel bg-surface-card/40">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <SlidersHorizontal className="size-4" />
                <span>Filters</span>
              </button>

              <div className="flex-1" />

              <div className="flex gap-2">
                {/* Genre Filter */}
                <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                  <SelectTrigger className="w-40 bg-white/10 border-white/10 text-white">
                    <SelectValue placeholder="Genre" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENRES.map((genre) => (
                      <SelectItem key={genre.value} value={genre.value}>
                        {genre.emoji && `${genre.emoji} `}
                        {genre.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Sort Dropdown */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 bg-white/10 border-white/10 text-white">
                    <SelectValue placeholder="Sort by" />
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
                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                  >
                    <X className="size-4" />
                    <span className="hidden md:inline">Clear</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Search Results */}
          {searchQuery && searching && <SearchResultsSkeleton />}
          {searchQuery && !searching && (
            <div className="space-y-8">
              {searchResults.length === 0 ? (
                <EmptyState
                  message={`No results found for "${searchQuery}"`}
                  secondary="Try a different search term or browse by genre."
                  icon={<SearchIcon className="size-16 text-[#6B7280]" />}
                  className="py-12"
                />
              ) : (

                <>
                  {/* Songs */}
                  {songsResults.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Music className="size-6 text-brand-primary" />
                        <h2 className="text-2xl font-bold text-white">Songs</h2>
                        <span className="text-zinc-400">({songsResults.length})</span>
                      </div>
                      <div className="space-y-2">
                        {songsResults.slice(0, 10).map((song) => (
                          <div
                            key={song._id}
                            onClick={() => handlePlaySong(song)}
                            className="flex items-center gap-4 min-h-[44px] p-3 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group relative"
                          >
                            <div className="relative size-14 rounded-md overflow-hidden shrink-0">
                              <img
                                src={song.imageUrl}
                                alt={song.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                onError={(e) => { e.currentTarget.src = '/placeholder-album.svg'; }}
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Play className="size-5 text-white fill-white ml-0.5" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-white font-medium truncate group-hover:text-brand-primary transition-colors">
                                {song.title}
                              </h3>
                              <p className="text-zinc-400 text-sm truncate">{song.artist}</p>
                            </div>
                            {song.genre && (
                              <span className="px-3 py-1 rounded-full text-xs bg-white/10 text-zinc-300 hidden sm:inline">
                                {song.genre}
                              </span>
                            )}
                            {/* Inline Add to Playlist button — always visible on mobile, hover-reveal on desktop */}
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedSongForPlaylist(song._id); }}
                              className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white shrink-0"
                              title="Add to playlist"
                            >
                              <ListPlus className="size-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      {/* AddToPlaylistDialog renders outside the rows to avoid event conflicts */}
                      {selectedSongForPlaylist && (
                        <AddToPlaylistDialog
                          songId={selectedSongForPlaylist}
                          open={true}
                          onOpenChange={(open) => { if (!open) setSelectedSongForPlaylist(null); }}
                        />
                      )}
                    </div>
                  )}


                  {/* Artists */}
                  {artistsResults.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <User2 className="size-6 text-brand-primary" />
                        <h2 className="text-2xl font-bold text-white">Artists</h2>
                        <span className="text-zinc-400">({artistsResults.length})</span>
                      </div>
                      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">

                        {artistsResults.slice(0, 12).map((artist) => {
                          const artistSong = songs.find((s) => s.artist === artist);
                          return (
                            <button
                              key={artist}
                              onClick={() => navigate(`/artists/${encodeURIComponent(artist)}`)}
                              className="group relative p-4 rounded-xl bg-surface-card/40 hover:bg-surface-elevated/60 backdrop-blur-md border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:shadow-xl text-center"
                            >
                              <div className="relative aspect-square mb-3 rounded-full overflow-hidden shadow-lg border border-white/5 group-hover:border-brand-primary/30 transition-colors">
                                {artistSong && (
                                  <img
                                    src={artistSong.imageUrl}
                                    alt={artist}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    loading="lazy"
                                    onError={(e) => { e.currentTarget.src = '/placeholder-album.svg'; }}
                                  />
                                )}
                              </div>
                              <h3 className="font-semibold truncate text-sm group-hover:text-brand-primary transition-colors">
                                {artist}
                              </h3>
                              <p className="text-xs text-text-secondary">Artist</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Members (user search) */}
                  {userResults.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Users className="size-6 text-brand-primary" />
                        <h2 className="text-2xl font-bold text-white">Members</h2>
                        <span className="text-zinc-400">({userResults.length})</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {userResults.slice(0, 8).map((user) => (
                          <button
                            key={user._id}
                            onClick={() => navigate(`/profile/${user.clerkId}`)}
                            className="flex items-center gap-3 p-3 rounded-xl bg-surface-card/40 hover:bg-surface-elevated/60 border border-white/5 hover:border-white/10 transition-all duration-200 hover:-translate-y-0.5 text-left group"
                          >
                            <Avatar className="size-12 flex-shrink-0 border border-white/10">
                              <AvatarImage src={user.imageUrl} alt={user.fullName} />
                              <AvatarFallback>{user.fullName?.[0] ?? '?'}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-white truncate group-hover:text-brand-primary transition-colors">
                                {user.fullName}
                              </p>
                              <p className="text-xs text-zinc-400">Member</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Albums */}
                  {albumResults.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Disc3 className="size-6 text-brand-primary" />
                        <h2 className="text-2xl font-bold text-white">Albums</h2>
                        <span className="text-zinc-400">({albumResults.length})</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                        {albumResults.slice(0, 12).map((album) => (
                          <div
                            key={album._id}
                            className="group relative p-4 rounded-xl bg-surface-card/40 hover:bg-surface-elevated/60 backdrop-blur-md border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:shadow-xl cursor-pointer"
                          >
                            <div className="relative aspect-square mb-3 rounded-lg overflow-hidden shadow-lg">
                              <img
                                src={album.imageUrl}
                                alt={album.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                                onError={(e) => { e.currentTarget.src = '/placeholder-album.svg'; }}
                              />
                            </div>
                            <h3 className="font-semibold truncate text-sm text-text-primary group-hover:text-brand-primary transition-colors">
                              {album.title}
                            </h3>
                            <p className="text-xs text-text-secondary truncate">{album.artist}</p>
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
