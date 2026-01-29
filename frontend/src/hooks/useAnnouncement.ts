import { useState, useCallback } from 'react';

type Priority = 'polite' | 'assertive';

/**
 * useAnnouncement Hook
 * Provides a way to make screen reader announcements via ARIA live regions.
 * Returns only the current announcement string, which should be rendered in a visually hidden live region.
 */
export const useAnnouncement = () => {
    const [announcement, setAnnouncement] = useState('');
    const [priority, setPriority] = useState<Priority>('polite');

    const announce = useCallback((message: string, priorityLevel: Priority = 'polite') => {
        // Clear first to force re-announcement if message is same
        setAnnouncement('');
        setPriority(priorityLevel);

        // Small timeout to ensure state change is registered by SR
        setTimeout(() => {
            setAnnouncement(message);
        }, 100);
    }, []);

    return { announcement, priority, announce };
};
