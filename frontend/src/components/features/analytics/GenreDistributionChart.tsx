import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Disc } from "lucide-react";

interface GenreDistributionChartProps {
    genres: string[];
}

const COLORS = ["#22C55E", "#3B82F6", "#06b6d4", "#f59e0b", "#ef4444"];

export const GenreDistributionChart = ({ genres }: GenreDistributionChartProps) => {
    // Aggregate genres from the list
    // Note: If backend sends just a list of favorite genres, we allocate equal weight or just list them.
    // Ideally userPref.favoriteGenres is just an array of strings ["Pop", "Rock"].
    // To make a pie chart we need values.
    // For now, let's assume we map them equally or find counts from history if possible.
    // Actually, looking at the store data, we have `favoriteGenres: string[]`.
    // Let's visualize them as tags if we can't do a chart, OR if we had data like { genre: count } we could do a chart.
    // BUT! We also have `listeningHistory` which contains songs. Songs have `genre` (maybe).
    // Let's stick to a simple placeholder or a donut chart if we have data, otherwise just a list.
    // Wait, the detailed implementation plan said "Pie/Bar chart".
    // I will mock the weights for now based on the array length simply to show the component,
    // OR deeper: Iterate through listening history to count genres.

    // Fallback: Just visualization of the "Top Genres" as a list is safer if we don't have counts.
    // But let's look at `UserPreference` model: `favoriteGenres: []` are just strings.
    // Charts need numbers.
    // Let's create a visual "Genre DNA" donut using equal slices for user's favorites for now, 
    // simulating "Your Mix".

    const data = genres.map((genre) => ({
        name: genre,
        value: 1, // Equal weight for favorites
    }));

    if (data.length === 0) {
        return (
            <Card className="bg-zinc-900 border-zinc-800 h-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
                        <Disc className="size-5 text-emerald-500" />
                        Top Genres
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[300px] text-zinc-500">
                    No genres data yet
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-zinc-900 border-zinc-800 h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
                    <Disc className="size-5 text-emerald-500" />
                    Top Genres
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((_entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#18181b",
                                    border: "1px solid #334155",
                                    borderRadius: "8px",
                                    color: "#fff",
                                }}
                                itemStyle={{ color: "#fff" }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Center Label */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">{genres.length}</div>
                            <div className="text-xs text-zinc-400">Genres</div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                    {genres.map((genre, i) => (
                        <div key={genre} className="flex items-center gap-1.5 text-xs text-zinc-400">
                            <div className="size-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                            {genre}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
