import {supabase} from '@/integrations/supabase/client';
import {Database} from '@/integrations/supabase/types';
import {getEnvironment} from '@/lib/environment';

// Import types from our types directory
import {ExerciseLog, ExerciseLogInsert, ExerciseLogUpdate} from './types/exercise-logs';

// Type definitions
// type ExerciseLog = Database['public']['Tables']['exercise_logs']['Row'];
// type ExerciseLogInsert = Database['public']['Tables']['exercise_logs']['Insert'];
// type ExerciseLogUpdate = Database['public']['Tables']['exercise_logs']['Update'];

/**
 * Get all exercise logs for a workout session
 * @param sessionId - The workout session ID
 * @returns Array of exercise logs or empty array if none found
 */
export const getExerciseLogs = async (sessionId: string): Promise<ExerciseLog[]> => {
    const {data, error} = await supabase
        .from('exercise_logs')
        .select('*')
        .eq('workout_session_id', sessionId)
        .order('created_at', {ascending: true});

    if (error) {
        console.error('Error fetching exercise logs:', error);
        return [];
    }

    return data || [];
};

/**
 * Get an exercise log by ID
 * @param logId - The exercise log ID
 * @returns The exercise log or null if not found
 */
export const getExerciseLog = async (logId: string): Promise<ExerciseLog | null> => {
    const {data, error} = await supabase
        .from('exercise_logs')
        .select('*')
        .eq('id', logId)
        .single();

    if (error) {
        console.error('Error fetching exercise log:', error);
        return null;
    }

    return data;
};

/**
 * Create a new exercise log
 * @param log - The exercise log data to insert
 * @returns The created exercise log or null if there was an error
 */
export const createExerciseLog = async (log: ExerciseLogInsert): Promise<ExerciseLog | null> => {
    // Ensure environment is set
    const environment = getEnvironment();

    const {data, error} = await supabase
        .from('exercise_logs')
        .insert({...log, environment})
        .select()
        .single();

    if (error) {
        console.error('Error creating exercise log:', error);
        return null;
    }

    return data;
};

/**
 * Update an exercise log
 * @param logId - The exercise log ID
 * @param updates - The exercise log data to update
 * @returns The updated exercise log or null if there was an error
 */
export const updateExerciseLog = async (
    logId: string,
    updates: ExerciseLogUpdate
): Promise<ExerciseLog | null> => {
    const {data, error} = await supabase
        .from('exercise_logs')
        .update(updates)
        .eq('id', logId)
        .select()
        .single();

    if (error) {
        console.error('Error updating exercise log:', error);
        return null;
    }

    return data;
};

/**
 * Delete an exercise log
 * @param logId - The exercise log ID
 * @returns True if the exercise log was deleted successfully, false otherwise
 */
export const deleteExerciseLog = async (logId: string): Promise<boolean> => {
    const {error} = await supabase
        .from('exercise_logs')
        .delete()
        .eq('id', logId);

    if (error) {
        console.error('Error deleting exercise log:', error);
        return false;
    }

    return true;
};

/**
 * Log a completed exercise for a workout session
 * @param workoutSessionId - The workout session ID
 * @param exerciseId - The exercise ID
 * @param setsCompleted - Number of sets completed
 * @param repsCompleted - Array of reps completed for each set
 * @param weightsUsed - Array of weights used for each set
 * @param videoUrl - Optional URL to a video of the exercise
 * @returns The created exercise log or null if there was an error
 */
export const logExercise = async (
    workoutSessionId: string,
    exerciseId: string,
    setsCompleted: number,
    repsCompleted: number[],
    weightsUsed: number[],
    videoUrl?: string
): Promise<ExerciseLog | null> => {
    return createExerciseLog({
        workout_session_id: workoutSessionId,
        exercise_id: exerciseId,
        sets_completed: setsCompleted,
        reps_completed: repsCompleted,
        weights_used: weightsUsed,
        video_url: videoUrl,
    });
};

/**
 * Add form feedback to an exercise log
 * @param logId - The exercise log ID
 * @param feedback - Feedback on the exercise form
 * @param sorenessRating - Optional rating of soreness (1-10)
 * @returns The updated exercise log or null if there was an error
 */
export const addFormFeedback = async (
    logId: string,
    feedback: string,
    sorenessRating?: number
): Promise<ExerciseLog | null> => {
    return updateExerciseLog(logId, {
        form_feedback: feedback,
        soreness_rating: sorenessRating,
    });
};

/**
 * Subscribe to real-time updates for exercise logs in a workout session
 * @param sessionId - The workout session ID
 * @param callback - Function to call when data changes
 * @returns A function to unsubscribe
 */
export const subscribeToExerciseLogs = (
    sessionId: string,
    callback: (log: ExerciseLog, eventType: 'INSERT' | 'UPDATE' | 'DELETE') => void
) => {
    const environment = getEnvironment();

    const subscription = supabase
        .channel('exercise_logs_changes')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'exercise_logs',
                filter: `workout_session_id=eq.${sessionId} AND environment=eq.${environment}`,
            },
            (payload) => {
                // @ts-ignore - payload.new and payload.old types are not properly defined
                callback(payload.new || payload.old, payload.eventType);
            }
        )
        .subscribe();

    // Return unsubscribe function
    return () => {
        supabase.removeChannel(subscription);
    };
};

/**
 * Get all exercise logs for a user across all workout sessions
 * @param userId - The user's ID
 * @param limit - Maximum number of logs to return (default: 100)
 * @returns Array of exercise logs or empty array if none found
 */
export const getUserExerciseLogs = async (
    userId: string,
    limit = 100
): Promise<ExerciseLog[]> => {
    const {data, error} = await supabase
        .from('exercise_logs')
        .select('*, workout_sessions!inner(*)')
        .eq('workout_sessions.user_id', userId)
        .order('created_at', {ascending: false})
        .limit(limit);

    if (error) {
        console.error('Error fetching user exercise logs:', error);
        return [];
    }

    // Filter out the workout_sessions join data
    return (data || []).map(item => {
        const {workout_sessions, ...log} = item;
        return log as unknown as ExerciseLog;
    });
};
