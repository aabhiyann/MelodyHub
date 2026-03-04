import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMusicStore } from "@/stores/MusicStore";
import { usePlayerStore } from "@/stores/PlayerStore";
import { Radio as RadioIcon, AlertCircle, Play, Shuffle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Song } from "@/types";
import React from "react";
import { Button } from "@/components/ui/button";
import Topbar from "@/components/layout/TopBar";

const RadioPage = () => {
    const { songId } = useParams();
    const navigate = useNavigate();
    const { fetchRadioStation, songs, fetchSongs } = useMusicStore();
    const { setCurrentSong, playAlbum } = usePlayerStore();

    const [stationSongs, setStationSongs] = React.useState<Song[]>([]);
    const [seedSong, setSeedSong] = React.useState<Song | null>(null);
    const [pageLoading, setPageLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    // Handle missing songId by redirecting to a random song
    useEffect(() => {
        if (!songId && songs.length > 0) {
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
                // Find the seed song for station identity
                const seed = songs.find(s => s._id === songId) || fetchedSongs[0] || null;
                setSeedSong(seed);
            } catch (err) {
                console.error("Failed to load radio station:", err);
                setError("Failed to generate radio station. Please try another song.");
            } finally {
                setPageLoading(false);
            }
        };

        loadRadio();
    }, [songId, fetchRadioStation, songs]);

    const handlePlayAll = () => {
        if (stationSongs.length > 0) playAlbum(stationSongs, 0);
    };

    const handleShuffle = () => {
        if (stationSongs.length > 0) {
            const randomIndex = Math.floor(Math.random() * stationSongs.length);
            playAlbum(stationSongs, randomIndex);
        }
    };

    if (pageLoading) {
        return (
            <div className="h-full flex flex-col">
                <Topbar />
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    <div className="relative">
                        <RadioIcon className="size-12 text-brand-primary animate-pulse" />
                        <span className="absolute -top-1 -right-1 size-3 rounded-full bg-brand-primary animate-ping" />
                    </div>
                    <p className="text-zinc-400">Tuning your station...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full flex flex-col">
                <Topbar />
                <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
                    <AlertCircle className="size-16 text-red-500" />
                    <h2 className="text-2xl font-bold text-white">Oops!</h2>
                    <p className="text-zinc-400 text-center max-w-md">{error}</p>
                    <Button onClick={() => navigate('/home')} className="mt-4">
                        Back to Home
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <Topbar />
            <ScrollArea className="flex-1">
                {/* Station Hero Banner */}
                <div className="relative overflow-hidden">
                    {/* Blurred seed art background */}
                    {seedSong?.imageUrl && (
                        <div
                            className="absolute inset-0 opacity-20 blur-2xl scale-110 pointer-events-none"
                            style={{ backgroundImage: `url(${seedSong.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/60 to-zinc-950 pointer-events-none" />

                    <div className="relative z-10 p-6 pb-8 flex flex-col sm:flex-row items-start sm:items-end gap-6">
                        {/* Station art */}
                        <div className="relative size-32 sm:size-44 rounded-2xl overflow-hidden shadow-2xl shrink-0 border border-white/10">
                            {seedSong?.imageUrl ? (
                                <img src={seedSong.imageUrl} alt="Station" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                                    <RadioIcon className="size-12 text-brand-primary" />
                                </div>
                            )}
                            {/* Live indicator */}
                            <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm">
                                <span className="size-1.5 rounded-full bg-brand-primary animate-pulse" />
                                <span className="text-[10px] font-bold text-white uppercase tracking-wide">Live</span>
                            </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-widest text-brand-primary mb-1">Song Radio</p>
                            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight truncate">
                                {seedSong ? `${seedSong.title} Radio` : 'Your Station'}
                            </h1>
                            {seedSong && (
                                <p className="text-zinc-400 mt-1">Based on <span className="text-white">{seedSong.artist}</span></p>
                            )}
                            <p className="text-zinc-500 text-sm mt-1">{stationSongs.length} songs</p>

                            <div className="flex items-center gap-3 mt-4">
                                <button
                                    onClick={handlePlayAll}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-primary text-black font-bold text-sm hover:scale-105 transition-transform shadow-lg"
                                >
                                    <Play className="size-4 fill-black" />
                                    Play Station
                                </button>
                                <button
                                    onClick={handleShuffle}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 text-white font-medium text-sm hover:bg-white/20 transition-colors"
                                >
                                    <Shuffle className="size-4" />
                                    Shuffle
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Song List */}
                <div className="p-6 pt-4 space-y-1">
                    {stationSongs.length === 0 ? (
                        <div className="text-zinc-500 text-center py-12">No similar songs found to generate a station.</div>
                    ) : (
                        stationSongs.map((song, index) => (
                            <div
                                key={song._id}
                                onClick={() => setCurrentSong(song)}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 group transition-colors cursor-pointer"
                            >
                                <span className="text-zinc-600 text-sm w-5 text-center shrink-0 group-hover:hidden">{index + 1}</span>
                                <Play className="size-4 text-white fill-white hidden group-hover:block shrink-0" />
                                <div className="relative size-11 rounded overflow-hidden shrink-0">
                                    <img src={song.imageUrl} alt={song.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-white truncate group-hover:text-brand-primary transition-colors">{song.title}</div>
                                    <div className="text-sm text-zinc-400 truncate">{song.artist}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    );
};

export default RadioPage;
