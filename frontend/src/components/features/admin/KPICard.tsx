/**
 * KPICard - Premium KPI card with trend indicators and sparklines
 * Inspired by Vercel, Linear, and Stripe dashboards
 */

import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { cn } from '@/lib/utils';

interface KPICardProps {
    title: string;
    value: number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    prefix?: string;
    suffix?: string;
    sparklineData?: number[];
    className?: string;
}

export const KPICard = ({
    title,
    value,
    icon: Icon,
    trend,
    prefix = '',
    suffix = '',
    sparklineData,
    className,
}: KPICardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
            transition={{ duration: 0.2 }}
        >
            <Card variant="elevated" className={cn('bg-white border-border', className)}>
                <CardHeader className='flex flex-row items-center justify-between pb-2'>
                    <span className='text-body-sm font-medium text-gray-600'>{title}</span>
                    <div className='p-2 rounded-lg bg-brand-primary/10'>
                        <Icon className='size-4 text-brand-primary' />
                    </div>
                </CardHeader>

                <CardContent className='space-y-2'>
                    {/* Value */}
                    <div className='flex items-baseline gap-2'>
                        <span className='text-display-md font-bold text-gray-900'>
                            {prefix}
                            <CountUp end={value} duration={1} separator=',' />
                            {suffix}
                        </span>

                        {/* Trend indicator */}
                        {trend && (
                            <div
                                className={cn(
                                    'flex items-center gap-1 px-2 py-1 rounded-full text-body-xs font-semibold',
                                    trend.isPositive
                                        ? 'bg-success/10 text-success'
                                        : 'bg-error/10 text-error'
                                )}
                            >
                                {trend.isPositive ? (
                                    <TrendingUp className='size-3' />
                                ) : (
                                    <TrendingDown className='size-3' />
                                )}
                                {Math.abs(trend.value)}%
                            </div>
                        )}
                    </div>

                    {/* Sparkline */}
                    {sparklineData && sparklineData.length > 0 && (
                        <div className='h-8'>
                            <Sparkline data={sparklineData} />
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};

// Simple sparkline component
const Sparkline = ({ data }: { data: number[] }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data
        .map((value, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - ((value - min) / range) * 100;
            return `${x},${y}`;
        })
        .join(' ');

    return (
        <svg viewBox='0 0 100 100' className='w-full h-full' preserveAspectRatio='none'>
            <polyline
                points={points}
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                className='text-brand-primary opacity-70'
            />
            <polyline
                points={`0,100 ${points} 100,100`}
                fill='url(#gradient)'
                opacity='0.2'
            />
            <defs>
                <linearGradient id='gradient' x1='0%' y1='0%' x2='0%' y2='100%'>
                    <stop offset='0%' stopColor='currentColor' stopOpacity='0.3' />
                    <stop offset='100%' stopColor='currentColor' stopOpacity='0' />
                </linearGradient>
            </defs>
        </svg>
    );
};
