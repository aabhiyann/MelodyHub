/**
 * Performance utility hooks and helpers
 * Debounce, throttle, and other optimization utilities
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Debounce hook - delays execution until after delay ms have elapsed
 * Perfect for search inputs, window resize
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

/**
 * Debounced callback hook - returns a debounced version of the callback
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
    callback: T,
    delay: number = 300
): (...args: Parameters<T>) => void {
    const timeoutRef = useRef<NodeJS.Timeout>();

    return useCallback(
        (...args: Parameters<T>) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                callback(...args);
            }, delay);
        },
        [callback, delay]
    );
}

/**
 * Throttle hook - ensures callback is only called once per interval
 * Perfect for scroll events, drag events
 */
export function useThrottle<T extends (...args: any[]) => any>(
    callback: T,
    delay: number = 100
): (...args: Parameters<T>) => void {
    const lastRun = useRef(Date.now());

    return useCallback(
        (...args: Parameters<T>) => {
            const now = Date.now();

            if (now - lastRun.current >= delay) {
                callback(...args);
                lastRun.current = now;
            }
        },
        [callback, delay]
    );
}

/**
 * Intersection Observer hook for lazy loading
 * Returns true when element is visible
 */
export function useInView(
    ref: React.RefObject<Element>,
    options?: IntersectionObserverInit
): boolean {
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(([entry]) => {
            setIsInView(entry.isIntersecting);
        }, options);

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [ref, options]);

    return isInView;
}

/**
 * Performance monitoring utilities
 */
export const performance = {
    /**
     * Mark performance milestone
     */
    mark: (name: string) => {
        if (typeof window !== 'undefined' && window.performance) {
            window.performance.mark(name);
        }
    },

    /**
     * Measure time between two marks
     */
    measure: (name: string, startMark: string, endMark: string) => {
        if (typeof window !== 'undefined' && window.performance) {
            window.performance.measure(name, startMark, endMark);
            const measure = window.performance.getEntriesByName(name)[0];
            return measure.duration;
        }
        return 0;
    },

    /**
     * Log performance metrics to console (dev only)
     */
    log: (name: string, duration: number) => {
        if (import.meta.env.DEV) {
            console.log(`⚡ ${name}: ${duration.toFixed(2)}ms`);
        }
    },
};

/**
 * Memoization helper types
 */
export type MemoizedComponent<P = {}> = React.MemoExoticComponent<
    React.FC<P>
>;
