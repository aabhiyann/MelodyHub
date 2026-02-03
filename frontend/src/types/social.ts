import { Song } from './index';

// ============================================
// Friend Request Types
// ============================================

export interface UserProfile {
    _id: string;
    clerkId: string;
    username: string;
    email?: string;
    imageUrl?: string;
    fullName?: string;
}

export interface FriendRequest {
    _id: string;
    from: UserProfile;
    to: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
    updatedAt?: string;
}

// ============================================
// Activity Feed Types
// ============================================

export type ActivityType = 'song_play' | 'playlist_create' | 'friend_add' | 'song_like' | 'album_create';

export interface Activity {
    _id: string;
    userId: string;
    user?: UserProfile;
    type: ActivityType;
    target: ActivityTarget;
    timestamp: string;
    createdAt: string;
}

// Activity Target Types
export type ActivityTarget = SongTarget | PlaylistTarget | UserTarget | AlbumTarget;

export interface SongTarget {
    type: 'song';
    song: Song;
}

export interface PlaylistTarget {
    type: 'playlist';
    playlist: {
        _id: string;
        name: string;
        imageUrl?: string;
    };
}

export interface UserTarget {
    type: 'user';
    user: UserProfile;
}

export interface AlbumTarget {
    type: 'album';
    album: {
        _id: string;
        title: string;
        artist: string;
        imageUrl?: string;
    };
}

// ============================================
// Social Stats Types
// ============================================

export interface SocialStats {
    friendCount: number;
    playlistShares: number;
    totalLikes: number;
    followerCount?: number;
    followingCount?: number;
}

// ============================================
// Type Guards
// ============================================

export function isSongTarget(target: ActivityTarget): target is SongTarget {
    return target.type === 'song';
}

export function isPlaylistTarget(target: ActivityTarget): target is PlaylistTarget {
    return target.type === 'playlist';
}

export function isUserTarget(target: ActivityTarget): target is UserTarget {
    return target.type === 'user';
}

export function isAlbumTarget(target: ActivityTarget): target is AlbumTarget {
    return target.type === 'album';
}
