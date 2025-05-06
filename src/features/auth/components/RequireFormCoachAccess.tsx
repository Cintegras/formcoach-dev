import React, {useEffect, useState} from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {useFeatureToggles} from '@/hooks/useFeatureToggles';
import LoadingIndicator from '@/components/LoadingIndicator';

interface RequireFormCoachAccessProps {
    children: React.ReactNode;
}

const RequireFormCoachAccess: React.FC<RequireFormCoachAccessProps> = ({children}) => {
    const {
        formCoachEnabled,
        workoutCount,
        loading,
        error,
        checkFormCoachEnabled,
        updateFormCoachAccess,
        fetchWorkoutCount
    } = useFeatureToggles();
    const location = useLocation();
    const [shouldRedirect, setShouldRedirect] = useState(false);

    useEffect(() => {
        // First check if the feature is already enabled
        const checkAccess = async () => {
            const isEnabled = await checkFormCoachEnabled();

            if (!isEnabled) {
                // If not enabled, check workout count and update if needed
                const count = await fetchWorkoutCount();

                if (count >= 3) {
                    // If user has 3+ workouts, enable the feature
                    await updateFormCoachAccess();
                } else {
                    // Not enough workouts, should redirect
                    setShouldRedirect(true);
                }
            }
        };

        checkAccess();
    }, [checkFormCoachEnabled, updateFormCoachAccess, fetchWorkoutCount]);

    if (loading) {
        return <LoadingIndicator fullScreen text="Checking access..."/>;
    }

    if (error) {
        console.error("Feature toggle error:", error);
        return <Navigate to="/error" state={{error: "Failed to check feature access"}}/>;
    }

    if (shouldRedirect) {
        // Redirect to home page with a message about needing more workouts
        return <Navigate to="/" state={{
            message: "Complete 3 workouts to unlock the Trends feature",
            from: location
        }} replace/>;
    }

    return <>{children}</>;
};

export default RequireFormCoachAccess;