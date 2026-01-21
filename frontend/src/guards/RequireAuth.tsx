/**
 * Route Guard: Require Authentication
 * Redirects to landing page if user is not authenticated
 */

import { useUser } from '@clerk/clerk-react';
import { Navigate, useLocation } from 'react-router-dom';
import { LoadingScreen } from '@/components/LoadingScreen';

interface RequireAuthProps {
    children: React.ReactNode;
}

export const RequireAuth = ({ children }: RequireAuthProps) => {
    const { isSignedIn, isLoaded } = useUser();
    const location = useLocation();

    // Show loading while checking auth status
    if (!isLoaded) {
        return <LoadingScreen />;
    }

    // Redirect to landing if not signed in
    if (!isSignedIn) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};
