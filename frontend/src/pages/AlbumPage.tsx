import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SongRow } from '@/components/ui/SongRow';
import { useMusicStore } from '@/stores/MusicStore';
import { usePlayerStore } from '@/stores/PlayerStore';
import { Clock, Pause, Play, Disc } from 'lucide-react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const AlbumPage = () => {
  const { albumId } = useParams();
  const { fetchAlbumById, currentAlbum, isLoading } = useMusicStore();
  const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();

  useEffect(() => {
    if (albumId) fetchAlbumById(albumId);
  }, [fetchAlbumById, albumId]);

  if (isLoading) return null;

  const handlePlayAlbum = () => {
    if (!currentAlbum) return;

    const isCurrentAlbumPlaying = currentAlbum?.songs.some((song) => song._id === currentSong?._id);
    if (isCurrentAlbumPlaying) togglePlay();
    else {
      // start playing the album from the beginning
      playAlbum(currentAlbum?.songs, 0);
    }
  };

  const handlePlaySong = (index: number) => {
    if (!currentAlbum) return;

    playAlbum(currentAlbum?.songs, index);
  };

  return (
    <div className="h-full bg-transparent">
      <ScrollArea className="h-full rounded-md">
        {/* Main Content */}
        <div className="relative min-h-full">
          {/* bg gradient - Reduced for cleaner glass look */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-brand-primary/20 via-transparent to-transparent pointer-events-none"
            aria-hidden="true"
          />

          {/* Content */}
          <div className="relative z-10">
            <div className="flex p-6 gap-6 pb-8">
              <img
                src={currentAlbum?.imageUrl}
                alt={currentAlbum?.title}
                className="w-[240px] h-[240px] shadow-2xl rounded-lg ring-1 ring-white/10"
              />
              <div className="flex flex-col justify-end">
                <p className="text-sm font-medium text-text-secondary uppercase tracking-wider">
                  Album
                </p>
                <h1 className="text-5xl md:text-7xl font-bold my-4 text-white tracking-tight">
                  {currentAlbum?.title}
                </h1>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <span className="font-medium text-white">{currentAlbum?.artist}</span>
                  <span className="flex items-center text-text-secondary">
                    <Disc className="w-3 h-3 mx-2" /> {currentAlbum?.songs.length} songs
                  </span>
                  <span className="flex items-center text-text-secondary">
                    <span className="w-1 h-1 rounded-full bg-text-tertiary mx-2" />{' '}
                    {currentAlbum?.releaseYear}
                  </span>
                </div>
              </div>
            </div>

            {/* play button */}
            <div className="px-6 pb-6 flex items-center gap-6">
              <Button
                onClick={handlePlayAlbum}
                size="icon"
                className="w-14 h-14 rounded-full bg-gradient-to-r from-brand-secondary to-brand-primary hover:from-brand-secondary/80 hover:to-brand-primary/90 hover:scale-105 transition-all shadow-glow-primary"
              >
                {isPlaying && currentAlbum?.songs.some((song) => song._id === currentSong?._id) ? (
                  <Pause className="h-7 w-7 text-white" />
                ) : (
                  <Play className="h-7 w-7 text-white ml-1" />
                )}
              </Button>
            </div>

            {/* Table Section */}
            <div className="bg-background-elevated/20 backdrop-blur-sm">
              {/* table header */}
              <div
                className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm 
            text-text-secondary border-b border-white/5 uppercase tracking-wider"
              >
                <div>#</div>
                <div>Title</div>
                <div>Released Date</div>
                <div>
                  <Clock className="h-4 w-4" />
                </div>
              </div>

              {/* songs list */}

              <div className="px-6">
                <div className="space-y-2 py-4">
                  {currentAlbum?.songs.map((song, index) => (
                    <SongRow
                      key={song._id}
                      song={song}
                      index={index}
                      isCurrentSong={currentSong?._id === song._id}
                      isPlaying={isPlaying}
                      onClick={() => handlePlaySong(index)}
                      metadataContent={song.createdAt.split('T')[0]}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
export default AlbumPage;
