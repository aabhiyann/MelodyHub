import Topbar from "@/components/Topbar";
import { useMusicStore } from "@/stores/MusicStore";
import { useEffect } from "react";
import FeaturedSection from "./components/FeaturedSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import SectionGrid from "./components/SectionGrid";
import { usePlayerStore } from "@/stores/PlayerStore";

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
		<main className='rounded-md overflow-hidden h-full bg-gradient-to-b from-gray-300 to-gray-500'>
			<Topbar />
			<ScrollArea className='h-[calc(100vh-180px)]'>
				<div className='p-4 sm:p-6 '>
					<h1 className=' sm:text-3xl mb-6 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl'>
					<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-950">
    Welcome!!
  </span>{" "}</h1>
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
