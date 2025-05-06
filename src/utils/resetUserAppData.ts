/**
 * Utility function to safely reset a user's app data in Supabase
 * This function deletes all user-linked records from specific tables
 * and resets profile fields while preserving others.
 *
 * @param userId - The ID of the user whose data should be reset
 * @returns A promise that resolves to true if successful, false otherwise
 */
import {supabase} from '@/integrations/supabase/client';

/**
 * Logs an event to the app_logs table
 * @param userId - The ID of the user associated with the log
 * @param context - The context of the log (e.g., 'resetUserAppData > delete exercise_logs')
 * @param message - The message to log
 * @param level - The log level ('info' or 'error')
 */
export const logEvent = async (
    userId: string,
    context: string,
    message: string,
    level: 'info' | 'error' = 'info'
): Promise<void> => {
    try {
        await supabase.from('app_logs').insert([{user_id: userId, context, message, level}]);
    } catch (error) {
        // Fallback to console if logging fails
        console.error('Failed to log event:', {userId, context, message, level, error});
    }
};

export const resetUserAppData = async (userId: string): Promise<boolean> => {
    if (!userId) {
        console.error('resetUserAppData: No userId provided');
        return false;
    }

    try {
        // Log the start of the operation
        await logEvent(userId, 'resetUserAppData', 'Starting user data reset', 'info');

        // 1. First fetch all necessary IDs
        // Get workout session IDs
        const {data: workoutSessions, error: workoutSessionsError} = await supabase
            .from('workout_sessions')
            .select('id')
            .eq('user_id', userId);

        if (workoutSessionsError) {
            await logEvent(
                userId,
                'resetUserAppData > fetch workout_sessions',
                `Error: ${workoutSessionsError.message}`,
                'error'
            );
            console.error('Error fetching workout_sessions:', workoutSessionsError);
            return false;
        }

        const workoutSessionIds = workoutSessions.map(session => session.id);

        // Get workout plan IDs
        const {data: workoutPlans, error: workoutPlansError} = await supabase
            .from('workout_plans')
            .select('id')
            .eq('user_id', userId);

        if (workoutPlansError) {
            await logEvent(
                userId,
                'resetUserAppData > fetch workout_plans',
                `Error: ${workoutPlansError.message}`,
                'error'
            );
            console.error('Error fetching workout_plans:', workoutPlansError);
            return false;
        }

        const workoutPlanIds = workoutPlans.map(plan => plan.id);

        // Get exercise log IDs
        const {data: exerciseLogs, error: exerciseLogsQueryError} = await supabase
            .from('exercise_logs')
            .select('id')
            .in('workout_session_id', workoutSessionIds.length > 0 ? workoutSessionIds : ['no-sessions']);

        if (exerciseLogsQueryError) {
            await logEvent(
                userId,
                'resetUserAppData > fetch exercise_logs',
                `Error: ${exerciseLogsQueryError.message}`,
                'error'
            );
            console.error('Error fetching exercise_logs:', exerciseLogsQueryError);
            return false;
        }

        const exerciseLogIds = exerciseLogs.map(log => log.id);

        // 2. Delete records in order to respect foreign key constraints

        // Delete form_analyses (depends on exercise_logs)
        if (exerciseLogIds.length > 0) {
            const {error: formAnalysesError} = await supabase
                .from('form_analyses')
                .delete()
                .in('exercise_log_id', exerciseLogIds);

            if (formAnalysesError) {
                await logEvent(
                    userId,
                    'resetUserAppData > delete form_analyses',
                    `Error: ${formAnalysesError.message}`,
                    'error'
                );
                console.error('Error deleting form_analyses:', formAnalysesError);
                return false;
            }

            await logEvent(userId, 'resetUserAppData > delete form_analyses', 'Successfully deleted form analyses');
        }

        // Delete exercise_logs (depends on workout_sessions)
        if (workoutSessionIds.length > 0) {
            const {error: exerciseLogsError} = await supabase
                .from('exercise_logs')
                .delete()
                .in('workout_session_id', workoutSessionIds);

            if (exerciseLogsError) {
                await logEvent(
                    userId,
                    'resetUserAppData > delete exercise_logs',
                    `Error: ${exerciseLogsError.message}`,
                    'error'
                );
                console.error('Error deleting exercise_logs:', exerciseLogsError);
                return false;
            }

            await logEvent(userId, 'resetUserAppData > delete exercise_logs', 'Successfully deleted exercise logs');
        }

        // Delete workout_plan_exercises (depends on workout_plans)
        if (workoutPlanIds.length > 0) {
            const {error: workoutPlanExercisesError} = await supabase
                .from('workout_plan_exercises')
                .delete()
                .in('workout_plan_id', workoutPlanIds);

            if (workoutPlanExercisesError) {
                await logEvent(
                    userId,
                    'resetUserAppData > delete workout_plan_exercises',
                    `Error: ${workoutPlanExercisesError.message}`,
                    'error'
                );
                console.error('Error deleting workout_plan_exercises:', workoutPlanExercisesError);
                return false;
            }

            await logEvent(userId, 'resetUserAppData > delete workout_plan_exercises', 'Successfully deleted workout plan exercises');
        }

        // Delete workout_sessions (depends on user_id)
        const {error: workoutSessionsDeleteError} = await supabase
            .from('workout_sessions')
            .delete()
            .eq('user_id', userId);

        if (workoutSessionsDeleteError) {
            await logEvent(
                userId,
                'resetUserAppData > delete workout_sessions',
                `Error: ${workoutSessionsDeleteError.message}`,
                'error'
            );
            console.error('Error deleting workout_sessions:', workoutSessionsDeleteError);
            return false;
        }

        await logEvent(userId, 'resetUserAppData > delete workout_sessions', 'Successfully deleted workout sessions');

        // Delete workout_plans (depends on user_id)
        const {error: workoutPlansDeleteError} = await supabase
            .from('workout_plans')
            .delete()
            .eq('user_id', userId);

        if (workoutPlansDeleteError) {
            await logEvent(
                userId,
                'resetUserAppData > delete workout_plans',
                `Error: ${workoutPlansDeleteError.message}`,
                'error'
            );
            console.error('Error deleting workout_plans:', workoutPlansDeleteError);
            return false;
        }

        await logEvent(userId, 'resetUserAppData > delete workout_plans', 'Successfully deleted workout plans');

        // Delete feature_toggles (depends on user_id)
        const {error: featureTogglesError} = await supabase
            .from('feature_toggles')
            .delete()
            .eq('user_id', userId);

        if (featureTogglesError) {
            await logEvent(
                userId,
                'resetUserAppData > delete feature_toggles',
                `Error: ${featureTogglesError.message}`,
                'error'
            );
            console.error('Error deleting feature_toggles:', featureTogglesError);
            return false;
        }

        await logEvent(userId, 'resetUserAppData > delete feature_toggles', 'Successfully deleted feature toggles');

        // Delete progress_metrics (depends on user_id)
        const {error: progressMetricsError} = await supabase
            .from('progress_metrics')
            .delete()
            .eq('user_id', userId);

        if (progressMetricsError) {
            await logEvent(
                userId,
                'resetUserAppData > delete progress_metrics',
                `Error: ${progressMetricsError.message}`,
                'error'
            );
            console.error('Error deleting progress_metrics:', progressMetricsError);
            return false;
        }

        await logEvent(userId, 'resetUserAppData > delete progress_metrics', 'Successfully deleted progress metrics');

        // Update profiles - reset specific fields while preserving others
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
            await logEvent(
                userId,
                'resetUserAppData > update profile',
                `Error: ${profilesError.message}`,
                'error'
            );
            console.error('Error updating profile:', profilesError);
            return false;
        }

        await logEvent(userId, 'resetUserAppData > update profile', 'Successfully reset profile fields');

        // Log successful completion
        await logEvent(
            userId,
            'resetUserAppData',
            'User data reset completed successfully',
            'info'
        );

        return true;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        await logEvent(
            userId,
            'resetUserAppData',
            `Unexpected error: ${errorMessage}`,
            'error'
        );
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
