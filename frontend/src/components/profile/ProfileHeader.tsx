import { User } from '@/types';
import { Camera, MapPin, Globe, Edit2, Lock, UserPlus, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { axiosInstance } from '@/lib/axios';
import toast from 'react-hot-toast';

interface ProfileHeaderProps {
    user: User;
    isOwnProfile: boolean;
    onEdit?: () => void;
}

export const ProfileHeader = ({ user, isOwnProfile, onEdit }: ProfileHeaderProps) => {
    const [isFollowing, setIsFollowing] = useState(user.isFollowing || false);
    const [followersCount, setFollowersCount] = useState(user.followersCount || 0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsFollowing(user.isFollowing || false);
        setFollowersCount(user.followersCount || 0);
    }, [user]);

    const handleFollowToggle = async () => {
        setIsLoading(true);
        try {
            if (isFollowing) {
                await axiosInstance.post(`/users/unfollow/${user._id || user.clerkId}`);
                setIsFollowing(false);
                setFollowersCount(prev => Math.max(0, prev - 1));
                toast.success(`Unfollowed ${user.fullName}`);
            } else {
                await axiosInstance.post(`/users/follow/${user._id || user.clerkId}`);
                setIsFollowing(true);
                setFollowersCount(prev => prev + 1);
                toast.success(`Following ${user.fullName}`);
            }
        } catch (error) {
            toast.error('Failed to update follow status');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative mb-8 group">
            {/* Banner / Gradient Background */}
            <div className="h-48 md:h-64 bg-gradient-to-br from-brand-primary/20 via-zinc-900 to-zinc-950 rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Profile Content */}
            <div className="absolute top-32 md:top-40 left-6 right-6 flex flex-col md:flex-row items-end md:items-end gap-6">

                {/* Avatar */}
                <div className="relative shrink-0">
                    <div className="size-32 md:size-40 rounded-full border-4 border-zinc-950 overflow-hidden bg-zinc-800 shadow-2xl">
                        <img
                            src={user.imageUrl}
                            alt={user.fullName}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {isOwnProfile && (
                        <button
                            onClick={onEdit}
                            className="absolute bottom-2 right-2 p-2 bg-brand-primary rounded-full text-white shadow-lg hover:bg-brand-primary/90 transition-colors opacity-0 group-hover:opacity-100"
                            aria-label="Edit Profile"
                        >
                            <Camera className="size-4" />
                        </button>
                    )}
                </div>

                {/* User Info */}
                <div className="flex-1 pb-2 space-y-2 md:space-y-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-center gap-3">
                        <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-2">
                            {user.fullName}
                            {user.isPrivate && <Lock className="size-5 text-zinc-500" />}
                        </h1>
                        {!isOwnProfile && (
                            <Button
                                onClick={handleFollowToggle}
                                disabled={isLoading}
                                className={`h-8 rounded-full font-semibold gap-2 ${isFollowing
                                        ? "bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700"
                                        : "bg-white text-black hover:bg-white/90"
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
                        )}
                        {isOwnProfile && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onEdit}
                                className="hidden md:flex gap-2 rounded-full border-white/20 hover:bg-white/10"
                            >
                                <Edit2 className="size-4" />
                                Edit Profile
                            </Button>
                        )}
                    </div>

                    {/* Bio */}
                    {user.bio && (
                        <p className="text-zinc-300 text-sm md:text-base max-w-2xl">
                            {user.bio}
                        </p>
                    )}

                    {/* Meta Details */}
                    <div className="flex items-center justify-center md:justify-start gap-4 md:gap-6 text-sm text-zinc-400 pt-2 flex-wrap">
                        {user.location && (
                            <div className="flex items-center gap-1.5">
                                <MapPin className="size-4 text-brand-primary" />
                                <span>{user.location}</span>
                            </div>
                        )}
                        {user.website && (
                            <div className="flex items-center gap-1.5">
                                <Globe className="size-4 text-brand-primary" />
                                <a href={user.website} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors hover:underline">
                                    {user.website.replace(/^https?:\/\//, '')}
                                </a>
                            </div>
                        )}
                        {/* Stats */}
                        <div className="flex items-center gap-4 border-l border-white/10 pl-4 ml-2">
                            <div>
                                <span className="text-white font-bold">{followersCount}</span> Followers
                            </div>
                            <div>
                                <span className="text-white font-bold">{user.followingCount || 0}</span> Following
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Edit Button (Visible only on mobile in normal layout) */}
                {isOwnProfile && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onEdit}
                        className="md:hidden w-full rounded-full border-white/20 hover:bg-white/10 mt-4"
                    >
                        Edit Profile
                    </Button>
                )}
            </div>
        </div>
    );
};
