import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

describe('useInfiniteScroll', () => {
  let mockObserve: ReturnType<typeof vi.fn>;
  let mockDisconnect: ReturnType<typeof vi.fn>;
  let observerCallback: (entries: Array<{ isIntersecting: boolean }>) => void;

  beforeEach(() => {
    mockObserve = vi.fn();
    mockDisconnect = vi.fn();
    vi.stubGlobal(
      'IntersectionObserver',
      class MockIntersectionObserver {
        constructor(callback: (entries: Array<{ isIntersecting: boolean }>) => void, _opts: unknown) {
          observerCallback = callback;
        }
        observe = mockObserve;
        disconnect = mockDisconnect;
      }
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns a ref', () => {
    const loadMore = vi.fn();
    const { result } = renderHook(() =>
      useInfiniteScroll({ loadMore, hasMore: true })
    );
    expect(result.current).toBeDefined();
    expect(result.current.current).toBeNull();
  });

  it('creates IntersectionObserver when hasMore is true', () => {
    const loadMore = vi.fn();
    renderHook(() => useInfiniteScroll({ loadMore, hasMore: true }));
    expect(observerCallback).toBeDefined();
  });

  it('calls loadMore when entry is intersecting', () => {
    const loadMore = vi.fn();
    renderHook(() => useInfiniteScroll({ loadMore, hasMore: true }));
    expect(observerCallback).toBeDefined();
    observerCallback([{ isIntersecting: true }]);
    expect(loadMore).toHaveBeenCalled();
  });

  it('does not call loadMore when entry is not intersecting', () => {
    const loadMore = vi.fn();
    renderHook(() => useInfiniteScroll({ loadMore, hasMore: true }));
    observerCallback([{ isIntersecting: false }]);
    expect(loadMore).not.toHaveBeenCalled();
  });

  it('disconnects observer on unmount', () => {
    const loadMore = vi.fn();
    const { unmount } = renderHook(() =>
      useInfiniteScroll({ loadMore, hasMore: true })
    );
    unmount();
    expect(mockDisconnect).toHaveBeenCalled();
  });
});
