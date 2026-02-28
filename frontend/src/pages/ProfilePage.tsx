/**
 * ProfilePage - User profile with header, stats row, tabs (Activity, Playlists, Liked Songs, Friends)
 */

import { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import Topbar from '@/components/layout/TopBar';
import { LogOut, Settings, ListMusic, Heart, Users, Activity } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { axiosInstance } from '@/lib/axios';
import { User } from '@/types';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { EditProfileModal } from '@/components/profile/EditProfileModal';
import { EmptyState } from '@/components/shared/EmptyState';
import { SpotifyCard } from '@/pages/home/components/SpotifyCard';
import { useChatStore } from '@/stores/ChatStore';

type ProfileTab = 'activity' | 'playlists' | 'liked' | 'friends';

interface PlaylistItem {
    _id: string;
    name: string;
    description?: string;
    imageUrl?: string;
    songs?: { imageUrl?: string }[];
}

const TABS: { id: ProfileTab; label: string; icon: React.ElementType }[] = [
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'playlists', label: 'Playlists', icon: ListMusic },
    { id: 'liked', label: 'Liked Songs', icon: Heart },
    { id: 'friends', label: 'Friends', icon: Users },
];

const ProfilePage = () => {
    const { user: clerkUser } = useUser();
    const { signOut } = useClerk();
    const navigate = useNavigate();
    const { userId } = useParams();

    const [userProfile, setUserProfile] = useState<User | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<ProfileTab>('playlists');

    const [analyticsData, setAnalyticsData] = useState<{ totalPlays?: number; totalLikes?: number } | null>(null);
    const [playlists, setPlaylists] = useState<PlaylistItem[]>([]);

    const { friends, fetchFriends } = useChatStore();

    const isOwnProfile = !userId || (clerkUser && userId === clerkUser.id);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const profileEndpoint = userId ? `/users/${userId}` : '/users/profile';
                const profileRes = await axiosInstance.get(profileEndpoint);
                setUserProfile(profileRes.data.data);

                if (isOwnProfile) {
                    const [analyticsRes, playlistRes] = await Promise.all([
                        axiosInstance.get('/analytics/dashboard?period=all'),
                        axiosInstance.get('/social/playlists'),
                    ]);
                    setAnalyticsData(analyticsRes.data.data ?? null);
                    setPlaylists(playlistRes.data.data ?? []);
                }
            } catch (error) {
                console.error('Failed to fetch profile data:', error);
            }
        };

        if (clerkUser) {
            fetchProfileData();
        }
    }, [clerkUser, userId, isOwnProfile]);

    useEffect(() => {
        if (isOwnProfile && activeTab === 'friends') {
            fetchFriends();
        }
    }, [isOwnProfile, activeTab, fetchFriends]);

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    if (!clerkUser) return null;

    const displayUser: User = userProfile || {
        _id: '',
        clerkId: clerkUser.id,
        fullName: clerkUser.fullName || '',
        imageUrl: clerkUser.imageUrl,
    };

    const followersCount = displayUser.followersCount ?? 0;
    const followingCount = displayUser.followingCount ?? 0;
    const songsCount = analyticsData?.totalLikes ?? analyticsData?.totalPlays ?? 0;
    const playlistCount = isOwnProfile ? playlists.length : 0;

    const profileStats = {
        followersCount: Number(displayUser.followersCount) || followersCount,
        followingCount: Number(displayUser.followingCount) || followingCount,
        songsCount,
        playlistCount,
    };

    return (
        <main className="rounded-md overflow-hidden h-full bg-transparent">
            <Topbar />
            <ScrollArea className="h-[calc(100vh-180px)]">
                <div className="p-4 md:p-6 space-y-6">
                    <ProfileHeader
                        user={displayUser}
                        isOwnProfile={!!isOwnProfile}
                        onEdit={isOwnProfile ? () => setIsEditModalOpen(true) : undefined}
                        stats={profileStats}
                    />

                    {/* Tabs */}
                    <div className="border-b border-[#1F2933]">
                        <nav className="flex gap-1 overflow-x-auto scrollbar-hide" aria-label="Profile tabs">
                            {TABS.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                                            activeTab === tab.id
                                                ? 'text-[#22C55E] border-b-2 border-[#22C55E] bg-[#101019]/50'
                                                : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
                                        }`}
                                    >
                                        <Icon className="size-4" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Tab content */}
                    <div className="min-h-[200px]">
                        {activeTab === 'activity' && (
                            <div className="rounded-[12px] bg-[#101019] border border-[#1F2933] p-8">
                                <EmptyState
                                    message="No activity yet"
                                    secondary="Your recent likes, playlists, and follows will show here."
                                    icon={<Activity className="size-10 text-[#6B7280]" />}
                                />
                            </div>
                        )}

                        {activeTab === 'playlists' && (
                            <>
                                {isOwnProfile ? (
                                    playlists.length === 0 ? (
                                        <div className="rounded-[12px] bg-[#101019] border border-[#1F2933] p-8">
                                            <EmptyState
                                                message="No playlists yet"
                                                secondary="Create a playlist from the Library or Browse."
                                                icon={<ListMusic className="size-10 text-[#6B7280]" />}
                                            />
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                            {playlists.map((pl) => {
                                                const imageUrl =
                                                    (pl as PlaylistItem & { imageUrl?: string }).imageUrl ||
                                                    (pl.songs?.[0] as { imageUrl?: string } | undefined)?.imageUrl ||
                                                    '';
                                                return (
                                                    <SpotifyCard
                                                        key={pl._id}
                                                        imageUrl={imageUrl || 'https://placehold.co/400?text=Playlist'}
                                                        title={pl.name}
                                                        description={pl.description ?? `${pl.songs?.length ?? 0} songs`}
                                                        href={`/playlists/${pl._id}`}
                                                        width={180}
                                                    />
                                                );
                                            })}
                                        </div>
                                    )
                                ) : (
                                    <div className="rounded-[12px] bg-[#101019] border border-[#1F2933] p-8">
                                        <EmptyState
                                            message="No public playlists"
                                            secondary="This user hasn't shared any playlists."
                                        />
                                    </div>
                                )}
                            </>
                        )}

                        {activeTab === 'liked' && (
                            <div className="rounded-[12px] bg-[#101019] border border-[#1F2933] p-8">
                                {isOwnProfile ? (
                                    <EmptyState
                                        message="Liked songs"
                                        secondary={`You have ${songsCount} liked song${songsCount !== 1 ? 's' : ''}. They'll appear here when we add the list.`}
                                        icon={<Heart className="size-10 text-[#6B7280]" />}
                                    />
                                ) : (
                                    <EmptyState
                                        message="Liked songs are private"
                                        secondary="Only the user can see their liked songs."
                                    />
                                )}
                            </div>
                        )}

                        {activeTab === 'friends' && (
                            <div className="rounded-[12px] bg-[#101019] border border-[#1F2933] overflow-hidden">
                                {isOwnProfile ? (
                                    friends.length === 0 ? (
                                        <div className="p-8">
                                            <EmptyState
                                                message="No friends yet"
                                                secondary="Find friends in Chat or from search."
                                                icon={<Users className="size-10 text-[#6B7280]" />}
                                            />
                                        </div>
                                    ) : (
                                        <ul className="divide-y divide-[#1F2933]">
                                            {friends.map((friend) => (
                                                <li key={friend._id || friend.clerkId}>
                                                    <button
                                                        type="button"
                                                        onClick={() => navigate(`/profile/${friend.clerkId || friend._id}`)}
                                                        className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors text-left"
                                                    >
                                                        <img
                                                            src={friend.imageUrl || ''}
                                                            alt=""
                                                            className="size-12 rounded-full object-cover bg-[#1F2933]"
                                                        />
                                                        <div className="min-w-0 flex-1">
                                                            <p className="font-medium text-[#F9FAFB] truncate">
                                                                {friend.fullName || 'Unknown'}
                                                            </p>
                                                            {(friend as { username?: string }).username && (
                                                                <p className="text-sm text-[#9CA3AF] truncate">
                                                                    @{(friend as { username?: string }).username}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )
                                ) : (
                                    <div className="p-8">
                                        <EmptyState
                                            message="Friends are private"
                                            secondary="Only the user can see their friends list."
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Account Settings - own profile only */}
                    {isOwnProfile && (
                        <div className="space-y-4 pt-4 border-t border-[#1F2933]">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-[#F9FAFB] tracking-tight">Account</h2>
                                <button
                                    type="button"
                                    onClick={handleSignOut}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 hover:border-red-500/40 transition-all font-medium text-sm"
                                >
                                    <LogOut className="size-4" />
                                    Sign Out
                                </button>
                            </div>
                            <div className="space-y-2">
                                <button
                                    type="button"
                                    onClick={() => navigate('/settings')}
                                    className="w-full flex items-center gap-3 p-4 rounded-[12px] bg-[#101019] border border-[#1F2933] hover:bg-white/5 transition-colors text-left"
                                >
                                    <Settings className="size-5 text-[#9CA3AF]" />
                                    <div>
                                        <p className="font-medium text-[#F9FAFB]">Settings</p>
                                        <p className="text-sm text-[#9CA3AF]">Playback, notifications, and more</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>

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
