import { User } from '@/types';
import { Camera, MapPin, Globe, Edit2, Lock, UserPlus, UserCheck, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '@/lib/axios';
import toast from 'react-hot-toast';

interface ProfileHeaderProps {
    user: User;
    isOwnProfile: boolean;
    onEdit?: () => void;
    /** Optional stats for stats row (from parent). */
    stats?: {
        followersCount: number;
        followingCount: number;
        songsCount: number;
        playlistCount: number;
    };
}

export const ProfileHeader = ({ user, isOwnProfile, onEdit, stats: statsProp }: ProfileHeaderProps) => {
    const [isFollowing, setIsFollowing] = useState(user.isFollowing || false);
    const [followersCount, setFollowersCount] = useState(statsProp?.followersCount ?? user.followersCount ?? 0);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const profileUserId = user._id || user.clerkId;
    const followingCount = statsProp?.followingCount ?? user.followingCount ?? 0;
    const songsCount = statsProp?.songsCount ?? 0;
    const playlistCount = statsProp?.playlistCount ?? 0;

    useEffect(() => {
        setIsFollowing(user.isFollowing ?? false);
        setFollowersCount(statsProp?.followersCount ?? user.followersCount ?? 0);
    }, [user.isFollowing, user.followersCount, statsProp?.followersCount]);

    const handleFollowToggle = async () => {
        setIsLoading(true);
        try {
            if (isFollowing) {
                await axiosInstance.post(`/users/unfollow/${user._id || user.clerkId}`);
                setIsFollowing(false);
                setFollowersCount((prev) => Math.max(0, prev - 1));
                toast.success(`Unfollowed ${user.fullName}`);
            } else {
                await axiosInstance.post(`/users/follow/${user._id || user.clerkId}`);
                setIsFollowing(true);
                setFollowersCount((prev) => prev + 1);
                toast.success(`Following ${user.fullName}`);
            }
        } catch (error) {
            toast.error('Failed to update follow status');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMessage = () => {
        navigate('/chat', { state: { openUserId: profileUserId } });
    };

    const username = (user as { username?: string }).username;

    return (
        <div className="relative mb-6 md:mb-8 group">
            {/* Banner - DESIGN_PLAN: no purple */}
            <div className="h-32 md:h-40 bg-gradient-to-br from-[#1F2933] via-[#101019] to-[#0F172A] rounded-[12px] overflow-hidden relative">
                <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Profile content: mobile stacked + centered, desktop row */}
            <div className="px-4 md:px-6 -mt-12 md:-mt-16 relative z-10 flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6">
                {/* Avatar: large circular, edit on hover (own) */}
                <div className="relative shrink-0 flex flex-col items-center md:items-start">
                    <div className="relative size-20 md:size-24 rounded-full border-4 border-[#101019] overflow-hidden bg-[#101019] shadow-xl ring-2 ring-white/5">
                        <img
                            src={user.imageUrl}
                            alt={user.fullName}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => { e.currentTarget.src = '/placeholder-album.svg'; }}
                        />
                        {isOwnProfile && (
                            <button
                                type="button"
                                onClick={onEdit}
                                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                                aria-label="Edit Profile"
                            >
                                <span className="p-2.5 rounded-full bg-[#22C55E] text-[#020617] shadow-lg">
                                    <Camera className="size-5" />
                                </span>
                            </button>
                        )}
                    </div>
                </div>

                {/* User info: display name, username, bio, buttons */}
                <div className="flex-1 w-full pb-0 md:pb-2 space-y-2 text-center md:text-left min-w-0">
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                            <h1 className="text-2xl md:text-3xl font-bold text-[#F9FAFB] truncate">
                                {user.fullName}
                            </h1>
                            {user.isPrivate && (
                                <Lock className="size-5 text-[#9CA3AF] shrink-0" aria-hidden />
                            )}
                        </div>
                        {username && (
                            <p className="text-sm text-[#9CA3AF] truncate max-w-full">@{username}</p>
                        )}
                    </div>

                    {user.bio && (
                        <p className="text-[#9CA3AF] text-sm md:text-base max-w-2xl line-clamp-2 md:line-clamp-none">
                            {user.bio}
                        </p>
                    )}

                    {/* Location / website - optional */}
                    <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-[#9CA3AF] flex-wrap">
                        {user.location && (
                            <div className="flex items-center gap-1.5">
                                <MapPin className="size-4 text-[#22C55E]" />
                                <span>{user.location}</span>
                            </div>
                        )}
                        {user.website && (
                            <div className="flex items-center gap-1.5">
                                <Globe className="size-4 text-[#22C55E]" />
                                <a
                                    href={user.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-[#F9FAFB] transition-colors hover:underline truncate max-w-[200px]"
                                >
                                    {user.website.replace(/^https?:\/\//, '')}
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
                        {isOwnProfile && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onEdit}
                                className="rounded-full border-[#1F2933] text-[#F9FAFB] hover:bg-[#1F2933] hover:border-[#22C55E]/50 hover:text-[#22C55E] transition-colors"
                            >
                                <Edit2 className="size-4 mr-1.5" />
                                Edit profile
                            </Button>
                        )}
                        {!isOwnProfile && (
                            <>
                                <Button
                                    onClick={handleFollowToggle}
                                    disabled={isLoading}
                                    className={`h-9 rounded-full font-semibold gap-2 transition-all ${
                                        isFollowing
                                            ? 'bg-[#101019] text-[#F9FAFB] hover:bg-[#1F2933] border border-[#1F2933]'
                                            : 'bg-[#22C55E] text-[#020617] hover:bg-[#16A34A]'
                                    }`}
                                >
                                    {isFollowing ? (
                                        <>
                                            <UserCheck className="size-4" />
                                            Following
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="size-4" />
                                            Follow
                                        </>
                                    )}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleMessage}
                                    className="h-9 rounded-full border-[#1F2933] text-[#F9FAFB] hover:bg-[#1F2933]"
                                >
                                    <MessageCircle className="size-4 mr-1.5" />
                                    Message
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats row: Followers | Following | Songs | Playlists */}
            <div className="flex items-center justify-center md:justify-start gap-6 md:gap-8 mt-6 pt-4 border-t border-[#1F2933]">
                <button
                    type="button"
                    onClick={() => profileUserId && navigate(`/followers/${profileUserId}`)}
                    className="text-left hover:opacity-90 transition-opacity"
                >
                    <span className="block font-bold text-[#F9FAFB] text-lg">{followersCount}</span>
                    <span className="text-sm text-[#9CA3AF]">Followers</span>
                </button>
                <button
                    type="button"
                    onClick={() => profileUserId && navigate(`/following/${profileUserId}`)}
                    className="text-left hover:opacity-90 transition-opacity"
                >
                    <span className="block font-bold text-[#F9FAFB] text-lg">{followingCount}</span>
                    <span className="text-sm text-[#9CA3AF]">Following</span>
                </button>
                <div className="text-left">
                    <span className="block font-bold text-[#F9FAFB] text-lg">{songsCount}</span>
                    <span className="text-sm text-[#9CA3AF]">Songs</span>
                </div>
                <div className="text-left">
                    <span className="block font-bold text-[#F9FAFB] text-lg">{playlistCount}</span>
                    <span className="text-sm text-[#9CA3AF]">Playlists</span>
                </div>
            </div>
        </div>
    );
};
