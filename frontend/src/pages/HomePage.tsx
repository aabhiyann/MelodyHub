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

	const { initializeQueue, isPlaying } = usePlayerStore();

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
		<main className='rounded-md overflow-hidden h-full bg-transparent'>
			<Topbar />
			<ScrollArea className='h-[calc(100vh-180px)]'>
				<div className='p-6'>
					{/* Welcome Hero Section with Gradient Glow */}
					<div className='relative rounded-3xl bg-white/5 backdrop-blur-md p-8 mb-8 border border-white/5 overflow-hidden group'>
						{/* Background Decorative Blob */}
						<div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-primary/20 rounded-full blur-3xl pointer-events-none transition-all duration-1000 group-hover:bg-brand-primary/30" />

						<div className='relative z-10 flex flex-col md:flex-row items-center justify-between gap-8'>
							<div className='flex-1 space-y-4 text-center md:text-left'>
								<h1 className='text-4xl md:text-6xl font-display font-bold text-white tracking-tight'>
									Welcome to <br />
									<span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
										MelodyHub
									</span>
								</h1>
								<p className='text-lg text-zinc-400 max-w-xl mx-auto md:mx-0'>
									Your personal AI-powered soundtrack. Discover new favorites and rediscover old classics.
								</p>
							</div>
							<div className='flex-shrink-0 relative'>
								{/* Glow behind mascot */}
								<div className="absolute inset-0 bg-brand-secondary/20 blur-2xl rounded-full scale-110" />
								<MascotImage
									state={isPlaying ? 'playing' : 'default'}
									size='lg'
									className={`relative drop-shadow-2xl hover-scale ${isPlaying ? 'animate-bounce' : ''}`}
								/>
							</div>
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
