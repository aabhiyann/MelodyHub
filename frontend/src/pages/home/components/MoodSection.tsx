import { Song } from '@/types';
import { usePlayerStore } from '@/stores/PlayerStore';
import { axiosInstance } from '@/lib/axios';
import { Smile, Music2 } from 'lucide-react';
import { useState } from 'react';

const MOODS = [
  { id: 'happy', label: 'Happy', accent: 'from-amber-400 to-orange-500' },
  { id: 'chill', label: 'Chill', accent: 'from-blue-400 to-cyan-500' },
  { id: 'energetic', label: 'Energetic', accent: 'from-red-500 to-pink-500' },
  { id: 'sad', label: 'Sad', accent: 'from-slate-500 to-indigo-600' },
  { id: 'focused', label: 'Focused', accent: 'from-emerald-500 to-teal-600' },
  { id: 'romantic', label: 'Romantic', accent: 'from-rose-500 to-pink-600' },
  { id: 'neutral', label: 'Neutral', accent: 'from-gray-500 to-slate-600' },
] as const;

const mapApiSongToSong = (raw: Record<string, unknown>): Song => ({
  _id: String(raw._id),
  title: String(raw.title ?? ''),
  artist: String(raw.artist ?? ''),
  imageUrl: String(raw.imageUrl ?? ''),
  audioUrl: String(raw.audioUrl ?? ''),
  duration: Number(raw.duration ?? 0),
  createdAt: String(raw.createdAt ?? ''),
  updatedAt: String(raw.updatedAt ?? ''),
  genre: raw.genre != null ? String(raw.genre) : undefined,
});

export const MoodSection = () => {
  const { playAlbum } = usePlayerStore();
  const [loadingMood, setLoadingMood] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const playMoodPlaylist = async (moodId: string) => {
    setError(null);
    setLoadingMood(moodId);
    try {
      const { data } = await axiosInstance.get<{
        success: boolean;
        data: Record<string, unknown>[];
      }>('/mood/playlist', { params: { mood: moodId, limit: 20 } });
      if (!data.success || !Array.isArray(data.data)) {
        setError('Could not load playlist');
        return;
      }
      const songs = data.data.map(mapApiSongToSong).filter((s) => s.audioUrl);
      if (songs.length === 0) {
        setError('No songs for this mood');
        return;
      }
      playAlbum(songs, 0);
    } catch {
      setError('Failed to load mood playlist');
    } finally {
      setLoadingMood(null);
    }
  };

  return (
    <section>
      <div className="flex items-center gap-2 mb-4 px-4 md:px-0">
        <Smile className="size-6 text-brand-primary" />
        <h3 className="text-2xl font-bold text-white tracking-tight">Play by mood</h3>
      </div>
      <div className="flex flex-wrap gap-3 px-4 md:px-0">
        {MOODS.map((mood) => (
          <button
            key={mood.id}
            type="button"
            onClick={() => playMoodPlaylist(mood.id)}
            disabled={loadingMood !== null}
            className={`
              inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-white
              bg-gradient-to-r ${mood.accent} opacity-90 hover:opacity-100
              transition-all duration-200 hover:scale-105 disabled:opacity-60 disabled:hover:scale-100
            `}
          >
            {loadingMood === mood.id ? (
              <Music2 className="size-4 animate-pulse" />
            ) : (
              <Smile className="size-4" />
            )}
            <span>{mood.label}</span>
          </button>
        ))}
      </div>
      {error && (
        <p className="mt-2 px-4 md:px-0 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </section>
  );
};
