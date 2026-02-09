import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GemsIndicator } from '../GemsIndicator';
import { useGamificationStore } from '@/stores/GamificationStore';

vi.mock('@/stores/GamificationStore', () => ({
    useGamificationStore: vi.fn(),
}));

describe('GemsIndicator', () => {
    it('renders gem count', () => {
        (useGamificationStore as any).mockReturnValue({
            gems: 100,
        });

        render(<GemsIndicator />);
        expect(screen.getByText('100')).toBeDefined();
    });
});
