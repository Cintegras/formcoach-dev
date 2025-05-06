import {useCallback, useEffect, useState} from 'react';
import {useAuth} from '@/features/auth/hooks/useAuth';
import {
    getWorkoutSessionCount,
    isFeatureEnabled,
    isFormCoachEnabled,
    setFeatureToggle,
    updateFormCoachToggle
} from '@/services/supabase/feature-toggles';
import {Json} from '@/types/supabase';

/**
 * Hook for managing feature toggles
 */
export function useFeatureToggles() {
    const {user} = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [formCoachEnabled, setFormCoachEnabled] = useState<boolean>(false);
    const [workoutCount, setWorkoutCount] = useState<number>(0);

    /**
     * Check if a feature is enabled for the current user
     */
    const checkFeatureEnabled = useCallback(async (featureName: string): Promise<boolean> => {
        if (!user) return false;

        setLoading(true);
        setError(null);

        try {
            const isEnabled = await isFeatureEnabled(user.id, featureName);
            return isEnabled;
        } catch (err) {
            const error = err instanceof Error ? err : new Error(`Failed to check if ${featureName} is enabled`);
            setError(error);
            console.error(`Error checking if ${featureName} is enabled:`, err);
            return false;
        } finally {
            setLoading(false);
        }
    }, [user]);

    /**
     * Set a feature toggle for the current user
     */
    const setFeature = useCallback(async (
        featureName: string,
        isEnabled: boolean,
        metadata?: Json
    ) => {
        if (!user) return null;

        setLoading(true);
        setError(null);

        try {
            const result = await setFeatureToggle(user.id, featureName, isEnabled, metadata);
            return result;
        } catch (err) {
            const error = err instanceof Error ? err : new Error(`Failed to set ${featureName}`);
            setError(error);
            console.error(`Error setting ${featureName}:`, err);
            return null;
        } finally {
            setLoading(false);
        }
    }, [user]);

    /**
     * Check if form coach access is enabled for the current user
     */
    const checkFormCoachEnabled = useCallback(async (): Promise<boolean> => {
        if (!user) return false;

        setLoading(true);
        setError(null);

        try {
            const isEnabled = await isFormCoachEnabled(user.id);
            setFormCoachEnabled(isEnabled);
            return isEnabled;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to check if form coach is enabled');
            setError(error);
            console.error('Error checking if form coach is enabled:', err);
            return false;
        } finally {
            setLoading(false);
        }
    }, [user]);

    /**
     * Update the form coach access toggle based on workout count
     */
    const updateFormCoachAccess = useCallback(async () => {
        if (!user) return null;

        setLoading(true);
        setError(null);

        try {
            const result = await updateFormCoachToggle(user.id);
            if (result) {
                setFormCoachEnabled(true);
            }
            return result;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to update form coach access');
            setError(error);
            console.error('Error updating form coach access:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, [user]);

    /**
     * Get the workout count for the current user
     */
    const fetchWorkoutCount = useCallback(async () => {
        if (!user) return 0;

        setLoading(true);
        setError(null);

        try {
            const count = await getWorkoutSessionCount(user.id);
            setWorkoutCount(count);
            return count;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to get workout count');
            setError(error);
            console.error('Error getting workout count:', err);
            return 0;
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Check if form coach is enabled when the user changes
    useEffect(() => {
        if (user) {
            checkFormCoachEnabled();
            fetchWorkoutCount();
        }
    }, [user, checkFormCoachEnabled, fetchWorkoutCount]);

    return {
        loading,
        error,
        formCoachEnabled,
        workoutCount,
        checkFeatureEnabled,
        setFeature,
        checkFormCoachEnabled,
        updateFormCoachAccess,
        fetchWorkoutCount
    };
}