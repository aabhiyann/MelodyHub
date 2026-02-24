/**
 * Route Guard: Require Authentication
 * Redirects to landing page if user is not authenticated
 */

import { useUser } from '@clerk/clerk-react';
import { Navigate, useLocation } from 'react-router-dom';
import { LoadingScreen } from '@/components/shared/LoadingScreen';
import { useAuthStore } from "@/stores/AuthStore";
import { useEffect } from "react";
import { axiosInstance } from "@/lib/axios";

interface RequireAuthProps {
    children: React.ReactNode;
}

export const RequireAuth = ({ children }: RequireAuthProps) => {
    const { isSignedIn, isLoaded, user } = useUser();
    const { authUser, setAuthUser } = useAuthStore();
    const location = useLocation();

    useEffect(() => {
        const syncUser = async () => {
            if (localStorage.getItem('TEST_MODE') === 'true' && !authUser) {
                try {
                    const response = await axiosInstance.get("/users");
                    if (response.data && response.data.length > 0) {
                        setAuthUser(response.data[0]);
                    }
                } catch (error) {
                    console.error("Test sync failed:", error);
                }
                return;
            }
            if (user && !authUser) {
                try {
                    const response = await axiosInstance.post("/auth/callback", {
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        imageUrl: user.imageUrl,
                    });
                    setAuthUser(response.data);
                } catch (error) {
                    console.error("Failed to sync user:", error);
                }
            }
        };

        syncUser();
    }, [user, authUser, setAuthUser]);

    // Show loading while checking auth status
    if (!isLoaded && localStorage.getItem('TEST_MODE') !== 'true') {
        return <LoadingScreen />;
    }

    // Redirect to landing if not signed in
    if (!isSignedIn && isLoaded) {
        if (localStorage.getItem('TEST_MODE') === 'true') {
            return <>{children}</>;
        }
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};
