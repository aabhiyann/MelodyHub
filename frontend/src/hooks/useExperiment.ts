import { useMemo, useEffect } from 'react';
import { getVariant } from '@/utils/experiments';
import { axiosInstance } from '@/lib/axios';
import { useAuthStore } from '@/stores/AuthStore';

export const useExperiment = (experimentId: string): string => {
  const { clerkUser } = useAuthStore();
  const userId = clerkUser?.id || 'anonymous';

  // Get variant (memoized to prevent recalculation)
  const variant = useMemo(
    () => getVariant(experimentId, userId),
    [experimentId, userId]
  );

  // Track experiment exposure once
  useEffect(() => {
    const trackExposure = async () => {
      try {
        await axiosInstance.post('/analytics/experiment-exposure', {
          experimentId,
          variant,
          userId,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        // Silently fail for analytics
        console.debug('Failed to track experiment exposure:', error);
      }
    };

    trackExposure();
  }, [experimentId, variant, userId]);

  return variant;
};
