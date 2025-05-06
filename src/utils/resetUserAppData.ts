/**
 * Utility function to safely reset a user's app data in Supabase
 * This function deletes all user-linked records from specific tables
 * and resets profile fields while preserving others.
 *
 * @param userId - The ID of the user whose data should be reset
 * @returns A promise that resolves to true if successful, false otherwise
 */
import {supabase} from '@/integrations/supabase/client';

export const resetUserAppData = async (userId: string): Promise<boolean> => {
    if (!userId) {
        console.error('resetUserAppData: No userId provided');
        return false;
    }

    try {
        // Delete records from tables in order to respect foreign key constraints

        // 1. First delete form_analyses (depends on exercise_logs)
        const {error: formAnalysesError} = await supabase
            .from('form_analyses')
            .delete()
            .in('exercise_log_id',
                supabase
                    .from('exercise_logs')
                    .select('id')
                    .in('workout_session_id',
                        supabase
                            .from('workout_sessions')
                            .select('id')
                            .eq('user_id', userId)
                    )
            );

        if (formAnalysesError) {
            console.error('Error deleting form_analyses:', formAnalysesError);
            return false;
        }

        // 2. Delete exercise_logs (depends on workout_sessions)
        const {error: exerciseLogsError} = await supabase
            .from('exercise_logs')
            .delete()
            .in('workout_session_id',
                supabase
                    .from('workout_sessions')
                    .select('id')
                    .eq('user_id', userId)
            );

        if (exerciseLogsError) {
            console.error('Error deleting exercise_logs:', exerciseLogsError);
            return false;
        }

        // 3. Delete workout_plan_exercises (depends on workout_plans)
        const {error: workoutPlanExercisesError} = await supabase
            .from('workout_plan_exercises')
            .delete()
            .in('workout_plan_id',
                supabase
                    .from('workout_plans')
                    .select('id')
                    .eq('user_id', userId)
            );

        if (workoutPlanExercisesError) {
            console.error('Error deleting workout_plan_exercises:', workoutPlanExercisesError);
            return false;
        }

        // 4. Delete workout_sessions (depends on user_id)
        const {error: workoutSessionsError} = await supabase
            .from('workout_sessions')
            .delete()
            .eq('user_id', userId);

        if (workoutSessionsError) {
            console.error('Error deleting workout_sessions:', workoutSessionsError);
            return false;
        }

        // 5. Delete workout_plans (depends on user_id)
        const {error: workoutPlansError} = await supabase
            .from('workout_plans')
            .delete()
            .eq('user_id', userId);

        if (workoutPlansError) {
            console.error('Error deleting workout_plans:', workoutPlansError);
            return false;
        }

        // 6. Delete feature_toggles (depends on user_id)
        const {error: featureTogglesError} = await supabase
            .from('feature_toggles')
            .delete()
            .eq('user_id', userId);

        if (featureTogglesError) {
            console.error('Error deleting feature_toggles:', featureTogglesError);
            return false;
        }

        // 7. Delete progress_metrics (depends on user_id)
        const {error: progressMetricsError} = await supabase
            .from('progress_metrics')
            .delete()
            .eq('user_id', userId);

        if (progressMetricsError) {
            console.error('Error deleting progress_metrics:', progressMetricsError);
            return false;
        }

        // 8. Update profiles - reset specific fields while preserving others
        const {error: profilesError} = await supabase
            .from('profiles')
            .update({
                username: null,
                full_name: null,
                avatar_url: null,
                height: null,
                fitness_level: null,
                goals: null,
                birthdate: null,
                // Preserve user_type and tester_description
            })
            .eq('id', userId);

        if (profilesError) {
            console.error('Error updating profile:', profilesError);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error in resetUserAppData:', error);
        return false;
    }
};

/**
 * Example usage in ProfilePage.tsx:
 *
 * import { resetUserAppData } from '@/utils/resetUserAppData';
 *
 * const handleClearCache = async () => {
 *   setIsClearCacheDialogOpen(false);
 *
 *   // Show loading toast
 *   toast({
 *     title: "Clearing data...",
 *     description: "Please wait while we reset your app data.",
 *   });
 *
 *   try {
 *     // First reset server-side data if user is logged in
 *     if (user) {
 *       const success = await resetUserAppData(user.id);
 *       if (!success) {
 *         console.warn("Failed to reset user app data");
 *       }
 *     }
 *
 *     // Then clear localStorage
 *     localStorage.clear();
 *
 *     toast({
 *       title: "Data Cleared",
 *       description: "All app data has been reset. Redirecting to login...",
 *     });
 *
 *     // Redirect to login
 *     setTimeout(() => {
 *       navigate('/login');
 *     }, 1500);
 *   } catch (error) {
 *     console.error("Error clearing data:", error);
 *     toast({
 *       title: "Error",
 *       description: "There was a problem clearing your data. Please try again.",
 *       variant: "destructive",
 *     });
 *   }
 * };
 */
