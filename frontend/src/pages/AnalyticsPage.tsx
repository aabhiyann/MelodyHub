import { useEffect } from "react";
import { useAnalyticsStore } from "@/stores/AnalyticsStore";
import { ListeningActivityChart } from "@/components/analytics/ListeningActivityChart";
import { GenreDistributionChart } from "@/components/analytics/GenreDistributionChart";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Headphones, Heart, Music } from "lucide-react";
import { motion } from "framer-motion";

const AnalyticsPage = () => {
    const { fetchUserStats, stats, isLoading } = useAnalyticsStore();

    useEffect(() => {
        fetchUserStats();
    }, [fetchUserStats]);

    if (isLoading && !stats) {
        return (
            <div className="flex items-center justify-center h-full text-zinc-500">
                Loading your stats...
            </div>
        );
    }

    if (!stats) return null;

    const summaryStats = [
        {
            label: "Total Plays",
            value: stats.totalPlays.toString(),
            icon: Headphones,
            color: "text-emerald-500",
            bgColor: "bg-emerald-500/10",
        },
        {
            label: "Liked Songs",
            value: stats.likedSongsCount.toString(),
            icon: Heart,
            color: "text-pink-500",
            bgColor: "bg-pink-500/10",
        },
        {
            label: "Favorite Genres",
            value: stats.favoriteGenres.length.toString(),
            icon: Music,
            color: "text-violet-500",
            bgColor: "bg-violet-500/10",
        },
    ];

    return (
        <ScrollArea className="h-full">
            <div className="p-6 space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-2"
                >
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                        Your Dashboard
                    </h1>
                    <p className="text-zinc-400">
                        Insights into your listening habits
                    </p>
                </motion.div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {summaryStats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex items-center gap-4 hover:border-zinc-700 transition-colors"
                        >
                            <div className={`p-3 rounded-full ${stat.bgColor}`}>
                                <stat.icon className={`size-6 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-zinc-400 text-sm font-medium">{stat.label}</p>
                                <p className="text-2xl font-bold text-white">{stat.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <ListeningActivityChart data={stats.listeningHistory} />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <GenreDistributionChart genres={stats.favoriteGenres} />
                    </motion.div>
                </div>

                {/* Listening History List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
                >
                    <div className="p-4 border-b border-zinc-800">
                        <h3 className="font-semibold text-white">Recent Activity</h3>
                    </div>
                    <div className="divide-y divide-zinc-800">
                        {stats.listeningHistory.slice().reverse().slice(0, 5).map((play, i) => (
                            <div key={i} className="p-4 flex items-center justify-between hover:bg-zinc-800/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-white">
                                            {play.songId?.title || "Unknown Song"}
                                        </p>
                                        <p className="text-xs text-zinc-400">
                                            {play.songId?.artist || "Unknown Artist"}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-xs text-zinc-500">
                                    {new Date(play.playedAt).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                        {stats.listeningHistory.length === 0 && (
                            <div className="p-8 text-center text-zinc-500 text-sm">
                                No listening history yet. Start playing some music!
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </ScrollArea>
    );
};

export default AnalyticsPage;
