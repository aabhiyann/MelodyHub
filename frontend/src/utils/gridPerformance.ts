import { axiosInstance } from '@/lib/axios';

export const measureGridPerformance = (gridId: string) => {
  const startMark = `grid-${gridId}-start`;
  const endMark = `grid-${gridId}-end`;
  const measureName = `grid-${gridId}`;

  // Mark the start time
  performance.mark(startMark);

  // Return cleanup function
  return () => {
    // Mark the end time
    performance.mark(endMark);

    // Measure the duration
    try {
      performance.measure(measureName, startMark, endMark);

      const measure = performance.getEntriesByName(measureName)[0];

      if (measure && measure.duration > 1000) {
        console.warn(`Grid ${gridId} took ${measure.duration.toFixed(2)}ms to render`);

        // Track slow renders to analytics
        axiosInstance
          .post('/analytics/performance', {
            metric: 'grid_render',
            gridId,
            duration: measure.duration,
            timestamp: new Date().toISOString(),
          })
          .catch((error) => {
            console.error('Failed to send performance metric:', error);
          });
      }

      // Clean up performance entries
      performance.clearMarks(startMark);
      performance.clearMarks(endMark);
      performance.clearMeasures(measureName);
    } catch (error) {
      console.error(`Failed to measure grid performance for ${gridId}:`, error);
    }
  };
};

export const useGridPerformance = (gridId: string, dependencies: unknown[] = []) => {
  useEffect(() => {
    const cleanup = measureGridPerformance(gridId);
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};

// Import at top of file for useEffect
import { useEffect } from 'react';
