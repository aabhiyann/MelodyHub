/**
 * Complete integration example for MainLayout
 * Shows how to add Melody globally with all features
 */

import { Outlet } from 'react-router-dom';
import { Mascot } from '@/components/mascot/Mascot';
import { useMascot } from '@/hooks/useMascot';
import { getHolidayTheme, isBirthday } from '@/utils/holidays';
import { useEffect } from 'react';

export default function MainLayoutWithMascot() {
    const mascot = useMascot();

    // Show holiday greeting on mount
    useEffect(() => {
        const holiday = getHolidayTheme();
        if (holiday) {
            mascot.setState('celebrating');
            mascot.showMessage(holiday.message);
            mascot.show();
            setTimeout(() => mascot.hide(), 5000);
        }

        // Check for user birthday (would get from user profile)
        const userBirthday = '1990-01-21'; // Example
        if (isBirthday(userBirthday)) {
            setTimeout(() => {
                mascot.setState('celebrating');
                mascot.showMessage('🎂 Happy Birthday! Hope your day is filled with great music!');
                mascot.show();
            }, 1000);
        }
    }, []);

    return (
        <div className="h-screen flex flex-col">
            <Outlet />

            {/* Global mascot - always available */}
            <Mascot />
        </div>
    );
}
