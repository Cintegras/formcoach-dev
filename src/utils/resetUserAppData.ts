/**
 * Utility function to safely reset a user's app data in Supabase
 * This function deletes all user-linked records from specific tables
 * and resets profile fields while preserving others.
 *
 * @param userId - The ID of the user whose data should be reset
 * @param allowTestUsers - Optional flag to allow resetting test users (default: false)
 * @returns A promise that resolves to true if successful, false otherwise
 */
import {supabase} from '@/integrations/supabase/client';

// Define log level enum for better type safety
enum LogLevel {
    INFO = 'info',
    ERROR = 'error',
}

// Interface for log entry data
interface LogEventData {
    userId: string;
    context: string;
    message: string;
    level?: LogLevel;
}

/**
 * Logs an event to the application logging system
 * @param eventData The event data to log
 */
export const logEvent = async (eventData: LogEventData): Promise<void> => {
    const {userId, context, message, level = LogLevel.INFO} = eventData;

    try {
        await (supabase as any)
            .from('app_logs')
            .insert([{user_id: userId, context, message, level}]);
        // Temporary workaround if app_logs is not in Database type:
        // await (supabase as any).from('app_logs').insert([{ user_id: userId, context, message, level }]);
    } catch (error) {
        handleLoggingError(error, {userId, context, message, level});
    }
};

/**
 * Handles errors that occur during logging
 */
const handleLoggingError = (error: unknown, logData: LogEventData): void => {
    console.error('Failed to log event:', {
        ...logData,
        error: error instanceof Error ? error.message : 'Unknown error',
    });
};

export const resetUserAppData = async (userId: string, allowTestUsers: boolean = false): Promise<boolean> => {
    if (!userId) {
        console.error('resetUserAppData: No userId provided');
        return false;
    }

    try {
        // Clear profile_complete flag from localStorage to ensure user goes through welcome flow
        localStorage.removeItem("profile_complete");

        // Log the start of the operation
        await logEvent({
            userId,
            context: 'resetUserAppData',
            message: `Starting user data reset (allowTestUsers: ${allowTestUsers})`,
            level: LogLevel.INFO,
        });

        // Check if user is a test user (has tester_description)
        const {data: profile, error: profileError} = await supabase
            .from('profiles')
            .select('tester_description')
            .eq('id', userId)
            .single();

        if (profileError) {
            await logEvent({
                userId,
                context: 'resetUserAppData > check profile',
                message: `Error checking profile: ${profileError.message}`,
                level: LogLevel.ERROR,
            });
            console.error('Error checking profile:', profileError);
            return false;
        }

        if (profile.tester_description && !allowTestUsers) {
            await logEvent({
                userId,
                context: 'resetUserAppData',
                message: 'Skipping reset: User is a test user with tester_description',
                level: LogLevel.INFO,
            });
            console.warn(`resetUserAppData: Skipping test user ${userId}`);
            return false;
        }

        // Initialize counters for logging deleted records
        let deletedCounts = {
            form_analyses: 0,
            exercise_logs: 0,
            workout_plan_exercises: 0,
            workout_sessions: 0,
            workout_plans: 0,
            feature_toggles: 0,
            progress_metrics: 0,
        };

        // 1. Fetch necessary IDs
        // Get workout session IDs
        const {data: workoutSessions, error: workoutSessionsError} = await supabase
            .from('workout_sessions')
            .select('id')
            .eq('user_id', userId);

        if (workoutSessionsError) {
            await logEvent({
                userId,
                context: 'resetUserAppData > fetch workout_sessions',
                message: `Error: ${workoutSessionsError.message}`,
                level: LogLevel.ERROR,
            });
            console.error('Error fetching workout_sessions:', workoutSessionsError);
            return false;
        }

        const workoutSessionIds = workoutSessions?.map((session) => session.id) || [];

        // Get workout plan IDs
        const {data: workoutPlans, error: workoutPlansError} = await supabase
            .from('workout_plans')
            .select('id')
            .eq('user_id', userId);

        if (workoutPlansError) {
            await logEvent({
                userId,
                context: 'resetUserAppData > fetch workout_plans',
                message: `Error: ${workoutPlansError.message}`,
                level: LogLevel.ERROR,
            });
            console.error('Error fetching workout_plans:', workoutPlansError);
            return false;
        }

        const workoutPlanIds = workoutPlans?.map((plan) => plan.id) || [];

        // Get exercise log IDs
        let exerciseLogIds: string[] = [];
        if (workoutSessionIds.length > 0) {
            const {data: exerciseLogs, error: exerciseLogsQueryError} = await supabase
                .from('exercise_logs')
                .select('id')
                .in('workout_session_id', workoutSessionIds);

            if (exerciseLogsQueryError) {
                await logEvent({
                    userId,
                    context: 'resetUserAppData > fetch exercise_logs',
                    message: `Error: ${exerciseLogsQueryError.message}`,
                    level: LogLevel.ERROR,
                });
                console.error('Error fetching exercise_logs:', exerciseLogsQueryError);
                return false;
            }

            exerciseLogIds = exerciseLogs?.map((log) => log.id) || [];
        } else {
            await logEvent({
                userId,
                context: 'resetUserAppData > fetch exercise_logs',
                message: 'No workout sessions found — skipping exercise logs fetch',
                level: LogLevel.INFO,
            });
        }

        // 2. Delete records in order to respect foreign key constraints

        // Delete form_analyses
        if (exerciseLogIds.length > 0) {
            const {count, error: formAnalysesError} = await supabase
                .from('form_analyses')
                .delete({count: 'exact'})
                .in('exercise_log_id', exerciseLogIds);

            if (formAnalysesError) {
                await logEvent({
                    userId,
                    context: 'resetUserAppData > delete form_analyses',
                    message: `Error: ${formAnalysesError.message}`,
                    level: LogLevel.ERROR,
                });
                console.error('Error deleting form_analyses:', formAnalysesError);
                return false;
            }

            deletedCounts.form_analyses = count || 0;
            await logEvent({
                userId,
                context: 'resetUserAppData > delete form_analyses',
                message: `Successfully deleted ${deletedCounts.form_analyses} form analyses`,
                level: LogLevel.INFO,
            });
        } else {
            await logEvent({
                userId,
                context: 'resetUserAppData > delete form_analyses',
                message: 'No exercise logs found — skipping deletion',
                level: LogLevel.INFO,
            });
        }

        // Delete exercise_logs
        if (workoutSessionIds.length > 0) {
            const {count, error: exerciseLogsError} = await supabase
                .from('exercise_logs')
                .delete({count: 'exact'})
                .in('workout_session_id', workoutSessionIds);

            if (exerciseLogsError) {
                await logEvent({
                    userId,
                    context: 'resetUserAppData > delete exercise_logs',
                    message: `Error: ${exerciseLogsError.message}`,
                    level: LogLevel.ERROR,
                });
                console.error('Error deleting exercise_logs:', exerciseLogsError);
                return false;
            }

            deletedCounts.exercise_logs = count || 0;
            await logEvent({
                userId,
                context: 'resetUserAppData > delete exercise_logs',
                message: `Successfully deleted ${deletedCounts.exercise_logs} exercise logs`,
                level: LogLevel.INFO,
            });
        } else {
            await logEvent({
                userId,
                context: 'resetUserAppData > delete exercise_logs',
                message: 'No workout sessions found — skipping deletion',
                level: LogLevel.INFO,
            });
        }

        // Delete workout_plan_exercises
        if (workoutPlanIds.length > 0) {
            const {count, error: workoutPlanExercisesError} = await supabase
                .from('workout_plan_exercises')
                .delete({count: 'exact'})
                .in('workout_plan_id', workoutPlanIds);

            if (workoutPlanExercisesError) {
                await logEvent({
                    userId,
                    context: 'resetUserAppData > delete workout_plan_exercises',
                    message: `Error: ${workoutPlanExercisesError.message}`,
                    level: LogLevel.ERROR,
                });
                console.error('Error deleting workout_plan_exercises:', workoutPlanExercisesError);
                return false;
            }

            deletedCounts.workout_plan_exercises = count || 0;
            await logEvent({
                userId,
                context: 'resetUserAppData > delete workout_plan_exercises',
                message: `Successfully deleted ${deletedCounts.workout_plan_exercises} workout plan exercises`,
                level: LogLevel.INFO,
            });
        } else {
            await logEvent({
                userId,
                context: 'resetUserAppData > delete workout_plan_exercises',
                message: 'No workout plans found — skipping deletion',
                level: LogLevel.INFO,
            });
        }

        // Delete workout_sessions
        const {count: sessionsCount, error: workoutSessionsDeleteError} = await supabase
            .from('workout_sessions')
            .delete({count: 'exact'})
            .eq('user_id', userId);

        if (workoutSessionsDeleteError) {
            await logEvent({
                userId,
                context: 'resetUserAppData > delete workout_sessions',
                message: `Error: ${workoutSessionsDeleteError.message}`,
                level: LogLevel.ERROR,
            });
            console.error('Error deleting workout_sessions:', workoutSessionsDeleteError);
            return false;
        }

        deletedCounts.workout_sessions = sessionsCount || 0;
        await logEvent({
            userId,
            context: 'resetUserAppData > delete workout_sessions',
            message: `Successfully deleted ${deletedCounts.workout_sessions} workout sessions`,
            level: LogLevel.INFO,
        });

        // Delete workout_plans
        const {count: plansCount, error: workoutPlansDeleteError} = await supabase
            .from('workout_plans')
            .delete({count: 'exact'})
            .eq('user_id', userId);

        if (workoutPlansDeleteError) {
            await logEvent({
                userId,
                context: 'resetUserAppData > delete workout_plans',
                message: `Error: ${workoutPlansDeleteError.message}`,
                level: LogLevel.ERROR,
            });
            console.error('Error deleting workout_plans:', workoutPlansDeleteError);
            return false;
        }

        deletedCounts.workout_plans = plansCount || 0;
        await logEvent({
            userId,
            context: 'resetUserAppData > delete workout_plans',
            message: `Successfully deleted ${deletedCounts.workout_plans} workout plans`,
            level: LogLevel.INFO,
        });

        // Delete feature_toggles
        const {count: togglesCount, error: featureTogglesError} = await supabase
            .from('feature_toggles')
            .delete({count: 'exact'})
            .eq('user_id', userId);

        if (featureTogglesError) {
            await logEvent({
                userId,
                context: 'resetUserAppData > delete feature_toggles',
                message: `Error: ${featureTogglesError.message}`,
                level: LogLevel.ERROR,
            });
            console.error('Error deleting feature_toggles:', featureTogglesError);
            return false;
        }

        deletedCounts.feature_toggles = togglesCount || 0;
        await logEvent({
            userId,
            context: 'resetUserAppData > delete feature_toggles',
            message: `Successfully deleted ${deletedCounts.feature_toggles} feature toggles`,
            level: LogLevel.INFO,
        });

        // Delete progress_metrics
        const {count: metricsCount, error: progressMetricsError} = await supabase
            .from('progress_metrics')
            .delete({count: 'exact'})
            .eq('user_id', userId);

        if (progressMetricsError) {
            await logEvent({
                userId,
                context: 'resetUserAppData > delete progress_metrics',
                message: `Error: ${progressMetricsError.message}`,
                level: LogLevel.ERROR,
            });
            console.error('Error deleting progress_metrics:', progressMetricsError);
            return false;
        }

        deletedCounts.progress_metrics = metricsCount || 0;
        await logEvent({
            userId,
            context: 'resetUserAppData > delete progress_metrics',
            message: `Successfully deleted ${deletedCounts.progress_metrics} progress metrics`,
            level: LogLevel.INFO,
        });

        // Update profiles - reset specific fields while preserving others
        const {error: profilesError} = await supabase
            .from('profiles')
            .update({
                username: undefined, // Changed to undefined for string | undefined
                full_name: undefined, // Changed to undefined for string | undefined
                avatar_url: undefined, // Changed to undefined for string | undefined
                height: null, // Numeric, allows null
                fitness_level: null, // Text, allows null
                goals: null, // text[], allows null
                birthdate: undefined, // Changed to undefined for string | undefined
                // Preserve user_type and tester_description
            })
            .eq('id', userId);

        if (profilesError) {
            await logEvent({
                userId,
                context: 'resetUserAppData > update profile',
                message: `Error: ${profilesError.message}`,
                level: LogLevel.ERROR,
            });
            console.error('Error updating profile:', profilesError);
            return false;
        }

        await logEvent({
            userId,
            context: 'resetUserAppData > update profile',
            message: 'Successfully reset profile fields',
            level: LogLevel.INFO,
        });

        // Log summary of deleted records
        await logEvent({
            userId,
            context: 'resetUserAppData',
            message: `User data reset completed successfully. Deleted records: ${JSON.stringify(deletedCounts)}`,
            level: LogLevel.INFO,
        });

        return true;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        await logEvent({
            userId,
            context: 'resetUserAppData',
            message: `Unexpected error: ${errorMessage}`,
            level: LogLevel.ERROR,
        });
        console.error('Error in resetUserAppData:', error);
        return false;
    }
};
