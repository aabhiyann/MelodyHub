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
import { cn } from '@/lib/utils';

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

	// Handle seeking (from mini bar or expanded player)
	const handleSeek = (time: number) => {
		if (!audioRef.current) return;
		audioRef.current.currentTime = time;
		seek(time);
	};

	// Sync seek from FullScreenPlayer (which doesn't have audio ref) to actual audio element
	useEffect(() => {
		const handler = (e: Event) => {
			const time = (e as CustomEvent<number>).detail;
			if (audioRef.current && typeof time === 'number' && !isNaN(time)) {
				audioRef.current.currentTime = time;
				seek(time);
			}
		};
		window.addEventListener('player-seek', handler as EventListener);
		return () => window.removeEventListener('player-seek', handler as EventListener);
	}, [seek]);

	if (!currentSong) return <audio ref={audioRef} />;

	const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

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

			{/* Mini player bar: progress line at top, then art + title + artist + play + next. Tap (except buttons) to expand. */}
			<div
				role="button"
				tabIndex={0}
				onClick={(e) => {
					if (!(e.target as HTMLElement).closest('button')) toggleExpanded();
				}}
				onKeyDown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						if (!(e.target as HTMLElement).closest('button')) toggleExpanded();
					}
				}}
				className={cn(
					'fixed left-0 right-0 z-[1000] cursor-pointer select-none',
					'bottom-[72px] md:bottom-6 mx-2 md:mx-6',
					'h-14 md:h-16 rounded-t-xl md:rounded-xl overflow-hidden',
					'transition-opacity duration-300',
					isExpanded && 'opacity-0 pointer-events-none'
				)}
				style={{
					background: 'rgba(0,0,0,0.75)',
					backdropFilter: 'blur(20px)',
					WebkitBackdropFilter: 'blur(20px)',
					border: '1px solid rgba(255,255,255,0.08)',
					borderBottom: 'none',
					boxShadow: '0 -4px 24px rgba(0,0,0,0.3)',
				}}
				aria-label="Now playing - tap to expand"
			>
				{/* Progress bar as thin line at the very top */}
				<div className="absolute top-0 left-0 right-0 h-0.5 bg-white/20">
					<div
						className="h-full bg-[#22C55E] transition-[width] duration-100"
						style={{ width: `${progressPercent}%` }}
					/>
				</div>

				<div className="flex items-center gap-3 h-full pl-3 pr-2 py-2 pt-2.5">
					{/* Album art - small, rounded */}
					<div className="flex-shrink-0 w-10 h-10 md:w-11 md:h-11 rounded-lg overflow-hidden ring-1 ring-white/10">
						<img
							src={currentSong.imageUrl}
							alt=""
							className="w-full h-full object-cover"
						/>
					</div>

					{/* Title + artist */}
					<div className="flex-1 min-w-0 text-left">
						<p className="text-sm font-semibold text-white truncate">{currentSong.title}</p>
						<p className="text-xs text-white/60 truncate">{currentSong.artist}</p>
					</div>

					{/* Play/Pause + Next - buttons so they don't trigger expand */}
					<div className="flex items-center gap-0.5">
						<button
							type="button"
							onClick={(e) => { e.stopPropagation(); togglePlay(); }}
							className="p-2.5 rounded-full text-white hover:bg-white/10 transition-colors"
							aria-label={isPlaying ? 'Pause' : 'Play'}
						>
							{isPlaying ? (
								<Pause className="w-5 h-5 md:w-6 md:h-6 fill-current" />
							) : (
								<Play className="w-5 h-5 md:w-6 md:h-6 fill-current" />
							)}
						</button>
						<button
							type="button"
							onClick={(e) => { e.stopPropagation(); playNext(true); }}
							className="p-2.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
							aria-label="Next"
						>
							<SkipForward className="w-5 h-5 md:w-6 md:h-6 fill-current" />
						</button>
					</div>
				</div>
			</div>

			{/* Desktop: center controls + full progress; tap area to expand */}
			<div
				role="button"
				tabIndex={0}
				onClick={(e) => {
					if (!(e.target as HTMLElement).closest('button') && !(e.target as HTMLElement).closest('input')) toggleExpanded();
				}}
				onKeyDown={(e) => {
					if ((e.key === 'Enter' || e.key === ' ') && !(e.target as HTMLElement).closest('button')) {
						e.preventDefault();
						toggleExpanded();
					}
				}}
				className={cn(
					'hidden md:flex fixed bottom-6 left-6 right-6 z-[1000] max-w-[1920px] mx-auto cursor-pointer',
					'h-[92px] rounded-2xl overflow-hidden',
					'transition-opacity duration-300',
					isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'
				)}
				style={{
					background: 'rgba(0,0,0,0.75)',
					backdropFilter: 'blur(20px)',
					WebkitBackdropFilter: 'blur(20px)',
					border: '1px solid rgba(255,255,255,0.08)',
					boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
				}}
				aria-label="Now playing - click to expand"
			>
				<div className="absolute top-0 left-0 right-0 h-0.5 bg-white/20">
					<div className="h-full bg-[#22C55E] transition-[width] duration-100" style={{ width: `${progressPercent}%` }} />
				</div>
				<div className="grid grid-cols-3 flex-1 h-full px-6 items-center gap-4 pt-1">
					<div className="flex items-center min-w-0">
						<NowPlaying />
					</div>
					<div className="flex flex-col items-center justify-center gap-2 max-w-[600px] mx-auto w-full">
						<PlaybackControls />
						<div className="w-full px-2" onClick={(e) => e.stopPropagation()}>
							<ProgressBar currentTime={currentTime} duration={duration} bufferedTime={bufferedTime} onSeek={handleSeek} />
						</div>
					</div>
					<div className="flex justify-end items-center min-w-0" onClick={(e) => e.stopPropagation()}>
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

			{/* Spacer so content is not hidden behind player */}
			<div className="h-16 md:h-[100px]" aria-hidden />
		</>
	);
};

export default AudioPlayer;
