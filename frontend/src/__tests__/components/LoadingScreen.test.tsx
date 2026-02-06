import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingScreen } from '@/components/shared/LoadingScreen';

describe('LoadingScreen Component', () => {
    it('renders with default message', () => {
        render(<LoadingScreen />);
        expect(screen.getByText('Finding the perfect vibe...')).toBeInTheDocument();
    });

    it('renders with custom message', () => {
        render(<LoadingScreen message="Creating your AI playlist..." />);
        expect(screen.getByText('Creating your AI playlist...')).toBeInTheDocument();
    });

    it('displays loading mascot state', () => {
        const { container } = render(<LoadingScreen />);
        const img = container.querySelector('img');
        expect(img).toHaveAttribute('src', '/mascot/melody-loading.png');
    });

    it('has pulse animation on mascot', () => {
        const { container } = render(<LoadingScreen />);
        const mascotContainer = container.querySelector('.animate-pulse');
        expect(mascotContainer).toBeInTheDocument();
    });

    it('displays three loading dots', () => {
        const { container } = render(<LoadingScreen />);
        const dots = container.querySelectorAll('.animate-bounce');
        expect(dots.length).toBe(3);
    });

    it('loading dots have staggered animations', () => {
        const { container } = render(<LoadingScreen />);
        const dots = container.querySelectorAll('.animate-bounce');

        expect(dots[0]).toHaveStyle({ animationDelay: '0ms' });
        expect(dots[1]).toHaveStyle({ animationDelay: '150ms' });
        expect(dots[2]).toHaveStyle({ animationDelay: '300ms' });
    });
});
