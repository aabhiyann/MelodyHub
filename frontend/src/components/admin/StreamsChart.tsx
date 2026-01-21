/**
 * StreamsChart - Line chart for daily/weekly streams
 * Professional analytics visualization with Recharts
 */

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { format, subDays } from 'date-fns';

interface StreamData {
    date: string;
    streams: number;
}

interface StreamsChartProps {
    data?: StreamData[];
    title?: string;
    showTrend?: boolean;
}

// Generate mock data (replace with real API data)
const generateMockStreamData = (days: number = 30): StreamData[] => {
    const data: StreamData[] = [];
    for (let i = days; i >= 0; i--) {
        const date = subDays(new Date(), i);
        data.push({
            date: format(date, 'MMM dd'),
            streams: Math.floor(Math.random() * 5000) + 2000,
        });
    }
    return data;
};

export const StreamsChart = ({
    data = generateMockStreamData(30),
    title = 'Daily Streams',
    showTrend = true,
}: StreamsChartProps) => {
    // Calculate trend
    const firstValue = data[0]?.streams || 0;
    const lastValue = data[data.length - 1]?.streams || 0;
    const trendPercentage = ((lastValue - firstValue) / firstValue * 100).toFixed(1);
    const isPositive = Number(trendPercentage) >= 0;

    return (
        <Card className='bg-white border-border'>
            <CardHeader>
                <div className='flex items-center justify-between'>
                    <CardTitle className='text-heading-md font-bold text-gray-900'>
                        {title}
                    </CardTitle>

                    {showTrend && (
                        <div
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-body-sm font-semibold ${isPositive
                                    ? 'bg-success/10 text-success'
                                    : 'bg-error/10 text-error'
                                }`}
                        >
                            <TrendingUp className={`size-4 ${!isPositive && 'rotate-180'}`} />
                            {trendPercentage}%
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent>
                <div className='h-[350px] w-full'>
                    <ResponsiveContainer width='100%' height='100%'>
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id='colorStreams' x1='0' y1='0' x2='0' y2='1'>
                                    <stop offset='5%' stopColor='#10b981' stopOpacity={0.3} />
                                    <stop offset='95%' stopColor='#10b981' stopOpacity={0} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' vertical={false} />

                            <XAxis
                                dataKey='date'
                                stroke='#6b7280'
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />

                            <YAxis
                                stroke='#6b7280'
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
                            />

                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                }}
                                labelStyle={{ color: '#374151', fontWeight: 600 }}
                                itemStyle={{ color: '#10b981' }}
                            />

                            <Area
                                type='monotone'
                                dataKey='streams'
                                stroke='#10b981'
                                strokeWidth={2}
                                fill='url(#colorStreams)'
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};
