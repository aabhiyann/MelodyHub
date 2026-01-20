import { Play, MoreHorizontal, Heart, Plus, ListMusic } from "lucide-react";
import { Song } from "@/types";
import { useState } from "react";
import { motion } from "framer-motion";

interface MusicCardProps {
    song: Song;
    onClick?: () => void;
    onPlayClick?: (e: React.MouseEvent) => void;
}

const MusicCard = ({ song, onClick, onPlayClick }: MusicCardProps) => {
    const [showMenu, setShowMenu] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    return (
        <div
            onClick={onClick}
            className='group relative w-[160px] md:w-[200px] flex-shrink-0 cursor-pointer bg-transparent transition-all duration-300 hover:z-10'
            onMouseLeave={() => setShowMenu(false)}
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

                {/* Like Button (Top Right) */}
                <div className="absolute top-3 right-3 z-20 opacity-0 translate-y-[-10px] group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75">
                    <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsLiked(!isLiked);
                        }}
                        className="p-2 rounded-full bg-black/20 backdrop-blur-md hover:bg-black/40 text-white transition-colors border border-white/5"
                    >
                        <Heart className={`w-5 h-5 transition-colors duration-300 ${isLiked ? "fill-brand-primary text-brand-primary line-clamp-none" : "text-white"}`} />
                        {isLiked && (
                            <motion.div
                                initial={{ scale: 0, opacity: 1 }}
                                animate={{ scale: 1.5, opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0 rounded-full bg-brand-primary/50 pointer-events-none"
                            />
                        )}
                    </motion.button>
                </div>

                {/* Play Button Overlay */}
                <div className="absolute bottom-3 right-3 flex gap-2 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 z-20">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(!showMenu);
                        }}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white shadow-lg transition-transform hover:scale-110 hover:bg-white/20"
                        aria-label="More options"
                    >
                        <MoreHorizontal className="h-5 w-5" />
                    </button>

                    <button
                        onClick={onPlayClick}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary text-white shadow-lg transition-transform hover:scale-110 hover:bg-brand-primary/90"
                        aria-label={`Play ${song.title}`}
                    >
                        <Play className="h-5 w-5 fill-white ml-0.5" />
                    </button>
                </div>
            </div>

            {/* Context Menu Dropdown */}
            {showMenu && (
                <div className="absolute top-[60%] right-4 z-50 w-48 rounded-xl border border-white/10 bg-zinc-900/95 p-1 shadow-xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
                    <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/10 hover:text-white transition-colors text-left">
                        <Plus className="h-4 w-4" />
                        Add to Queue
                    </button>
                    <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/10 hover:text-white transition-colors text-left">
                        <Heart className="h-4 w-4" />
                        Save to Favorites
                    </button>
                    <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/10 hover:text-white transition-colors text-left">
                        <ListMusic className="h-4 w-4" />
                        Go to Artist
                    </button>
                </div>
            )}

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
    <div className='w-[160px] md:w-[200px] flex-shrink-0 animate-pulse skeleton-shimmer rounded-2xl'>
        <div className="aspect-square rounded-2xl bg-white/5" />
        <div className="mt-3 space-y-2">
            <div className="h-4 w-3/4 rounded bg-white/5" />
            <div className="h-3 w-1/2 rounded bg-white/5" />
        </div>
    </div>
);

export default MusicCard;
