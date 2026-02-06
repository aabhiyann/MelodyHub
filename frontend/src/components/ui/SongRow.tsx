import { Play, Music } from 'lucide-react';
import { Song } from '@/types';
import { cn } from '@/lib/utils';
import { memo } from 'react';

interface SongRowProps {
  song: Song;
  index: number;
  isCurrentSong: boolean;
  isPlaying: boolean;
  onClick: () => void;
  thumbnailSize?: 'sm' | 'md' | 'lg';
  showThumbnail?: boolean;
  metadataContent?: React.ReactNode;
  className?: string;
}

export const SongRow = memo(({
  song,
  index,
  isCurrentSong,
  isPlaying,
  onClick,
  thumbnailSize = 'md',
  showThumbnail = true,
  metadataContent,
  className,
}: SongRowProps) => {
  const thumbnailSizes = {
    sm: 'size-8',
    md: 'size-10',
    lg: 'size-12',
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm',
        'rounded-md group cursor-pointer transition-all duration-200 ease-out',
        'hover:scale-[1.01] active:scale-[0.99]',
        isCurrentSong ? 'bg-brand-primary/10 ring-1 ring-brand-primary/20' : 'hover:bg-white/5',
        className
      )}
    >
      {/* Track Number / Play Icon */}
      <div className="flex items-center justify-center">
        {isCurrentSong && isPlaying ? (
          <Music className="size-4 text-brand-primary animate-pulse" />
        ) : (
          <span className="group-hover:hidden text-text-secondary">{index + 1}</span>
        )}
        {!isCurrentSong && <Play className="h-4 w-4 hidden group-hover:block text-white" />}
      </div>

      {/* Song Info with Thumbnail */}
      <div className="flex items-center gap-3">
        {showThumbnail && (
          <img
            src={song.imageUrl}
            alt={song.title}
            loading="lazy"
            className={cn(thumbnailSizes[thumbnailSize], 'rounded shadow')}
          />
        )}

        <div className="min-w-0 flex-1">
          <div
            className={cn(
              'font-medium truncate',
              isCurrentSong ? 'text-brand-primary' : 'text-text-primary'
            )}
          >
            {song.title}
          </div>
          <div className="text-text-secondary truncate">{song.artist}</div>
        </div>
      </div>

      {/* Metadata (Date, Album, Genre, etc.) */}
      <div className="flex items-center text-text-secondary truncate">
        {metadataContent || song.createdAt?.split('T')[0] || '—'}
      </div>

      {/* Duration */}
      <div className="flex items-center text-text-secondary">{formatDuration(song.duration)}</div>
    </div>
  );
});
