import { describe, it, expect, vi } from 'vitest';
import { formatDuration, formatNumber, debounce } from '@/lib/utils';

describe('formatDuration', () => {
    it('formats seconds correctly', () => {
        expect(formatDuration(45)).toBe('0:45');
        expect(formatDuration(125)).toBe('2:05');
    });

    it('handles zero', () => {
        expect(formatDuration(0)).toBe('0:00');
    });

    it('pads single digits', () => {
        expect(formatDuration(5)).toBe('0:05');
    });
});

describe('formatNumber', () => {
    it('formats large numbers with commas', () => {
        expect(formatNumber(1000)).toBe('1,000');
        expect(formatNumber(1000000)).toBe('1,000,000');
    });

    it('formats numbers with K/M suffixes', () => {
        expect(formatNumber(5000, true)).toBe('5K');
        expect(formatNumber(1500000, true)).toBe('1.5M');
    });
});

describe('debounce', () => {
    it('delays function execution', async () => {
        vi.useFakeTimers();
        const fn = vi.fn();
        const debouncedFn = debounce(fn, 300);

        debouncedFn();
        expect(fn).not.toHaveBeenCalled();

        vi.advanceTimersByTime(300);
        expect(fn).toHaveBeenCalledTimes(1);

        vi.useRealTimers();
    });
});
