import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGridNavigation } from '@/hooks/useGridNavigation';

describe('useGridNavigation', () => {
  it('returns focusedIndex, setFocusedIndex, handleKeyDown, containerRef', () => {
    const onSelect = vi.fn();
    const { result } = renderHook(() =>
      useGridNavigation({ itemCount: 9, columns: 3, onSelect })
    );
    expect(result.current.focusedIndex).toBe(0);
    expect(typeof result.current.setFocusedIndex).toBe('function');
    expect(typeof result.current.handleKeyDown).toBe('function');
    expect(result.current.containerRef).toBeDefined();
  });

  it('ArrowRight increments focusedIndex', () => {
    const onSelect = vi.fn();
    const { result } = renderHook(() =>
      useGridNavigation({ itemCount: 9, columns: 3, onSelect })
    );

    act(() => {
      result.current.handleKeyDown({
        key: 'ArrowRight',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent);
    });
    expect(result.current.focusedIndex).toBe(1);

    act(() => {
      result.current.handleKeyDown({
        key: 'ArrowRight',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent);
    });
    expect(result.current.focusedIndex).toBe(2);
  });

  it('ArrowLeft decrements focusedIndex', () => {
    const onSelect = vi.fn();
    const { result } = renderHook(() =>
      useGridNavigation({ itemCount: 9, columns: 3, onSelect })
    );
    act(() => result.current.setFocusedIndex(2));

    act(() => {
      result.current.handleKeyDown({
        key: 'ArrowLeft',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent);
    });
    expect(result.current.focusedIndex).toBe(1);
  });

  it('ArrowDown adds columns to focusedIndex', () => {
    const onSelect = vi.fn();
    const { result } = renderHook(() =>
      useGridNavigation({ itemCount: 9, columns: 3, onSelect })
    );

    act(() => {
      result.current.handleKeyDown({
        key: 'ArrowDown',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent);
    });
    expect(result.current.focusedIndex).toBe(3);
  });

  it('Enter calls onSelect with focusedIndex', () => {
    const onSelect = vi.fn();
    const { result } = renderHook(() =>
      useGridNavigation({ itemCount: 9, columns: 3, onSelect })
    );
    act(() => result.current.setFocusedIndex(2));

    act(() => {
      result.current.handleKeyDown({
        key: 'Enter',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent);
    });
    expect(onSelect).toHaveBeenCalledWith(2);
  });

  it('Home sets focusedIndex to 0', () => {
    const onSelect = vi.fn();
    const { result } = renderHook(() =>
      useGridNavigation({ itemCount: 9, columns: 3, onSelect })
    );
    act(() => result.current.setFocusedIndex(5));

    act(() => {
      result.current.handleKeyDown({
        key: 'Home',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent);
    });
    expect(result.current.focusedIndex).toBe(0);
  });

  it('End sets focusedIndex to itemCount - 1', () => {
    const onSelect = vi.fn();
    const { result } = renderHook(() =>
      useGridNavigation({ itemCount: 9, columns: 3, onSelect })
    );

    act(() => {
      result.current.handleKeyDown({
        key: 'End',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent);
    });
    expect(result.current.focusedIndex).toBe(8);
  });

  it('does not update when enabled is false', () => {
    const onSelect = vi.fn();
    const { result } = renderHook(() =>
      useGridNavigation({ itemCount: 9, columns: 3, onSelect, enabled: false })
    );

    act(() => {
      result.current.handleKeyDown({
        key: 'ArrowRight',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent);
    });
    expect(result.current.focusedIndex).toBe(0);
  });
});
