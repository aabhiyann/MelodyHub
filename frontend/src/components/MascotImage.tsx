import React from 'react';

export type MascotState =
    | 'default'
    | 'playing'
    | 'chatting'
    | 'loading'
    | 'error'
    | 'success'
    | 'ai'
    | 'empty';

interface MascotImageProps {
    state: MascotState;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    alt?: string;
}

const sizeClasses = {
    sm: 'w-16 h-16',    // 64px
    md: 'w-32 h-32',    // 128px
    lg: 'w-48 h-48',    // 192px
    xl: 'w-64 h-64',    // 256px
};

const mascotImages: Record<MascotState, string> = {
    default: '/mascot/melody-default.png',
    playing: '/mascot/melody-playing.png',
    chatting: '/mascot/melody-chatting.png',
    loading: '/mascot/melody-loading.png',
    error: '/mascot/melody-404.png',
    success: '/mascot/melody-success.png',
    ai: '/mascot/melody-ai.png',
    empty: '/mascot/melody-empty.png',
};

const mascotAlts: Record<MascotState, string> = {
    default: 'Melody the turtle mascot welcoming you',
    playing: 'Melody enjoying music',
    chatting: 'Melody in chat mode',
    loading: 'Melody waiting patiently',
    error: 'Melody looking confused',
    success: 'Melody celebrating',
    ai: 'Melody thinking with AI',
    empty: 'Melody encouraging you to add content',
};

export const MascotImage: React.FC<MascotImageProps> = ({
    state,
    size = 'md',
    className = '',
    alt,
}) => {
    return (
        <img
            src={mascotImages[state]}
            alt={alt || mascotAlts[state]}
            className={`${sizeClasses[size]} ${className}`}
            loading="lazy"
        />
    );
};
