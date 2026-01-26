import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { axiosInstance } from "@/lib/axios";
import Topbar from "@/components/Topbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LiquidGlassCard } from "@/components/ui/LiquidGlassCard";
import { BarChart3, Clock, Disc3, Music, Play, TrendingUp, User } from "lucide-react";

interface AnalyticsData {
    favoriteGenres: string[];
    favoriteArtists: string[];
    likedSongsCount: number;
    totalPlays: number;
    listeningHistory: {
        songId: {
            _id: string;
            title: string;
            artist: string;
            imageUrl: string;
        };
        playedAt: string;
    }[];
}

const AnalyticsPage = () => {
    const { user } = useUser();
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await axiosInstance.get("/analytics/user-preferences");
                setData(response.data.data);
            } catch (error) {
                console.error("Failed to fetch analytics", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) fetchAnalytics();
    }, [user]);

    // Derived Stats
    const uniqueArtists = new Set(data?.listeningHistory.map(h => h.songId?.artist).filter(Boolean)).size;
    const uniqueGenres = new Set(data?.favoriteGenres).size;

    // Top Genres Calculation (mock if empty, otherwise real)
    // improving logic: Backend returns favoriteGenres as array of strings, 
    // but standard approach is to count frequency from history if backend doesn't give counts.
    // For MVP, let's assume `favoriteGenres` is just a list. 
    // Let's count genres from history for the chart if possible, or just list favorites.
    // Actually, `listeningHistory` has songId which might have genre? 
    // The backend `getUserPreferences` populates `listeningHistory.songId`.
    // Let's assume song object has genre.
    // If not, we'll fall back to `data?.favoriteGenres` which is likely just an ordered list.

    const processTopGenres = () => {
        if (!data?.listeningHistory) return [];
        const genreCounts: Record<string, number> = {};
        data.listeningHistory.forEach(item => {
            // Assuming song model has genre, but the Type might fail if backend doesn't return it.
            // Let's check `UserPreference` populate. It populates `songId`.
            // Song model has `genre`. So it should be there.
            const genre = (item.songId as any)?.genre;
            if (genre) {
                genreCounts[genre] = (genreCounts[genre] || 0) + 1;
            }
        });
        return Object.entries(genreCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([name, count]) => ({ name, count }));
    };

    const topGenres = processTopGenres();
    const maxGenreCount = Math.max(...topGenres.map(g => g.count), 1);

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-primary"></div>
            </div>
        );
    }

    return (
        <main className="rounded-md overflow-hidden h-full bg-transparent">
            <Topbar />
            <ScrollArea className="h-[calc(100vh-180px)]">
                <div className="p-6 space-y-8">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-surface-elevated/50 backdrop-blur-md border border-white/5">
                            <TrendingUp className="size-8 text-brand-primary" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-1">Your Analytics</h1>
                            <p className="text-zinc-400">Insights into your listening habits</p>
                        </div>
                    </div>

                    {/* Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatsCard
                            icon={Play}
                            label="Total Plays"
                            value={data?.totalPlays || 0}
                            color="text-emerald-400"
                            bgColor="bg-emerald-400/10"
                        />
                        <StatsCard
                            icon={Clock}
                            label="Listening Time"
                            value={`${Math.round((data?.totalPlays || 0) * 3.5)}m`} // Approx 3.5 mins per song
                            subLabel="(Est.)"
                            color="text-blue-400"
                            bgColor="bg-blue-400/10"
                        />
                        <StatsCard
                            icon={User}
                            label="Unique Artists"
                            value={uniqueArtists}
                            color="text-purple-400"
                            bgColor="bg-purple-400/10"
                        />
                        <StatsCard
                            icon={Disc3}
                            label="Genres Explored"
                            value={uniqueGenres || topGenres.length}
                            color="text-pink-400"
                            bgColor="bg-pink-400/10"
                        />
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Top Genres Chart */}
                        <div className="glass-panel p-6 rounded-2xl">
                            <div className="flex items-center gap-3 mb-6">
                                <BarChart3 className="size-5 text-brand-primary" />
                                <h3 className="text-lg font-bold text-white">Top Genres</h3>
                            </div>

                            <div className="space-y-4">
                                {topGenres.length === 0 ? (
                                    <p className="text-zinc-500 text-center py-8">Start listening to see your top genres!</p>
                                ) : (
                                    topGenres.map((genre, index) => (
                                        <div key={genre.name} className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-white font-medium">{genre.name}</span>
                                                <span className="text-zinc-400">{genre.count} plays</span>
                                            </div>
                                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full transform origin-left transition-transform duration-1000 ease-out"
                                                    style={{ width: `${(genre.count / maxGenreCount) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Recent History */}
                        <div className="glass-panel p-6 rounded-2xl">
                            <div className="flex items-center gap-3 mb-6">
                                <Clock className="size-5 text-brand-primary" />
                                <h3 className="text-lg font-bold text-white">Recent Activity</h3>
                            </div>

                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {data?.listeningHistory.length === 0 ? (
                                    <p className="text-zinc-500 text-center py-8">No listening history yet.</p>
                                ) : (
                                    data?.listeningHistory.slice().reverse().slice(0, 20).map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group">
                                            <div className="relative size-10 rounded overflow-hidden">
                                                <img
                                                    src={item.songId?.imageUrl || "/placeholder.jpg"}
                                                    alt={item.songId?.title}
                                                    className="object-cover w-full h-full"
                                                />
                                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Music className="size-4 text-white" />
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-white truncate">{item.songId?.title || "Unknown Song"}</p>
                                                <p className="text-xs text-zinc-400 truncate">{item.songId?.artist || "Unknown Artist"}</p>
                                            </div>
                                            <span className="text-xs text-zinc-500">
                                                {new Date(item.playedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </main>
    );
};

const StatsCard = ({ icon: Icon, label, value, subLabel, color, bgColor }: any) => (
    <div className="glass-panel p-4 rounded-xl flex items-center gap-4 hover:bg-surface-elevated/40 transition-colors">
        <div className={`p-3 rounded-lg ${bgColor}`}>
            <Icon className={`size-5 ${color}`} />
        </div>
        <div>
            <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider">{label}</p>
            <div className="flex items-baseline gap-1">
                <h4 className="text-2xl font-bold text-white">{value}</h4>
                {subLabel && <span className="text-xs text-zinc-500">{subLabel}</span>}
            </div>
        </div>
    </div>
);

export default AnalyticsPage;
