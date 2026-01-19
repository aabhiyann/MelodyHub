import Topbar from "@/components/Topbar";
import { useMusicStore } from "@/stores/MusicStore";
import { useEffect } from "react";
import FeaturedSection from "./components/FeaturedSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import SectionGrid from "./components/SectionGrid";
import { usePlayerStore } from "@/stores/PlayerStore";
import { MascotImage } from "@/components/MascotImage";

const HomePage = () => {
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

	return (
		<main className='rounded-md overflow-hidden h-full bg-gradient-to-b from-[var(--color-bg-primary)] to-[var(--color-bg-secondary)]'>
			<Topbar />
			<ScrollArea className='h-[calc(100vh-180px)]'>
				<div className='p-4 sm:p-6 '>
					{/* Welcome Hero Section */}
					<div className='flex flex-col md:flex-row items-center justify-between gap-6 mb-8'>
						<div className='flex-1'>
							<h1 className='sm:text-3xl mb-4 text-3xl font-extrabold font-display text-[var(--color-text-primary)] md:text-5xl lg:text-6xl'>
								<span className="bg-gradient-to-r from-[var(--melody-purple-400)] to-[var(--melody-blue-400)] bg-clip-text text-transparent">
									Welcome!!
								</span>
							</h1>
							<p className='text-lg text-[var(--color-text-secondary)] max-w-2xl'>
								Discover your perfect soundtrack with AI-powered playlists and personalized recommendations 🎵
							</p>
						</div>
						<div className='flex-shrink-0'>
							<MascotImage
								state='default'
								size='lg'
								className='drop-shadow-2xl hover-lift'
							/>
						</div>
					</div>

					<FeaturedSection />

					<div className='space-y-8 '>
						<SectionGrid title='Made For You' songs={madeForYouSongs} isLoading={isLoading} />
						<SectionGrid title='Trending' songs={trendingSongs} isLoading={isLoading} />
					</div>
				</div>
			</ScrollArea>
		</main>
	);
};
export default HomePage;
