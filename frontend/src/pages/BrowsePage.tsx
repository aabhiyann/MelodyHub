import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMusicStore } from '@/stores/MusicStore';
import { usePlayerStore } from '@/stores/PlayerStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Music2, Mic2, Radio, Grid3x3, List } from 'lucide-react';
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
import HorizontalScrollSection from '@/pages/home/components/HorizontalScrollSection';
import { SpotifyCard } from '@/pages/home/components/SpotifyCard';
import { SectionRowSkeleton } from '@/pages/home/components/SectionRowSkeleton';
import { EmptyState } from '@/components/shared/EmptyState';

// Genre configuration with gradients and emojis
const GENRE_CONFIG: Record<string, { gradient: string; icon: string }> = {
  Pop: { gradient: 'bg-gradient-to-br from-pink-500 to-rose-500', icon: '🎤' },
  Rock: { gradient: 'bg-gradient-to-br from-red-600 to-orange-600', icon: '🎸' },
  'K-Pop': { gradient: 'bg-gradient-to-br from-rose-500 to-pink-500', icon: '💜' },
  'Hip Hop': { gradient: 'bg-gradient-to-br from-yellow-500 to-orange-600', icon: '🎵' },
  Electronic: { gradient: 'bg-gradient-to-br from-blue-500 to-cyan-500', icon: '🎹' },
  Jazz: { gradient: 'bg-gradient-to-br from-amber-700 to-orange-800', icon: '🎺' },
  Classical: { gradient: 'bg-gradient-to-br from-indigo-600 to-slate-700', icon: '🎻' },
  'R&B': { gradient: 'bg-gradient-to-br from-fuchsia-600 to-pink-600', icon: '🎶' },
  Country: { gradient: 'bg-gradient-to-br from-green-700 to-emerald-800', icon: '🤠' },
  Latin: { gradient: 'bg-gradient-to-br from-red-500 to-pink-500', icon: '💃' },
  Indie: { gradient: 'bg-gradient-to-br from-teal-600 to-blue-600', icon: '🎧' },
  Metal: { gradient: 'bg-gradient-to-br from-gray-800 to-slate-900', icon: '🤘' },
  Folk: { gradient: 'bg-gradient-to-br from-amber-600 to-yellow-700', icon: '🪕' },
};

// Normalize iTunes/varied genre names → GENRE_CONFIG keys
const GENRE_NORMALIZE: Record<string, string> = {
  // Pop
  'Pop': 'Pop', 'Pop Latino': 'Pop', 'Dance Pop': 'Pop',
  // Rock
  'Rock': 'Rock', 'Alternative': 'Rock', 'Hard Rock': 'Rock', 'Indie Rock': 'Rock', 'Punk': 'Rock',
  // K-Pop
  'K-Pop': 'K-Pop',
  // Hip Hop
  'Hip-Hop/Rap': 'Hip Hop', 'Hip-Hop': 'Hip Hop', 'Hip Hop': 'Hip Hop',
  'Rap': 'Hip Hop', 'Dirty South': 'Hip Hop',
  // Electronic
  'Electronic': 'Electronic', 'Electronica': 'Electronic', 'Dance': 'Electronic',
  'House': 'Electronic', 'Ambient': 'Electronic', 'New Age': 'Electronic',
  // Jazz
  'Jazz': 'Jazz', 'Smooth Jazz': 'Jazz',
  // Classical
  'Classical': 'Classical', 'Classical Crossover': 'Classical',
  'Piano': 'Classical', 'Soundtrack': 'Classical', 'Instrumental': 'Classical',
  // R&B
  'R&B/Soul': 'R&B', 'R&B': 'R&B',
  // Country
  'Country': 'Country',
  // Latin
  'Latin': 'Latin', 'Urbano latino': 'Latin', 'Música Mexicana': 'Latin',
  'Reggae': 'Latin', 'Música tropical': 'Latin', 'Modern Dancehall': 'Latin',
  // Indie
  'Indie': 'Indie', 'Singer/Songwriter': 'Indie', 'Folk-Rock': 'Indie',
  // Metal
  'Metal': 'Metal',
  // Folk
  'Folk': 'Folk', 'Traditional Folk': 'Folk',
  // Other
  'Nature': 'Folk', 'Christian': 'Folk', 'Contemporary Gospel': 'Folk',
  'Afrobeats': 'Latin', 'Fitness & Workout': 'Electronic',
  'Holiday': 'Pop', 'Musicals': 'Classical',
};

/** Normalize a raw genre string to match a GENRE_CONFIG key */
function normalizeGenre(rawGenre: string | undefined | null): string {
  if (!rawGenre) return 'Pop'; // Default fallback
  return GENRE_NORMALIZE[rawGenre] || GENRE_NORMALIZE[rawGenre.trim()] || 'Pop';
}

const BrowsePage = () => {
  const navigate = useNavigate();
  const { announce } = useAnnouncement();
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [displayCount, setDisplayCount] = useState(50);
  const { songs, featuredSongs, trendingSongs, fetchAlbums, fetchSongs, fetchFeaturedSongs, fetchTrendingSongs, isLoading } = useMusicStore();
  const { setCurrentSong, currentSong, isPlaying, playAlbum } = usePlayerStore();
  const genreTheme = useGenreTheme(selectedGenre);

  useEffect(() => {
    fetchAlbums();
    fetchSongs();
    fetchFeaturedSongs();
    fetchTrendingSongs();
  }, [fetchAlbums, fetchSongs, fetchFeaturedSongs, fetchTrendingSongs]);

  // Group songs by normalized genre
  const genreSongs = songs.reduce((acc, song) => {
    const genre = normalizeGenre(song.genre);
    if (!acc[genre]) acc[genre] = [];
    acc[genre].push(song);
    return acc;
  }, {} as Record<string, typeof songs>);

  // Use only GENRE_CONFIG keys for the genre grid (clean, curated list)
  const genres = Object.keys(GENRE_CONFIG);

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
              <div className="space-y-8">
                  {/* Featured / Trending row at top */}
                  {!selectedGenre && (
                    isLoading ? (
                      <SectionRowSkeleton cardCount={6} />
                    ) : (
                      <HorizontalScrollSection title="Trending Now" seeAllHref="/home" seeAllLabel="See all">
                        {(() => {
                          const featured = (featuredSongs?.length ? featuredSongs : trendingSongs?.length ? trendingSongs : songs).slice(0, 6);
                          if (featured.length === 0) {
                            return (
                              <div className="flex-shrink-0 w-full min-w-[280px] px-6">
                                <EmptyState message="No featured tracks yet" secondary="Explore genres to discover music." />
                              </div>
                            );
                          }
                          return featured.map((song) => (
                            <SpotifyCard
                              key={song._id}
                              imageUrl={song.imageUrl}
                              title={song.title}
                              description={song.artist}
                              onPlayClick={() => playAlbum([song], 0)}
                              width={160}
                            />
                          ));
                        })()}
                      </HorizontalScrollSection>
                    )
                  )}

                  {/* Start Browsing Section */}
                  {!selectedGenre && (
                    <section>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl md:text-2xl font-bold text-[#F9FAFB]">Start browsing</h2>
                        <button
                          type="button"
                          onClick={() => document.querySelector('[role="grid"]')?.scrollIntoView({ behavior: 'smooth' })}
                          className="text-sm font-medium text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors"
                        >
                          View all genres
                        </button>
                      </div>
                      {isLoading ? (
                        <CategoryCardSkeleton count={3} size="large" />
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <CategoryCard
                            title="Music"
                            gradient="bg-gradient-to-br from-pink-500 to-rose-500"
                            icon={<Music2 className="w-16 h-16" />}
                            size="large"
                            index={0}
                            onClick={() => document.querySelector('[role="grid"]')?.scrollIntoView({ behavior: 'smooth' })}
                          />
                          <CategoryCard
                            title="Artists"
                            gradient="bg-gradient-to-br from-teal-600 to-emerald-600"
                            icon={<Mic2 className="w-16 h-16" />}
                            size="large"
                            index={1}
                            onClick={() => {
                              if (songs.length > 0) navigate(`/artists/${encodeURIComponent(songs[0].artist)}`);
                            }}
                          />
                          <CategoryCard
                            title="Discover"
                            gradient="bg-gradient-to-br from-[#22C55E] to-[#16A34A]"
                            icon={<Radio className="w-16 h-16" />}
                            size="large"
                            index={2}
                            onClick={() => navigate('/radio')}
                          />
                        </div>
                      )}
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
                          className={`text-xl md:text-2xl font-bold transition-colors ${selectedGenre ? genreTheme.textAccent : 'text-[#F9FAFB]'
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
                      isLoading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                          {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="aspect-square rounded-[12px] bg-white/10 skeleton-shimmer" />
                          ))}
                        </div>
                      ) : (
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
                      )
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

                        {displayedSongs.length === 0 ? (
                          <div className="py-12">
                            <EmptyState
                              message="No songs in this genre"
                              secondary="Try another genre or check back later."
                            />
                          </div>
                        ) : viewType === 'list' && displayedSongs.length > 50 ? (
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
                                  <div className="relative aspect-square mb-3 rounded-[12px] overflow-hidden shadow-lg group-hover:shadow-xl group-hover:scale-[1.03] transition-all duration-200">
                                    <img
                                      src={song.imageUrl}
                                      alt={song.title}
                                      loading="lazy"
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                  </div>
                                  <h3 className="font-semibold truncate text-sm text-[#F9FAFB]">
                                    {song.title}
                                  </h3>
                                  <p className="text-xs text-[#9CA3AF] truncate">{song.artist}</p>
                                </div>
                              ))}
                            </div>

                            {/* Infinite scroll trigger */}
                            {hasMore && (
                              <div ref={loadMoreRef} className="flex items-center justify-center py-8">
                                <div className="h-10 w-32 rounded-lg bg-white/10 skeleton-shimmer" />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </section>
                </div>
            </div>
          </div>
        </ScrollArea>
      </PageTransition>
    </div>
  );
};

export default BrowsePage;
