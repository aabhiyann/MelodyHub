import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCardReveal } from '@/hooks/useCardReveal';

const mockIsInView = vi.fn();
vi.mock('@/utils/performance', () => ({
  useInView: () => mockIsInView(),
}));

describe('useCardReveal', () => {
  beforeEach(() => {
    mockIsInView.mockReturnValue(false);
  });

  it('returns ref, animate, and transition', () => {
    const { result } = renderHook(() => useCardReveal());
    expect(result.current.ref).toBeDefined();
    expect(result.current.animate).toBe('hidden');
    expect(result.current.transition).toEqual({
      delay: 0,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    });
  });

  it('returns visible when useInView is true', () => {
    mockIsInView.mockReturnValue(true);
    const { result } = renderHook(() => useCardReveal());
    expect(result.current.animate).toBe('visible');
  });

  it('applies delay from index option', () => {
    const { result } = renderHook(() => useCardReveal({ delay: 2 }));
    expect(result.current.transition.delay).toBe(0.1); // 2 * 0.05
  });

  it('uses default rootMargin and once', () => {
    renderHook(() => useCardReveal());
    expect(mockIsInView).toHaveBeenCalled();
  });
});
