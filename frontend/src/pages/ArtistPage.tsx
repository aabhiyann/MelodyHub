/**
 * ArtistPage - Artist profile page
 * Features: Artist info, top tracks, albums
 */

import { ScrollArea } from '@/components/ui/scroll-area';
import { SongRow } from '@/components/ui/SongRow';
import { SongRowSkeleton } from '@/components/skeletons/SongRowSkeleton';
import { AlbumCard } from '@/components/ui/AlbumCard';
import Topbar from '@/components/layout/TopBar';
import { Music, Play, Heart, Disc3 } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMusicStore } from '@/stores/MusicStore';
import { usePlayerStore } from '@/stores/PlayerStore';
import { useEffect, useMemo } from 'react';

const ArtistPage = () => {
  const navigate = useNavigate();
  const { artistId } = useParams();
  const { songs, albums, fetchSongs, fetchAlbums, isLoading } = useMusicStore();
  const { playAlbum, currentSong, isPlaying } = usePlayerStore();

  // Assuming artistId in URL is the Artist Name (decoded)
  const artistName = artistId ? decodeURIComponent(artistId) : '';

  useEffect(() => {
    fetchSongs();
    fetchAlbums();
  }, [fetchSongs, fetchAlbums]);

  const artistSongs = useMemo(() => {
    return songs.filter((song) => song.artist === artistName);
  }, [songs, artistName]);

  const artistAlbums = useMemo(() => {
    return albums.filter((album) => album.artist === artistName);
  }, [albums, artistName]);

  const handlePlayArtist = () => {
    if (artistSongs.length > 0) {
      playAlbum(artistSongs, 0);
    }
  };

  if (isLoading) {
    return (
      <main className="rounded-md relative overflow-hidden h-full bg-transparent">
        <Topbar />
        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="p-6 space-y-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="size-56 rounded-full skeleton-shimmer" />
              <div className="flex-1 space-y-4">
                <div className="h-24 w-3/4 skeleton-shimmer rounded" />
                <div className="h-6 w-1/2 skeleton-shimmer rounded" />
              </div>
            </div>
            <SongRowSkeleton count={10} />
          </div>
        </ScrollArea>
      </main>
    );
  }

  if (!artistName) return <div>Artist not found</div>;

  // After data loads, if this artist has no songs AND no albums, they don't exist
  if (!isLoading && artistSongs.length === 0 && artistAlbums.length === 0) {
    return (
      <main className="rounded-md relative overflow-hidden h-full bg-transparent">
        <Topbar />
        <div className="h-full flex flex-col items-center justify-center gap-4 p-8 text-center">
          <Music className="size-16 text-white/20" />
          <h2 className="text-xl font-semibold text-white">Artist not found</h2>
          <p className="text-sm text-text-secondary">
            We couldn't find any music for "{artistName}". They may have been removed or the URL may be incorrect.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm text-white transition-colors"
          >
            Go Back
          </button>
        </div>
      </main>
    );
  }

  const artistImage = artistSongs[0]?.imageUrl || artistAlbums[0]?.imageUrl;

  return (
    <main className="rounded-md relative overflow-hidden h-full bg-transparent">
      {/* Blurred Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center blur-3xl opacity-50"
          style={{ backgroundImage: `url(${artistImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/80 to-black" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Topbar />
        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="p-6 space-y-8">
            {/* Artist Header */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="size-56 rounded-full overflow-hidden shadow-2xl border-4 border-white/10">
                {artistImage ? (
                  <img src={artistImage} alt={artistName} className="w-full h-full object-cover" loading="lazy" onError={(e) => { e.currentTarget.src = '/placeholder-album.svg'; }} />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-brand-primary to-blue-600 flex items-center justify-center">
                    <Music className="size-24 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1 text-center md:text-left space-y-4 min-w-0">
                <div className="min-w-0">
                  <p className="text-sm text-text-secondary font-medium uppercase tracking-widest mb-2">
                    Artist
                  </p>
                  <h1 className="text-5xl md:text-8xl font-black text-white tracking-tight mb-4 drop-shadow-lg truncate max-w-full">
                    {artistName}
                  </h1>
                </div>
                <div className="flex items-center gap-4 justify-center md:justify-start text-text-secondary">
                  <span className="text-lg">
                    {artistSongs.length} Songs • {artistAlbums.length} Albums
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 justify-center md:justify-start pt-2">
                  <button
                    onClick={handlePlayArtist}
                    disabled={artistSongs.length === 0}
                    className="flex items-center gap-2 px-8 py-4 rounded-full bg-brand-primary hover:bg-brand-primary/90 text-white font-bold transition-all hover:scale-105 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Play className="size-5 fill-current" />
                    <span>Play</span>
                  </button>
                  <button className="p-4 rounded-full border border-white/20 hover:border-white/40 hover:bg-white/10 transition-all">
                    <Heart className="size-6 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <div className="grid gap-12 mt-8">
              {/* Top Tracks */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Music className="size-6 text-brand-primary" />
                  Popular Tracks
                </h2>
                {artistSongs.length === 0 ? (
                  <p className="text-text-tertiary">No tracks found for this artist.</p>
                ) : (
                  <div className="space-y-2">
                    {artistSongs.map((song, index) => (
                      <SongRow
                        key={song._id}
                        song={song}
                        index={index}
                        isCurrentSong={currentSong?._id === song._id}
                        isPlaying={isPlaying}
                        onClick={() => playAlbum(artistSongs, index)}
                        thumbnailSize="lg"
                        metadataContent={song.albumId || 'Single'}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Albums */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Disc3 className="size-6 text-brand-primary" />
                  Discography
                </h2>
                {artistAlbums.length === 0 ? (
                  <div className="p-8 rounded-xl bg-white/5 border border-white/5 text-center">
                    <p className="text-text-tertiary">No albums found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {artistAlbums.map((album, index) => (
                      <AlbumCard
                        key={album._id}
                        id={album._id}
                        title={album.title}
                        artist={album.artist}
                        imageUrl={album.imageUrl}
                        index={index}
                        onClick={() => navigate(`/albums/${album._id}`)}
                      />
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
