/**
 * LiveRegion - Announces dynamic content to screen readers
 * WCAG 2.1 Success Criterion 4.1.3 (Status Messages - Level AA)
 */

import { useRef } from 'react';

export type LiveRegionPoliteness = 'polite' | 'assertive' | 'off';

interface LiveRegionProps {
    children: React.ReactNode;
    politeness?: LiveRegionPoliteness;
    atomic?: boolean;
    className?: string;
}

export const LiveRegion = ({
    children,
    politeness = 'polite',
    atomic = true,
    className
}: LiveRegionProps) => {
    return (
        <div
            role="status"
            aria-live={politeness}
            aria-atomic={atomic}
            className={className}
        >
            {children}
        </div>
    );
};

/**
 * Hook to announce messages to screen readers
 */
export function useAnnounce() {
    const regionRef = useRef<HTMLDivElement>(null);

    const announce = (message: string, politeness: LiveRegionPoliteness = 'polite') => {
        if (!regionRef.current) return;

        // Clear previous message
        regionRef.current.textContent = '';

        // Force reflow
        void regionRef.current.offsetHeight;

        // Set new message
        regionRef.current.textContent = message;
        regionRef.current.setAttribute('aria-live', politeness);
    };

    const AnnouncerComponent = () => (
        <div
            ref={regionRef}
            className="sr-only"
            role="status"
            aria-live="polite"
            aria-atomic="true"
        />
    );

    return { announce, Announcer: AnnouncerComponent };
}
