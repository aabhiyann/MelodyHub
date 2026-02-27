import { Song } from '@/types';
import { usePlayerStore } from '@/stores/PlayerStore';
import { Play, Sparkles, Calendar, Radio } from 'lucide-react';
import HorizontalScrollSection from './HorizontalScrollSection';
import { SectionRowSkeleton } from './SectionRowSkeleton';
import { EmptyState } from '@/components/shared/EmptyState';

interface MadeForYouProps {
  songs: Song[];
  isLoading: boolean;
}

const mixesConfig = [
  { title: 'Daily Mix 1', type: 'daily', accent: 'from-[#22C55E]/80 to-[#16A34A]/80', icon: Sparkles },
  { title: 'Discover Weekly', type: 'weekly', accent: 'from-blue-500/80 to-cyan-500/80', icon: Calendar },
  { title: 'Release Radar', type: 'release', accent: 'from-amber-500/80 to-orange-500/80', icon: Radio },
  { title: 'Chill Vibes', type: 'mood', accent: 'from-slate-500/80 to-slate-600/80', icon: Sparkles },
];

export const MadeForYou = ({ songs, isLoading }: MadeForYouProps) => {
  const { playAlbum } = usePlayerStore();

  const mixes = mixesConfig.map((config, i) => ({
    ...config,
    songs: songs.slice(i * 3, i * 3 + 10).filter(Boolean),
  }));

  if (isLoading) {
    return <SectionRowSkeleton cardCount={4} />;
  }

  return (
    <HorizontalScrollSection title="Recommended for You" seeAllHref="/browse" seeAllLabel="See all">
      {songs.length === 0 ? (
        <div className="flex-shrink-0 w-full min-w-[280px] px-6">
          <EmptyState
            message="Play something to see recommendations"
            secondary="We'll build mixes based on your listening."
          />
        </div>
      ) : (
        mixes.map((mix, idx) => {
          const firstSong = mix.songs[0];
          const imageUrl = firstSong?.imageUrl ?? '';
          const description = mix.songs.length
            ? `${mix.songs.slice(0, 2).map((s) => s.artist).join(', ')}${mix.songs.length > 2 ? ' and more' : ''}`
            : '';

          return (
            <div
              key={idx}
              className="flex-shrink-0 w-[180px] snap-start group/card cursor-pointer"
              style={{ width: '180px' }}
              onClick={() => mix.songs.length && playAlbum(mix.songs, 0)}
            >
              <div className="relative aspect-square rounded-[12px] overflow-hidden mb-3 shadow-lg transition-all duration-200 group-hover/card:shadow-xl group-hover/card:scale-[1.03]">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-105"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${mix.accent}`} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80" />
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                  <mix.icon className="size-5 text-[#F9FAFB]" />
                  <div className="p-2 rounded-full bg-[#22C55E] text-[#020617] opacity-0 group-hover/card:opacity-100 transition-opacity">
                    <Play className="size-4 fill-current ml-0.5" />
                  </div>
                </div>
              </div>
              <p className="font-semibold text-sm truncate text-[#F9FAFB]">{mix.title}</p>
              {description && (
                <p className="text-xs truncate text-[#9CA3AF] mt-0.5">{description}</p>
              )}
            </div>
          );
        })
      )}
    </HorizontalScrollSection>
  );
};
