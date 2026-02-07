import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BrowsePage from '../BrowsePage';

vi.mock('@/stores/MusicStore', () => ({
  useMusicStore: vi.fn(),
}));

vi.mock('@/stores/PlayerStore', () => ({
  usePlayerStore: vi.fn(),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: vi.fn(() => vi.fn()),
  };
});

vi.mock('@/lib/axios', () => ({
  axiosInstance: { post: vi.fn() },
}));

vi.mock('@/utils/gridPerformance', () => ({
  measureGridPerformance: vi.fn(() => vi.fn()),
}));

vi.mock('@/components/layout/Topbar', () => ({
  default: () => <div data-testid="topbar">Topbar</div>,
}));

vi.mock('@/components/layout/PageTransition', () => ({
  PageTransition: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/hooks/useAnnouncement', () => ({
  useAnnouncement: () => vi.fn(),
}));

import { useMusicStore } from '@/stores/MusicStore';
import { usePlayerStore } from '@/stores/PlayerStore';

describe('BrowsePage', () => {
  beforeEach(() => {
    vi.mocked(useMusicStore).mockReturnValue({
      songs: [],
      albums: [],
      isLoading: false,
      error: null,
      fetchSongs: vi.fn(),
      fetchAlbums: vi.fn(),
    } as never);
    vi.mocked(usePlayerStore).mockReturnValue({
      setCurrentSong: vi.fn(),
      setQueue: vi.fn(),
      currentSong: null,
      isPlaying: false,
    } as never);
  });

  it('renders Browse page with loading skeleton when loading', () => {
    vi.mocked(useMusicStore).mockReturnValue({
      songs: [],
      isLoading: true,
      fetchSongs: vi.fn(),
      fetchAlbums: vi.fn(),
    } as never);
    render(
      <MemoryRouter>
        <BrowsePage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('topbar')).toBeInTheDocument();
  });

  it('fetches data on mount', () => {
    render(
      <MemoryRouter>
        <BrowsePage />
      </MemoryRouter>
    );
    expect(useMusicStore().fetchSongs).toHaveBeenCalled();
    expect(useMusicStore().fetchAlbums).toHaveBeenCalled();
  });

  it('renders genre grid when songs are loaded', () => {
    const mockSongs = [
      { _id: '1', title: 'Song 1', artist: 'A1', genre: 'Pop', duration: 180 },
      { _id: '2', title: 'Song 2', artist: 'A2', genre: 'Rock', duration: 200 },
    ];
    vi.mocked(useMusicStore).mockReturnValue({
      songs: mockSongs,
      isLoading: false,
      fetchSongs: vi.fn(),
      fetchAlbums: vi.fn(),
    } as never);
    render(
      <MemoryRouter>
        <BrowsePage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('topbar')).toBeInTheDocument();
    expect(screen.getByText('Pop')).toBeInTheDocument();
    expect(screen.getByText('Rock')).toBeInTheDocument();
  });
});
