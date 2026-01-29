import { useState, useEffect } from 'react';

export function useReducedMotion() {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setMatches(mediaQuery.matches);

        const handleChange = () => {
            setMatches(mediaQuery.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    return matches;
}
