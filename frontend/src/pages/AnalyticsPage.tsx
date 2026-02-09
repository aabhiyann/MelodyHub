import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { axiosInstance } from "@/lib/axios";
import Topbar from "@/components/layout/TopBar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StatsCard } from "@/components/features/analytics/StatsCard";
import { ListeningChart } from "@/components/features/analytics/ListeningChart";
import { TopArtistsGrid } from "@/components/features/analytics/TopArtistsGrid";
import { RecentlyPlayed } from "@/components/features/analytics/RecentlyPlayed";
import { ListeningPatternsHeatmap } from "@/components/features/analytics/ListeningPatternsHeatmap";
import { GenreDistributionChart } from "@/components/features/analytics/GenreDistributionChart";
import { Clock, Disc3, Play, TrendingUp, User } from "lucide-react";

type Period = "week" | "month" | "year" | "all";

interface DashboardData {
    totalListeningTime: number;
    totalPlays: number;
    totalLikes: number;
    topArtists: { artist: string; playCount: number }[];
    topGenres: { genre: string; percentage: number }[];
    discoveryRate: number;
    skipRate: number;
    listeningByDay: { date: string; plays: number }[];
}

interface ListeningHistoryResponse {
    data: {
        songId?: { _id: string; title?: string; artist?: string; imageUrl?: string };
        playedAt: string;
    }[];
}

interface ListeningPatternsData {
    hourOfDay: { hour: number; playCount: number }[];
    dayOfWeek: { day: string; playCount: number }[];
    mostActiveTime: string;
}

const AnalyticsPage = () => {
    const { user } = useUser();
    const [period, setPeriod] = useState<Period>("all");
    const [dashboard, setDashboard] = useState<DashboardData | null>(null);
    const [listeningHistory, setListeningHistory] = useState<ListeningHistoryResponse["data"]>([]);
    const [patterns, setPatterns] = useState<ListeningPatternsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setIsLoading(false);
            return;
        }
        const fetchAll = async () => {
            setIsLoading(true);
            try {
                const [dashboardRes, historyRes, patternsRes] = await Promise.all([
                    axiosInstance.get<{ success: boolean; data: DashboardData }>(
                        `/analytics/dashboard?period=${period}`
                    ),
                    axiosInstance.get<{ success: boolean; data: ListeningHistoryResponse["data"] }>(
                        "/analytics/listening-history?page=1&limit=20"
                    ),
                    axiosInstance.get<{ success: boolean; data: ListeningPatternsData }>(
                        "/analytics/listening-patterns"
                    ),
                ]);
                if (dashboardRes.data.success && dashboardRes.data.data)
                    setDashboard(dashboardRes.data.data);
                if (historyRes.data.success && Array.isArray((historyRes.data as any).data))
                    setListeningHistory((historyRes.data as any).data);
                if (patternsRes.data.success && patternsRes.data.data) setPatterns(patternsRes.data.data);
            } catch (error) {
                console.error("Failed to fetch analytics", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAll();
    }, [user, period]);

    const listeningTimeMinutes = dashboard
        ? Math.round(dashboard.totalListeningTime / 60)
        : 0;
    const uniqueArtists = dashboard?.topArtists?.length ?? 0;
    const genreNames = dashboard?.topGenres?.map((g) => g.genre) ?? [];

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-primary" />
            </div>
        );
    }

    return (
        <main className="rounded-md overflow-hidden h-full bg-transparent">
            <Topbar />
            <ScrollArea className="h-[calc(100vh-180px)]">
                <div className="p-6 space-y-8">
                    {/* Header + Period */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-surface-elevated/50 backdrop-blur-md border border-white/5">
                                <TrendingUp className="size-8 text-brand-primary" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-white mb-1">Your Analytics</h1>
                                <p className="text-zinc-400">Insights into your listening habits</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {(["week", "month", "year", "all"] as const).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPeriod(p)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                                        period === p
                                            ? "bg-brand-primary text-white"
                                            : "bg-white/5 text-zinc-400 hover:bg-white/10"
                                    }`}
                                >
                                    {p === "all" ? "All time" : p}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatsCard
                            icon={Play}
                            label="Total Plays"
                            value={dashboard?.totalPlays ?? 0}
                            color="text-emerald-400"
                            bgColor="bg-emerald-400/10"
                        />
                        <StatsCard
                            icon={Clock}
                            label="Listening Time"
                            value={`${listeningTimeMinutes}m`}
                            subLabel="(Est.)"
                            color="text-blue-400"
                            bgColor="bg-blue-400/10"
                        />
                        <StatsCard
                            icon={User}
                            label="Top Artists"
                            value={uniqueArtists}
                            color="text-purple-400"
                            bgColor="bg-purple-400/10"
                        />
                        <StatsCard
                            icon={Disc3}
                            label="Songs Discovered"
                            value={`${dashboard?.discoveryRate ?? 0}%`}
                            color="text-pink-400"
                            bgColor="bg-pink-400/10"
                        />
                    </div>

                    {/* Line chart + Top Genres */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <ListeningChart data={dashboard?.listeningByDay ?? []} />
                        <GenreDistributionChart genres={genreNames} />
                    </div>

                    {/* Top Artists + Recently Played */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <TopArtistsGrid artists={dashboard?.topArtists ?? []} />
                        <RecentlyPlayed items={listeningHistory} />
                    </div>

                    {/* Listening patterns heatmap */}
                    {patterns && (
                        <ListeningPatternsHeatmap
                            hourOfDay={patterns.hourOfDay}
                            dayOfWeek={patterns.dayOfWeek}
                            mostActiveTime={patterns.mostActiveTime}
                        />
                    )}
                </div>
            </ScrollArea>
        </main>
    );
};

export default AnalyticsPage;
