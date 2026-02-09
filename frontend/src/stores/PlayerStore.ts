import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Song } from "@/types";
import { PlayerManager } from "@/providers/playerManager";

/**
 * Core state interface for the Audio Player.
 */
interface PlayerState {
	/** The currently playing song object */
	currentSong: Song | null;
	/** Whether audio is currently playing */
	isPlaying: boolean;
	/** List of songs in the current playback queue */
	queue: Song[];
	/** Index of the current song in the queue */
	currentIndex: number;
	/** Whether shuffle mode is enabled */
	shuffled: boolean;
	/** Whether repeat mode is enabled */
	isRepeating: boolean;
	/** Whether the lyrics view is open */
	isLyricsOpen: boolean;
	/** Whether the queue drawer is open */
	isQueueOpen: boolean;

	// New audio state
	/** Current volume level (0-100) */
	volume: number;
	/** Whether audio is muted */
	isMuted: boolean;
	/** Current playback time in seconds */
	currentTime: number;
	/** Total duration of the track in seconds */
	duration: number;
	/** Buffered duration in seconds */
	bufferedTime: number;

	// UI State
	/** Whether the keyboard shortcuts guide is visible */
	isShortcutsGuideOpen: boolean;
	/** Whether the player is in expanded (full screen) mode */
	isExpanded: boolean;

	/** Number of active listeners on the current song */
	activeListeners: number;
}

/**
 * Actions available to manipulate the Player state.
 */
interface PlayerActions {
	/** Seek to a specific time in seconds */
	seek: (time: number) => void;
	/** Toggle visibility of shortcuts guide */
	toggleShortcutsGuide: () => void;
	/** Toggle expanded player view */
	toggleExpanded: () => void;

	/** Set a new queue of songs and start playing */
	initializeQueue: (songs: Song[]) => void;
	/** Play a specific album, optionally starting from a specific index */
	playAlbum: (songs: Song[], startIndex?: number) => void;
	/** Set the current song directly */
	setCurrentSong: (song: Song | null) => void;
	/** Toggle play/pause state */
	togglePlay: () => void;
	/** Skip to the next song */
	playNext: (skipped?: boolean) => void;
	/** Skip to the previous song */
	playPrevious: () => void;
	/** Shuffle the current queue */
	shuffleQueue: () => void;
	/** Toggle repeat mode */
	toggleRepeat: () => void;
	/** Toggle lyrics view */
	toggleLyrics: () => void;
	/** Toggle queue drawer */
	toggleQueue: () => void;

	// New audio actions
	/** Set smooth volume (0-100) */
	setVolume: (volume: number) => void;
	/** Toggle mute state */
	toggleMute: () => void;
	/** Update current playback time */
	setCurrentTime: (time: number) => void;
	/** Set track duration */
	setDuration: (duration: number) => void;
	/** Set buffered time */
	setBufferedTime: (time: number) => void;

	// Real-time actions
	setActiveListeners: (count: number) => void;
}

type PlayerStore = PlayerState & PlayerActions;

const initialState: PlayerState = {
	currentSong: null,
	isPlaying: false,
	activeListeners: 0,
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

/**
 * Global store for managing audio playback, queue, and player UI state.
 * Leverages `PlayerManager` for complex logic.
 */
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

				// Real-time State Actions
				setActiveListeners: (count: number) => set({ activeListeners: count }, false, "player/setActiveListeners"),
			};
		},
		{ name: "PlayerStore" }
	)
);
