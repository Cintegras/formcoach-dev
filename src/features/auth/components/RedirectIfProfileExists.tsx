import React, {useEffect, useRef, useState} from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {useProfile} from '@/hooks/useProfile';
import {useAuth} from '@/features/auth/hooks/useAuth';
import LoadingIndicator from '@/components/LoadingIndicator';
import {hasCompleteProfile} from '@/utils/profile-utils';

interface RedirectIfProfileExistsProps {
    children: React.ReactNode;
    redirectTo?: string;
}

const RedirectIfProfileExists: React.FC<RedirectIfProfileExistsProps> = ({
                                                                             children,
                                                                             redirectTo = "/"
                                                                         }) => {
    const {profile, loading: profileLoading, error: profileError} = useProfile();
    const {loading: authLoading, error: authError} = useAuth();
    const location = useLocation();
    const [shouldRedirect, setShouldRedirect] = useState(false);

    // Track redirect count for debugging
    const redirectCount = useRef<{ count: number, lastTime: number }>({count: 0, lastTime: 0});

    // Combined loading state
    const isLoading = authLoading || profileLoading;

    // Combined error state
    const error = profileError || authError;

    // Get the intended destination (if any)
    const from = location.state?.from?.pathname || redirectTo;

    // Use effect with delay to prevent rapid redirects
    useEffect(() => {
        // Don't make decisions while still loading
        if (isLoading) {
            return;
        }

        // Check if profile is complete using the utility function
        const profileComplete = hasCompleteProfile(profile);

        // Check localStorage fallback
        const hasProfileComplete = localStorage.getItem("profile_complete") === "true";

        if (profileComplete || hasProfileComplete) {
            // Add a small delay before deciding to redirect
            const timer = setTimeout(() => {
                setShouldRedirect(true);

                // Log if redirects happen too frequently (for debugging)
                const now = Date.now();
                if (now - redirectCount.current.lastTime < 5000) {
                    redirectCount.current.count++;
                    if (redirectCount.current.count > 2) {
                        console.warn("Multiple redirects detected in RedirectIfProfileExists within 5 seconds");
                    }
                } else {
                    redirectCount.current.count = 1;
                }
                redirectCount.current.lastTime = now;

            }, 300); // 300ms delay

            return () => clearTimeout(timer);
        } else {
            setShouldRedirect(false);
        }
    }, [profile, isLoading, from, location.pathname]);

    if (isLoading) {
        return <LoadingIndicator fullScreen text="Checking profile..."/>;
    }

    if (error) {
        console.error("Profile/Auth error:", error);
        return <Navigate to="/error" state={{error: "Failed to check profile"}}/>;
    }

    if (shouldRedirect) {
        // If profile exists, redirect to the intended destination or home
        return <Navigate to={from} replace/>;
    }

    return <>{children}</>;
};

export default RedirectIfProfileExists;
