import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { Song } from "@/types";
import { usePlayerStore } from "@/stores/PlayerStore";
import { OptimizedImage } from "@/components/OptimizedImage";

import { ListeningHistoryItem } from "@/hooks/useHomeData";

interface JumpBackInProps {
    history: ListeningHistoryItem[];
}

export const JumpBackIn = ({ history }: JumpBackInProps) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { currentSong, isPlaying, togglePlay, playAlbum } = usePlayerStore();

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 600;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Filter unique songs/albums from history to avoid duplicates
    // And limit to recent 10-15 items
    const uniqueItems = history.reduce((acc: Song[], item) => {
        if (!item.songId) return acc;
        if (!acc.find(s => s._id === item.songId._id)) {
            acc.push(item.songId as Song);
        }
        return acc;
    }, []).slice(0, 15);

    if (uniqueItems.length === 0) return null;

    return (
        <section className="group/section relative">
            <div className="flex items-center justify-between mb-6 px-4 md:px-0">
                <h3 className="text-2xl font-bold text-white tracking-tight">Jump Back In</h3>
                <Link to="/history" className="text-sm font-medium text-text-secondary hover:text-white transition-colors">
                    See all
                </Link>
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

            {/* Scroll Container */}
            <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar px-4 md:px-0"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {uniqueItems.map((song, index) => {
                    const isCurrentSong = currentSong?._id === song._id;
                    const isCurrentPlaying = isCurrentSong && isPlaying;

                    return (
                        <div
                            key={`${song._id}-${index}`}
                            className="flex-shrink-0 w-[140px] md:w-[180px] snap-start group/card"
                        >
                            <div className="relative aspect-square rounded-xl overflow-hidden mb-3 shadow-lg group-hover/card:shadow-xl transition-all duration-300 group-hover/card:translate-y-[-4px]">
                                <OptimizedImage
                                    src={song.imageUrl}
                                    alt={song.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                                />

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />

                                {/* Play Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (isCurrentSong) {
                                            togglePlay();
                                        } else {
                                            playAlbum([song], 0);
                                        }
                                    }}
                                    className={`absolute bottom-3 right-3 p-3 rounded-full bg-brand-primary text-white shadow-lg shadow-brand-primary/40 
                                        items-center justify-center transition-all duration-300 transform
                                        ${isCurrentPlaying ? 'flex opacity-100 scale-100' : 'flex opacity-0 translate-y-2 scale-90 group-hover/card:opacity-100 group-hover/card:translate-y-0 group-hover/card:scale-100'}
                                    `}
                                >
                                    {isCurrentPlaying ? (
                                        <Pause className="size-5 fill-current" />
                                    ) : (
                                        <Play className="size-5 fill-current ml-0.5" />
                                    )}
                                </button>
                            </div>

                            <div className="space-y-1">
                                <h4 className={`font-semibold text-sm truncate ${isCurrentPlaying ? 'text-brand-primary' : 'text-white'}`}>
                                    {song.title}
                                </h4>
                                <p className="text-xs text-zinc-400 truncate hover:underline cursor-pointer" onClick={() => navigate(`/artist/${song.artist}`)}>
                                    {song.artist}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
