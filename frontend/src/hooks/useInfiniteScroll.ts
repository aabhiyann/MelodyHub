import { useEffect, useRef } from 'react';

interface UseInfiniteScrollOptions {
  loadMore: () => void;
  hasMore: boolean;
  threshold?: number;
  rootMargin?: string;
}

export const useInfiniteScroll = ({
  loadMore,
  hasMore,
  threshold = 0.8,
  rootMargin = '100px',
}: UseInfiniteScrollOptions) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      { threshold, rootMargin }
    );

    observerRef.current = observer;

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loadMore, threshold, rootMargin]);

  return loadMoreRef;
};
