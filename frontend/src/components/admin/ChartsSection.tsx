import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { useState } from 'react';

// Mock Data
const streamData = [
    { date: 'Mon', streams: 4000 },
    { date: 'Tue', streams: 3000 },
    { date: 'Wed', streams: 2000 },
    { date: 'Thu', streams: 2780 },
    { date: 'Fri', streams: 1890 },
    { date: 'Sat', streams: 2390 },
    { date: 'Sun', streams: 3490 },
];

const topSongsData = [
    { title: 'Midnight City', plays: 4000 },
    { title: 'Blinding Lights', plays: 3000 },
    { title: 'Levitating', plays: 2000 },
    { title: 'Starboy', plays: 2780 },
    { title: 'Heat Waves', plays: 1890 },
];

const genreData = [
    { name: 'Pop', value: 400 },
    { name: 'Rock', value: 300 },
    { name: 'Hip Hop', value: 300 },
    { name: 'Electronic', value: 200 },
    { name: 'Jazz', value: 100 },
];

const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EC4899'];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-3 rounded-lg shadow-xl">
                <p className="font-semibold text-sm mb-1">{label}</p>
                <p className="text-sm text-brand-primary">
                    {payload[0].value.toLocaleString()}
                    {payload[0].name === 'streams' ? ' streams' : ''}
                </p>
            </div>
        );
    }
    return null;
};

export const ChartsSection = () => {
    const [timeRange, setTimeRange] = useState('Weekly');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Area Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Streams Over Time</h3>
                    <div className="flex bg-zinc-100 dark:bg-white/5 p-1 rounded-lg">
                        {['Daily', 'Weekly', 'Monthly'].map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${timeRange === range
                                    ? 'bg-white dark:bg-zinc-800 text-brand-primary shadow-sm'
                                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                                    }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={streamData} margin={{ top: 5, right: 0, bottom: 0, left: -20 }}>
                            <defs>
                                <linearGradient id="colorStreams" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} vertical={false} />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#888' }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#888' }}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#8B5CF6', strokeWidth: 1, strokeDasharray: '4 4' }} />
                            <Area
                                type="monotone"
                                dataKey="streams"
                                stroke="#8B5CF6"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorStreams)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Side Charts Column */}
            <div className="space-y-6">
                {/* Bar Chart - Top Songs */}
                <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 rounded-xl p-6 h-[200px] flex flex-col">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Top Songs This Week</h3>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topSongsData}>
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', background: '#18181b', color: '#fff' }}
                                />
                                <Bar dataKey="plays" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart - Genre Distribution */}
                <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 rounded-xl p-6 h-[200px] flex flex-col">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Genre Distribution</h3>
                    <div className="flex-1 w-full min-h-0 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={genreData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={60}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {genreData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', background: '#18181b', color: '#fff' }} />
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Legend */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <span className="text-2xl font-bold block">{genreData.length}</span>
                            <span className="text-[10px] uppercase text-zinc-500 font-medium">Genres</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
