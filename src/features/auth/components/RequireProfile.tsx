import React, {useEffect, useState} from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {useProfile} from '@/hooks/useProfile';
import LoadingIndicator from '@/components/LoadingIndicator';

interface RequireProfileProps {
    children: React.ReactNode;
}

const RequireProfile: React.FC<RequireProfileProps> = ({children}) => {
    const {profile, loading, error} = useProfile();
    const location = useLocation();
    const [shouldRedirect, setShouldRedirect] = useState(false);

    // Use effect with delay to prevent rapid redirects
    useEffect(() => {
        if (!loading && !profile) {
            // Add a small delay before deciding to redirect
            const timer = setTimeout(() => {
                setShouldRedirect(true);
            }, 300); // 300ms delay

            return () => clearTimeout(timer);
        } else {
            setShouldRedirect(false);
        }
    }, [profile, loading]);

    if (loading) {
        return <LoadingIndicator fullScreen text="Loading profile..."/>;
    }

    if (error) {
        console.error("Profile error:", error);
        return <Navigate to="/error" state={{error: "Failed to load profile"}}/>;
    }

    if (shouldRedirect) {
        // Redirect to profile setup and save the location they were trying to access
        return <Navigate to="/profile-setup" state={{from: location}} replace/>;
    }

    return <>{children}</>;
};

export default RequireProfile;
