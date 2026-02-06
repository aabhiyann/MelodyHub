import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Song } from "@/types";
import { PlayerManager } from "@/providers/playerManager";

interface PlayerState {
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

	// UI State
	isShortcutsGuideOpen: boolean;
	isExpanded: boolean;
}

interface PlayerActions {
	seek: (time: number) => void;
	toggleShortcutsGuide: () => void;
	toggleExpanded: () => void;

	initializeQueue: (songs: Song[]) => void;
	playAlbum: (songs: Song[], startIndex?: number) => void;
	setCurrentSong: (song: Song | null) => void;
	togglePlay: () => void;
	playNext: (skipped?: boolean) => void;
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
}

type PlayerStore = PlayerState & PlayerActions;

const initialState: PlayerState = {
	currentSong: null,
	isPlaying: false,
	queue: [],
	currentIndex: -1,
	shuffled: false,
	isRepeating: false,
	isLyricsOpen: false,
	isQueueOpen: false,
	volume: 70,
	isMuted: false,
	currentTime: 0,
	duration: 0,
	bufferedTime: 0,
	isShortcutsGuideOpen: false,
	isExpanded: false,
};

export const usePlayerStore = create<PlayerStore>()(
	devtools(
		(set, get) => {
			const manager = new PlayerManager(set, get);

			return {
				...initialState,

				// UI State Actions
				toggleShortcutsGuide: () => set((state) => ({ isShortcutsGuideOpen: !state.isShortcutsGuideOpen }), false, "player/toggleShortcuts"),
				toggleExpanded: () => set((state) => ({ isExpanded: !state.isExpanded }), false, "player/toggleExpanded"),

				// Manager Delegated Actions
				initializeQueue: manager.initializeQueue.bind(manager),
				playAlbum: manager.playAlbum.bind(manager),
				setCurrentSong: manager.setCurrentSong.bind(manager),
				togglePlay: manager.togglePlay.bind(manager),
				playNext: manager.playNext.bind(manager),
				playPrevious: manager.playPrevious.bind(manager),
				shuffleQueue: manager.shuffleQueue.bind(manager),
				toggleRepeat: manager.toggleRepeat.bind(manager),

				toggleLyrics: () => set((state) => ({ isLyricsOpen: !state.isLyricsOpen }), false, "player/toggleLyrics"),
				toggleQueue: () => set((state) => ({ isQueueOpen: !state.isQueueOpen }), false, "player/toggleQueue"),

				// Audio State Actions
				setVolume: (volume) => set({ volume }, false, "player/setVolume"),
				toggleMute: () => set((state) => ({ isMuted: !state.isMuted }), false, "player/toggleMute"),
				setCurrentTime: (time) => set({ currentTime: time }, false, "player/setTime"),
				setDuration: (duration) => set({ duration }, false, "player/setDuration"),
				setBufferedTime: (time) => set({ bufferedTime: time }, false, "player/setBuffered"),
				seek: (time) => set({ currentTime: time }, false, "player/seek"),
			};
		},
		{ name: "PlayerStore" }
	)
);
