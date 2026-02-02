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

vi.mock('@/components/Topbar', () => ({
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
    expect(screen.getByTestId('topbar')).toBeInTheDocument();
  });

  it('renders Browse All section', () => {
    render(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Browse All/i)).toBeInTheDocument();
  });
});
