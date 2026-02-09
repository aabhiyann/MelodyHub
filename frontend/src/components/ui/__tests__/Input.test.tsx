import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Input } from '../input';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
    motion: {
        input: ({ className, ...props }: any) => <input className={className} {...props} />
    }
}));

describe('Input Component', () => {
    it('renders correctly', () => {
        render(<Input placeholder="Test Input" />);
        const input = screen.getByPlaceholderText('Test Input');
        expect(input).toBeDefined();
        expect(input.getAttribute('type')).toBeNull(); // Default type
    });

    it('applies custom classes', () => {
        render(<Input className="custom-class" data-testid="input" />);
        const input = screen.getByTestId('input');
        expect(input.className).toContain('custom-class');
        expect(input.className).toContain('border-input'); // Standard class
    });

    it('handles hasError prop', () => {
        render(<Input hasError={true} data-testid="input" />);
        const input = screen.getByTestId('input');
        expect(input.getAttribute('aria-invalid')).toBe('true');
    });

    it('triggers shake animation logic on error', () => {
        vi.useFakeTimers();
        const { rerender } = render(<Input hasError={false} data-testid="input" />);
        let input = screen.getByTestId('input');
        expect(input.className).not.toContain('animate-shake-enhanced');

        rerender(<Input hasError={true} data-testid="input" />);
        input = screen.getByTestId('input');
        expect(input.className).toContain('animate-shake-enhanced');

        act(() => {
            vi.advanceTimersByTime(550);
        });

        expect(input.className).not.toContain('animate-shake-enhanced');
        vi.useRealTimers();
    });

    it('forwards refs', () => {
        const ref = { current: null };
        render(<Input ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
});
