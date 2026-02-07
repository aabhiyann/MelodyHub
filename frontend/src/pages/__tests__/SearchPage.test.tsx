import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SearchPage from '../SearchPage';

vi.mock('@/stores/MusicStore', () => ({
  useMusicStore: vi.fn(),
}));

vi.mock('@/stores/PlayerStore', () => ({
  usePlayerStore: vi.fn(),
}));

vi.mock('@/lib/axios', () => ({
  axiosInstance: { post: vi.fn() },
}));

vi.mock('@/components/layout/Topbar', () => ({
  default: () => <div data-testid="topbar">Topbar</div>,
}));

vi.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

import { useMusicStore } from '@/stores/MusicStore';
import { usePlayerStore } from '@/stores/PlayerStore';

describe('SearchPage', () => {
  beforeEach(() => {
    vi.mocked(useMusicStore).mockReturnValue({
      songs: [],
      albums: [],
      fetchSongs: vi.fn(),
      fetchAlbums: vi.fn(),
    } as never);
    vi.mocked(usePlayerStore).mockReturnValue({
      playAlbum: vi.fn(),
    } as never);
  });

  it('renders Search page with search input', () => {
    render(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText(/What do you want to listen to/i)).toBeInTheDocument();
  });

  it('renders Browse All section initially', () => {
    render(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Browse All/i)).toBeInTheDocument();
  });

  it('filters songs based on search query', async () => {
    const mockSongs = [
      { _id: '1', title: 'Hello World', artist: 'Artist 1', genre: 'Pop', imageUrl: 'test.jpg' },
      { _id: '2', title: 'Another Song', artist: 'Artist 2', genre: 'Rock', imageUrl: 'test2.jpg' },
    ];

    vi.mocked(useMusicStore).mockReturnValue({
      songs: mockSongs,
      albums: [],
      fetchSongs: vi.fn(),
      fetchAlbums: vi.fn(),
    } as never);

    render(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/What do you want to listen to/i);
    await import('@testing-library/user-event').then(userEvent =>
      userEvent.default.type(input, 'Hello')
    );

    // Wait for debounce
    await new Promise(r => setTimeout(r, 400));

    expect(screen.getByText('Hello World')).toBeInTheDocument();
    expect(screen.queryByText('Another Song')).not.toBeInTheDocument();
  });

  it('shows no results message when search returns nothing', async () => {
    vi.mocked(useMusicStore).mockReturnValue({
      songs: [],
      albums: [],
      fetchSongs: vi.fn(),
      fetchAlbums: vi.fn(),
    } as never);

    render(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/What do you want to listen to/i);
    await import('@testing-library/user-event').then(userEvent =>
      userEvent.default.type(input, 'NonExistent')
    );

    // Wait for debounce
    await new Promise(r => setTimeout(r, 400));

    expect(screen.getByText(/No results found/i)).toBeInTheDocument();
  });
});
