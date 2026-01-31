import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RippleButton } from '@/components/ui/RippleButton';

describe('RippleButton', () => {
    it('renders children correctly', () => {
        render(<RippleButton>Click Me</RippleButton>);
        expect(screen.getByRole('button')).toHaveTextContent('Click Me');
    });

    it('calls onClick when clicked', () => {
        const handleClick = vi.fn();
        render(<RippleButton onClick={handleClick}>Click Me</RippleButton>);

        fireEvent.click(screen.getByRole('button'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('creates ripple effect on click', () => {
        render(<RippleButton>Ripple</RippleButton>);
        const button = screen.getByRole('button');

        // Initial state: no ripples
        expect(button.querySelectorAll('span.animate-ripple')).toHaveLength(0);

        // Click to trigger ripple
        fireEvent.click(button, { clientX: 10, clientY: 10 });

        // Should have 1 ripple
        expect(button.querySelectorAll('span.animate-ripple')).toHaveLength(1);
    });

    it('disables ripple when configured', () => {
        render(<RippleButton enableRipple={false}>No Ripple</RippleButton>);
        const button = screen.getByRole('button');

        fireEvent.click(button);
        expect(button.querySelectorAll('span.animate-ripple')).toHaveLength(0);
    });
});
