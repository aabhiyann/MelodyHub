import { useEffect } from "react";
import { useParams } from "react-router-dom"; // Fixed missing import for useParams? No it was there.
import { useMusicStore } from "@/stores/MusicStore";
import { Loader } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Song } from "@/types";
import React from "react";

const RadioPage = () => {
    const { songId } = useParams();
    const { fetchRadioStation } = useMusicStore();

    // We'll store radio songs in a local state or a specific store slice if we want to avoid polluting global songs
    // But for now let's assume fetchRadioStation returns songs and we display them.
    // Actually, looking at MusicStore implementation plan, `fetchRadioStation` returns a promise of Songs.
    // So we should manage state here or add a `radioSongs` to store.
    // Let's add local state for now to keep it simple.

    // WAIT, I should check if I added `radioSongs` to the store. 
    // In Step 6701, I added `fetchRadioStation` which RETURNS `Promise<Song[]>`.
    // It does NOT update a store state property.
    // So I need to use local state here.

    // Re-importing React hooks
    const [stationSongs, setStationSongs] = React.useState<Song[]>([]);
    const [pageLoading, setPageLoading] = React.useState(true);

    useEffect(() => {
        if (!songId) return;

        const loadRadio = async () => {
            setPageLoading(true);
            const fetchedSongs = await fetchRadioStation(songId);
            setStationSongs(fetchedSongs);
            setPageLoading(false);
        };

        loadRadio();
    }, [songId, fetchRadioStation]);

    if (pageLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="size-8 text-emerald-500 animate-spin" />
            </div>
        );
    }

    return (
        <ScrollArea className="h-full p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-2">Song Radio</h1>
                <p className="text-zinc-400">Based on your selection</p>
            </div>

            <div className="space-y-4">
                {/* Reusing existing list component if possible, otherwise simple mapping */}
                {stationSongs.length === 0 ? (
                    <div className="text-zinc-500">No similar songs found to generate a station.</div>
                ) : (
                    <div className="grid grid-cols-1 gap-2">
                        {stationSongs.map((song) => (
                            <div key={song._id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800/50 group transition-colors">
                                <img src={song.imageUrl} alt={song.title} className="size-12 rounded object-cover" />
                                <div className="flex-1">
                                    <div className="font-medium text-white">{song.title}</div>
                                    <div className="text-sm text-zinc-400">{song.artist}</div>
                                </div>
                                {/* Play button etc would go here */}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 
                Better yet: Use the existing generic Song List component if available.
                I see `SongsTable` or `FeaturedGrid`?
                `FeaturedGrid` is for cards.
                Let's use a nice list layout.
            */}
        </ScrollArea>
    );
};

export default RadioPage;
