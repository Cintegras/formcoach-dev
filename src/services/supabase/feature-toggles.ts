import {supabase} from '@/integrations/supabase/client';
import {Database} from '@/integrations/supabase/types';
import {Json} from '@/types/supabase';

// Type definitions
type FeatureToggle = Database['public']['Tables']['feature_toggles']['Row'];
type FeatureToggleInsert = Database['public']['Tables']['feature_toggles']['Insert'];
type FeatureToggleUpdate = Database['public']['Tables']['feature_toggles']['Update'];

/**
 * Get a feature toggle by user ID and feature name
 * @param userId - The user's ID
 * @param featureName - The name of the feature
 * @returns The feature toggle or null if not found
 */
export const getFeatureToggle = async (
    userId: string,
    featureName: string
): Promise<FeatureToggle | null> => {
    const {data, error} = await supabase
        .from('feature_toggles')
        .select('*')
        .eq('user_id', userId)
        .eq('feature_name', featureName)
        .maybeSingle();

    if (error) {
        console.error(`Error fetching feature toggle ${featureName}:`, error);
        return null;
    }

    return data;
};

/**
 * Check if a feature is enabled for a user
 * @param userId - The user's ID
 * @param featureName - The name of the feature
 * @returns True if the feature is enabled, false otherwise
 */
export const isFeatureEnabled = async (
    userId: string,
    featureName: string
): Promise<boolean> => {
    const toggle = await getFeatureToggle(userId, featureName);
    return toggle !== null && toggle.is_enabled === true;
};

/**
 * Create or update a feature toggle
 * @param userId - The user's ID
 * @param featureName - The name of the feature
 * @param isEnabled - Whether the feature is enabled
 * @param metadata - Optional metadata for the feature toggle
 * @returns The created or updated feature toggle or null if there was an error
 */
export const setFeatureToggle = async (
    userId: string,
    featureName: string,
    isEnabled: boolean,
    metadata?: Json
): Promise<FeatureToggle | null> => {
    const now = new Date().toISOString();

    const toggle: FeatureToggleInsert = {
        user_id: userId,
        feature_name: featureName,
        is_enabled: isEnabled,
        created_at: now,
        updated_at: now,
        metadata: metadata || null
    };

    const {data, error} = await supabase
        .from('feature_toggles')
        .upsert(toggle, {
            onConflict: 'user_id,feature_name',
            ignoreDuplicates: false
        })
        .select()
        .maybeSingle();

    if (error) {
        console.error(`Error setting feature toggle ${featureName}:`, error);
        return null;
    }

    return data;
};

/**
 * Get the count of workout sessions for a user
 * @param userId - The user's ID
 * @returns The number of workout sessions
 */
export const getWorkoutSessionCount = async (userId: string): Promise<number> => {
    const {count, error} = await supabase
        .from('workout_sessions')
        .select('*', {count: 'exact', head: true})
        .eq('user_id', userId);

    if (error) {
        console.error('Error counting workout sessions:', error);
        return 0;
    }

    return count || 0;
};

/**
 * Update the form_coach_access feature toggle based on workout count
 * @param userId - The user's ID
 * @returns The updated feature toggle or null if there was an error
 */
export const updateFormCoachToggle = async (userId: string): Promise<FeatureToggle | null> => {
    const sessionCount = await getWorkoutSessionCount(userId);
    const featureThreshold = 3;

    if (sessionCount >= featureThreshold) {
        return setFeatureToggle(
            userId,
            'form_coach_access',
            true,
            {reason: '3 workouts', session_count: sessionCount}
        );
    }

    return null;
};

/**
 * Check if form coach access is enabled for a user
 * @param userId - The user's ID
 * @returns True if form coach access is enabled, false otherwise
 */
export const isFormCoachEnabled = async (userId: string): Promise<boolean> => {
    return isFeatureEnabled(userId, 'form_coach_access');
};
