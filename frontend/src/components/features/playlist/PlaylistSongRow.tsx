import { memo } from "react";
import { Song } from "@/types";
import { Music, Play, Heart } from "lucide-react";
import { formatDuration } from "@/lib/utils";
import { OptimizedImage } from "@/components/shared/OptimizedImage";
import { motion, PanInfo, useAnimation } from "framer-motion";

interface PlaylistSongRowProps {
    song: Song;
    index: number;
    isCurrentSong: boolean;
    isPlaying: boolean;
    onClick: () => void;
    onRemove?: () => void;
    isOwner?: boolean;
    showActions?: boolean;
}

export const PlaylistSongRow = memo(({ song, index, isCurrentSong, isPlaying, onClick, onRemove, isOwner, showActions }: PlaylistSongRowProps) => {
    const controls = useAnimation();

    const handleDragEnd = async (_: MouseEvent | TouchEvent | PointerEvent | Event, info: PanInfo) => {
        if (info.offset.x < -100) {
            // Swiped Left
            // TODO: Swipe Action
        }
        await controls.start({ x: 0 });
    };

    return (
        <motion.div
            onClick={onClick}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            animate={controls}
            className={`grid grid-cols-[16px_1fr_2fr_80px_40px] md:grid-cols-[16px_4fr_2fr_1fr_48px] gap-2 md:gap-4 px-3 md:px-4 py-2 text-sm 
            rounded-md group cursor-pointer transition-colors duration-200 ease-out
            touch-pan-y
            ${isCurrentSong ? "bg-[#22C55E]/10 ring-1 ring-[#22C55E]/20" : "hover:bg-white/5"}
            `}
            whileTap={{ scale: 0.98 }}
        >
            <div className='flex items-center justify-center'>
                {isCurrentSong && isPlaying ? (
                    <Music className='size-4 text-[#22C55E] animate-pulse' />
                ) : (
                    <span className='group-hover:hidden text-[#9CA3AF]'>{index + 1}</span>
                )}
                {!isCurrentSong && (
                    <Play className='h-4 w-4 hidden group-hover:block text-[#F9FAFB]' />
                )}
            </div>

            <div className='flex items-center gap-3 min-w-0'>
                <OptimizedImage
                    src={song.imageUrl}
                    alt={song.title}
                    className='size-10 rounded shadow pointer-events-none flex-shrink-0'
                    size="thumbnail"
                />
                <div className="min-w-0">
                    <div className={`font-medium truncate ${isCurrentSong ? "text-[#22C55E]" : "text-[#F9FAFB]"}`}>{song.title}</div>
                </div>
            </div>
            <div className="text-[#9CA3AF] truncate pointer-events-none">{song.artist}</div>
            <div className='flex items-center text-[#9CA3AF] pointer-events-none'>{formatDuration(song.duration)}</div>
            <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                <button type="button" className="p-2 rounded-full hover:bg-white/10 text-[#9CA3AF] hover:text-[#22C55E] transition-colors min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 flex items-center justify-center" aria-label="Like">
                    <Heart className="size-4" />
                </button>
            </div>
        </motion.div>
    );
}, (prevProps, nextProps) => {
    return (
        prevProps.song._id === nextProps.song._id &&
        prevProps.isCurrentSong === nextProps.isCurrentSong &&
        prevProps.isPlaying === nextProps.isPlaying &&
        prevProps.index === nextProps.index
    );
});
