/**
 * AudioPlayer Component
 * Professional-grade music player with glassmorphism design
 * Features: Now Playing | Playback Controls | Progress Bar | Additional Controls
 */

import { useEffect, useRef } from 'react';
import { usePlayerStore } from '@/stores/PlayerStore';
import { useGamificationStore } from '@/stores/GamificationStore';
import { useChatStore } from '@/stores/useChatStore';
import { NowPlaying } from './player/NowPlaying';
import { PlaybackControls } from './player/PlaybackControls';
import { ProgressBar } from './player/ProgressBar';
import { AdditionalControls } from './player/AdditionalControls';
import { useKeyboardControls } from '@/hooks/useKeyboardControls';
import { Play, Pause, SkipForward } from 'lucide-react';

const AudioPlayer = () => {
	const audioRef = useRef<HTMLAudioElement>(null);
	const prevSongRef = useRef<string | null>(null);

	const {
		currentSong,
		isPlaying,
		togglePlay,
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

	// Handle song ended
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const handleEnded = () => {
			useGamificationStore.getState().awardXP(10, 'Song Completed');
			playNext();
		};
		audio.addEventListener('ended', handleEnded);
		return () => audio.removeEventListener('ended', handleEnded);
	}, [playNext]);

	// Handle song changes
	useEffect(() => {
		if (!audioRef.current || !currentSong) return;

		const audio = audioRef.current;
		const isSongChange = prevSongRef.current !== currentSong?.audioUrl;

		console.log('🎵 Song Change:', {
			isSongChange,
			currentSong: currentSong.title,
			audioUrl: currentSong.audioUrl,
			isPlaying
		});

		if (isSongChange) {
			audio.src = currentSong?.audioUrl;
			audio.currentTime = 0;
			prevSongRef.current = currentSong?.audioUrl;

			console.log('✅ Audio src set:', audio.src);

			if (isPlaying) {
				audio.play()
					.then(() => console.log('✅ Audio playing successfully'))
					.catch(err => {
						console.error('❌ Playback error:', err);
						console.log('💡 Tip: Click play button to start (browser autoplay restriction)');
					});
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

			{/* Player UI - Fixed Bottom Bar */}
			<div
				className="fixed bottom-0 left-0 right-0 z-[1000] h-[90px] md:h-[90px] sm:h-[80px]"
				style={{
					background: 'rgba(18, 18, 18, 0.85)',
					backdropFilter: 'blur(60px)',
					WebkitBackdropFilter: 'blur(60px)',
					borderTop: '1px solid rgba(255, 255, 255, 0.1)',
					boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.6)'
				}}
			>
				{/* Content */}
				<div className="h-full px-4 md:px-6 max-w-[1920px] mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-3 h-full items-center gap-4">

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
			<div className="h-[90px] md:h-[90px] sm:h-[80px]" />
		</>
	);
};

export default AudioPlayer;
