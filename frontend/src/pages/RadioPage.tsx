import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMusicStore } from "@/stores/MusicStore";
import { Loader, Radio as RadioIcon, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Song } from "@/types";
import React from "react";
import { Button } from "@/components/ui/button";

const RadioPage = () => {
    const { songId } = useParams();
    const navigate = useNavigate();
    const { fetchRadioStation, songs, fetchSongs } = useMusicStore();

    const [stationSongs, setStationSongs] = React.useState<Song[]>([]);
    const [pageLoading, setPageLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    // Handle missing songId by redirecting to a random song
    useEffect(() => {
        if (!songId && songs.length > 0) {
            // Pick a random song to generate radio from
            const randomSong = songs[Math.floor(Math.random() * songs.length)];
            navigate(`/radio/${randomSong._id}`, { replace: true });
        }
    }, [songId, songs, navigate]);

    // Fetch songs if not loaded yet
    useEffect(() => {
        if (songs.length === 0) {
            fetchSongs();
        }
    }, [songs.length, fetchSongs]);

    // Load radio station when songId is available
    useEffect(() => {
        if (!songId) return;

        const loadRadio = async () => {
            setPageLoading(true);
            setError(null);
            try {
                const fetchedSongs = await fetchRadioStation(songId);
                if (fetchedSongs.length === 0) {
                    setError("No similar songs found to generate a station.");
                }
                setStationSongs(fetchedSongs);
            } catch (err) {
                console.error("Failed to load radio station:", err);
                setError("Failed to generate radio station. Please try another song.");
            } finally {
                setPageLoading(false);
            }
        };

        loadRadio();
    }, [songId, fetchRadioStation]);

    if (pageLoading) {
        return (
            <div className="h-full flex flex-col items-center justify-center gap-4">
                <Loader className="size-8 text-brand-primary animate-spin" />
                <p className="text-zinc-400">Generating your radio station...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full flex flex-col items-center justify-center gap-4 p-6">
                <AlertCircle className="size-16 text-red-500" />
                <h2 className="text-2xl font-bold text-white">Oops!</h2>
                <p className="text-zinc-400 text-center max-w-md">{error}</p>
                <Button onClick={() => navigate('/home')} className="mt-4">
                    Back to Home
                </Button>
            </div>
        );
    }

    return (
        <ScrollArea className="h-full p-6">
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <RadioIcon className="size-8 text-brand-primary" />
                    <h1 className="text-3xl font-bold text-white">Song Radio</h1>
                </div>
                <p className="text-zinc-400">
                    Based on your selection • {stationSongs.length} similar songs
                </p>
            </div>

            <div className="space-y-4">
                {stationSongs.length === 0 ? (
                    <div className="text-zinc-500">No similar songs found to generate a station.</div>
                ) : (
                    <div className="grid grid-cols-1 gap-2">
                        {stationSongs.map((song) => (
                            <div key={song._id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800/50 group transition-colors cursor-pointer">
                                <img src={song.imageUrl} alt={song.title} className="size-12 rounded object-cover" />
                                <div className="flex-1">
                                    <div className="font-medium text-white">{song.title}</div>
                                    <div className="text-sm text-zinc-400">{song.artist}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </ScrollArea>
    );
};

export default RadioPage;
