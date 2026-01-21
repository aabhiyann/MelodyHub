/**
 * ProfilePage - User profile with stats and settings
 * Features: Avatar, listening stats, account settings, sign out
 */

import { useUser, useClerk } from '@clerk/clerk-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import Topbar from '@/components/Topbar';
import { LogOut, Mail, Music, Clock, Heart, Calendar, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const { user } = useUser();
    const { signOut } = useClerk();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    if (!user) {
        return null;
    }

    // Mock stats - replace with real data from your backend
    const stats = [
        { label: 'Total Listening Time', value: '124 hours', icon: Clock, color: 'text-blue-400' },
        { label: 'Favorite Songs', value: '47 tracks', icon: Heart, color: 'text-pink-400' },
        { label: 'Playlists Created', value: '8 playlists', icon: Music, color: 'text-purple-400' },
        { label: 'Member Since', value: 'January 2026', icon: Calendar, color: 'text-green-400' },
    ];

    return (
        <main className='rounded-md overflow-hidden h-full bg-transparent'>
            <Topbar />
            <ScrollArea className='h-[calc(100vh-180px)]'>
                <div className='p-6 space-y-8'>
                    {/* Profile Header */}
                    <div className='flex flex-col md:flex-row items-center gap-6 p-8 rounded-2xl bg-gradient-to-br from-brand-primary/20 via-purple-500/20 to-transparent border border-white/10'>
                        <div className='relative'>
                            <img
                                src={user.imageUrl}
                                alt={user.firstName || 'User'}
                                className='size-32 rounded-full object-cover ring-4 ring-white/20 shadow-2xl'
                            />
                            <div className='absolute -bottom-2 -right-2 size-10 rounded-full bg-green-500 border-4 border-black flex items-center justify-center'>
                                <div className='size-3 rounded-full bg-white animate-pulse' />
                            </div>
                        </div>

                        <div className='flex-1 text-center md:text-left'>
                            <h1 className='text-3xl md:text-4xl font-bold text-white mb-2'>
                                {user.firstName} {user.lastName}
                            </h1>
                            <div className='flex items-center gap-2 text-zinc-400 justify-center md:justify-start'>
                                <Mail className='size-4' />
                                <span>{user.primaryEmailAddress?.emailAddress}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleSignOut}
                            className='flex items-center gap-2 px-6 py-3 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 transition-all font-medium'
                        >
                            <LogOut className='size-4' />
                            <span>Sign Out</span>
                        </button>
                    </div>

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
                        <h2 className='text-2xl font-bold text-white mb-4'>Account Settings</h2>
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
        </main>
    );
};

export default ProfilePage;
