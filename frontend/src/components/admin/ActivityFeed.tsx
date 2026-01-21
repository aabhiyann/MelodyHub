/**
 * ActivityFeed - Recent activity timeline for admin dashboard
 * Shows uploads, user signups, and other events
 */

import { motion } from 'framer-motion';
import { Music, UserPlus, Album, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
    id: string;
    type: 'upload' | 'signup' | 'album' | 'milestone';
    title: string;
    description: string;
    timestamp: Date;
    user?: string;
}

interface ActivityFeedProps {
    activities?: Activity[];
    limit?: number;
}

const ACTIVITY_ICONS = {
    upload: Music,
    signup: UserPlus,
    album: Album,
    milestone: TrendingUp,
};

const ACTIVITY_COLORS = {
    upload: 'text-brand-primary bg-brand-primary/10',
    signup: 'text-blue-500 bg-blue-500/10',
    album: 'text-purple-500 bg-purple-500/10',
    milestone: 'text-success bg-success/10',
};

export const ActivityFeed = ({ activities = [], limit = 10 }: ActivityFeedProps) => {
    const displayActivities = activities.slice(0, limit);

    return (
        <Card className='bg-white border-border'>
            <CardHeader>
                <CardTitle className='text-heading-md font-bold text-gray-900'>
                    Recent Activity
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className='space-y-4'>
                    {displayActivities.length === 0 ? (
                        <p className='text-body-md text-gray-500 text-center py-8'>
                            No recent activity
                        </p>
                    ) : (
                        displayActivities.map((activity, index) => {
                            const Icon = ACTIVITY_ICONS[activity.type];
                            const colorClass = ACTIVITY_COLORS[activity.type];

                            return (
                                <motion.div
                                    key={activity.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className='flex gap-4'
                                >
                                    {/* Icon */}
                                    <div className={`p-2 rounded-lg ${colorClass} flex-shrink-0`}>
                                        <Icon className='size-4' />
                                    </div>

                                    {/* Content */}
                                    <div className='flex-1 min-w-0'>
                                        <p className='text-body-md font-medium text-gray-900 truncate'>
                                            {activity.title}
                                        </p>
                                        <p className='text-body-sm text-gray-600 truncate'>
                                            {activity.description}
                                        </p>
                                        <p className='text-body-xs text-gray-500 mt-1'>
                                            {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

// Mock data generator for demo
export const generateMockActivities = (): Activity[] => {
    return [
        {
            id: '1',
            type: 'upload',
            title: 'New song uploaded',
            description: 'Midnight City by M83',
            timestamp: new Date(Date.now() - 5 * 60 * 1000),
        },
        {
            id: '2',
            type: 'signup',
            title: 'New user joined',
            description: 'john@example.com signed up',
            timestamp: new Date(Date.now() - 15 * 60 * 1000),
        },
        {
            id: '3',
            type: 'album',
            title: 'Album created',
            description: 'Hurry Up, We\'re Dreaming',
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
        },
        {
            id: '4',
            type: 'milestone',
            title: 'Milestone reached',
            description: '1,000 total songs uploaded',
            timestamp: new Date(Date.now() - 60 * 60 * 1000),
        },
    ];
};
