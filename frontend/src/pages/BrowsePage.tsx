import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMusicStore } from '@/stores/MusicStore';
import { usePlayerStore } from '@/stores/PlayerStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader, Music2, Mic2, Radio, Grid3x3, List } from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';
import { CategoryCard } from '@/components/ui/CategoryCard';
import { VirtualScrollList } from '@/components/shared/VirtualScrollList';
import { SongRow } from '@/components/ui/SongRow';
import { CategoryCardSkeleton } from '@/components/skeletons/CategoryCardSkeleton';
import { useGenreTheme } from '@/utils/genreThemes';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useGridNavigation } from '@/hooks/useGridNavigation';
import { useAnnouncement } from '@/hooks/useAnnouncement';
import { axiosInstance } from '@/lib/axios';
import { measureGridPerformance } from '@/utils/gridPerformance';
import Topbar from '@/components/layout/TopBar';
import { Song } from '@/types';

// Genre configuration with gradients and emojis
const GENRE_CONFIG: Record<string, { gradient: string; icon: string }> = {
  Pop: { gradient: 'bg-gradient-to-br from-pink-500 to-rose-500', icon: '🎤' },
  Rock: { gradient: 'bg-gradient-to-br from-red-600 to-orange-600', icon: '🎸' },
  'K-Pop': { gradient: 'bg-gradient-to-br from-purple-500 to-pink-500', icon: '💜' },
  'Hip Hop': { gradient: 'bg-gradient-to-br from-yellow-500 to-orange-600', icon: '🎵' },
  Electronic: { gradient: 'bg-gradient-to-br from-blue-500 to-cyan-500', icon: '🎹' },
  Jazz: { gradient: 'bg-gradient-to-br from-amber-700 to-orange-800', icon: '🎺' },
  Classical: { gradient: 'bg-gradient-to-br from-indigo-600 to-purple-600', icon: '🎻' },
  'R&B': { gradient: 'bg-gradient-to-br from-fuchsia-600 to-pink-600', icon: '🎶' },
  Country: { gradient: 'bg-gradient-to-br from-green-700 to-emerald-800', icon: '🤠' },
  Latin: { gradient: 'bg-gradient-to-br from-red-500 to-pink-500', icon: '💃' },
  Indie: { gradient: 'bg-gradient-to-br from-teal-600 to-blue-600', icon: '🎧' },
  Metal: { gradient: 'bg-gradient-to-br from-gray-800 to-slate-900', icon: '🤘' },
  Folk: { gradient: 'bg-gradient-to-br from-amber-600 to-yellow-700', icon: '🪕' },
};

const BrowsePage = () => {
  const navigate = useNavigate();
  const { announce } = useAnnouncement();
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [displayCount, setDisplayCount] = useState(50);
  const { songs, fetchAlbums, fetchSongs, isLoading } = useMusicStore();
  const { setCurrentSong, currentSong, isPlaying } = usePlayerStore();
  const genreTheme = useGenreTheme(selectedGenre);

  useEffect(() => {
    fetchAlbums();
    fetchSongs();
  }, [fetchAlbums, fetchSongs]);

  // Group songs by genre
  const genreSongs = songs.reduce((acc, song) => {
    const genre = song.genre || 'Other';
    if (!acc[genre]) acc[genre] = [];
    acc[genre].push(song);
    return acc;
  }, {} as Record<string, typeof songs>);

  const genres = Object.keys(genreSongs).sort();

  // Filter songs based on selected genre
  const allFilteredSongs = selectedGenre ? genreSongs[selectedGenre] || [] : songs;

  // Paginated songs for infinite scroll in grid view
  const displayedSongs = viewType === 'grid'
    ? allFilteredSongs.slice(0, displayCount)
    : allFilteredSongs;

  const hasMore = displayCount < allFilteredSongs.length;

  const loadMoreSongs = () => {
    setDisplayCount(prev => Math.min(prev + 50, allFilteredSongs.length));
  };

  const loadMoreRef = useInfiniteScroll({
    loadMore: loadMoreSongs,
    hasMore: hasMore && viewType === 'grid',
    threshold: 0.5,
  });

  // Reset display count when genre changes
  useEffect(() => {
    setDisplayCount(50);
  }, [selectedGenre]);

  // Measure grid performance
  useEffect(() => {
    if (!selectedGenre) return;
    const cleanup = measureGridPerformance(`browse-${selectedGenre.toLowerCase()}`);
    return cleanup;
  }, [selectedGenre, displayedSongs.length]);

  const handleGenreClick = async (genre: string) => {
    const isSelecting = genre !== selectedGenre;
    setSelectedGenre(isSelecting ? genre : null);

    // Screen reader announcement
    if (isSelecting) {
      const songCount = genreSongs[genre]?.length || 0;
      announce(`${genre} genre selected. Showing ${songCount} songs.`, 'polite');

      // Track genre click event
      try {
        await axiosInstance.post('/analytics/track-event', {
          event: 'genre_click',
          properties: {
            genre,
            page: 'browse',
            songCount,
            timestamp: new Date().toISOString(),
          },
        });
      } catch (error) {
        console.error('Failed to track genre click:', error);
      }
    } else {
      announce('Genre filter cleared. Showing all genres.', 'polite');
    }
  };

  // Grid keyboard navigation
  const { focusedIndex, handleKeyDown, containerRef } = useGridNavigation({
    itemCount: genres.length,
    columns: 4, // lg breakpoint columns
    onSelect: (index) => handleGenreClick(genres[index]),
    enabled: !selectedGenre,
  });

  const handleSongClick = (song: Song) => {
    setCurrentSong(song);
  };

  return (
    <div className="h-full flex flex-col rounded-lg overflow-hidden bg-transparent">
      <Topbar />
      <PageTransition>
        <ScrollArea className="h-full flex-1">
          <div className="p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
              {isLoading ? (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="h-10 w-64 skeleton-shimmer rounded" />
                    <CategoryCardSkeleton count={3} size="large" />
                  </div>
                  <div className="space-y-4">
                    <div className="h-8 w-48 skeleton-shimmer rounded" />
                    <CategoryCardSkeleton count={12} />
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Start Browsing Section */}
                  {!selectedGenre && (
                    <section>
                      <h2 className="text-3xl font-bold mb-6">Start browsing</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <CategoryCard
                          title="Music"
                          gradient="bg-gradient-to-br from-pink-500 to-rose-500"
                          icon={<Music2 className="w-16 h-16" />}
                          size="large"
                          index={0}
                          onClick={() => navigate('/home')}
                        />
                        <CategoryCard
                          title="Artists"
                          gradient="bg-gradient-to-br from-teal-600 to-emerald-600"
                          icon={<Mic2 className="w-16 h-16" />}
                          size="large"
                          index={1}
                          onClick={() => {
                            // Navigate to first artist from songs
                            if (songs.length > 0) {
                              navigate(`/artist/${encodeURIComponent(songs[0].artist)}`);
                            }
                          }}
                        />
                        <CategoryCard
                          title="Discover"
                          gradient="bg-gradient-to-br from-purple-600 to-violet-600"
                          icon={<Radio className="w-16 h-16" />}
                          size="large"
                          index={2}
                          onClick={() => navigate('/search')}
                        />
                      </div>
                    </section>
                  )}

                  {/* Browse All / Selected Genre Section */}
                  <section>
                    <div
                      className={`flex items-center justify-between mb-6 pb-4 border-b transition-colors ${selectedGenre ? genreTheme.borderAccent : 'border-border-subtle'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        {selectedGenre && (
                          <span className="text-4xl">{genreTheme.icon}</span>
                        )}
                        <h2
                          className={`text-3xl font-bold transition-colors ${selectedGenre ? genreTheme.textAccent : 'text-text-primary'
                            }`}
                        >
                          {selectedGenre ? `${selectedGenre} Music` : 'Browse all'}
                        </h2>
                      </div>
                      {selectedGenre && (
                        <button
                          onClick={() => setSelectedGenre(null)}
                          className="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium"
                        >
                          ← Back to all genres
                        </button>
                      )}
                    </div>

                    {/* Genre Grid */}
                    {!selectedGenre && (
                      <div
                        ref={containerRef}
                        role="grid"
                        aria-label="Music genres"
                        onKeyDown={handleKeyDown}
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8"
                      >
                        {genres.map((genre, index) => {
                          const config = GENRE_CONFIG[genre] || {
                            gradient: 'bg-gradient-to-br from-gray-700 to-gray-900',
                            icon: '🎵',
                          };
                          const isFocused = focusedIndex === index;
                          return (
                            <div key={genre} role="gridcell">
                              <CategoryCard
                                title={genre}
                                gradient={config.gradient}
                                icon={config.icon}
                                index={index}
                                data-grid-index={index}
                                tabIndex={isFocused ? 0 : -1}
                                data-focused={isFocused}
                                onClick={() => handleGenreClick(genre)}
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Songs Display */}
                    {selectedGenre && (
                      <div>
                        <div className="flex items-center justify-between mb-6">
                          <p className={`text-lg font-medium transition-colors ${genreTheme.textAccent}`}>
                            {displayedSongs.length} songs
                          </p>

                          {/* View Toggle */}
                          <div className={`flex items-center gap-2 rounded-lg p-1 ${genreTheme.bgAccent}`}>
                            <button
                              onClick={() => setViewType('grid')}
                              className={`p-2 rounded transition-colors ${viewType === 'grid'
                                ? `bg-gradient-to-r ${genreTheme.gradient} text-white`
                                : 'text-text-secondary hover:text-text-primary'
                                }`}
                              aria-label="Grid view"
                            >
                              <Grid3x3 className="size-4" />
                            </button>
                            <button
                              onClick={() => setViewType('list')}
                              className={`p-2 rounded transition-colors ${viewType === 'list'
                                ? `bg-gradient-to-r ${genreTheme.gradient} text-white`
                                : 'text-text-secondary hover:text-text-primary'
                                }`}
                              aria-label="List view"
                            >
                              <List className="size-4" />
                            </button>
                          </div>
                        </div>

                        {viewType === 'list' && displayedSongs.length > 50 ? (
                          /* Virtual Scrolling for large lists */
                          <VirtualScrollList
                            items={displayedSongs}
                            height={600}
                            itemHeight={72}
                            renderItem={(song, index) => (
                              <SongRow
                                song={song}
                                index={index}
                                isCurrentSong={currentSong?._id === song._id}
                                isPlaying={isPlaying}
                                onClick={() => handleSongClick(song)}
                              />
                            )}
                            className="rounded-lg overflow-hidden"
                          />
                        ) : viewType === 'list' ? (
                          /* Regular list for smaller collections */
                          <div className="space-y-2">
                            {displayedSongs.map((song, index) => (
                              <SongRow
                                key={song._id}
                                song={song}
                                index={index}
                                isCurrentSong={currentSong?._id === song._id}
                                isPlaying={isPlaying}
                                onClick={() => handleSongClick(song)}
                              />
                            ))}
                          </div>
                        ) : (
                          /* Grid view */
                          <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                              {displayedSongs.map((song) => (
                                <div
                                  key={song._id}
                                  className="group cursor-pointer"
                                  onClick={() => handleSongClick(song)}
                                >
                                  <div className="relative aspect-square mb-3 rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl group-hover:scale-[1.02] transition-all duration-300">
                                    <img
                                      src={song.imageUrl}
                                      alt={song.title}
                                      loading="lazy"
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                  </div>
                                  <h3 className="font-semibold truncate text-sm text-text-primary">
                                    {song.title}
                                  </h3>
                                  <p className="text-xs text-text-secondary truncate">{song.artist}</p>
                                </div>
                              ))}
                            </div>

                            {/* Infinite scroll trigger */}
                            {hasMore && (
                              <div ref={loadMoreRef} className="flex items-center justify-center py-8">
                                <Loader className="size-6 text-brand-primary animate-spin" />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </section>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </PageTransition>
    </div>
  );
};

export default BrowsePage;
