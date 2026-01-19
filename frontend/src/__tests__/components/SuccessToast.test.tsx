import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SuccessToast } from '@/components/SuccessToast';

describe('SuccessToast Component', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders with message', () => {
        render(<SuccessToast message="Success!" />);
        expect(screen.getByText('Success!')).toBeInTheDocument();
    });

    it('renders with description', () => {
        render(
            <SuccessToast
                message="Playlist created"
                description="Added 15 songs to your playlist"
            />
        );
        expect(screen.getByText('Playlist created')).toBeInTheDocument();
        expect(screen.getByText(/Added 15 songs/i)).toBeInTheDocument();
    });

    it('displays success mascot', () => {
        const { container } = render(<SuccessToast message="Test" />);
        const img = container.querySelector('img');
        expect(img).toHaveAttribute('src', '/mascot/melody-success.png');
    });

    it('has close button', () => {
        render(<SuccessToast message="Test" />);
        const closeButton = screen.getByLabelText('Close');
        expect(closeButton).toBeInTheDocument();
    });

    it('sets up auto-dismiss timer on mount', () => {
        const onClose = vi.fn();
        render(<SuccessToast message="Test" onClose={onClose} />);

        // Verify timer was set
        expect(vi.getTimerCount()).toBeGreaterThan(0);
    });
});
