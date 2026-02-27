import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from '@/components/shared/EmptyState';

describe('EmptyState Component', () => {
    it('renders with default props', () => {
        render(<EmptyState />);
        expect(screen.getByText('Nothing here yet')).toBeInTheDocument();
    });

    it('renders custom message and secondary', () => {
        render(
            <EmptyState
                message="No playlists found"
                secondary="Create your first playlist to get started"
            />
        );
        expect(screen.getByText('No playlists found')).toBeInTheDocument();
        expect(screen.getByText(/Create your first playlist/i)).toBeInTheDocument();
    });

    it('renders only message when secondary is omitted', () => {
        render(<EmptyState message="No results" />);
        expect(screen.getByText('No results')).toBeInTheDocument();
    });
});
