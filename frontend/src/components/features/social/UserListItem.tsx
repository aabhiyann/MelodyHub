import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus, Users } from "lucide-react";

interface UserListItemProps {
    user: {
        _id: string;
        fullName?: string;
        imageUrl?: string;
        clerkId?: string;
    };
    isFollowing?: boolean;
    isMutual?: boolean;
    onFollow?: (userId: string) => void;
    onUnfollow?: (userId: string) => void;
    showActions?: boolean;
}

export const UserListItem = ({
    user,
    isFollowing = false,
    isMutual = false,
    onFollow,
    onUnfollow,
    showActions = true,
}: UserListItemProps) => {
    const id = user.clerkId || user._id;
    return (
        <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
            <Link to={`/profile/${id}`} className="flex items-center gap-4 flex-1 min-w-0">
                <img
                    src={user.imageUrl || "/placeholder.jpg"}
                    alt={user.fullName || "User"}
                    className="size-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{user.fullName || "Unknown"}</p>
                    {isMutual && (
                        <span className="inline-flex items-center gap-1 text-xs text-zinc-400">
                            <Users className="size-3" />
                            Mutual friend
                        </span>
                    )}
                </div>
            </Link>
            {showActions && (onFollow || onUnfollow) && (
                <>
                    {isFollowing && onUnfollow ? (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-zinc-400 hover:text-white"
                            onClick={() => onUnfollow(user._id)}
                        >
                            <UserMinus className="size-4 mr-1" />
                            Unfollow
                        </Button>
                    ) : (
                        onFollow && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-brand-primary hover:text-brand-primary/90"
                                onClick={() => onFollow(user._id)}
                            >
                                <UserPlus className="size-4 mr-1" />
                                Follow
                            </Button>
                        )
                    )}
                </>
            )}
        </div>
    );
};
