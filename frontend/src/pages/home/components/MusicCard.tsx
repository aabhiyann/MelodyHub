import { Play, MoreHorizontal, Plus, ListMusic, Share2, Radio } from "lucide-react";
import { Song } from "@/types";
import { useState, memo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { LikeButton } from "@/components/ui/LikeButton";
import { AddToPlaylistDialog } from "@/components/features/playlist/AddToPlaylistDialog";
import { OptimizedImage } from "@/components/shared/OptimizedImage";
import { LiquidGlassCard } from "@/components/ui/LiquidGlassCard";
import { useCardReveal } from "@/hooks/useCardReveal";

interface MusicCardProps {
    song: Song;
    onClick?: () => void;
    onPlayClick?: (e: React.MouseEvent) => void;
    index?: number;
}

const MusicCard = memo(({ song, onClick, onPlayClick, index = 0 }: MusicCardProps) => {
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();
    const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { ref, animate, transition } = useCardReveal({ delay: index });

    const handleTouchStart = () => {
        longPressTimer.current = setTimeout(() => {
            setShowMenu(true);
            // Vibrate if available
            if (navigator.vibrate) navigator.vibrate(50);
        }, 500);
    };

    const handleTouchEnd = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    };

    const [showPlaylistDialog, setShowPlaylistDialog] = useState(false);

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={animate}
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
            }}
            transition={transition as any}
            onClick={onClick}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchEnd}
            className='relative flex-shrink-0 min-w-[160px] max-w-[220px]'
            onMouseLeave={() => setShowMenu(false)}
        >
            {/* Modern Card Container using LiquidGlassCard */}
            <LiquidGlassCard
                className="p-4 h-full group"
                hover={true}
                variant="default"
            >
                {/* Image Container - Spotify/Apple Music style: rounded-xl, shadow, hover scale */}
                <div
                    className="relative aspect-square overflow-hidden rounded-xl mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-[1.02] transition-all duration-300 ease-out"
                >
                    <OptimizedImage
                        src={song.imageUrl}
                        alt={song.title}
                        size="small"
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />

                    {/* Gradient overlay on hover - streaming-app style */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {/* Like Button (Top Right) */}
                    <div className="absolute top-2 right-2 z-20 opacity-0 translate-y-[-8px] group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75 ease-out">
                        <div onClick={(e) => e.stopPropagation()}>
                            <LikeButton
                                size={18}
                                isLiked={!!song.likeCount && song.likeCount > 0}
                                onToggle={async (liked) => {
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

                    {/* Modern Play Button - MelodyHub Purple Brand */}
                    <div className="absolute bottom-2 right-2 translate-y-2 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 z-20">
                        <button
                            onClick={onPlayClick}
                            className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary hover:bg-brand-primary/90 text-white shadow-lg hover:shadow-xl hover:shadow-brand-primary/50 transition-all duration-300 hover:scale-110 active:scale-95"
                            aria-label={`Play ${song.title}`}
                        >
                            <Play className="h-5 w-5 fill-white ml-0.5" />
                        </button>
                    </div>

                    {/* More Options Button - Minimalist */}
                    <div className="absolute bottom-2 left-2 translate-y-2 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 z-20 delay-75">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowMenu(!showMenu);
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white/80 hover:text-white hover:bg-black/60 transition-all duration-200 hover:scale-110"
                            aria-label="More options"
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-text-primary line-clamp-1 tracking-tight group-hover:text-brand-primary transition-colors">
                        {song.title}
                    </h3>
                    <p className="text-xs text-text-secondary line-clamp-1 leading-relaxed">
                        {song.artist}
                    </p>
                </div>
            </LiquidGlassCard>

            {/* Context Menu - Refined with Glass Panel */}
            {showMenu && (
                <div className="absolute top-[75%] right-2 z-50 w-48 rounded-xl glass-panel bg-surface-elevated/90 p-1.5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            const link = `${window.location.origin}/radio/${song._id}`;
                            navigator.clipboard.writeText(link);
                            toast.success("Radio link copied!");
                            setShowMenu(false);
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary hover:bg-white/10 hover:text-text-primary transition-colors text-left"
                    >
                        <Share2 className="h-4 w-4" />
                        Copy Link
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/radio/${song._id}`);
                            setShowMenu(false);
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary hover:bg-white/10 hover:text-text-primary transition-colors text-left"
                    >
                        <Radio className="h-4 w-4" />
                        Start Radio
                    </button>

                    <div className="h-px bg-white/10 my-1 mx-2" />

                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary hover:bg-white/10 hover:text-text-primary transition-colors text-left">
                        <Plus className="h-4 w-4" />
                        Add to Queue
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowPlaylistDialog(true);
                            setShowMenu(false);
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary hover:bg-white/10 hover:text-text-primary transition-colors text-left"
                    >
                        <ListMusic className="h-4 w-4" />
                        Add to Playlist
                    </button>

                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary hover:bg-white/10 hover:text-text-primary transition-colors text-left">
                        <ListMusic className="h-4 w-4" />
                        Go to Artist
                    </button>
                </div>
            )}

            <AddToPlaylistDialog
                songId={song._id}
                open={showPlaylistDialog}
                onOpenChange={setShowPlaylistDialog}
            />
        </motion.div>
    );
});

export const MusicCardSkeleton = () => (
    <div className='flex-shrink-0 min-w-[160px] max-w-[220px]'>
        <div className="bg-surface-card rounded-xl p-4">
            <div className="aspect-square rounded-md bg-white/5 skeleton-shimmer-enhanced mb-4" />
            <div className="space-y-2">
                <div className="h-3.5 w-3/4 rounded bg-white/5 skeleton-shimmer-enhanced" />
                <div className="h-3 w-1/2 rounded bg-white/5 skeleton-shimmer-enhanced" />
            </div>
        </div>
    </div>
);

export default MusicCard;
