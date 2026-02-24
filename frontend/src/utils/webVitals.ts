/**
 * Web Vitals monitoring and reporting
 * Tracks Core Web Vitals: LCP, INP, CLS, FCP, TTFB
 */

import { onCLS, onFCP, onINP, onLCP, onTTFB, Metric } from 'web-vitals';

interface WebVitalsMetrics {
    lcp?: number;
    inp?: number; // Updated from FID to INP
    cls?: number;
    fcp?: number;
    ttfb?: number;
}

const metrics: WebVitalsMetrics = {};

/**
 * Send metric to analytics
 */
function sendToAnalytics(metric: Metric) {
    // Store metric
    metrics[metric.name.toLowerCase() as keyof WebVitalsMetrics] = metric.value;

    // Log in development
    if (import.meta.env.DEV) {
        console.log(`📊 ${metric.name}:`, {
            value: metric.value,
            rating: metric.rating,
            delta: metric.delta,
        });
    }

    // Send to analytics service (PostHog, Google Analytics, etc.)
    if (typeof window !== 'undefined' && (window as any).posthog) {
        (window as any).posthog.capture('web_vitals', {
            metric_name: metric.name,
            value: metric.value,
            rating: metric.rating,
            delta: metric.delta,
            id: metric.id,
        });
    }

    // Send to custom endpoint
    if (import.meta.env.PROD) {
        const body = JSON.stringify({
            name: metric.name,
            value: metric.value,
            rating: metric.rating,
            navigationType: metric.navigationType,
        });

        const apiUrl = import.meta.env.VITE_API_URL || '/api';
        const endpoint = `${apiUrl}/analytics/web-vitals`;

        // Use sendBeacon if available (doesn't block page unload)
        if (navigator.sendBeacon) {
            navigator.sendBeacon(endpoint, body);
        } else {
            fetch(endpoint, {
                body,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                keepalive: true,
            }).catch(console.error);
        }
    }
}

/**
 * Initialize Web Vitals monitoring
 */
export function initWebVitals() {
    onCLS(sendToAnalytics);
    onFCP(sendToAnalytics);
    onINP(sendToAnalytics); // Updated from FID to INP (Interaction to Next Paint)
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
}

/**
 * Get current metrics
 */
export function getMetrics(): WebVitalsMetrics {
    return { ...metrics };
}

/**
 * Performance marks for custom measurements
 */
export const marks = {
    /**
     * Mark when app starts
     */
    appStart: () => {
        performance.mark('app-start');
    },

    /**
     * Mark when app is interactive
     */
    appInteractive: () => {
        performance.mark('app-interactive');
        performance.measure('app-load-time', 'app-start', 'app-interactive');

        const measure = performance.getEntriesByName('app-load-time')[0];
        if (measure && import.meta.env.DEV) {
            console.log(`⚡ App Load Time: ${measure.duration.toFixed(2)}ms`);
        }
    },

    /**
     * Mark when route changes
     */
    routeChange: (route: string) => {
        performance.mark(`route-${route}`);
    },
};

/**
 * Check if metrics meet thresholds
 */
export function checkPerformanceThresholds(): {
    passing: boolean;
    metrics: WebVitalsMetrics;
    failures: string[];
} {
    const failures: string[] = [];

    // LCP should be < 2.5s
    if (metrics.lcp && metrics.lcp > 2500) {
        failures.push(`LCP too high: ${metrics.lcp}ms (target: <2500ms)`);
    }

    // INP should be < 200ms (replaces FID in web-vitals v3)
    if (metrics.inp && metrics.inp > 200) {
        failures.push(`INP too high: ${metrics.inp}ms (target: <200ms)`);
    }

    // CLS should be < 0.1
    if (metrics.cls && metrics.cls > 0.1) {
        failures.push(`CLS too high: ${metrics.cls} (target: <0.1)`);
    }

    // FCP should be < 1.8s
    if (metrics.fcp && metrics.fcp > 1800) {
        failures.push(`FCP too high: ${metrics.fcp}ms (target: <1800ms)`);
    }

    // TTFB should be < 600ms
    if (metrics.ttfb && metrics.ttfb > 600) {
        failures.push(`TTFB too high: ${metrics.ttfb}ms (target: <600ms)`);
    }

    return {
        passing: failures.length === 0,
        metrics,
        failures,
    };
}
