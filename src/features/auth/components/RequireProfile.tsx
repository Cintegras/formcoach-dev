import React from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {useProfile} from '@/hooks/useProfile';
import LoadingIndicator from '@/components/LoadingIndicator';

interface RequireProfileProps {
    children: React.ReactNode;
}

const RequireProfile: React.FC<RequireProfileProps> = ({children}) => {
    const {profile, loading, error} = useProfile();
    const location = useLocation();

    if (loading) {
        return <LoadingIndicator fullScreen text="Loading profile..."/>;
    }

    if (error) {
        console.error("Profile error:", error);
        return <Navigate to="/error" state={{error: "Failed to load profile"}}/>;
    }

    if (!profile) {
        // Redirect to profile setup and save the location they were trying to access
        return <Navigate to="/profile-setup" state={{from: location}} replace/>;
    }

    return <>{children}</>;
};

export default RequireProfile;