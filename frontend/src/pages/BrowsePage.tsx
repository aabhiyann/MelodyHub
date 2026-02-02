import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMusicStore } from '@/stores/MusicStore';
import { usePlayerStore } from '@/stores/PlayerStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader, Music2, Mic2, Radio } from 'lucide-react';
import { PageTransition } from '@/components/PageTransition';
import { CategoryCard } from '@/components/ui/CategoryCard';
import Topbar from '@/components/Topbar';
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
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const { songs, fetchAlbums, fetchSongs, isLoading } = useMusicStore();
  const { setCurrentSong, setQueue } = usePlayerStore();

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
  const displayedSongs = selectedGenre ? genreSongs[selectedGenre] || [] : songs;

  const handleGenreClick = (genre: string) => {
    setSelectedGenre(genre === selectedGenre ? null : genre);
  };

  const handleSongClick = (song: Song, index: number) => {
    setCurrentSong(song);
    setQueue(displayedSongs);
  };

  return (
    <div className="h-full flex flex-col rounded-lg overflow-hidden bg-transparent">
      <Topbar />
      <PageTransition>
        <ScrollArea className="h-full flex-1">
          <div className="p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-96">
                  <Loader className="size-8 text-brand-primary animate-spin" />
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
                          onClick={() => navigate('/home')}
                        />
                        <CategoryCard
                          title="Artists"
                          gradient="bg-gradient-to-br from-teal-600 to-emerald-600"
                          icon={<Mic2 className="w-16 h-16" />}
                          size="large"
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
                          onClick={() => navigate('/discovery')}
                        />
                      </div>
                    </section>
                  )}

                  {/* Browse All / Selected Genre Section */}
                  <section>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-3xl font-bold">
                        {selectedGenre ? `${selectedGenre} Music` : 'Browse all'}
                      </h2>
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
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                        {genres.map((genre) => {
                          const config = GENRE_CONFIG[genre] || {
                            gradient: 'bg-gradient-to-br from-gray-700 to-gray-900',
                            icon: '🎵',
                          };
                          return (
                            <CategoryCard
                              key={genre}
                              title={genre}
                              gradient={config.gradient}
                              icon={config.icon}
                              onClick={() => handleGenreClick(genre)}
                            />
                          );
                        })}
                      </div>
                    )}

                    {/* Songs Grid */}
                    {selectedGenre && (
                      <div>
                        <p className="text-text-secondary text-lg mb-6">
                          {displayedSongs.length} songs
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                          {displayedSongs.map((song, index) => (
                            <div
                              key={song._id}
                              className="group cursor-pointer"
                              onClick={() => handleSongClick(song, index)}
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
