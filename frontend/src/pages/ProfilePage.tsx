/**
 * ProfilePage - User profile with real stats
 * Features: Avatar, real listening stats from Analytics API
 */

import { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import Topbar from '@/components/layout/Topbar';
import { LogOut, Music, PlayCircle, Heart, Calendar, Settings } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { axiosInstance } from '@/lib/axios';
import { User } from '@/types';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { EditProfileModal } from '@/components/profile/EditProfileModal';

const ProfilePage = () => {
    const { user: clerkUser } = useUser();
    const { signOut } = useClerk();
    const navigate = useNavigate();
    const { userId } = useParams();

    const [userProfile, setUserProfile] = useState<User | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    // const [isLoading, setIsLoading] = useState(true); // Removed unused state

    // Real Stats State
    const [analyticsData, setAnalyticsData] = useState<any>(null);
    const [playlistCount, setPlaylistCount] = useState(0);

    const isOwnProfile = !userId || (clerkUser && userId === clerkUser.id);

    useEffect(() => {
        const fetchProfileData = async () => {
            // setIsLoading(true);
            try {
                // 1. Fetch User Profile
                const profileEndpoint = userId ? `/users/${userId}` : '/users/profile';
                const profileRes = await axiosInstance.get(profileEndpoint);
                setUserProfile(profileRes.data.data);

                // 2. Fetch User Stats (Only if own profile for now, or if endpoint allows public stats)
                // Assuming /analytics/user-preferences is private to the user
                if (isOwnProfile) {
                    const [analyticsRes, playlistRes] = await Promise.all([
                        axiosInstance.get('/analytics/user-preferences'),
                        axiosInstance.get('/social/playlists')
                    ]);

                    setAnalyticsData(analyticsRes.data.data);
                    setPlaylistCount(playlistRes.data.data?.length || 0);
                }
            } catch (error) {
                console.error('Failed to fetch profile data:', error);
            } finally {
                // setIsLoading(false);
            }
        };

        if (clerkUser) {
            fetchProfileData();
        }
    }, [clerkUser, userId, isOwnProfile]);

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    if (!clerkUser) return null;

    // Use fetched profile if available, fallback to Clerk data for basics
    const displayUser: User = userProfile || {
        _id: '',
        clerkId: clerkUser.id,
        fullName: clerkUser.fullName || '',
        imageUrl: clerkUser.imageUrl,
    };

    // Real Stats
    const stats = [
        {
            label: 'Total Plays',
            value: analyticsData?.totalPlays?.toString() || '0',
            icon: PlayCircle,
            color: 'text-blue-400'
        },
        {
            label: 'Liked Songs',
            value: analyticsData?.likedSongsCount?.toString() || '0',
            icon: Heart,
            color: 'text-pink-400'
        },
        {
            label: 'Playlists Created',
            value: playlistCount.toString(),
            icon: Music,
            color: 'text-brand-primary'
        },
        {
            label: 'Member Since',
            value: clerkUser.createdAt ? new Date(clerkUser.createdAt).toLocaleDateString() : '2024',
            icon: Calendar,
            color: 'text-brand-accent'
        },
    ];

    return (
        <main className='rounded-md overflow-hidden h-full bg-transparent'>
            <Topbar />
            <ScrollArea className='h-[calc(100vh-180px)]'>
                <div className='p-6 space-y-8'>
                    {/* Profile Header */}
                    <ProfileHeader
                        user={displayUser}
                        isOwnProfile={!!isOwnProfile}
                        onEdit={isOwnProfile ? () => setIsEditModalOpen(true) : undefined}
                    />

                    {/* Listening Stats */}
                    <div>
                        <h2 className='text-2xl font-bold text-text-primary mb-4 tracking-tight'>Your Stats</h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                            {stats.map((stat) => {
                                const Icon = stat.icon;
                                return (
                                    <div
                                        key={stat.label}
                                        className='p-6 glass-panel hover:bg-surface-elevated/60 transition-colors group'
                                    >
                                        <div className='flex items-center gap-3 mb-3'>
                                            <div className='p-2 rounded-lg bg-surface-elevated/50 group-hover:scale-110 transition-transform'>
                                                <Icon className={`size-5 ${stat.color}`} />
                                            </div>
                                            <p className='text-sm text-text-secondary'>{stat.label}</p>
                                        </div>
                                        <p className='text-2xl font-bold text-text-primary'>{stat.value}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Account Settings */}
                    {isOwnProfile && (
                        <div>
                            <div className='flex items-center justify-between mb-4'>
                                <h2 className='text-2xl font-bold text-text-primary tracking-tight'>Account Settings</h2>
                                <button
                                    onClick={handleSignOut}
                                    className='flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-text-primary border border-red-500/20 hover:border-red-500/40 transition-all font-medium text-sm'
                                >
                                    <LogOut className='size-4' />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                            <div className='space-y-3'>
                                <button className='w-full flex items-center justify-between p-4 glass-panel hover:bg-surface-elevated/60 transition-colors text-left group'>
                                    <div className='flex items-center gap-3'>
                                        <div className='p-2 rounded-lg bg-surface-elevated/50 group-hover:bg-white/10 transition-colors'>
                                            <Settings className='size-5 text-text-secondary group-hover:text-text-primary transition-colors' />
                                        </div>
                                        <div>
                                            <p className='font-semibold text-text-primary'>Playback Settings</p>
                                            <p className='text-sm text-text-secondary'>Audio quality, volume normalization</p>
                                        </div>
                                    </div>
                                </button>

                                <button className='w-full flex items-center justify-between p-4 glass-panel hover:bg-surface-elevated/60 transition-colors text-left group'>
                                    <div className='flex items-center gap-3'>
                                        <div className='p-2 rounded-lg bg-surface-elevated/50 group-hover:bg-white/10 transition-colors'>
                                            <Settings className='size-5 text-text-secondary group-hover:text-text-primary transition-colors' />
                                        </div>
                                        <div>
                                            <p className='font-semibold text-text-primary'>Notifications</p>
                                            <p className='text-sm text-text-secondary'>Manage your notification preferences</p>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            {/* Edit Profile Modal */}
            <EditProfileModal
                user={displayUser}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onUpdate={(updated) => setUserProfile(updated)}
            />
        </main>
    );
};

export default ProfilePage;
