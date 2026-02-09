import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { format, parseISO } from "date-fns";
import { BarChart3 } from "lucide-react";

interface ListeningChartProps {
    data: { date: string; plays: number }[];
}

export const ListeningChart = ({ data }: ListeningChartProps) => {
    const chartData = data.map((d) => ({
        ...d,
        label: format(parseISO(d.date), "MMM d"),
    }));

    if (chartData.length === 0) {
        return (
            <div className="glass-panel p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <BarChart3 className="size-5 text-brand-primary" />
                    <h3 className="text-lg font-bold text-white">Listening Over Time</h3>
                </div>
                <p className="text-zinc-500 text-center py-12">Start listening to see your activity!</p>
            </div>
        );
    }

    return (
        <div className="glass-panel p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="size-5 text-brand-primary" />
                <h3 className="text-lg font-bold text-white">Listening Over Time (Last 30 Days)</h3>
            </div>
            <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(date) => format(parseISO(date), "MMM d")}
                            stroke="#94a3b8"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#18181b",
                                border: "1px solid #334155",
                                borderRadius: "8px",
                                color: "#fff",
                            }}
                            labelFormatter={(label) => (typeof label === "string" ? format(parseISO(label), "MMM d, yyyy") : label)}
                        />
                        <Line
                            type="monotone"
                            dataKey="plays"
                            stroke="var(--brand-primary, #a855f7)"
                            strokeWidth={2}
                            dot={{ fill: "var(--brand-primary)", r: 3 }}
                            activeDot={{ r: 5 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
