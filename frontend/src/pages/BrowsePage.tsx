import { useState, useEffect } from "react";
import { useMusicStore } from "@/stores/MusicStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BrowsePage = () => {
    const [activeTab, setActiveTab] = useState("all");
    const { songs, fetchAlbums, fetchSongs, isLoading } = useMusicStore();

    useEffect(() => {
        fetchAlbums();
        fetchSongs();
    }, [fetchAlbums, fetchSongs]);

    // Group songs by genre
    const genreSongs = songs.reduce((acc, song) => {
        const genre = song.genre || "Other";
        if (!acc[genre]) acc[genre] = [];
        acc[genre].push(song);
        return acc;
    }, {} as Record<string, typeof songs>);

    const genres = Object.keys(genreSongs).sort();

    return (
        <PageTransition>
            <ScrollArea className="h-full">
                <div className="p-4 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-4xl md:text-6xl font-bold mb-2">Browse</h1>
                            <p className="text-text-secondary text-lg">
                                Discover music by genre
                            </p>
                        </div>

                        {isLoading ? (
                            <div className="flex items-center justify-center h-96">
                                <Loader className="size-8 text-brand-primary animate-spin" />
                            </div>
                        ) : (
                            <Tabs value={activeTab} onValueChange={setActiveTab}>
                                <TabsList className="mb-6">
                                    <TabsTrigger value="all">All</TabsTrigger>
                                    {genres.map((genre) => (
                                        <TabsTrigger key={genre} value={genre.toLowerCase()}>
                                            {genre}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>

                                <TabsContent value="all">
                                    <div className="space-y-8">
                                        <div className="mb-6">
                                            <h2 className="text-3xl font-bold mb-2">All Music</h2>
                                            <p className="text-text-secondary text-lg font-medium">{songs.length} songs available</p>
                                        </div>

                                        {genres.map((genre) => (
                                            <div key={genre} className="space-y-4">
                                                <h2 className="text-2xl font-bold">{genre}</h2>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                                    {genreSongs[genre].slice(0, 5).map((song) => (
                                                        <div
                                                            key={song._id}
                                                            className="group cursor-pointer"
                                                        >
                                                            <div className="relative aspect-square mb-3 rounded-lg overflow-hidden shadow-lg">
                                                                <img
                                                                    src={song.imageUrl}
                                                                    alt={song.title}
                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                                />
                                                            </div>
                                                            <h3 className="font-semibold truncate">{song.title}</h3>
                                                            <p className="text-sm text-text-secondary truncate">
                                                                {song.artist}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>

                                {genres.map((genre) => (
                                    <TabsContent key={genre} value={genre.toLowerCase()}>
                                        <div className="space-y-6">
                                            <h2 className="text-3xl font-bold">{genre} Music</h2>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                                {genreSongs[genre].map((song) => (
                                                    <div
                                                        key={song._id}
                                                        className="group cursor-pointer"
                                                    >
                                                        <div className="relative aspect-square mb-3 rounded-lg overflow-hidden shadow-lg">
                                                            <img
                                                                src={song.imageUrl}
                                                                alt={song.title}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                            />
                                                        </div>
                                                        <h3 className="font-semibold truncate text-sm">
                                                            {song.title}
                                                        </h3>
                                                        <p className="text-xs text-text-secondary truncate">
                                                            {song.artist}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </TabsContent>
                                ))}
                            </Tabs>
                        )}
                    </div>
                </div>
            </ScrollArea>
        </PageTransition>
    );
};

export default BrowsePage;
