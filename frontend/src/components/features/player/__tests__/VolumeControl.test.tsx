import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { VolumeControl } from '../VolumeControl';

describe('VolumeControl', () => {
    const mockOnVolumeChange = vi.fn();
    const mockOnToggleMute = vi.fn();

    it('renders with correct volume icon', () => {
        render(
            <VolumeControl
                volume={50}
                isMuted={false}
                onVolumeChange={mockOnVolumeChange}
                onToggleMute={mockOnToggleMute}
            />
        );

        // Should check for an svg or aria-label if possible
        const muteButton = screen.getByLabelText('Mute');
        expect(muteButton).toBeDefined();
    });

    it('toggles mute on click', () => {
        render(
            <VolumeControl
                volume={50}
                isMuted={false}
                onVolumeChange={mockOnVolumeChange}
                onToggleMute={mockOnToggleMute}
            />
        );

        const muteButton = screen.getByLabelText('Mute');
        fireEvent.click(muteButton);
        expect(mockOnToggleMute).toHaveBeenCalled();
    });

    it('shows slider on hover', async () => {
        const { container } = render(
            <VolumeControl
                volume={50}
                isMuted={false}
                onVolumeChange={mockOnVolumeChange}
                onToggleMute={mockOnToggleMute}
            />
        );

        // Hover over the container
        const controlContainer = container.firstChild as Element;
        fireEvent.mouseEnter(controlContainer);

        // Slider should appear
        const slider = await screen.findByRole('slider', { name: /volume/i });
        expect(slider).toBeDefined();
    });

    it('changes volume via slider', async () => {
        const { container } = render(
            <VolumeControl
                volume={50}
                isMuted={false}
                onVolumeChange={mockOnVolumeChange}
                onToggleMute={mockOnToggleMute}
            />
        );

        const controlContainer = container.firstChild as Element;
        fireEvent.mouseEnter(controlContainer);

        const slider = await screen.findByRole('slider', { name: /volume/i });
        fireEvent.change(slider, { target: { value: '75' } });

        expect(mockOnVolumeChange).toHaveBeenCalledWith(75);
    });

    it('unmutes if volume changes while muted', async () => {
        const { container } = render(
            <VolumeControl
                volume={0}
                isMuted={true}
                onVolumeChange={mockOnVolumeChange}
                onToggleMute={mockOnToggleMute}
            />
        );

        const controlContainer = container.firstChild as Element;
        fireEvent.mouseEnter(controlContainer);

        const slider = await screen.findByRole('slider', { name: /volume/i });
        fireEvent.change(slider, { target: { value: '20' } });

        expect(mockOnVolumeChange).toHaveBeenCalledWith(20);
        expect(mockOnToggleMute).toHaveBeenCalled();
    });
});
