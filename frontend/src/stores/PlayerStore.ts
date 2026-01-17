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

	initializeQueue: (songs: Song[]) => void;
	playAlbum: (songs: Song[], startIndex?: number) => void;
	setCurrentSong: (song: Song | null) => void;
	togglePlay: () => void;
	playNext: () => void;
	playPrevious: () => void;
	shuffleQueue: () => void;
	toggleRepeat: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => {
	const manager = new PlayerManager(set, get);

	return {
		currentSong: null,
		isPlaying: false,
		queue: [],
		currentIndex: -1,
		shuffled: false,
		isRepeating: false,

		initializeQueue: manager.initializeQueue.bind(manager),
		playAlbum: manager.playAlbum.bind(manager),
		setCurrentSong: manager.setCurrentSong.bind(manager),
		togglePlay: manager.togglePlay.bind(manager),
		playNext: manager.playNext.bind(manager),
		playPrevious: manager.playPrevious.bind(manager),
		shuffleQueue: manager.shuffleQueue.bind(manager),
		toggleRepeat: manager.toggleRepeat.bind(manager),
	};
});
