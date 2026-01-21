import { create } from "zustand";
import { Song } from "@/types";
import { PlayerManager } from "@/providers/playerManager";

interface PlayerStore {
	currentSong: Song | null;
	isPlaying: boolean;
	queue: Song[];
	currentIndex: number;
	shuffled: boolean;
	isRepeating: boolean;
	isLyricsOpen: boolean;
	isQueueOpen: boolean;
	// New audio state
	volume: number;
	isMuted: boolean;
	currentTime: number;
	duration: number;
	bufferedTime: number;

	initializeQueue: (songs: Song[]) => void;
	playAlbum: (songs: Song[], startIndex?: number) => void;
	setCurrentSong: (song: Song | null) => void;
	togglePlay: () => void;
	playNext: () => void;
	playPrevious: () => void;
	shuffleQueue: () => void;
	toggleRepeat: () => void;
	toggleLyrics: () => void;
	toggleQueue: () => void;
	// New audio actions
	setVolume: (volume: number) => void;
	toggleMute: () => void;
	setCurrentTime: (time: number) => void;
	setDuration: (duration: number) => void;
	setBufferedTime: (time: number) => void;
	seek: (time: number) => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => {
	const manager = new PlayerManager(set, get);

	return {
		currentSong: null,
		isPlaying: false,
		queue: [],
		currentIndex: - 1,
		shuffled: false,
		isRepeating: false,
		isLyricsOpen: false,
		isQueueOpen: false,
		// New audio state
		volume: 70,
		isMuted: false,
		currentTime: 0,
		duration: 0,
		bufferedTime: 0,

		initializeQueue: manager.initializeQueue.bind(manager),
		playAlbum: manager.playAlbum.bind(manager),
		setCurrentSong: manager.setCurrentSong.bind(manager),
		togglePlay: manager.togglePlay.bind(manager),
		playNext: manager.playNext.bind(manager),
		playPrevious: manager.playPrevious.bind(manager),
		shuffleQueue: manager.shuffleQueue.bind(manager),
		toggleRepeat: manager.toggleRepeat.bind(manager),
		toggleLyrics: () => set(state => ({ isLyricsOpen: !state.isLyricsOpen })),
		toggleQueue: () => set(state => ({ isQueueOpen: !state.isQueueOpen })),
		// New audio actions
		setVolume: (volume) => set({ volume }),
		toggleMute: () => set(state => ({ isMuted: !state.isMuted })),
		setCurrentTime: (time) => set({ currentTime: time }),
		setDuration: (duration) => set({ duration }),
		setBufferedTime: (time) => set({ bufferedTime: time }),
		seek: (time) => set({ currentTime: time }),
	};
});
