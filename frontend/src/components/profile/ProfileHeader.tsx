import { User } from '@/types';
import { Camera, MapPin, Globe, Edit2, Lock, UserPlus, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
            <div className="h-48 md:h-64 bg-gradient-to-br from-brand-primary/20 via-surface-elevated to-surface-base rounded-xl overflow-hidden relative">
                <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Profile Content - using negative margin instead of absolute positioning for flow layout */}
            <div className="px-6 -mt-16 md:-mt-24 relative z-10 flex flex-col md:flex-row items-end gap-6">

                {/* Avatar */}
                <div className="relative shrink-0">
                    <div className="size-32 md:size-48 rounded-full border-4 border-surface-base overflow-hidden bg-surface-elevated shadow-2xl">
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
                <div className="flex-1 pb-2 space-y-2 md:space-y-1 text-center md:text-left min-w-0">
                    <div className="flex flex-col md:flex-row items-center gap-3">
                        <h1 className="text-3xl md:text-4xl font-bold text-whitish truncate max-w-full flex items-center gap-2">
                            {user.fullName}
                            {user.isPrivate && <Lock className="size-5 text-text-secondary" />}
                        </h1>
                        {!isOwnProfile && (
                            <Button
                                onClick={handleFollowToggle}
                                disabled={isLoading}
                                className={`h-8 rounded-full font-semibold gap-2 transition-all ${isFollowing
                                    ? "bg-surface-elevated text-whitish hover:bg-surface-elevated/80 border border-white/10"
                                    : "bg-brand-primary text-white hover:bg-brand-primary/90 shadow-glow-primary"
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
                        <p className="text-text-secondary text-sm md:text-base max-w-2xl line-clamp-2 md:line-clamp-none">
                            {user.bio}
                        </p>
                    )}

                    {/* Meta Details */}
                    <div className="flex items-center justify-center md:justify-start gap-4 md:gap-6 text-sm text-text-secondary pt-2 flex-wrap">
                        {user.location && (
                            <div className="flex items-center gap-1.5">
                                <MapPin className="size-4 text-brand-primary" />
                                <span>{user.location}</span>
                            </div>
                        )}
                        {user.website && (
                            <div className="flex items-center gap-1.5">
                                <Globe className="size-4 text-brand-primary" />
                                <a href={user.website} target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent transition-colors hover:underline truncate max-w-[200px]">
                                    {user.website.replace(/^https?:\/\//, '')}
                                </a>
                            </div>
                        )}
                        {/* Stats - clickable to open followers/following pages */}
                        <div className="flex items-center gap-4 border-l border-white/10 pl-4 ml-2">
                            <button
                                type="button"
                                onClick={() => profileUserId && navigate(`/followers/${profileUserId}`)}
                                className="hover:text-whitish transition-colors text-left"
                            >
                                <span className="text-whitish font-bold">{followersCount}</span> Followers
                            </button>
                            <button
                                type="button"
                                onClick={() => profileUserId && navigate(`/following/${profileUserId}`)}
                                className="hover:text-whitish transition-colors text-left"
                            >
                                <span className="text-whitish font-bold">{user.followingCount || 0}</span> Following
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Edit Button */}
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
