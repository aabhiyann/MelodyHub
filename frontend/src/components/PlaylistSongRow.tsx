import { memo } from "react";
import { Song } from "@/types";
import { Music, Play } from "lucide-react";
import { formatDuration } from "@/pages/AlbumPage";
import { OptimizedImage } from "@/components/OptimizedImage";

interface PlaylistSongRowProps {
    song: Song;
    index: number;
    isCurrentSong: boolean;
    isPlaying: boolean;
    onClick: () => void;
}

export const PlaylistSongRow = memo(({ song, index, isCurrentSong, isPlaying, onClick }: PlaylistSongRowProps) => {
    return (
        <div
            onClick={onClick}
            className={`grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm 
            rounded-md group cursor-pointer transition-all duration-200 ease-out
            hover:scale-[1.01] active:scale-[0.99]
            ${isCurrentSong ? "bg-brand-primary/10 ring-1 ring-brand-primary/20" : "hover:bg-white/5"}
            `}
        >
            <div className='flex items-center justify-center'>
                {isCurrentSong && isPlaying ? (
                    <Music className='size-4 text-brand-primary animate-pulse' />
                ) : (
                    <span className='group-hover:hidden text-text-secondary'>{index + 1}</span>
                )}
                {!isCurrentSong && (
                    <Play className='h-4 w-4 hidden group-hover:block text-white' />
                )}
            </div>

            <div className='flex items-center gap-3'>
                <OptimizedImage
                    src={song.imageUrl}
                    alt={song.title}
                    className='size-10 rounded shadow'
                    size="thumbnail"
                />

                <div>
                    <div className={`font-medium ${isCurrentSong ? "text-brand-primary" : "text-text-primary"}`}>{song.title}</div>
                </div>
            </div>
            <div className="text-text-secondary">{song.artist}</div>
            <div className='flex items-center text-text-secondary'>{formatDuration(song.duration)}</div>
        </div>
    );
}, (prevProps, nextProps) => {
    // Custom comparison to ensure we only re-render when strictly necessary
    return (
        prevProps.song._id === nextProps.song._id &&
        prevProps.isCurrentSong === nextProps.isCurrentSong &&
        prevProps.isPlaying === nextProps.isPlaying &&
        prevProps.index === nextProps.index
    );
});
