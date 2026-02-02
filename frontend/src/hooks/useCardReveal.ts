import { useInView } from '@/utils/performance';
import { useRef } from 'react';

interface UseCardRevealOptions {
  delay?: number;
  once?: boolean;
  rootMargin?: string;
}

export const useCardReveal = (options: UseCardRevealOptions = {}) => {
  const { delay = 0, once = true, rootMargin = '50px' } = options;
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { rootMargin, once });

  return {
    ref,
    animate: isInView ? 'visible' : 'hidden',
    transition: { delay: delay * 0.05, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  };
};
