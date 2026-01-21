/**
 * AudioPlayer Component
 * Professional-grade music player with glassmorphism design
 * Features: Now Playing | Playback Controls | Progress Bar | Additional Controls
 */

import { useEffect, useRef } from 'react';
import { usePlayerStore } from '@/stores/PlayerStore';
import { NowPlaying } from './player/NowPlaying';
import { PlaybackControls } from './player/PlaybackControls';
import { ProgressBar } from './player/ProgressBar';
import { AdditionalControls } from './player/AdditionalControls';
import { useKeyboardControls } from '@/hooks/useKeyboardControls';

const AudioPlayer = () => {
	const audioRef = useRef<HTMLAudioElement>(null);
	const prevSongRef = useRef<string | null>(null);

	const {
		currentSong,
		isPlaying,
		playNext,
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

	// Handle song ended
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const handleEnded = () => playNext();
		audio.addEventListener('ended', handleEnded);
		return () => audio.removeEventListener('ended', handleEnded);
	}, [playNext]);

	// Handle song changes
	useEffect(() => {
		if (!audioRef.current || !currentSong) return;

		const audio = audioRef.current;
		const isSongChange = prevSongRef.current !== currentSong?.audioUrl;

		if (isSongChange) {
			audio.src = currentSong?.audioUrl;
			audio.currentTime = 0;
			prevSongRef.current = currentSong?.audioUrl;

			if (isPlaying) {
				audio.play().catch(err => console.error('Playback error:', err));
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

			{/* Player UI - Fixed Bottom Bar */}
			<div className="fixed bottom-0 left-0 right-0 z-50 h-[90px] md:h-[90px] sm:h-[80px]">
				{/* Glassmorphism Background */}
				<div className="absolute inset-0 bg-gradient-to-t from-zinc-900/95 to-zinc-900/90 backdrop-blur-2xl border-t border-white/10" />

				{/* Content */}
				<div className="relative h-full px-4 md:px-6">
					<div className="flex flex-col h-full justify-center gap-2">
						{/* Progress Bar - Top */}
						<div className="w-full">
							<ProgressBar
								currentTime={currentTime}
								duration={duration}
								bufferedTime={bufferedTime}
								onSeek={handleSeek}
							/>
						</div>

						{/* Main Player Controls - Three Column Grid */}
						<div className="grid grid-cols-3 items-center gap-4">
							{/* Left: Now Playing */}
							<div className="flex justify-start min-w-0">
								<NowPlaying />
							</div>

							{/* Center: Playback Controls */}
							<div className="flex justify-center">
								<PlaybackControls />
							</div>

							{/* Right: Additional Controls */}
							<div className="flex justify-end">
								<AdditionalControls
									queueCount={queue.length}
									onQueueClick={toggleQueue}
									volume={volume}
									isMuted={isMuted}
									onVolumeChange={setVolume}
									onToggleMute={toggleMute}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Spacer to prevent content from being hidden behind player */}
			<div className="h-[90px] md:h-[90px] sm:h-[80px]" />
		</>
	);
};

export default AudioPlayer;
