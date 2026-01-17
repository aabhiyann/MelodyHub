export interface Song {
	_id: string;
	title: string;
	artist: string;
	albumId: string | null;
	imageUrl: string;
	audioUrl: string;
	duration: number;
	createdAt: string;
	updatedAt: string;
}

export interface Album {
	_id: string;
	title: string;
	artist: string;
	imageUrl: string;
	releaseYear: number;
	songs: Song[];
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
}

export interface ClientToServerEvents {
	send_message: (data: { receiverId: string; senderId: string; content: string }) => void;
	update_activity: (data: { userId: string; activity: string }) => void;
	user_connected: (userId: string) => void;
}