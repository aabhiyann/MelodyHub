import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

interface ListeningActivityChartProps {
    data: {
        playedAt: string;
    }[];
}

export const ListeningActivityChart = ({ data }: ListeningActivityChartProps) => {
    // Aggregate plays by day
    const dailyPlays = data.reduce((acc, curr) => {
        const day = format(parseISO(curr.playedAt), "MMM dd");
        acc[day] = (acc[day] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(dailyPlays).map(([date, plays]) => ({
        date,
        plays,
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Fill in last 7 days if empty (optional improvement, keeping simple for now)

    return (
        <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
                    <Activity className="size-5 text-emerald-500" />
                    Listening Activity
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorPlays" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="#94a3b8"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#94a3b8"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                allowDecimals={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#18181b",
                                    border: "1px solid #334155",
                                    borderRadius: "8px",
                                    color: "#fff",
                                }}
                                itemStyle={{ color: "#10b981" }}
                            />
                            <Area
                                type="monotone"
                                dataKey="plays"
                                stroke="#10b981"
                                fillOpacity={1}
                                fill="url(#colorPlays)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};
