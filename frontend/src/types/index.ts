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
	likeCount?: number; // For like/unlike functionality
}

export type ActivityType = "like_song" | "create_playlist" | "follow_user";

export interface Activity {
	_id: string;
	userId: User;
	targetId: string;
	target?: {
		title?: string;
		artist?: string;
		name?: string;
		fullName?: string;
		imageUrl?: string;
	};
	type: ActivityType;
	createdAt: string;
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
	owner: string; // or User object if populated, but usually ID in simplest form or check usage
	collaborators: string[];
	viewers: string[];
	songs: Song[];
	isPublic: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface Stats {
	totalSongs: number;
	totalAlbums: number;
	totalUsers: number;
	totalArtists: number;
}

export interface Message {
	_id: string;
	senderId: string;
	receiverId: string;
	content: string;
	createdAt: string;
	updatedAt: string;
}

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



export interface SocketAuth {
	userId: string;
}

export interface ServerToClientEvents {
	users_online: (users: string[]) => void;
	activities: (activities: [string, string][]) => void;
	user_connected: (userId: string) => void;
	user_disconnected: (userId: string) => void;
	receive_message: (message: Message) => void;
	message_sent: (message: Message) => void;
	activity_updated: (data: { userId: string; activity: string }) => void;
	user_typing: (data: { senderId: string }) => void;
}

export interface ClientToServerEvents {
	send_message: (data: { receiverId: string; senderId: string; content: string }) => void;
	typing: (data: { senderId: string; receiverId: string }) => void;
	update_activity: (data: { userId: string; activity: string }) => void;
	user_connected: (userId: string) => void;
}