// Domain Models

export interface User {
    _id: string;
    clerkId: string;
    fullName: string;
    imageUrl: string;
    bio?: string;
    location?: string;
    website?: string;
    isPrivate?: boolean;
    followersCount?: number;
    followingCount?: number;
    isFollowing?: boolean;
}

export interface UserProfile extends User {
    username?: string;
    email?: string;
}

export interface Song {
    _id: string;
    title: string;
    artist: string;
    albumId?: string | null;
    imageUrl: string;
    audioUrl: string;
    duration: number;
    createdAt: string;
    updatedAt: string;
    isTrending?: boolean;
    isFeatured?: boolean;
    genre?: string;
    playCount?: number;
    likeCount?: number;
}

export interface Album {
    _id: string;
    title: string;
    artist: string;
    imageUrl: string;
    releaseYear: number;
    songs: Song[];
}

export interface Playlist {
    _id: string;
    name: string;
    description?: string;
    owner: string | User;
    collaborators: string[];
    viewers: string[];
    songs: Song[];
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Message {
    _id: string;
    senderId: string;
    receiverId: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

export interface Stats {
    totalSongs: number;
    totalAlbums: number;
    totalUsers: number;
    totalArtists: number;
}

export interface SocialStats {
    friendCount: number;
    playlistShares: number;
    totalLikes: number;
    followerCount?: number;
    followingCount?: number;
}

// Activity Types
export type ActivityType = "like_song" | "create_playlist" | "follow_user" | "song_play" | "friend_add" | "song_like" | "album_create";

export interface ActivityTarget {
    type: 'song' | 'playlist' | 'user' | 'album';
    [key: string]: unknown; // Tightened from 'any'
}

export interface SongTarget extends ActivityTarget {
    type: 'song';
    song: Song;
}

export interface PlaylistTarget extends ActivityTarget {
    type: 'playlist';
    playlist: {
        _id: string;
        name: string;
        imageUrl?: string;
    };
}

export interface UserTarget extends ActivityTarget {
    type: 'user';
    user: UserProfile;
}

export interface AlbumTarget extends ActivityTarget {
    type: 'album';
    album: {
        _id: string;
        title: string;
        artist: string;
        imageUrl?: string;
    };
}

export interface Activity {
    _id: string;
    userId: User | string;
    targetId?: string; // Legacy support
    target?: ActivityTarget | { // Legacy support
        title?: string;
        artist?: string;
        name?: string;
        fullName?: string;
        imageUrl?: string;
    };
    type: ActivityType;
    createdAt: string;
    timestamp?: string; // Some parts use timestamp
}

export interface FriendRequest {
    _id: string;
    senderId: UserProfile; // Used in FriendsList
    from?: UserProfile; // Legacy/Backend field?
    to?: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
    updatedAt?: string;
}

// Type Guards
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
