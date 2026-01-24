/**
 * ProfilePage - User profile with stats and settings
 * Features: Avatar, listening stats, account settings, sign out
 */

import { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import Topbar from '@/components/Topbar';
import { LogOut, Music, Clock, Heart, Calendar, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '@/lib/axios';
import { User } from '@/types';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { EditProfileModal } from '@/components/profile/EditProfileModal';

const ProfilePage = () => {
    const { user: clerkUser } = useUser();
    const { signOut } = useClerk();
    const navigate = useNavigate();

    const [userProfile, setUserProfile] = useState<User | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axiosInstance.get('/users/profile');
                setUserProfile(response.data.data);
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (clerkUser) {
            fetchProfile();
        }
    }, [clerkUser]);

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

    // Mock stats - replace with real data from your backend
    const stats = [
        { label: 'Total Listening Time', value: '124 hours', icon: Clock, color: 'text-blue-400' },
        { label: 'Favorite Songs', value: '47 tracks', icon: Heart, color: 'text-pink-400' },
        { label: 'Playlists Created', value: '8 playlists', icon: Music, color: 'text-purple-400' },
        { label: 'Member Since', value: clerkUser.createdAt ? new Date(clerkUser.createdAt).toLocaleDateString() : '2026', icon: Calendar, color: 'text-green-400' },
    ];

    return (
        <main className='rounded-md overflow-hidden h-full bg-transparent'>
            <Topbar />
            <ScrollArea className='h-[calc(100vh-180px)]'>
                <div className='p-6 space-y-8'>
                    {/* Profile Header */}
                    <ProfileHeader
                        user={displayUser}
                        isOwnProfile={true}
                        onEdit={() => setIsEditModalOpen(true)}
                    />

                    {/* Listening Stats */}
                    <div>
                        <h2 className='text-2xl font-bold text-white mb-4'>Your Stats</h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                            {stats.map((stat) => {
                                const Icon = stat.icon;
                                return (
                                    <div
                                        key={stat.label}
                                        className='p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors'
                                    >
                                        <div className='flex items-center gap-3 mb-3'>
                                            <div className='p-2 rounded-lg bg-white/10'>
                                                <Icon className={`size-5 ${stat.color}`} />
                                            </div>
                                            <p className='text-sm text-zinc-400'>{stat.label}</p>
                                        </div>
                                        <p className='text-2xl font-bold text-white'>{stat.value}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Top Artists (Placeholder) */}
                    <div>
                        <h2 className='text-2xl font-bold text-white mb-4'>Top Artists This Month</h2>
                        <div className='text-center py-12 rounded-xl bg-white/5 border border-white/10'>
                            <Music className='size-12 text-zinc-600 mx-auto mb-4' />
                            <p className='text-zinc-400 text-lg'>Coming Soon!</p>
                            <p className='text-zinc-500 text-sm mt-2'>
                                We're working on personalized insights for you
                            </p>
                        </div>
                    </div>

                    {/* Account Settings */}
                    <div>
                        <div className='flex items-center justify-between mb-4'>
                            <h2 className='text-2xl font-bold text-white'>Account Settings</h2>
                            <button
                                onClick={handleSignOut}
                                className='flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 transition-all font-medium text-sm'
                            >
                                <LogOut className='size-4' />
                                <span>Sign Out</span>
                            </button>
                        </div>
                        <div className='space-y-3'>
                            <button className='w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-left group'>
                                <div className='flex items-center gap-3'>
                                    <div className='p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors'>
                                        <Settings className='size-5 text-zinc-400' />
                                    </div>
                                    <div>
                                        <p className='font-semibold text-white'>Playback Settings</p>
                                        <p className='text-sm text-zinc-400'>Audio quality, volume normalization</p>
                                    </div>
                                </div>
                            </button>

                            <button className='w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-left group'>
                                <div className='flex items-center gap-3'>
                                    <div className='p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors'>
                                        <Settings className='size-5 text-zinc-400' />
                                    </div>
                                    <div>
                                        <p className='font-semibold text-white'>Notifications</p>
                                        <p className='text-sm text-zinc-400'>Manage your notification preferences</p>
                                    </div>
                                </div>
                            </button>

                            <button className='w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-left group'>
                                <div className='flex items-center gap-3'>
                                    <div className='p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors'>
                                        <Settings className='size-5 text-zinc-400' />
                                    </div>
                                    <div>
                                        <p className='font-semibold text-white'>Privacy</p>
                                        <p className='text-sm text-zinc-400'>Control your data and visibility</p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
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
