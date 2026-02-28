export interface GenreTheme {
  gradient: string;
  bgAccent: string;
  textAccent: string;
  borderAccent: string;
  icon: string;
}

export const GENRE_THEMES: Record<string, GenreTheme> = {
  Pop: {
    gradient: 'from-pink-500 to-rose-500',
    bgAccent: 'bg-pink-500/10',
    textAccent: 'text-pink-400',
    borderAccent: 'border-pink-500/20',
    icon: '🎤',
  },
  Rock: {
    gradient: 'from-red-600 to-orange-600',
    bgAccent: 'bg-red-500/10',
    textAccent: 'text-red-400',
    borderAccent: 'border-red-500/20',
    icon: '🎸',
  },
  'K-Pop': {
    gradient: 'from-rose-500 to-pink-500',
    bgAccent: 'bg-rose-500/10',
    textAccent: 'text-rose-400',
    borderAccent: 'border-rose-500/20',
    icon: '💜',
  },
  'Hip Hop': {
    gradient: 'from-yellow-500 to-orange-600',
    bgAccent: 'bg-yellow-500/10',
    textAccent: 'text-yellow-400',
    borderAccent: 'border-yellow-500/20',
    icon: '🎵',
  },
  Electronic: {
    gradient: 'from-blue-500 to-cyan-500',
    bgAccent: 'bg-blue-500/10',
    textAccent: 'text-blue-400',
    borderAccent: 'border-blue-500/20',
    icon: '🎹',
  },
  Jazz: {
    gradient: 'from-amber-700 to-orange-800',
    bgAccent: 'bg-amber-600/10',
    textAccent: 'text-amber-400',
    borderAccent: 'border-amber-600/20',
    icon: '🎺',
  },
  Classical: {
    gradient: 'from-indigo-600 to-slate-700',
    bgAccent: 'bg-indigo-500/10',
    textAccent: 'text-indigo-400',
    borderAccent: 'border-indigo-500/20',
    icon: '🎻',
  },
  'R&B': {
    gradient: 'from-fuchsia-600 to-pink-600',
    bgAccent: 'bg-fuchsia-500/10',
    textAccent: 'text-fuchsia-400',
    borderAccent: 'border-fuchsia-500/20',
    icon: '🎶',
  },
  Country: {
    gradient: 'from-green-700 to-emerald-800',
    bgAccent: 'bg-green-600/10',
    textAccent: 'text-green-400',
    borderAccent: 'border-green-600/20',
    icon: '🤠',
  },
  Latin: {
    gradient: 'from-red-500 to-pink-500',
    bgAccent: 'bg-red-500/10',
    textAccent: 'text-red-400',
    borderAccent: 'border-red-500/20',
    icon: '💃',
  },
  Indie: {
    gradient: 'from-teal-600 to-blue-600',
    bgAccent: 'bg-teal-500/10',
    textAccent: 'text-teal-400',
    borderAccent: 'border-teal-500/20',
    icon: '🎧',
  },
  Metal: {
    gradient: 'from-gray-800 to-slate-900',
    bgAccent: 'bg-gray-700/10',
    textAccent: 'text-gray-400',
    borderAccent: 'border-gray-700/20',
    icon: '🤘',
  },
  Folk: {
    gradient: 'from-amber-600 to-yellow-700',
    bgAccent: 'bg-amber-500/10',
    textAccent: 'text-amber-400',
    borderAccent: 'border-amber-500/20',
    icon: '🪕',
  },
};

export const DEFAULT_THEME: GenreTheme = {
  gradient: 'from-gray-700 to-gray-900',
  bgAccent: 'bg-gray-600/10',
  textAccent: 'text-gray-400',
  borderAccent: 'border-gray-600/20',
  icon: '🎵',
};

export const useGenreTheme = (genre: string | null): GenreTheme => {
  if (!genre) return DEFAULT_THEME;
  return GENRE_THEMES[genre] || DEFAULT_THEME;
};
