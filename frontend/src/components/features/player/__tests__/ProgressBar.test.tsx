import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProgressBar } from '../ProgressBar';

// Mock InteractiveSlider as it's a complex UI component
vi.mock('@/components/ui/InteractiveSlider', () => ({
    InteractiveSlider: ({ value, max, onChange, className }: any) => (
        <input
            type="range"
            data-testid="progress-slider"
            value={value}
            max={max}
            onChange={(e) => onChange(Number(e.target.value))}
            className={className}
        />
    ),
}));

describe('ProgressBar', () => {
    const mockOnSeek = vi.fn();

    it('renders current time and duration formatted correctly', () => {
        render(
            <ProgressBar
                currentTime={65} // 1:05
                duration={185}   // 3:05
                bufferedTime={0}
                onSeek={mockOnSeek}
            />
        );

        expect(screen.getByText('1:05')).toBeDefined();
        expect(screen.getByText('3:05')).toBeDefined();
    });

    it('handles zero values correctly', () => {
        render(
            <ProgressBar
                currentTime={0}
                duration={0}
                bufferedTime={0}
                onSeek={mockOnSeek}
            />
        );

        // Should render 0:00 for both
        const timeDisplays = screen.getAllByText('0:00');
        expect(timeDisplays.length).toBe(2);
    });

    it('calls onSeek when slider changes', () => {
        render(
            <ProgressBar
                currentTime={0}
                duration={100}
                bufferedTime={0}
                onSeek={mockOnSeek}
            />
        );

        const slider = screen.getByTestId('progress-slider');
        fireEvent.change(slider, { target: { value: '50' } });

        expect(mockOnSeek).toHaveBeenCalledWith(50);
    });
});
