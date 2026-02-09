/**
 * Route Guard: Require Guest
 * Redirects to home page if user is already authenticated
 */

import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { LoadingScreen } from '@/components/shared/LoadingScreen';

interface RequireGuestProps {
    children: React.ReactNode;
}

export const RequireGuest = ({ children }: RequireGuestProps) => {
    const { isSignedIn, isLoaded } = useUser();

    // Show loading while checking auth status
    if (!isLoaded) {
        return <LoadingScreen />;
    }

    // Redirect to home if already signed in
    if (isSignedIn) {
        return <Navigate to="/home" replace />;
    }

    return <>{children}</>;
};
