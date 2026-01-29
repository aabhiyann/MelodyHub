import { useState } from 'react';

export const SkipLinks = () => {
    const [isVisible, setIsVisible] = useState(false);

    const handleFocus = () => setIsVisible(true);
    const handleBlur = () => setIsVisible(false);

    return (
        <div
            className={`
                fixed top-0 left-0 z-[2000] w-full pointer-events-none flex justify-center
                ${isVisible ? 'pointer-events-auto' : ''}
            `}
        >
            <a
                href="#main-content"
                onFocus={handleFocus}
                onBlur={handleBlur}
                className={`
                    px-6 py-3 bg-brand-primary text-white font-bold rounded-b-xl shadow-xl transform transition-transform duration-200
                    ${isVisible ? 'translate-y-0' : '-translate-y-full'}
                    focus:outline-none focus:ring-4 focus:ring-white/50
                `}
            >
                Skip to Main Content
            </a>
        </div>
    );
};
