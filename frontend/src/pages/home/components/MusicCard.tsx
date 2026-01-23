import { Play, MoreHorizontal, Plus, ListMusic, Heart } from "lucide-react";
import { Song } from "@/types";
import { useState, useEffect, useRef } from "react";
import { LikeButton } from "@/components/LikeButton";

interface MusicCardProps {
    song: Song;
    onClick?: () => void;
    onPlayClick?: (e: React.MouseEvent) => void;
}

const MusicCard = ({ song, onClick, onPlayClick }: MusicCardProps) => {
    const [showMenu, setShowMenu] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [shouldLoadImage, setShouldLoadImage] = useState(false);
    const imgContainerRef = useRef<HTMLDivElement>(null);

    // Lazy loading with Intersection Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShouldLoadImage(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '50px' } // Start loading 50px before visible
        );

        if (imgContainerRef.current) {
            observer.observe(imgContainerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div
            onClick={onClick}
            className='group relative w-[160px] md:w-[200px] flex-shrink-0 cursor-pointer'
            onMouseLeave={() => setShowMenu(false)}
        >
            {/* Modern Card Container */}
            <div className="relative bg-zinc-800/40 hover:bg-zinc-800/60 rounded-lg p-4 transition-smooth hover-scale-sm active-scale-xs">
                {/* Image Container with Hover Effects */}
                <div
                    ref={imgContainerRef}
                    className="relative aspect-square overflow-hidden rounded-md mb-4 shadow-lg group-hover:shadow-card-hover transition-smooth"
                >
                    {shouldLoadImage ? (
                        <img
                            src={song.imageUrl}
                            alt={song.title}
                            className={`h-full w-full object-cover transition-slow group-hover:scale-105 ${isImageLoaded ? 'opacity-100' : 'opacity-0'
                                }`}
                            loading="lazy"
                            onLoad={() => setIsImageLoaded(true)}
                        />
                    ) : (
                        <div className="h-full w-full bg-white/5 skeleton-shimmer-enhanced" />
                    )}

                    {/* Subtle Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-smooth group-hover:opacity-100" />

                    {/* Like Button (Top Right) */}
                    <div className="absolute top-2 right-2 z-20 opacity-0 translate-y-[-8px] group-hover:translate-y-0 group-hover:opacity-100 transition-smooth delay-75">
                        <div onClick={(e) => e.stopPropagation()}>
                            <LikeButton
                                size={18}
                                isLiked={!!song.likeCount && song.likeCount > 0}
                                onLike={async (liked) => {
                                    try {
                                        const { axiosInstance } = await import('@/lib/axios');
                                        await axiosInstance.post('/analytics/like-song', {
                                            songId: song._id,
                                            liked
                                        });
                                    } catch (error) {
                                        console.error('Failed to like/unlike song:', error);
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Modern Play Button - Spotify Style */}
                    <div className="absolute bottom-2 right-2 translate-y-2 opacity-0 transition-bounce group-hover:translate-y-0 group-hover:opacity-100 z-20">
                        <button
                            onClick={onPlayClick}
                            className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 hover:bg-green-400 text-black shadow-lg hover:shadow-xl transition-bounce hover-scale-md active-scale-sm"
                            aria-label={`Play ${song.title}`}
                        >
                            <Play className="h-5 w-5 fill-black ml-0.5" />
                        </button>
                    </div>

                    {/* More Options Button - Minimalist */}
                    <div className="absolute bottom-2 left-2 translate-y-2 opacity-0 transition-smooth group-hover:translate-y-0 group-hover:opacity-100 z-20 delay-75">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowMenu(!showMenu);
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white/80 hover:text-white hover:bg-black/60 transition-snap hover:scale-110"
                            aria-label="More options"
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Text Content - Improved Typography */}
                <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-white line-clamp-1 tracking-tight group-hover:text-white transition-colors">
                        {song.title}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-1 leading-relaxed">
                        {song.artist}
                    </p>
                </div>
            </div>

            {/* Context Menu - Refined Design */}
            {showMenu && (
                <div className="absolute top-[75%] right-2 z-50 w-48 rounded-lg border border-white/10 bg-zinc-900/98 backdrop-blur-xl p-1.5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                    <button className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition-snap text-left">
                        <Plus className="h-4 w-4" />
                        Add to Queue
                    </button>
                    <button className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition-snap text-left">
                        <Heart className="h-4 w-4" />
                        Save to Favorites
                    </button>
                    <button className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition-snap text-left">
                        <ListMusic className="h-4 w-4" />
                        Go to Artist
                    </button>
                </div>
            )}
        </div>
    );
};

export const MusicCardSkeleton = () => (
    <div className='w-[160px] md:w-[200px] flex-shrink-0'>
        <div className="bg-zinc-800/40 rounded-lg p-4">
            <div className="aspect-square rounded-md bg-white/5 skeleton-shimmer-enhanced mb-4" />
            <div className="space-y-2">
                <div className="h-3.5 w-3/4 rounded bg-white/5 skeleton-shimmer-enhanced" />
                <div className="h-3 w-1/2 rounded bg-white/5 skeleton-shimmer-enhanced" />
            </div>
        </div>
    </div>
);

export default MusicCard;
