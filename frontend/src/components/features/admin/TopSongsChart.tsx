/**
 * TopSongsChart - Horizontal bar chart for top songs by plays
 * Clean, professional visualization for rankings
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music } from 'lucide-react';

interface SongData {
    name: string;
    artist: string;
    plays: number;
}

interface TopSongsChartProps {
    data?: SongData[];
    limit?: number;
}

// Generate mock data (replace with real API data)
const generateMockTopSongs = (): SongData[] => {
    return [
        { name: 'Midnight City', artist: 'M83', plays: 12450 },
        { name: 'Starboy', artist: 'The Weeknd', plays: 11200 },
        { name: 'Blinding Lights', artist: 'The Weeknd', plays: 10800 },
        { name: 'Shape of You', artist: 'Ed Sheeran', plays: 9500 },
        { name: 'Levitating', artist: 'Dua Lipa', plays: 8900 },
        { name: 'Sunflower', artist: 'Post Malone', plays: 8200 },
        { name: 'Circles', artist: 'Post Malone', plays: 7800 },
        { name: 'Dynamite', artist: 'BTS', plays: 7200 },
        { name: 'Watermelon Sugar', artist: 'Harry Styles', plays: 6900 },
        { name: 'Don\'t Start Now', artist: 'Dua Lipa', plays: 6500 },
    ];
};

const COLORS = [
    '#10b981', // 1st - brand green
    '#8b5cf6', // 2nd - purple
    '#06b6d4', // 3rd - cyan
    '#6b7280', // 4th+ - gray
    '#6b7280',
    '#6b7280',
    '#6b7280',
    '#6b7280',
    '#6b7280',
    '#6b7280',
];

export const TopSongsChart = ({ data = generateMockTopSongs(), limit = 10 }: TopSongsChartProps) => {
    const displayData = data.slice(0, limit);

    return (
        <Card className='bg-white border-border'>
            <CardHeader>
                <CardTitle className='text-heading-md font-bold text-gray-900 flex items-center gap-2'>
                    <Music className='size-5 text-brand-primary' />
                    Top Songs
                </CardTitle>
            </CardHeader>

            <CardContent>
                <div className='h-[400px] w-full'>
                    <ResponsiveContainer width='100%' height='100%'>
                        <BarChart
                            data={displayData}
                            layout='vertical'
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' horizontal={false} />

                            <XAxis
                                type='number'
                                stroke='#6b7280'
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
                            />

                            <YAxis
                                type='category'
                                dataKey='name'
                                stroke='#6b7280'
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                width={150}
                                tickFormatter={(value, index) => {
                                    return `${index + 1}. ${value.length > 20 ? value.substring(0, 17) + '...' : value}`;
                                }}
                            />

                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                }}
                                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                formatter={(value: any, _name, props) => [
                                    `${value.toLocaleString()} plays`,
                                    `${props.payload.name} - ${props.payload.artist}`,
                                ]}
                            />

                            <Bar dataKey='plays' radius={[0, 4, 4, 0]}>
                                {displayData.map((_entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className='mt-4 flex items-center justify-center gap-6 text-body-sm text-gray-600'>
                    <div className='flex items-center gap-2'>
                        <div className='size-3 rounded-full bg-brand-primary' />
                        <span>#1</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <div className='size-3 rounded-full bg-purple-500' />
                        <span>#2</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <div className='size-3 rounded-full bg-cyan-500' />
                        <span>#3</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <div className='size-3 rounded-full bg-gray-500' />
                        <span>#4-10</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
