import { Play } from "lucide-react";
import { Song } from "@/types";

interface MusicCardProps {
    song: Song;
    onClick?: () => void;
    onPlayClick?: (e: React.MouseEvent) => void;
}

const MusicCard = ({ song, onClick, onPlayClick }: MusicCardProps) => {
    return (
        <div
            onClick={onClick}
            className='group relative w-[160px] md:w-[200px] flex-shrink-0 cursor-pointer bg-transparent transition-all duration-300 hover:z-10'
        >
            {/* Image Container with Hover Lift */}
            <div className="relative aspect-square overflow-hidden rounded-2xl shadow-lg transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl">
                <img
                    src={song.imageUrl}
                    alt={song.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Play Button Overlay */}
                <button
                    onClick={onPlayClick}
                    className="absolute bottom-3 right-3 flex h-12 w-12 translate-y-4 items-center justify-center rounded-full bg-brand-primary text-white opacity-0 shadow-lg blur-0 transition-all duration-300 hover:scale-110 hover:bg-brand-primary/90 group-hover:translate-y-0 group-hover:opacity-100"
                    aria-label={`Play ${song.title}`}
                >
                    <Play className="h-5 w-5 fill-white ml-0.5" />
                </button>
            </div>

            {/* Text Content */}
            <div className="mt-3">
                <h3 className="truncate text-base font-semibold text-white group-hover:text-brand-primary transition-colors">
                    {song.title}
                </h3>
                <p className="truncate text-sm text-zinc-400">
                    {song.artist}
                </p>
            </div>
        </div>
    );
};

export const MusicCardSkeleton = () => (
    <div className='w-[160px] md:w-[200px] flex-shrink-0 animate-pulse'>
        <div className="aspect-square rounded-2xl bg-white/5" />
        <div className="mt-3 space-y-2">
            <div className="h-4 w-3/4 rounded bg-white/5" />
            <div className="h-3 w-1/2 rounded bg-white/5" />
        </div>
    </div>
);

export default MusicCard;
