import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AIPlaylistDialog from '../components/AIPlaylistDialog';

// Mock dependencies
vi.mock('@/stores/AIStore', () => ({
  useAIStore: () => ({
    generatePlaylist: vi.fn(),
    generatedPlaylist: [],
    isLoading: false,
  }),
}));

vi.mock('@/stores/PlayerStore', () => ({
  usePlayerStore: () => ({
    playAlbum: vi.fn(),
  }),
}));

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  Bot: () => <div data-testid="bot-icon" />,
  Loader2: () => <div data-testid="loader-icon" />,
  Play: () => <div data-testid="play-icon" />,
  Sparkles: () => <div data-testid="sparkles-icon" />,
}));

// Mock UI components
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, className }: any) => (
    <button onClick={onClick} disabled={disabled} className={className}>
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/input', () => ({
  Input: ({ value, onChange, placeholder, onKeyDown }: any) => (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onKeyDown={onKeyDown}
      data-testid="ai-input"
    />
  ),
}));

// Mock Dialog components (simplified for testing trigger)
vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children }: any) => <div>{children}</div>,
  DialogTrigger: ({ children }: any) => <div>{children}</div>,
  DialogContent: ({ children }: any) => <div>{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <div>{children}</div>,
  DialogDescription: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: ({ children }: any) => <div>{children}</div>,
}));

describe('AIPlaylistDialog', () => {
  it('renders the trigger button', () => {
    render(<AIPlaylistDialog />);
    expect(screen.getByText('AI Playlist')).toBeInTheDocument();
  });

  it('renders the input field', () => {
    render(<AIPlaylistDialog />);
    // Since we mocked Dialog to just render children, content should be visible
    expect(screen.getByTestId('ai-input')).toBeInTheDocument();
  });

  it('updates input value on change', () => {
    render(<AIPlaylistDialog />);
    const input = screen.getByTestId('ai-input');
    fireEvent.change(input, { target: { value: 'sad songs' } });
    expect(input).toHaveValue('sad songs');
  });
});
