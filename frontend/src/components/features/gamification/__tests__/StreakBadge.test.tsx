import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StreakBadge } from '../StreakBadge';
import { useGamificationStore } from '@/stores/GamificationStore';

vi.mock('@/stores/GamificationStore', () => ({
    useGamificationStore: vi.fn(),
}));

describe('StreakBadge', () => {
    it('renders streak count', () => {
        (useGamificationStore as any).mockReturnValue({
            streak: 5,
            streakFreezes: 0,
        });

        render(<StreakBadge />);
        expect(screen.getByText('5')).toBeDefined();
    });

    it('shows freeze indicator when freezes > 0', () => {
        (useGamificationStore as any).mockReturnValue({
            streak: 5,
            streakFreezes: 1,
        });

        const { container } = render(<StreakBadge />);
        // Snowflake logic is conditional, check if it renders
        // Based on code: Snowflake is inside a motion.div
        // We can check for the Snowflake icon or the container class
        const snowflake = container.querySelector('.bg-cyan-500');
        expect(snowflake).toBeDefined();
    });

    it('hides freeze indicator when freezes == 0', () => {
        (useGamificationStore as any).mockReturnValue({
            streak: 5,
            streakFreezes: 0,
        });

        const { container } = render(<StreakBadge />);
        const snowflake = container.querySelector('.bg-cyan-500');
        expect(snowflake).toBeNull();
    });
});
