import { useState, useCallback, useEffect, useRef } from 'react';

interface UseGridNavigationOptions {
  itemCount: number;
  columns: number;
  onSelect: (index: number) => void;
  enabled?: boolean;
}

export const useGridNavigation = ({
  itemCount,
  columns,
  onSelect,
  enabled = true,
}: UseGridNavigationOptions) => {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!enabled) return;

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          setFocusedIndex((prev) => Math.min(prev + 1, itemCount - 1));
          break;

        case 'ArrowLeft':
          e.preventDefault();
          setFocusedIndex((prev) => Math.max(prev - 1, 0));
          break;

        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex((prev) => Math.min(prev + columns, itemCount - 1));
          break;

        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex((prev) => Math.max(prev - columns, 0));
          break;

        case 'Enter':
        case ' ':
          e.preventDefault();
          onSelect(focusedIndex);
          break;

        case 'Home':
          e.preventDefault();
          setFocusedIndex(0);
          break;

        case 'End':
          e.preventDefault();
          setFocusedIndex(itemCount - 1);
          break;

        default:
          break;
      }
    },
    [itemCount, columns, focusedIndex, onSelect, enabled]
  );

  // Focus the active element when focusedIndex changes
  useEffect(() => {
    if (!containerRef.current || !enabled) return;

    const focusableElement = containerRef.current.querySelector(
      `[data-grid-index="${focusedIndex}"]`
    ) as HTMLElement;

    if (focusableElement) {
      focusableElement.focus();
    }
  }, [focusedIndex, enabled]);

  return {
    focusedIndex,
    setFocusedIndex,
    handleKeyDown,
    containerRef,
  };
};
