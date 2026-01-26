/**
 * Route Guard: Require Authentication
 * Redirects to landing page if user is not authenticated
 */

import { useUser } from '@clerk/clerk-react';
import { Navigate, useLocation } from 'react-router-dom';
import { LoadingScreen } from '@/components/LoadingScreen';

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
    if (!isLoaded) {
        return <LoadingScreen />;
    }

    // Redirect to landing if not signed in
    if (!isSignedIn) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};
