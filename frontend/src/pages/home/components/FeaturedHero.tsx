/**
 * FeaturedHero - One large hero card at top of Home (featured or top trending).
 * DESIGN_PLAN: 12px radius, accent #22C55E for play. Skeleton when loading; empty state when no content.
 */

import { Play, Pause } from "lucide-react";
import { usePlayerStore } from "@/stores/PlayerStore";
import { Song } from "@/types";
import { EmptyState } from "@/components/shared/EmptyState";

interface FeaturedHeroProps {
    /** First featured or trending item */
    item: Song | null;
    isLoading: boolean;
}

export const FeaturedHeroSkeleton = () => (
    <div className="px-6 pt-2 md:pt-6 pb-4">
        <div className="relative aspect-[2.2/1] min-h-[200px] rounded-[16px] overflow-hidden bg-white/10 skeleton-shimmer" />
    </div>
);

export const FeaturedHero = ({ item, isLoading }: FeaturedHeroProps) => {
    const { playAlbum, currentSong, isPlaying, togglePlay } = usePlayerStore();

    if (isLoading) return <FeaturedHeroSkeleton />;

    if (!item) {
        return (
            <div className="px-6 pt-2 md:pt-6 pb-4">
                <div className="rounded-[16px] overflow-hidden bg-[#101019] border border-[#1F2933] p-8 min-h-[160px] flex items-center justify-center">
                    <EmptyState
                        message="Discover music"
                        secondary="Play something from Browse or Search to see featured picks here."
                    />
                </div>
            </div>
        );
    }

    const isCurrent = currentSong?._id === item._id;

    return (
        <div className="px-6 pt-2 md:pt-6 pb-4">
            <div
                className="group relative aspect-[2.2/1] min-h-[200px] rounded-[16px] overflow-hidden cursor-pointer transition-all duration-200 hover:scale-[1.01] shadow-lg hover:shadow-xl"
                onClick={() => playAlbum([item], 0)}
            >
                <img
                    src={item.imageUrl}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex items-end justify-between gap-4">
                    <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#22C55E] mb-1">
                            Featured
                        </p>
                        <h2 className="text-2xl md:text-4xl font-bold text-[#F9FAFB] truncate">
                            {item.title}
                        </h2>
                        <p className="text-[#9CA3AF] truncate mt-0.5">{item.artist}</p>
                    </div>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (isCurrent) togglePlay();
                            else playAlbum([item], 0);
                        }}
                        className="flex-shrink-0 size-14 md:size-16 rounded-full bg-[#22C55E] text-[#020617] flex items-center justify-center shadow-lg hover:scale-105 hover:bg-[#16A34A] transition-all"
                        aria-label={isCurrent && isPlaying ? "Pause" : "Play"}
                    >
                        {isCurrent && isPlaying ? (
                            <Pause className="w-7 h-7 md:w-8 md:h-8 fill-current" />
                        ) : (
                            <Play className="w-7 h-7 md:w-8 md:h-8 fill-current ml-1" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
