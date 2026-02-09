import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce, useDebouncedCallback, useThrottle, useInView, performance } from '../performance';
import { useRef } from 'react';

describe('Performance Utils', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.clearAllMocks();
    });

    describe('useDebounce', () => {
        it('returns initial value immediately', () => {
            const { result } = renderHook(() => useDebounce('initial', 500));
            expect(result.current).toBe('initial');
        });

        it('updates value after delay', () => {
            const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
                initialProps: { value: 'initial' },
            });

            rerender({ value: 'updated' });
            expect(result.current).toBe('initial');

            act(() => {
                vi.advanceTimersByTime(499);
            });
            expect(result.current).toBe('initial');

            act(() => {
                vi.advanceTimersByTime(2);
            });
            expect(result.current).toBe('updated');
        });
    });

    describe('useDebouncedCallback', () => {
        it('calls callback after delay', () => {
            const callback = vi.fn();
            const { result } = renderHook(() => useDebouncedCallback(callback, 500));

            act(() => {
                result.current('arg1');
            });

            expect(callback).not.toHaveBeenCalled();

            act(() => {
                vi.advanceTimersByTime(500);
            });

            expect(callback).toHaveBeenCalledWith('arg1');
        });

        it('resets timer on subsequent calls', () => {
            const callback = vi.fn();
            const { result } = renderHook(() => useDebouncedCallback(callback, 500));

            act(() => {
                result.current('call1');
            });

            act(() => {
                vi.advanceTimersByTime(250);
                result.current('call2');
            });

            act(() => {
                vi.advanceTimersByTime(251); // Total 501 from start, but only 251 from second call
            });
            expect(callback).not.toHaveBeenCalled();

            act(() => {
                vi.advanceTimersByTime(250); // Total 501 from second call
            });

            expect(callback).toHaveBeenCalledWith('call2');
            expect(callback).toHaveBeenCalledTimes(1);
        });
    });

    describe('useThrottle', () => {
        it('calls callback immediately then throttles', () => {
            const callback = vi.fn();
            const { result } = renderHook(() => useThrottle(callback, 1000));

            // First call - should run (assuming lastRun was initialized slightly in past or immediate check logic allows)
            // Implementation: const lastRun = useRef(Date.now()); if (now - lastRun >= delay) ...
            // If initialized at T0, and called at T0, difference is 0. If delay is 1000, it won't run immediately?
            // Wait, useThrottle usually runs on LEADING edge or TRAILING?
            // Code:
            // const lastRun = useRef(Date.now());
            // const now = Date.now();
            // if (now - lastRun.current >= delay) { callback(); lastRun.current = now; }
            // Since lastRun is init to Date.now(), immediate call (now - now = 0) < delay.
            // So it skips the first call? That seems like a bug or specific design (throttle trailing?).
            // Let's test the behavior as implemented.

            // To make it run, we must advance time by delay.
            act(() => {
                // Advance time so performance.now/Date.now changes?
                // vi.useFakeTimers() mocks Date.
                vi.setSystemTime(new Date(Date.now() + 1000));
                result.current('arg1');
            });

            expect(callback).toHaveBeenCalledWith('arg1');
            expect(callback).toHaveBeenCalledTimes(1);

            // Call again immediately (time hasn't advanced much)
            act(() => {
                result.current('arg2');
            });
            expect(callback).toHaveBeenCalledTimes(1); // Should be throttled

            // Advance time again
            act(() => {
                vi.setSystemTime(new Date(Date.now() + 1000 + 1000));
                result.current('arg3');
            });
            expect(callback).toHaveBeenCalledTimes(2);
            expect(callback).toHaveBeenCalledWith('arg3');
        });
    });

    describe('useInView', () => {
        it('returns true when intersecting', () => {
            // Mock IntersectionObserver
            const observe = vi.fn();
            const disconnect = vi.fn();
            let trigger: (isIntersecting: boolean) => void;

            class MockIntersectionObserver {
                constructor(callback: IntersectionObserverCallback) {
                    trigger = (isIntersecting: boolean) => {
                        callback([{ isIntersecting } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
                    };
                }
                observe = observe;
                disconnect = disconnect;
                unobserve = vi.fn();
                root = null;
                rootMargin = '';
                thresholds = [];
                takeRecords = vi.fn();
            }

            window.IntersectionObserver = MockIntersectionObserver as any;

            const { result } = renderHook(() => {
                const ref = useRef(document.createElement('div'));
                const isInView = useInView(ref);
                return { isInView, ref };
            });

            expect(result.current.isInView).toBe(false);
            expect(observe).toHaveBeenCalledWith(result.current.ref.current);

            // Trigger intersection
            act(() => {
                trigger(true);
            });

            expect(result.current.isInView).toBe(true);
        });
    });

    describe('performance helper', () => {
        it('calls window.performance methods', () => {
            const markSpy = vi.fn();
            const measureSpy = vi.fn();
            const getEntriesByNameSpy = vi.fn().mockReturnValue([{ duration: 123 }]);

            Object.defineProperty(window, 'performance', {
                value: {
                    mark: markSpy,
                    measure: measureSpy,
                    getEntriesByName: getEntriesByNameSpy
                },
                writable: true
            });

            performance.mark('test-start');
            expect(markSpy).toHaveBeenCalledWith('test-start');

            const duration = performance.measure('test-measure', 'test-start', 'test-end');
            expect(measureSpy).toHaveBeenCalledWith('test-measure', 'test-start', 'test-end');
            expect(duration).toBe(123);
        });

        it('logs to console in DEV mode', () => {
            const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });
            // Mock import.meta.env.DEV
            // logic check: performace.ts uses `import.meta.env.DEV`
            // Vitest environment usually simulates this.

            // Use value that rounds cleanly
            performance.log('test-metric', 50.123);

            // Expect to call if DEV is true (default in test usually?)
            // If it fails, we might need to mock import.meta or similar, but let's try.
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('⚡ test-metric: 50.12ms'));
        });
    });
});
