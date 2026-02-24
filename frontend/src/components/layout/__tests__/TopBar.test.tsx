import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Topbar from '../TopBar';
import { useUIStore } from '@/stores/UIStore';
import { useAIStore } from '@/stores/useAIStore';

// Mocks
vi.mock('@/stores/UIStore', () => ({
    useUIStore: vi.fn(),
}));

vi.mock('@/stores/useAIStore', () => ({
    useAIStore: vi.fn(),
}));

// Mock Clerk components
vi.mock('@clerk/clerk-react', () => ({
    SignedIn: ({ children }: any) => <div data-testid="signed-in">{children}</div>,
    SignedOut: ({ children }: any) => <div data-testid="signed-out">{children}</div>,
    UserButton: () => <button>UserButton</button>,
    useUser: () => ({ user: { id: 'test' } }),
}));

// Mock UI components
vi.mock('@/components/ui/sheet', () => ({
    Sheet: ({ children }: any) => <div>{children}</div>,
    SheetTrigger: ({ children }: any) => <div data-testid="sheet-trigger">{children}</div>,
    SheetContent: () => <div>SheetContent</div>,
}));

vi.mock('@/components/layout/LeftSidebar', () => ({
    default: () => <div>LeftSidebar</div>,
}));

vi.mock('@/components/shared/SigninAuth', () => ({
    default: () => <button>Sign In</button>,
}));

vi.mock('@/components/features/notifications/NotificationBell', () => ({
    NotificationBell: () => <div>NotificationBell</div>,
}));

vi.mock('@/components/features/gamification/StreakBadge', () => ({
    StreakBadge: () => <div>StreakBadge</div>,
}));

vi.mock('@/components/features/gamification/GemsIndicator', () => ({
    GemsIndicator: () => <div>GemsIndicator</div>,
}));

describe('TopBar', () => {
    const mockToggleActivityPanel = vi.fn();
    const mockOpenModal = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        (useUIStore as any).mockReturnValue({
            toggleActivityPanel: mockToggleActivityPanel,
            isActivityPanelOpen: false,
        });

        (useAIStore as any).mockReturnValue({
            openModal: mockOpenModal,
        });
    });

    it('renders logo', () => {
        render(<Topbar />);
        expect(screen.getByText('MelodyHub')).toBeDefined();
        expect(screen.getByAltText('Melody mascot')).toBeDefined();
    });

    it('renders user stats and AI button', () => {
        render(<Topbar />);
        expect(screen.getByText('StreakBadge')).toBeDefined();
        expect(screen.getByText('GemsIndicator')).toBeDefined();
        expect(screen.getByText('Magic')).toBeDefined();
    });

    it('opens AI modal on click', () => {
        render(<Topbar />);
        const aiBtn = screen.getByText('Magic').closest('button');
        fireEvent.click(aiBtn!);
        expect(mockOpenModal).toHaveBeenCalled();
    });

    it('toggles activity panel', () => {
        render(<Topbar />);
        const toggleBtn = screen.getByTitle('Show Friend Activity');
        fireEvent.click(toggleBtn);
        expect(mockToggleActivityPanel).toHaveBeenCalled();
    });

    it('renders signed in/out sections', () => {
        render(<Topbar />);
        expect(screen.getByTestId('signed-in')).toBeDefined();
        expect(screen.getByTestId('signed-out')).toBeDefined();
        // Since we mock SignedIn/SignedOut to both render (for structural testing), verify their children presence
        expect(screen.getByText('NotificationBell')).toBeDefined();
        expect(screen.getByText('Sign In')).toBeDefined();
    });
});
