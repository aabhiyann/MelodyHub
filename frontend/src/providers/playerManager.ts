import { Song, SocketAuth } from "@/types";
import { ChatStore } from "@/stores/ChatStore";
import { StateCreator } from "zustand";

/**
 * Manages music player logic, connected to Zustand state and Chat socket.
 */
export class PlayerManager {
	private set: Parameters<StateCreator<any>>[0];
	private get: Parameters<StateCreator<any>>[1];

	constructor(
		set: Parameters<StateCreator<any>>[0],
		get: Parameters<StateCreator<any>>[1]
	) {
		this.set = set;
		this.get = get;
	}

	/**
	 * Emits user activity via socket with the current status.
	 */
	private emitActivity(activity: string): void {
		const socket = ChatStore.getState().socket;
		const auth = socket.auth as SocketAuth;

		if (auth?.userId) {
			socket.emit("update_activity", {
				userId: auth.userId,
				activity,
			});
		}
	}

	/**
	 * Initializes the player queue and resets state.
	 */
	initializeQueue(songs: Song[]): void {
		this.set({
			queue: songs,
			currentSong: this.get().currentSong || songs[0],
			currentIndex: this.get().currentIndex === -1 ? 0 : this.get().currentIndex,
			shuffled: false,
			isRepeating: false,
		});
	}

	/**
	 * Plays an album from the given index.
	 */
	playAlbum(songs: Song[], startIndex: number = 0): void {
		if (songs.length === 0) return;

		const song = songs[startIndex];
		this.emitActivity(`Playing ${song.title} by ${song.artist}`);

		this.set({
			queue: songs,
			currentSong: song,
			currentIndex: startIndex,
			isPlaying: true,
			shuffled: false,
		});
	}

	/**
	 * Sets the current song and emits activity.
	 */
	setCurrentSong(song: Song | null): void {
		if (!song) return;

		this.emitActivity(`Playing ${song.title} by ${song.artist}`);

		const index = this.get().queue.findIndex((s: Song) => s._id === song._id);
		this.set({
			currentSong: song,
			isPlaying: true,
			currentIndex: index !== -1 ? index : this.get().currentIndex,
		});
	}

	/**
	 * Toggles between play and pause states.
	 */
	togglePlay(): void {
		const isPlaying = !this.get().isPlaying;
		const currentSong = this.get().currentSong;

		const activity = isPlaying && currentSong
			? `Playing ${currentSong.title} by ${currentSong.artist}`
			: "Idle";

		this.emitActivity(activity);
		this.set({ isPlaying });
	}

	/**
	 * Plays the next song in the queue, or stops if at the end.
	 */
	playNext(): void {
		const { currentIndex, queue, isRepeating } = this.get();

		if (isRepeating) return;

		const nextIndex = currentIndex + 1;
		if (nextIndex < queue.length) {
			const nextSong = queue[nextIndex];
			this.emitActivity(`Playing ${nextSong.title} by ${nextSong.artist}`);

			this.set({
				currentSong: nextSong,
				currentIndex: nextIndex,
				isPlaying: true,
			});
		} else {
			this.set({ isPlaying: false });
		}
	}

	/**
	 * Plays the previous song if available.
	 */
	playPrevious(): void {
		const { currentIndex, queue } = this.get();
		const prevIndex = currentIndex - 1;

		if (prevIndex >= 0) {
			const prevSong = queue[prevIndex];
			this.emitActivity(`Playing ${prevSong.title} by ${prevSong.artist}`);

			this.set({
				currentSong: prevSong,
				currentIndex: prevIndex,
				isPlaying: true,
			});
		} else {
			this.set({ isPlaying: false });
		}
	}

	/**
	 * Shuffles the current queue and starts from the first song.
	 */
	shuffleQueue(): void {
		const { queue } = this.get();
		const shuffled = this.shuffleArray([...queue]);

		this.set({
			queue: shuffled,
			currentIndex: 0,
			currentSong: shuffled[0],
			isPlaying: true,
			shuffled: true,
		});
	}

	/**
	 * Toggles the repeat state.
	 */
	toggleRepeat(): void {
		this.set({ isRepeating: !this.get().isRepeating });
	}

	/**
	 * Fisher-Yates Shuffle Algorithm.
	 */
	private shuffleArray<T>(array: T[]): T[] {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}
}
