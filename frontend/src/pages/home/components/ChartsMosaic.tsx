import { Song } from "@/types";
import { usePlayerStore } from "@/stores/PlayerStore";
import { OptimizedImage } from "@/components/OptimizedImage";
import { TrendingUp, Play, ArrowUp } from "lucide-react";

interface ChartsMosaicProps {
    trendingSongs: Song[];
    featuredSongs: Song[];
    isLoading: boolean;
}

export const ChartsMosaic = ({ trendingSongs, featuredSongs, isLoading }: ChartsMosaicProps) => {
    const { playAlbum, currentSong, isPlaying, togglePlay } = usePlayerStore();

    if (isLoading) {
        return <ChartsMosaicSkeleton />;
    }

    // const allSongs = [...trendingSongs, ...featuredSongs];
    const topSong = trendingSongs[0];
    const viralHits = trendingSongs.slice(1, 3);
    const newReleases = featuredSongs.slice(0, 4);

    return (
        <section>
            <div className="flex items-center gap-2 mb-6 px-4 md:px-0">
                <TrendingUp className="size-6 text-brand-primary" />
                <h3 className="text-2xl font-bold text-white tracking-tight">Charts & Trending</h3>
            </div>

            {/* Masonry-style Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 md:px-0 auto-rows-[140px]">

                {/* 1. Featured Chart Card (2x2) - The Big Hero */}
                {topSong && (
                    <div className="col-span-1 md:col-span-2 row-span-2 relative rounded-2xl overflow-hidden group cursor-pointer"
                        onClick={() => playAlbum([topSong], 0)}
                    >
                        <OptimizedImage
                            src={topSong.imageUrl}
                            alt={topSong.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                        <div className="absolute top-4 left-4 bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            #1 Global
                        </div>

                        <div className="absolute bottom-0 left-0 p-6 w-full">
                            <h4 className="text-3xl font-bold text-white mb-1 truncate">{topSong.title}</h4>
                            <p className="text-lg text-white/80 mb-4">{topSong.artist}</p>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (currentSong?._id === topSong._id) togglePlay();
                                        else playAlbum([topSong], 0);
                                    }}
                                    className="size-12 rounded-full bg-brand-primary text-white flex items-center justify-center hover:scale-105 transition-transform"
                                >
                                    {currentSong?._id === topSong._id && isPlaying ? <Play className="size-5 fill-current" /> : <Play className="size-5 ml-0.5 fill-current" />}
                                </button>
                                <span className="text-sm text-zinc-300 font-medium">+1.2M plays this week</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. Top Viral Hits (1x1 Cards) */}
                {viralHits.map((song, i) => (
                    <div
                        key={song._id}
                        className="col-span-1 row-span-1 bg-white/5 border border-white/5 backdrop-blur-sm rounded-2xl p-4 flex gap-4 hover:bg-white/10 transition-colors cursor-pointer group"
                        onClick={() => playAlbum(viralHits, i)}
                    >
                        <div className="relative aspect-square h-full rounded-lg overflow-hidden shrink-0">
                            <OptimizedImage src={song.imageUrl} alt={song.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Play className="size-6 text-white fill-white" />
                            </div>
                        </div>
                        <div className="flex flex-col justify-center min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xl font-bold text-white/40">#{i + 2}</span>
                                <span className="text-xs text-green-400 flex items-center gap-0.5">
                                    <ArrowUp className="size-3" /> 12%
                                </span>
                            </div>
                            <h5 className="font-bold text-white truncate">{song.title}</h5>
                            <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
                        </div>
                    </div>
                ))}

                {/* 3. Wide Album Card / Featured (2x1) */}
                {newReleases[0] && (
                    <div className="col-span-1 md:col-span-2 row-span-1 bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-white/5 rounded-2xl p-4 flex items-center gap-6 cursor-pointer group hover:border-white/10 transition-colors"
                        onClick={() => playAlbum([newReleases[0]], 0)}
                    >
                        <div className="aspect-square h-full rounded-xl overflow-hidden shadow-lg rotate-3 group-hover:rotate-0 transition-transform duration-300">
                            <OptimizedImage src={newReleases[0].imageUrl} alt={newReleases[0].title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <span className="inline-block px-2 py-0.5 rounded bg-white/10 text-[10px] font-bold uppercase tracking-wider text-purple-200 mb-2">
                                Trending Album
                            </span>
                            <h4 className="text-xl font-bold text-white truncate">{newReleases[0].title}</h4>
                            <p className="text-zinc-400 mb-3">{newReleases[0].artist}</p>
                        </div>
                        <div className="size-10 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                            <Play className="size-4 fill-current ml-0.5" />
                        </div>
                    </div>
                )}

                {/* 4. Filler / More Items */}
                {newReleases.slice(1).map((song) => (
                    <div
                        key={song._id}
                        className="col-span-1 row-span-1 bg-white/5 border border-white/5 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-4 hover:bg-white/10 transition-colors cursor-pointer group"
                        onClick={() => playAlbum([song], 0)}
                    >
                        <div className="size-16 rounded-lg overflow-hidden shrink-0">
                            <OptimizedImage src={song.imageUrl} alt={song.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h5 className="font-bold text-white truncate text-sm">{song.title}</h5>
                            <p className="text-xs text-zinc-400 truncate">{song.artist}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

const ChartsMosaicSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 md:px-0 auto-rows-[140px]">
        <div className="col-span-1 md:col-span-2 row-span-2 bg-zinc-800/40 rounded-2xl animate-pulse" />
        <div className="col-span-1 row-span-1 bg-zinc-800/40 rounded-2xl animate-pulse" />
        <div className="col-span-1 row-span-1 bg-zinc-800/40 rounded-2xl animate-pulse" />
        <div className="col-span-1 md:col-span-2 row-span-1 bg-zinc-800/40 rounded-2xl animate-pulse" />
    </div>
);
