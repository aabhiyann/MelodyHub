import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Pause } from "lucide-react";
import { Song } from "@/types";
import { usePlayerStore } from "@/stores/PlayerStore";
import { OptimizedImage } from "@/components/shared/OptimizedImage";
import HorizontalScrollSection from "./HorizontalScrollSection";
import { EmptyState } from "@/components/shared/EmptyState";
import { ListeningHistoryItem } from "@/hooks/useHomeData";

interface JumpBackInProps {
    history: ListeningHistoryItem[];
}

export const JumpBackIn = ({ history }: JumpBackInProps) => {
    const navigate = useNavigate();
    const { currentSong, isPlaying, togglePlay, playAlbum } = usePlayerStore();

    const uniqueItems = history.reduce((acc: Song[], item) => {
        if (!item.songId) return acc;
        if (!acc.find((s) => s._id === item.songId._id)) {
            acc.push(item.songId as Song);
        }
        return acc;
    }, []).slice(0, 15);

    return (
        <HorizontalScrollSection
            title="Recently Played"
            seeAllHref="/history"
            seeAllLabel="See all"
        >
            {uniqueItems.length === 0 ? (
                <div className="flex-shrink-0 w-full min-w-[280px] px-6">
                    <EmptyState
                        message="Nothing here yet"
                        secondary="Play something to see your recently played tracks."
                    />
                </div>
            ) : (
                uniqueItems.map((song, index) => {
                    const isCurrentSong = currentSong?._id === song._id;
                    const isCurrentPlaying = isCurrentSong && isPlaying;

                    return (
                        <div
                            key={`${song._id}-${index}`}
                            className="flex-shrink-0 w-[160px] md:w-[180px] snap-start group/card"
                        >
                            <div
                                className="relative aspect-square rounded-[12px] overflow-hidden mb-3 shadow-lg transition-all duration-200 group-hover/card:shadow-xl group-hover/card:scale-[1.03] cursor-pointer"
                                onClick={() => (isCurrentSong ? togglePlay() : playAlbum([song], 0))}
                            >
                                <OptimizedImage
                                    src={song.imageUrl}
                                    alt={song.title}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-200" />
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (isCurrentSong) togglePlay();
                                        else playAlbum([song], 0);
                                    }}
                                    className={`absolute bottom-2 right-2 p-2.5 rounded-full bg-[#22C55E] text-[#020617] shadow-lg transition-all duration-200 hover:scale-110 hover:bg-[#16A34A]
                                        ${isCurrentPlaying ? "flex opacity-100" : "opacity-0 group-hover/card:opacity-100 flex"}
                                    `}
                                    aria-label={isCurrentPlaying ? "Pause" : "Play"}
                                >
                                    {isCurrentPlaying ? (
                                        <Pause className="size-5 fill-current" />
                                    ) : (
                                        <Play className="size-5 fill-current ml-0.5" />
                                    )}
                                </button>
                            </div>
                            <p className="font-semibold text-sm truncate text-[#F9FAFB]">{song.title}</p>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate(`/artist/${song.artist}`);
                                }}
                                className="text-xs truncate text-[#9CA3AF] hover:text-[#F9FAFB] text-left w-full"
                            >
                                {song.artist}
                            </button>
                        </div>
                    );
                })
            )}
        </HorizontalScrollSection>
    );
};
