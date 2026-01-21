/**
 * Achievement system for Melody mascot
 * Tracks milestones and unlocks celebrations
 */

import { useMascot } from '@/hooks/useMascot';
import { useEffect } from 'react';

export interface Achievement {
    id: string;
    name: string;
    description: string;
    threshold: number;
    icon: string;
    unlocked: boolean;
}

export const achievements: Achievement[] = [
    {
        id: 'first-playlist',
        name: 'Playlist Pioneer',
        description: 'Create your first playlist',
        threshold: 1,
        icon: '🎵',
        unlocked: false,
    },
    {
        id: '10-playlists',
        name: 'Curator',
        description: 'Create 10 playlists',
        threshold: 10,
        icon: '📚',
        unlocked: false,
    },
    {
        id: '100-songs',
        name: 'Music Collector',
        description: 'Add 100 songs to your library',
        threshold: 100,
        icon: '💿',
        unlocked: false,
    },
    {
        id: '500-songs',
        name: 'Music Hoarder',
        description: 'Add 500 songs to your library',
        threshold: 500,
        icon: '🎸',
        unlocked: false,
    },
    {
        id: 'melody-veteran',
        name: 'Melody Veteran',
        description: 'Use MelodyHub for 1 year',
        threshold: 365,
        icon: '🏆',
        unlocked: false,
    },
];

/**
 * Hook to track and display achievements
 */
export function useAchievements() {
    const mascot = useMascot();

    const checkAchievement = (id: string, currentValue: number) => {
        const achievement = achievements.find((a) => a.id === id);
        if (!achievement) return;

        if (currentValue >= achievement.threshold && !achievement.unlocked) {
            unlockAchievement(achievement);
        }
    };

    const unlockAchievement = (achievement: Achievement) => {
        achievement.unlocked = true;

        // Show mascot celebration
        mascot.setState('celebrating');
        mascot.showMessage(
            `🏆 Achievement Unlocked: ${achievement.name}! ${achievement.icon}`
        );
        mascot.unlockAnimation(achievement.id);
        mascot.show();

        // Auto-hide after 5 seconds
        setTimeout(() => {
            mascot.hide();
        }, 5000);
    };

    return {
        checkAchievement,
        unlockAchievement,
        achievements,
    };
}

/**
 * Achievement tracking examples
 */
export function AchievementTracker() {
    const { checkAchievement } = useAchievements();

    // Example: Track playlist creation
    useEffect(() => {
        const playlistCount = 10; // Get from store
        checkAchievement('first-playlist', playlistCount);
        checkAchievement('10-playlists', playlistCount);
    }, []);

    // Example: Track song library
    useEffect(() => {
        const songCount = 150; // Get from store
        checkAchievement('100-songs', songCount);
        checkAchievement('500-songs', songCount);
    }, []);

    return null;
}
