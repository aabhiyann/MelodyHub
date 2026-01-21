/**
 * useRipple - Hook for creating Material Design ripple effect
 */

import { useCallback } from 'react';
import { TIMINGS } from '@/lib/interactions';

export const useRipple = () => {
    const createRipple = useCallback((event: React.MouseEvent<HTMLElement>) => {
        const button = event.currentTarget;

        // Check if element allows ripples
        if (button.disabled) return;

        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      pointer-events: none;
      animation: ripple-animation ${TIMINGS.ripple}ms ease-out;
    `;

        // Ensure parent is positioned
        const position = getComputedStyle(button).position;
        if (position === 'static') {
            button.style.position = 'relative';
        }
        button.style.overflow = 'hidden';

        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, TIMINGS.ripple);
    }, []);

    return { createRipple };
};

// Add this to your global CSS or design-tokens.css:
/*
@keyframes ripple-animation {
  from {
    transform: scale(0);
    opacity: 1;
  }
  to {
    transform: scale(4);
    opacity: 0;
  }
}
*/
