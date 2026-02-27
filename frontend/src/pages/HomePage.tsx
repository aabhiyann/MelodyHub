import Topbar from '@/components/layout/TopBar';
import { useMusicStore } from '@/stores/MusicStore';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Library, Compass, Radio } from 'lucide-react';

import { PullToRefresh } from '@/components/features/mobile/PullToRefresh';
import { useHomeData } from '@/hooks/useHomeData';

import { useAIStore } from '@/stores/useAIStore';
import { CategoryCard } from '@/components/ui/CategoryCard';

// New Components
import { FeaturedHero } from '@/pages/home/components/FeaturedHero';
import { HomeHero } from '@/pages/home/components/HomeHero';
import { JumpBackIn } from '@/pages/home/components/JumpBackIn';
import { MadeForYou } from '@/pages/home/components/MadeForYou';
import { ChartsMosaic } from '@/pages/home/components/ChartsMosaic';
import { GenreMosaic } from '@/pages/home/components/GenreMosaic';
import { NewReleases } from '@/pages/home/components/NewReleases';
import { MoodSection } from '@/pages/home/components/MoodSection';
import { RecommendedSection } from '@/pages/home/components/RecommendedSection';
import { TopArtists } from '@/pages/home/components/TopArtists';
import { SectionErrorBoundary } from '@/components/shared/SectionErrorBoundary';
import { SEO } from '@/components/shared/SEO';

const HomePage = () => {
  const navigate = useNavigate();
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
    <main className="rounded-md overflow-hidden h-full bg-transparent flex">
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <SEO title="Home" />
        <Topbar />

        <div className="flex-1 h-full overflow-hidden" id="home-scroll-container">
          <PullToRefresh onRefresh={refreshData}>
            <div className="space-y-16 min-h-full pb-32 max-w-full overflow-x-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* 1. FEATURED HERO (top trending/featured) */}
              <FeaturedHero
                item={featuredSongs?.[0] ?? trendingSongs?.[0] ?? null}
                isLoading={isLoading}
              />

              {/* 2. GREETING + STATS */}
              <div className="px-6 pt-2 md:pt-6">
                <HomeHero
                  totalListeningTime={listeningHistory.length * 3.5 * 60}
                  newDiscoveriesCount={newDiscoveries}
                />
              </div>

              {/* 3. START BROWSING */}
              <div className="px-6">
                <h2 className="text-2xl font-bold mb-4">Start browsing</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <CategoryCard
                    title="Your Library"
                    gradient="bg-gradient-to-br from-blue-600 to-indigo-600"
                    icon={<Library className="w-12 h-12" />}
                    size="large"
                    index={0}
                    onClick={() => navigate('/library')}
                  />
                  <CategoryCard
                    title="Discover"
                    gradient="bg-gradient-to-br from-purple-600 to-pink-600"
                    icon={<Compass className="w-12 h-12" />}
                    size="large"
                    index={1}
                    onClick={() => navigate('/browse')}
                  />
                  <CategoryCard
                    title="Browse Genres"
                    gradient="bg-gradient-to-br from-orange-500 to-red-600"
                    icon={<Radio className="w-12 h-12" />}
                    size="large"
                    index={2}
                    onClick={() => navigate('/browse')}
                  />
                </div>
              </div>

              {/* 4. JUMP BACK IN */}
              <div className="pl-6">
                <JumpBackIn history={listeningHistory} />
              </div>

              {/* 5. MADE FOR YOU */}
              <div className="px-6">
                <SectionErrorBoundary sectionName="Made For You">
                  <MadeForYou songs={madeForYouSongs} isLoading={isLoading} />
                </SectionErrorBoundary>
              </div>

              {/* 6. PLAY BY MOOD */}
              <div className="px-6">
                <MoodSection />
              </div>

              {/* 7. CHARTS & TRENDING */}
              <div className="px-6">
                <SectionErrorBoundary sectionName="Charts & Trending">
                  <ChartsMosaic
                    trendingSongs={trendingSongs}
                    featuredSongs={featuredSongs}
                    isLoading={isLoading}
                  />
                </SectionErrorBoundary>
              </div>

              {/* 8. GENRE EXPLORATION */}
              <div className="px-6">
                <GenreMosaic />
              </div>

              {/* 9. NEW RELEASES */}
              <div className="pl-6">
                <NewReleases albums={albums} isLoading={isLoading} />
              </div>

              {/* 10. RECOMMENDED */}
              <div className="pl-6">
                <RecommendedSection
                  songs={featuredSongs.slice(5, 15)} // Mocking similar songs
                  isLoading={isLoading}
                  seedArtist={topArtists[0]?.artist}
                />
              </div>

              {/* 11. TOP ARTISTS */}
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
    </main>
  );
};
export default HomePage;
