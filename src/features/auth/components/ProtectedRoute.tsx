import React from 'react';
import {Navigate, Outlet, useLocation} from 'react-router-dom';
import {useAuth} from '../hooks/useAuth';

/**
 * A component that protects routes by checking if the user is authenticated.
 * If the user is not authenticated, they are redirected to the login page.
 */
export const ProtectedRoute: React.FC = () => {
    const {user, loading} = useAuth();
    const location = useLocation();

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin w-8 h-8 border-4 border-t-transparent border-[#00C4B4] rounded-full"></div>
            </div>
        );
    }

    // If not authenticated, redirect to login with the current location as the redirect target
    if (!user) {
        return <Navigate to="/login" state={{from: location}} replace/>;
    }

    // If authenticated, render the child routes
    return <Outlet/>;
};

export default ProtectedRoute;