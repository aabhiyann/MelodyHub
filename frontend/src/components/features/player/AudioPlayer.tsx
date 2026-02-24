/**
 * AudioPlayer Component
 * Professional-grade music player with glassmorphism design
 * Features: Now Playing | Playback Controls | Progress Bar | Additional Controls
 */

import { useEffect, useRef } from 'react';
import { usePlayerStore } from '@/stores/PlayerStore';
import { useGamificationStore } from '@/stores/GamificationStore';
import { useChatStore } from '@/stores/ChatStore';
import { NowPlaying } from './NowPlaying';
import { PlaybackControls } from './PlaybackControls';
import { ProgressBar } from './ProgressBar';
import { AdditionalControls } from './AdditionalControls';
import { useKeyboardControls } from '@/hooks/useKeyboardControls';
import { Play, Pause, SkipForward } from 'lucide-react';

const resolveAudioUrl = (audioUrl?: string) => {
	if (!audioUrl) return '';
	if (audioUrl.startsWith('http://') || audioUrl.startsWith('https://')) {
		return audioUrl;
	}

	// Treat relative paths as files served by the frontend origin
	try {
		return new URL(audioUrl, window.location.origin).toString();
	} catch {
		return audioUrl;
	}
};

const AudioPlayer = () => {
	const audioRef = useRef<HTMLAudioElement>(null);
	const prevSongIdRef = useRef<string | null>(null);

	const {
		currentSong,
		isPlaying,
		togglePlay,
		playNext,
		playPrevious,
		volume,
		isMuted,
		setVolume,
		toggleMute,
		currentTime,
		duration,
		bufferedTime,
		setCurrentTime,
		setDuration,
		setBufferedTime,
		seek,
		queue,
		toggleQueue,
		isExpanded,
		toggleExpanded,
	} = usePlayerStore();

	// Enable keyboard controls
	useKeyboardControls();

	// Handle play/pause logic
	useEffect(() => {
		if (!audioRef.current) return;

		if (isPlaying) {
			audioRef.current.play().catch(err => console.error('Playback error:', err));
		} else {
			audioRef.current.pause();
		}
	}, [isPlaying]);

	// Handle volume changes
	useEffect(() => {
		if (!audioRef.current) return;
		audioRef.current.volume = isMuted ? 0 : volume / 100;
	}, [volume, isMuted]);

	// Handle song ended (track completion, then play next)
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const handleEnded = () => {
			useGamificationStore.getState().awardXP(10, 'Song Completed');
			playNext(false); // false = completed, not skipped
		};
		audio.addEventListener('ended', handleEnded);
		return () => audio.removeEventListener('ended', handleEnded);
	}, [playNext]);

	// Handle song changes (key off song id so next/prev always update the audio)
	useEffect(() => {
		if (!audioRef.current || !currentSong) return;

		const audio = audioRef.current;
		const isSongChange = currentSong._id !== prevSongIdRef.current;
		const resolvedUrl = resolveAudioUrl(currentSong.audioUrl);

		if (isSongChange) {
			prevSongIdRef.current = currentSong._id;
			if (resolvedUrl) {
				audio.src = resolvedUrl;
				audio.currentTime = 0;
				if (isPlaying) {
					audio.play().catch(err => console.error('Playback error:', err));
				}
			}
		}
	}, [currentSong, isPlaying]);

	// Update time and buffered progress
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const handleTimeUpdate = () => {
			setCurrentTime(audio.currentTime);

			// Update buffered time
			if (audio.buffered.length > 0) {
				const buffered = audio.buffered.end(audio.buffered.length - 1);
				setBufferedTime(buffered);
			}
		};

		const handleLoadedMetadata = () => {
			setDuration(audio.duration);
		};

		const handleDurationChange = () => {
			setDuration(audio.duration);
		};

		audio.addEventListener('timeupdate', handleTimeUpdate);
		audio.addEventListener('loadedmetadata', handleLoadedMetadata);
		audio.addEventListener('durationchange', handleDurationChange);

		return () => {
			audio.removeEventListener('timeupdate', handleTimeUpdate);
			audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
			audio.removeEventListener('durationchange', handleDurationChange);
		};
	}, [setCurrentTime, setDuration, setBufferedTime]);

	// MediaSession API for lock screen / OS media controls
	useEffect(() => {
		if (typeof navigator === "undefined" || !navigator.mediaSession) return;
		if (currentSong) {
			navigator.mediaSession.metadata = new (window as any).MediaMetadata({
				title: currentSong.title,
				artist: currentSong.artist,
				album: "",
				artwork: [{ src: currentSong.imageUrl || "", sizes: "512x512", type: "image/png" }],
			});
		}
		navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
	}, [currentSong, isPlaying]);

	useEffect(() => {
		if (typeof navigator === "undefined" || !navigator.mediaSession) return;
		const audio = audioRef.current;
		navigator.mediaSession.setActionHandler("play", () => {
			togglePlay();
			audio?.play().catch(() => { });
		});
		navigator.mediaSession.setActionHandler("pause", () => {
			togglePlay();
			audio?.pause();
		});
		navigator.mediaSession.setActionHandler("previoustrack", () => playPrevious());
		navigator.mediaSession.setActionHandler("nexttrack", () => playNext(true));
		return () => {
			navigator.mediaSession.setActionHandler("play", null);
			navigator.mediaSession.setActionHandler("pause", null);
			navigator.mediaSession.setActionHandler("previoustrack", null);
			navigator.mediaSession.setActionHandler("nexttrack", null);
		};
	}, [togglePlay, playNext, playPrevious]);

	// Update MediaSession position for lock screen progress
	useEffect(() => {
		if (typeof navigator === "undefined" || !navigator.mediaSession?.setPositionState || !currentSong) return;
		const audio = audioRef.current;
		if (audio && !isNaN(audio.duration)) {
			try {
				navigator.mediaSession.setPositionState({
					duration: audio.duration,
					playbackRate: audio.playbackRate,
					position: audio.currentTime,
				});
			} catch (_) { }
		}
	}, [currentTime, duration, currentSong]);

	// Broadcast activity
	const { updateActivity } = useChatStore();
	useEffect(() => {
		if (currentSong && isPlaying) {
			updateActivity(`Listening to ${currentSong.title}`);
		} else {
			updateActivity("Idle");
		}
	}, [currentSong, isPlaying, updateActivity]);

	// Handle seeking
	const handleSeek = (time: number) => {
		if (!audioRef.current) return;
		audioRef.current.currentTime = time;
		seek(time);
	};

	if (!currentSong) return <audio ref={audioRef} />;

	return (
		<>
			<audio ref={audioRef} />

			{/* Screen Reader Live Region for Accessibility */}
			<div
				role="status"
				aria-live="polite"
				aria-atomic="true"
				className="sr-only"
			>
				{isPlaying
					? `Now playing: ${currentSong.title} by ${currentSong.artist}`
					: currentSong
						? `Paused: ${currentSong.title} by ${currentSong.artist}`
						: 'No track loaded'}
			</div>

			{/* Player UI - Floating Pill */}
			<div
				className="fixed bottom-[72px] left-2 right-2 md:bottom-6 md:left-6 md:right-6 z-[1000] h-[60px] md:h-[92px] rounded-xl md:rounded-2xl"
				style={{
					background: 'rgba(20, 20, 22, 0.85)', // Slightly refined dark glass
					backdropFilter: 'blur(60px)',
					WebkitBackdropFilter: 'blur(60px)',
					border: '1px solid rgba(255, 255, 255, 0.08)',
					boxShadow: '0 16px 40px rgba(0, 0, 0, 0.8)'
				}}
			>
				{/* Content */}
				<div className="h-full px-3 md:px-6 max-w-[1920px] mx-auto">
					<div className="flex md:grid md:grid-cols-3 h-full items-center justify-between gap-4">

						{/* Left: Now Playing */}
						<div className="flex justify-between items-center w-full md:w-auto min-w-0 gap-4">
							<NowPlaying />

							{/* Mobile Controls */}
							<div className="flex items-center gap-1 md:hidden shrink-0">
								{/* Play/Pause Button */}
								<button
									onClick={(e) => {
										e.stopPropagation();
										togglePlay();
									}}
									className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
								>
									{isPlaying ? (
										<Pause className="w-6 h-6 fill-white" />
									) : (
										<Play className="w-6 h-6 fill-white" />
									)}
								</button>

								{/* Next Button */}
								<button
									onClick={(e) => {
										e.stopPropagation();
										playNext();
									}}
									className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
								>
									<SkipForward className="w-6 h-6 fill-white" />
								</button>
							</div>
						</div>

						{/* Center: Playback Controls & Progress */}
						<div className="hidden md:flex flex-col items-center justify-center w-full max-w-[600px] mx-auto gap-2">
							<PlaybackControls />
							<div className="w-full px-2">
								<ProgressBar
									currentTime={currentTime}
									duration={duration}
									bufferedTime={bufferedTime}
									onSeek={handleSeek}
								/>
							</div>
						</div>

						{/* Right: Additional Controls */}
						<div className="hidden md:flex justify-end items-center min-w-0">
							<AdditionalControls
								queueCount={queue.length}
								onQueueClick={toggleQueue}
								volume={volume}
								isMuted={isMuted}
								onVolumeChange={setVolume}
								onToggleMute={toggleMute}
								isExpanded={isExpanded}
								onToggleExpanded={toggleExpanded}
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Spacer to prevent content from being hidden behind player */}
			<div className="h-[84px] md:h-[120px]" />
		</>
	);
};

export default AudioPlayer;
