import React from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {useProfile} from '@/hooks/useProfile';
import LoadingIndicator from '@/components/LoadingIndicator';

interface RedirectIfProfileExistsProps {
    children: React.ReactNode;
    redirectTo?: string;
}

const RedirectIfProfileExists: React.FC<RedirectIfProfileExistsProps> = ({
                                                                             children,
                                                                             redirectTo = "/"
                                                                         }) => {
    const {profile, loading, error} = useProfile();
    const location = useLocation();

    // Get the intended destination (if any)
    const from = location.state?.from?.pathname || redirectTo;

    if (loading) {
        return <LoadingIndicator fullScreen text="Checking profile..."/>;
    }

    if (error) {
        console.error("Profile error:", error);
        return <Navigate to="/error" state={{error: "Failed to check profile"}}/>;
    }

    if (profile) {
        // If profile exists, redirect to the intended destination or home
        return <Navigate to={from} replace/>;
    }

    return <>{children}</>;
};

export default RedirectIfProfileExists;