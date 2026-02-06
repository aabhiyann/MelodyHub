import { useRef } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Song } from "@/types";
import { usePlayerStore } from "@/stores/PlayerStore";
import { OptimizedImage } from "@/components/shared/OptimizedImage";

interface RecommendedSectionProps {
    songs: Song[];
    isLoading: boolean;
    seedArtist?: string; // "Because you listened to [Seed Artist]"
}

export const RecommendedSection = ({ songs, isLoading, seedArtist }: RecommendedSectionProps) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const { playAlbum } = usePlayerStore();

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 600;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (isLoading || !songs || songs.length === 0) return null;

    return (
        <section className="group/section relative py-4">
            <div className="flex items-center justify-between mb-6 px-4 md:px-0">
                <div>
                    <p className="text-xs font-bold text-brand-primary uppercase tracking-wider mb-1">Based on your recent listening</p>
                    <h3 className="text-2xl font-bold text-white tracking-tight">
                        Because you listened to <span className="text-white">{seedArtist || "Pop"}</span>
                    </h3>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="absolute top-[60%] left-[-20px] z-20 hidden md:block opacity-0 group-hover/section:opacity-100 transition-opacity duration-300">
                <button
                    onClick={() => scroll('left')}
                    className="p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-black/70 hover:scale-110 transition-all shadow-xl"
                >
                    <ChevronLeft className="size-6" />
                </button>
            </div>
            <div className="absolute top-[60%] right-[-20px] z-20 hidden md:block opacity-0 group-hover/section:opacity-100 transition-opacity duration-300">
                <button
                    onClick={() => scroll('right')}
                    className="p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-black/70 hover:scale-110 transition-all shadow-xl"
                >
                    <ChevronRight className="size-6" />
                </button>
            </div>

            {/* Scroll Container - Circular Artists Style */}
            <div
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar px-4 md:px-0"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {songs.map((song, i) => (
                    <div
                        key={`${song._id}-${i}`}
                        className="flex-shrink-0 w-[160px] snap-start group/card flex flex-col items-center text-center cursor-pointer"
                        onClick={() => playAlbum([song], 0)}
                    >
                        <div className="relative aspect-square w-full rounded-full overflow-hidden mb-4 shadow-lg group-hover/card:shadow-brand-primary/20 transition-all duration-300 border-2 border-transparent group-hover/card:border-brand-primary/50">
                            <OptimizedImage
                                src={song.imageUrl}
                                alt={song.artist}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                            />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                                <Play className="size-8 text-white fill-white" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <h4 className="font-bold text-white truncate text-base group-hover/card:text-brand-primary transition-colors w-full">
                                {song.artist}
                            </h4>
                            <p className="text-xs text-zinc-400 truncate w-full">
                                Similar to {seedArtist}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
