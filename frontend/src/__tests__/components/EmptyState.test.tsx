import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from '@/components/EmptyState';
import userEvent from '@testing-library/user-event';

describe('EmptyState Component', () => {
    it('renders with default props', () => {
        render(<EmptyState />);
        expect(screen.getByText('Nothing here yet')).toBeInTheDocument();
        expect(screen.getByText(/Let's add some music/i)).toBeInTheDocument();
    });

    it('renders custom title and description', () => {
        render(
            <EmptyState
                title="No playlists found"
                description="Create your first playlist to get started"
            />
        );
        expect(screen.getByText('No playlists found')).toBeInTheDocument();
        expect(screen.getByText(/Create your first playlist/i)).toBeInTheDocument();
    });

    it('renders action button when provided', () => {
        const onAction = vi.fn();
        render(
            <EmptyState
                actionLabel="Add Songs"
                onAction={onAction}
            />
        );
        expect(screen.getByText('Add Songs')).toBeInTheDocument();
    });

    it('calls onAction when button is clicked', async () => {
        const user = userEvent.setup();
        const onAction = vi.fn();

        render(
            <EmptyState
                actionLabel="Browse Music"
                onAction={onAction}
            />
        );

        const button = screen.getByText('Browse Music');
        await user.click(button);

        expect(onAction).toHaveBeenCalledTimes(1);
    });

    it('does not render button when actionLabel is missing', () => {
        const onAction = vi.fn();
        render(<EmptyState onAction={onAction} />);
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('does not render button when onAction is missing', () => {
        render(<EmptyState actionLabel="Test Button" />);
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('uses empty mascot state by default', () => {
        const { container } = render(<EmptyState />);
        const img = container.querySelector('img');
        expect(img).toHaveAttribute('src', '/mascot/melody-empty.png');
    });

    it('uses default mascot state when specified', () => {
        const { container } = render(<EmptyState mascotState="default" />);
        const img = container.querySelector('img');
        expect(img).toHaveAttribute('src', '/mascot/melody-default.png');
    });
});
