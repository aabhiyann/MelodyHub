import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUIStore } from '@/stores/UIStore';

describe('UIStore', () => {
  beforeEach(() => {
    useUIStore.setState({ isActivityPanelOpen: false });
  });

  it('initializes with isActivityPanelOpen false', () => {
    const { result } = renderHook(() => useUIStore());
    expect(result.current.isActivityPanelOpen).toBe(false);
  });

  it('toggleActivityPanel toggles isActivityPanelOpen', () => {
    const { result } = renderHook(() => useUIStore());

    act(() => {
      result.current.toggleActivityPanel();
    });
    expect(result.current.isActivityPanelOpen).toBe(true);

    act(() => {
      result.current.toggleActivityPanel();
    });
    expect(result.current.isActivityPanelOpen).toBe(false);
  });

  it('setActivityPanelOpen sets isActivityPanelOpen', () => {
    const { result } = renderHook(() => useUIStore());

    act(() => {
      result.current.setActivityPanelOpen(true);
    });
    expect(result.current.isActivityPanelOpen).toBe(true);

    act(() => {
      result.current.setActivityPanelOpen(false);
    });
    expect(result.current.isActivityPanelOpen).toBe(false);
  });
});
