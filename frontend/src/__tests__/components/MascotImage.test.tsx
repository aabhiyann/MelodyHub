import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MascotImage } from '@/components/MascotImage';

describe('MascotImage Component', () => {
    it('renders with default state', () => {
        render(<MascotImage state="default" />);
        const img = screen.getByAltText(/welcoming/i);
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', '/mascot/melody-default.png');
    });

    it('renders with error state', () => {
        render(<MascotImage state="error" />);
        const img = screen.getByAltText(/confused/i);
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', '/mascot/melody-404.png');
    });

    it('applies correct size classes', () => {
        const { container } = render(<MascotImage state="default" size="xl" />);
        const img = container.querySelector('.w-64.h-64');
        expect(img).toBeInTheDocument();
    });

    it('applies custom className', () => {
        const { container } = render(
            <MascotImage state="success" className="drop-shadow-2xl" />
        );
        const img = container.querySelector('.drop-shadow-2xl');
        expect(img).toBeInTheDocument();
    });

    it('uses custom alt text when provided', () => {
        render(<MascotImage state="loading" alt="Custom alt text" />);
        const img = screen.getByAltText('Custom alt text');
        expect(img).toBeInTheDocument();
    });

    it('has lazy loading enabled', () => {
        render(<MascotImage state="playing" />);
        const img = screen.getByAltText(/enjoying music/i);
        expect(img).toHaveAttribute('loading', 'lazy');
    });

    it('renders all 8 mascot states correctly', () => {
        const states: Array<{
            state: 'default' | 'playing' | 'chatting' | 'loading' | 'error' | 'success' | 'ai' | 'empty';
            src: string;
        }> = [
                { state: 'default', src: '/mascot/melody-default.png' },
                { state: 'playing', src: '/mascot/melody-playing.png' },
                { state: 'chatting', src: '/mascot/melody-chatting.png' },
                { state: 'loading', src: '/mascot/melody-loading.png' },
                { state: 'error', src: '/mascot/melody-404.png' },
                { state: 'success', src: '/mascot/melody-success.png' },
                { state: 'ai', src: '/mascot/melody-ai.png' },
                { state: 'empty', src: '/mascot/melody-empty.png' },
            ];

        states.forEach(({ state, src }) => {
            const { container } = render(<MascotImage state={state} />);
            const img = container.querySelector('img');
            expect(img).toHaveAttribute('src', src);
        });
    });
});
