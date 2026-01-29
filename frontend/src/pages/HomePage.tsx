import Topbar from "@/components/Topbar";
import { useMusicStore } from "@/stores/MusicStore";
import { useEffect } from "react";
import { ActivityFeed } from "@/components/home/ActivityFeed";
import { Sparkles } from "lucide-react";

import { PullToRefresh } from "@/components/mobile/PullToRefresh";
import { useUIStore } from "@/stores/UIStore";
import { useHomeData } from "@/hooks/useHomeData";

import { useAIStore } from "@/stores/useAIStore";

// New Components
import { HomeHero } from "@/pages/home/components/HomeHero";
import { JumpBackIn } from "@/pages/home/components/JumpBackIn";
import { MadeForYou } from "@/pages/home/components/MadeForYou";
import { ChartsMosaic } from "@/pages/home/components/ChartsMosaic";
import { GenreMosaic } from "@/pages/home/components/GenreMosaic";
import { NewReleases } from "@/pages/home/components/NewReleases";
import { RecommendedSection } from "@/pages/home/components/RecommendedSection";
import { TopArtists } from "@/pages/home/components/TopArtists";

const HomePage = () => {
	const { isActivityPanelOpen } = useUIStore();
	const { openModal } = useAIStore();
	const {
		trendingSongs,
		featuredSongs,
		madeForYouSongs,
		albums,
		isLoading,
		fetchTrendingSongs,
		fetchFeaturedSongs,
		fetchMadeForYouSongs,
		fetchAlbums,
	} = useMusicStore();

	// custom hook for personalized data
	const { listeningHistory, topArtists } = useHomeData();

	const refreshData = async () => {
		await Promise.all([
			fetchTrendingSongs(),
			fetchFeaturedSongs(),
			fetchMadeForYouSongs(),
			fetchAlbums(),
			// useHomeData fetches on mount, but we could expose a refresh function if needed
		]);
	};

	useEffect(() => {
		refreshData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Calculate new discoveries (mock logic or derive from history vs total songs)
	const newDiscoveries = 12; // Placeholder or calculate

	return (
		<main className='rounded-md overflow-hidden h-full bg-transparent flex'>
			<div className="flex-1 flex flex-col overflow-hidden relative">
				<Topbar />

				<div className='flex-1 h-full overflow-hidden' id="home-scroll-container">
					<PullToRefresh onRefresh={refreshData}>
						<div className='space-y-16 min-h-full pb-32 max-w-full overflow-x-hidden animate-in fade-in slide-in-from-bottom-4 duration-700'>

							{/* 1. HERO SECTION */}
							<div className="px-6 pt-6">
								<HomeHero
									totalListeningTime={listeningHistory.length * 3.5 * 60} // Estimate
									newDiscoveriesCount={newDiscoveries}
								/>
							</div>

							{/* 2. JUMP BACK IN */}
							<div className="pl-6">
								<JumpBackIn history={listeningHistory} />
							</div>

							{/* 3. MADE FOR YOU */}
							<div className="px-6">
								<MadeForYou songs={madeForYouSongs} isLoading={isLoading} />
							</div>

							{/* 4. CHARTS & TRENDING */}
							<div className="px-6">
								<ChartsMosaic
									trendingSongs={trendingSongs}
									featuredSongs={featuredSongs}
									isLoading={isLoading}
								/>
							</div>

							{/* 5. GENRE EXPLORATION */}
							<div className="px-6">
								<GenreMosaic />
							</div>

							{/* 6. NEW RELEASES */}
							<div className="pl-6">
								<NewReleases albums={albums} isLoading={isLoading} />
							</div>

							{/* 7. RECOMMENDED */}
							<div className="pl-6">
								<RecommendedSection
									songs={featuredSongs.slice(5, 15)} // Mocking similar songs
									isLoading={isLoading}
									seedArtist={topArtists[0]?.artist}
								/>
							</div>

							{/* 8. TOP ARTISTS */}
							<div className="px-6 pb-12">
								<TopArtists artists={topArtists} />
							</div>

							{/* AI Playlist Floating Action Button (Mobile/Desktop) */}
							<div className="fixed bottom-24 right-6 z-50 md:bottom-8">
								<button
									onClick={openModal}
									className="group flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-full shadow-2xl hover:scale-105 hover:shadow-brand-primary/50 transition-all duration-300"
								>
									<Sparkles className="size-5 animate-pulse" />
									<span className="font-bold hidden md:inline">Generate AI Playlist</span>
								</button>
							</div>
						</div>
					</PullToRefresh>
				</div>
			</div>

			{/* Activity Feed Sidebar */}
			{isActivityPanelOpen && (
				<div className="hidden lg:block animate-in slide-in-from-right-10 duration-300 w-[280px] border-l border-white/5 bg-black/20 backdrop-blur-xl">
					<ActivityFeed />
				</div>
			)}


		</main>
	);
};
export default HomePage;
