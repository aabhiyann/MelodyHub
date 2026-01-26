import Topbar from "@/components/Topbar";
import { useMusicStore } from "@/stores/MusicStore";
import { usePlayerStore } from "@/stores/PlayerStore";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { ActivityFeed } from "@/components/home/ActivityFeed";

import { Sparkles } from "lucide-react";
import MusicCard, { MusicCardSkeleton } from "@/pages/home/components/MusicCard";
import HorizontalScrollSection from "@/pages/home/components/HorizontalScrollSection";
import { EmptyState } from "@/pages/home/components/EmptyState";
import { AIPlaylistPage } from "@/pages/ai/AIPlaylistPage";
import { Song } from "@/types";
import { PullToRefresh } from "@/components/mobile/PullToRefresh";
import { useUIStore } from "@/stores/UIStore";

const HomePage = () => {
	const { user } = useUser();
	const { isActivityPanelOpen } = useUIStore();
	const {
		trendingSongs,
		featuredSongs,
		madeForYouSongs,
		isLoading,
		fetchTrendingSongs,
		fetchFeaturedSongs,
		fetchMadeForYouSongs,
		fetchDailyMix
	} = useMusicStore();
	const { playAlbum } = usePlayerStore();
	const [showAIPlaylist, setShowAIPlaylist] = useState(false);
	const [dailyMix, setDailyMix] = useState<Song[]>([]);

	const refreshData = async () => {
		await Promise.all([
			fetchTrendingSongs(),
			fetchFeaturedSongs(),
			fetchMadeForYouSongs(),
			fetchDailyMix().then(songs => setDailyMix(songs))
		]);
	};

	useEffect(() => {
		refreshData();
	}, []);

	const getGreeting = () => {
		const hour = new Date().getHours();
		if (hour < 12) return "Good morning";
		if (hour < 18) return "Good afternoon";
		return "Good evening";
	};

	return (
		<main className='rounded-md overflow-hidden h-full bg-transparent flex'>
			<div className="flex-1 flex flex-col overflow-hidden">
				<Topbar />
				<div className='flex-1 h-full overflow-hidden'>
					<PullToRefresh onRefresh={refreshData}>
						<div className='p-6 space-y-12 min-h-full pb-24 max-w-full overflow-x-hidden'>
							{/* Welcome Header with AI Playlist Button */}
							<div className="flex items-center justify-between gap-4">
								<div className="space-y-1 flex-1">
									<h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-text-secondary bg-clip-text text-transparent tracking-tight">
										{getGreeting()}, {user?.firstName || "Music Lover"}
									</h1>
									<p className="text-text-secondary text-lg">Let's find your vibe for today</p>
								</div>

								{/* AI Playlist Button */}
								<button
									onClick={() => setShowAIPlaylist(true)}
									className="group relative px-6 py-3 bg-gradient-to-r from-brand-secondary to-brand-primary hover:from-brand-secondary/80 hover:to-brand-primary/90 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:shadow-brand-primary/50 transition-all duration-300 hover:scale-105 flex items-center gap-2"
								>
									<Sparkles className="w-5 h-5" />
									<span>AI Playlist</span>
								</button>
							</div>


							{/* Featured / Trending Section */}
							<div className="w-full overflow-hidden">
								<HorizontalScrollSection title="Trending Now" subtitle="The hottest tracks on MelodyHub">
									{isLoading ? (
										Array(5).fill(0).map((_, i) => <MusicCardSkeleton key={i} />)
									) : trendingSongs.length > 0 ? (
										trendingSongs.map((song, index) => (
											<MusicCard
												key={song._id}
												song={song}
												onClick={() => playAlbum(trendingSongs, index)}
												onPlayClick={(e) => {
													e.stopPropagation();
													playAlbum(trendingSongs, index);
												}}
											/>
										))
									) : (
										<EmptyState
											message="No trending tracks yet"
											description="Be the first to discover new music!"
											showMascot={false}
										/>
									)}
								</HorizontalScrollSection>
							</div>

							{/* Daily Mix Section */}
							{dailyMix.length > 0 && (
								<div>
									<h2 className="text-2xl font-bold text-white tracking-tight mb-6 flex items-center gap-2">
										<Sparkles className="size-6 text-brand-primary" />
										Your Daily Mix
									</h2>
									<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
										{dailyMix.map((song, index) => (
											<MusicCard
												key={song._id}
												song={song}
												onClick={() => playAlbum(dailyMix, index)}
												onPlayClick={(e) => {
													e.stopPropagation();
													playAlbum(dailyMix, index);
												}}
											/>
										))}
									</div>
								</div>
							)}

							{/* Made For You Section (Grid Layout as requested) */}
							<div>
								<h2 className="text-2xl font-bold text-white tracking-tight mb-6">Made For You</h2>
								<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
									{isLoading ? (
										Array(5).fill(0).map((_, i) => <MusicCardSkeleton key={i} />)
									) : (
										madeForYouSongs.map((song, index) => (
											<MusicCard
												key={song._id}
												song={song}
												onClick={() => playAlbum(madeForYouSongs, index)}
												onPlayClick={(e) => {
													e.stopPropagation();
													playAlbum(madeForYouSongs, index);
												}}
											/>
										))
									)}
								</div>
							</div>

							{/* Genre Exploration (New) */}
							<div>
								<h2 className="text-2xl font-bold text-white tracking-tight mb-6">Explore Genres</h2>
								<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
									{['Pop', 'Rock', 'Jazz', 'Electronic', 'Classical', 'Hip Hop', 'Indie', 'Ambient'].map((genre) => (
										<div
											key={genre}
											className="group relative h-32 rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:ring-1 hover:ring-white/10"
										>
											{/* Gradient Background */}
											<div className={`absolute inset-0 bg-gradient-to-br from-brand-primary/80 to-brand-secondary/80 opacity-60 transition-opacity group-hover:opacity-80`} />

											<span className="absolute bottom-3 left-3 text-xl font-bold text-white tracking-wide z-10 w-full text-center md:text-left drop-shadow-md">
												{genre}
											</span>
										</div>
									))}
								</div>
							</div>

							{/* Featured Section (Classic Grid for Featured) */}
							<div>
								<h2 className="text-2xl font-bold text-white tracking-tight mb-6">Featured Hits</h2>
								<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
									{isLoading ? (
										Array(10).fill(0).map((_, i) => <MusicCardSkeleton key={i} />)
									) : (
										featuredSongs.map((song, index) => (
											<MusicCard
												key={song._id}
												song={song}
												onClick={() => playAlbum(featuredSongs, index)}
												onPlayClick={(e) => {
													e.stopPropagation();
													playAlbum(featuredSongs, index);
												}}
											/>
										))
									)}
								</div>
							</div>
						</div>
					</PullToRefresh>
				</div>
			</div>

			{/* Activity Feed Sidebar (Hidden on smaller screens, togglable on large) */}
			{isActivityPanelOpen && (
				<div className="hidden lg:block animate-in slide-in-from-right-10 duration-300">
					<ActivityFeed />
				</div>
			)}

			{/* AI Playlist Modal */}
			<AIPlaylistPage isOpen={showAIPlaylist} onClose={() => setShowAIPlaylist(false)} />
		</main>
	);
};
export default HomePage;
