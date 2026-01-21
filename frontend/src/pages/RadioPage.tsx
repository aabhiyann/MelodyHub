import { useState, useEffect } from "react";
import { useMusicStore } from "@/stores/MusicStore";
import { usePlayerStore } from "@/stores/PlayerStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Loader, Play, Radio as RadioIcon, Shuffle } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";

const RadioPage = () => {
    const { songs, fetchSongs, isLoading } = useMusicStore();
    const { playAlbum } = usePlayerStore();
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

    useEffect(() => {
        fetchSongs();
    }, [fetchSongs]);

    // Group songs by genre for radio stations
    const genreStations = songs.reduce((acc, song) => {
        const genre = song.genre || "Other";
        if (!acc[genre]) {
            acc[genre] = [];
        }
        acc[genre].push(song);
        return acc;
    }, {} as Record<string, typeof songs>);

    const genres = Object.keys(genreStations).sort();

    const playRadioStation = (genre: string) => {
        const stationSongs = genreStations[genre];
        if (stationSongs.length > 0) {
            // Shuffle the songs for radio effect
            const shuffled = [...stationSongs].sort(() => Math.random() - 0.5);
            playAlbum(shuffled, 0);
            setSelectedGenre(genre);
        }
    };

    return (
        <PageTransition>
            <ScrollArea className="h-full">
                <div className="p-4 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-2">
                                <RadioIcon className="size-12 text-brand-primary" />
                                <h1 className="text-4xl md:text-6xl font-bold">Radio</h1>
                            </div>
                            <p className="text-text-secondary text-lg">
                                Endless music stations curated just for you
                            </p>
                        </div>

                        {isLoading ? (
                            <div className="flex items-center justify-center h-96">
                                <Loader className="size-8 text-brand-primary animate-spin" />
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Featured Station */}
                                {genres.length > 0 && (
                                    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-purple-600 to-pink-600 p-8">
                                        <div className="relative z-10">
                                            <h2 className="text-3xl font-bold mb-2">Mix Radio</h2>
                                            <p className="text-white/80 mb-4">
                                                All genres mixed together • {songs.length} tracks
                                            </p>
                                            <Button
                                                onClick={() => playAlbum(songs, 0)}
                                                size="lg"
                                                className="bg-white text-black hover:bg-white/90"
                                            >
                                                <Play className="size-5 mr-2 fill-current" />
                                                Play Station
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Genre Stations */}
                                <div>
                                    <h2 className="text-2xl font-bold mb-4">Genre Stations</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {genres.map((genre) => {
                                            const stationSongs = genreStations[genre];
                                            const isPlaying = selectedGenre === genre;

                                            return (
                                                <div
                                                    key={genre}
                                                    className={`group relative rounded-xl overflow-hidden bg-gradient-to-br from-white/5 to-white/10 p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${isPlaying ? "ring-2 ring-brand-primary" : ""
                                                        }`}
                                                    onClick={() => playRadioStation(genre)}
                                                >
                                                    <div className="flex items-start justify-between mb-4">
                                                        <RadioIcon className="size-8 text-brand-primary" />
                                                        <Button
                                                            size="icon"
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity bg-brand-primary hover:bg-brand-primary/80"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                playRadioStation(genre);
                                                            }}
                                                        >
                                                            <Shuffle className="size-4" />
                                                        </Button>
                                                    </div>
                                                    <h3 className="text-xl font-bold mb-1">{genre} Radio</h3>
                                                    <p className="text-sm text-text-secondary">
                                                        {stationSongs.length} tracks
                                                    </p>
                                                    {isPlaying && (
                                                        <div className="absolute bottom-4 right-4">
                                                            <div className="flex gap-1">
                                                                <div className="w-1 h-4 bg-brand-primary rounded-full animate-pulse" />
                                                                <div className="w-1 h-4 bg-brand-primary rounded-full animate-pulse delay-75" />
                                                                <div className="w-1 h-4 bg-brand-primary rounded-full animate-pulse delay-150" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Artist Stations - Future Feature */}
                                <div className="rounded-xl border border-white/10 p-8 text-center bg-white/5">
                                    <RadioIcon className="size-12 text-text-secondary mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">Artist Stations</h3>
                                    <p className="text-text-secondary">
                                        Coming soon! Create radio stations based on your favorite artists
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </ScrollArea>
        </PageTransition>
    );
};

export default RadioPage;
