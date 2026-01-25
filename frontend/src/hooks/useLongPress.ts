/**
 * useLongPress - Detect long press gesture
 * Useful for context menus on mobile
 */

import { useCallback, useRef } from 'react';

interface UseLongPressOptions {
    onLongPress: () => void;
    onClick?: () => void;
    threshold?: number; // ms
    vibrate?: boolean;
}

export function useLongPress({
    onLongPress,
    onClick,
    threshold = 500,
    vibrate = true,
}: UseLongPressOptions) {
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const preventClickRef = useRef(false);

    const handleStart = useCallback(() => {
        preventClickRef.current = false;

        timeoutRef.current = setTimeout(() => {
            // Trigger vibration on long press
            if (vibrate && navigator.vibrate) {
                navigator.vibrate(50);
            }

            onLongPress();
            preventClickRef.current = true;
        }, threshold);
    }, [onLongPress, threshold, vibrate]);

    const handleEnd = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, []);

    const handleClick = useCallback(() => {
        if (!preventClickRef.current && onClick) {
            onClick();
        }
        preventClickRef.current = false;
    }, [onClick]);

    return {
        onMouseDown: handleStart,
        onMouseUp: handleEnd,
        onMouseLeave: handleEnd,
        onTouchStart: handleStart,
        onTouchEnd: handleEnd,
        onClick: handleClick,
    };
}
