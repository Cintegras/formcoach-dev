import React, {useEffect, useRef, useState} from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {useProfile} from '@/hooks/useProfile';
import {useAuth} from '@/features/auth/hooks/useAuth';
import LoadingIndicator from '@/components/LoadingIndicator';
import {hasCompleteProfile} from '@/utils/profile-utils';
import {throttle} from 'lodash';

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

    // Create a throttled version of setShouldRedirect that can only be called once per second
    // This will prevent excessive history.replaceState() calls
    const throttledSetShouldRedirect = useRef(
        throttle((value: boolean) => {
            setShouldRedirect(value);

            // Log for debugging
            if (value) {
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
            }
        }, 1000, {leading: true, trailing: false})
    ).current;

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
            // Use throttled function to prevent excessive redirects
            throttledSetShouldRedirect(true);
        } else {
            // Only set to false if it was previously true to avoid unnecessary state updates
            if (shouldRedirect) {
                throttledSetShouldRedirect(false);
            }
        }

        // Cleanup function
        return () => {
            // Cancel any pending throttled calls when the component unmounts or dependencies change
            throttledSetShouldRedirect.cancel();
        };
    }, [profile, isLoading, shouldRedirect, from]);

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
