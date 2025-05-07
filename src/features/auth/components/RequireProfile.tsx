import React, {useEffect, useRef, useState} from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {useProfile} from '@/hooks/useProfile';
import {useAuth} from '@/features/auth/hooks/useAuth';
import LoadingIndicator from '@/components/LoadingIndicator';
import {hasCompleteProfile} from '@/utils/profile-utils';
import {throttle} from 'lodash';

interface RequireProfileProps {
    children: React.ReactNode;
}

const RequireProfile: React.FC<RequireProfileProps> = ({children}) => {
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
                        console.warn("Multiple redirects detected in RequireProfile within 5 seconds");
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

        if (!profileComplete && !hasProfileComplete) {
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
    }, [profile, isLoading, shouldRedirect]);

    if (isLoading) {
        return <LoadingIndicator fullScreen text="Loading profile..."/>;
    }

    if (error) {
        console.error("Profile/Auth error:", error);
        return <Navigate to="/error" state={{error: "Failed to load profile"}}/>;
    }

    if (shouldRedirect) {
        // Redirect to welcome screen instead of profile setup
        // This ensures users go through the welcome flow after clearing app data
        return <Navigate to="/welcome" state={{from: location}} replace/>;
    }

    return <>{children}</>;
};

export default RequireProfile;
