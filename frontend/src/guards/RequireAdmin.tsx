/**
 * Route Guard: Require Admin Role
 * Redirects non-admin users to /home to protect the admin dashboard
 */

import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { LoadingScreen } from '@/components/shared/LoadingScreen';

interface RequireAdminProps {
    children: React.ReactNode;
}

export const RequireAdmin = ({ children }: RequireAdminProps) => {
    const { isSignedIn, isLoaded, user } = useUser();

    if (!isLoaded) {
        return <LoadingScreen />;
    }

    // If not signed in at all, redirect to landing
    if (!isSignedIn) {
        return <Navigate to="/" replace />;
    }

    // Check Clerk publicMetadata for admin role
    const role = (user?.publicMetadata as { role?: string })?.role;
    const isAdmin = role === 'admin';

    if (!isAdmin) {
        // Silently redirect non-admin users to home — don't hint that admin exists
        return <Navigate to="/home" replace />;
    }

    return <>{children}</>;
};
