import { Song } from '@/types';
import { usePlayerStore } from '@/stores/PlayerStore';
import { Play, Sparkles, Calendar, Radio } from 'lucide-react';
import { OptimizedImage } from '@/components/shared/OptimizedImage';
import { LikeButton } from '@/components/ui/LikeButton';

interface MadeForYouProps {
  songs: Song[];
  isLoading: boolean;
}

export const MadeForYou = ({ songs, isLoading }: MadeForYouProps) => {
  const { playAlbum } = usePlayerStore();

  // Mock different "Mixes" from the single list of songs for UI demonstration
  // In a real app, these would be distinct playlist objects
  const mixes = [
    {
      title: 'Daily Mix 1',
      type: 'daily',
      songs: songs.slice(0, 10),
      accent: 'from-pink-500 to-rose-500',
      icon: <Sparkles className="size-4 text-pink-200" />,
    },
    {
      title: 'Discover Weekly',
      type: 'weekly',
      songs: songs.slice(5, 15),
      accent: 'from-violet-500 to-purple-500',
      icon: <Calendar className="size-4 text-violet-200" />,
    },
    {
      title: 'Release Radar',
      type: 'release',
      songs: songs.slice(2, 12),
      accent: 'from-emerald-500 to-green-500',
      icon: <Radio className="size-4 text-emerald-200" />,
    },
    {
      title: 'Chill Vibes',
      type: 'mood',
      songs: songs.slice(8, 18),
      accent: 'from-blue-500 to-cyan-500',
      icon: <Sparkles className="size-4 text-blue-200" />,
    },
  ];

  if (isLoading) {
    return <MadeForYouSkeleton />;
  }

  return (
    <section>
      <div className="flex items-center gap-2 mb-6 px-4 md:px-0">
        <Sparkles className="size-6 text-brand-primary" />
        <h3 className="text-2xl font-bold text-white tracking-tight">Made For You</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4 md:px-0">
        {mixes.map((mix, idx) => (
          <div
            key={idx}
            className="group relative h-[280px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
            onClick={() => playAlbum(mix.songs, 0)}
          >
            {/* Background Gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${mix.accent} opacity-80 transition-opacity duration-300 group-hover:opacity-100`}
            />
            <div className="absolute inset-0 bg-black/20" />

            {/* Content */}
            <div className="relative h-full p-6 flex flex-col justify-between z-10">
              <div>
                <div className="flex items-center gap-2 mb-2 opacity-90">
                  <div className="p-1 rounded-md bg-white/20 backdrop-blur-sm">{mix.icon}</div>
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    AI Generated
                  </span>
                </div>
                <h4 className="text-3xl font-bold text-white leading-tight mb-2">{mix.title}</h4>
                <p className="text-sm text-white/80 font-medium line-clamp-2">
                  {mix.songs
                    .map((s) => s.artist)
                    .slice(0, 3)
                    .join(', ')}{' '}
                  and more
                </p>
              </div>

              <div className="flex gap-3 items-end">
                {/* Preview Grid */}
                <div className="grid grid-cols-2 gap-2 w-24">
                  {mix.songs.slice(0, 4).map((song, i) => (
                    <div
                      key={i}
                      className="relative aspect-square rounded-md overflow-hidden bg-black/20 shadow-sm"
                    >
                      <OptimizedImage
                        src={song.imageUrl}
                        alt=""
                        className="w-full h-full object-cover opacity-80"
                      />
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <LikeButton className="size-10 bg-black/40 text-white backdrop-blur-md hover:bg-black/60" />
                  <div className="size-12 rounded-full bg-white text-black flex items-center justify-center shadow-2xl">
                    <Play className="size-6 ml-0.5" fill="currentColor" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const MadeForYouSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4 md:px-0">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="h-[280px] rounded-2xl bg-zinc-800/50 animate-pulse" />
    ))}
  </div>
);
