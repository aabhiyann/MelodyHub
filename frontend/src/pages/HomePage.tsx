import Topbar from "@/components/Topbar";
import { useMusicStore } from "@/stores/MusicStore";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePlayerStore } from "@/stores/PlayerStore";
import HorizontalScrollSection from "./home/components/HorizontalScrollSection";
import MusicCard, { MusicCardSkeleton } from "./home/components/MusicCard";
import { EmptyState } from "./home/components/EmptyState";
import { useUser } from "@clerk/clerk-react";
import { AIPlaylistPage } from "./ai/AIPlaylistPage";

const HomePage = () => {
	const { user } = useUser();
	const [showAIPlaylist, setShowAIPlaylist] = useState(false);

	const {
		fetchFeaturedSongs,
		fetchMadeForYouSongs,
		fetchTrendingSongs,
		isLoading,
		madeForYouSongs,
		featuredSongs,
		trendingSongs,
	} = useMusicStore();

	const { initializeQueue } = usePlayerStore();

	useEffect(() => {
		fetchFeaturedSongs();
		fetchMadeForYouSongs();
		fetchTrendingSongs();
	}, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs]);

	useEffect(() => {
		if (madeForYouSongs.length > 0 && featuredSongs.length > 0 && trendingSongs.length > 0) {
			const allSongs = [...featuredSongs, ...madeForYouSongs, ...trendingSongs];
			initializeQueue(allSongs);
		}
	}, [initializeQueue, madeForYouSongs, trendingSongs, featuredSongs]);

	// Calculate greeting
	const getGreeting = () => {
		const hour = new Date().getHours();
		if (hour < 12) return "Good morning";
		if (hour < 18) return "Good afternoon";
		return "Good evening";
	};

	return (
		<main className='rounded-md overflow-hidden h-full bg-transparent'>
			<Topbar />
			<ScrollArea className='h-[calc(100vh-180px)]'>
				<div className='p-6 space-y-12 min-h-full pb-24'>
					{/* Welcome Header */}
					<div className="flex items-center justify-between">
						<div className="space-y-1">
							<h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent tracking-tight">
								{getGreeting()}, {user?.firstName || "Music Lover"}
							</h1>
							<p className="text-zinc-400 text-lg">Let's find your vibe for today</p>
						</div>
					</div>

					{/* Featured / Trending Section */}
					<HorizontalScrollSection title="Trending Now" subtitle="The hottest tracks on MelodyHub">
						{isLoading ? (
							Array(5).fill(0).map((_, i) => <MusicCardSkeleton key={i} />)
						) : (
							trendingSongs.map((song) => (
								<MusicCard
									key={song._id}
									song={song}
									onClick={() => initializeQueue(trendingSongs)}
									onPlayClick={(e) => {
										e.stopPropagation();
										initializeQueue(trendingSongs);
									}}
								/>
							))
						)}
					</HorizontalScrollSection>

					{/* Made For You Section (Grid Layout as requested) */}
					<div>
						<h2 className="text-2xl font-bold text-white tracking-tight mb-6">Made For You</h2>
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
							{isLoading ? (
								Array(5).fill(0).map((_, i) => <MusicCardSkeleton key={i} />)
							) : (
								madeForYouSongs.map((song) => (
									<MusicCard
										key={song._id}
										song={song}
										onClick={() => initializeQueue(madeForYouSongs)}
										onPlayClick={(e) => {
											e.stopPropagation();
											initializeQueue(madeForYouSongs);
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
									className="group relative h-32 rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
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
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
							{isLoading ? (
								Array(10).fill(0).map((_, i) => <MusicCardSkeleton key={i} />)
							) : (
								featuredSongs.map((song) => (
									<MusicCard
										key={song._id}
										song={song}
										onClick={() => initializeQueue(featuredSongs)}
										onPlayClick={(e) => {
											e.stopPropagation();
											initializeQueue(featuredSongs);
										}}
									/>
								))
							)}
						</div>
					</div>
				</div>
			</ScrollArea>
		</main >
	);
};
export default HomePage;
