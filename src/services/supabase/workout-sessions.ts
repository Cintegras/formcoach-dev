import {supabase} from '@/integrations/supabase/client';
import {Database} from '@/integrations/supabase/types';
import {getEnvironment} from '@/lib/environment';

// Type definitions
type WorkoutSession = Database['public']['Tables']['workout_sessions']['Row'];
type WorkoutSessionInsert = Database['public']['Tables']['workout_sessions']['Insert'];
type WorkoutSessionUpdate = Database['public']['Tables']['workout_sessions']['Update'];

/**
 * Get all workout sessions for a user
 * @param userId - The user's ID
 * @param limit - Maximum number of sessions to return (default: 50)
 * @param orderBy - Field to order by (default: 'start_time')
 * @param ascending - Order direction (default: false, newest first)
 * @returns Array of workout sessions or empty array if none found
 */
export const getWorkoutSessions = async (
    userId: string,
    limit = 50,
    orderBy = 'start_time',
    ascending = false
): Promise<WorkoutSession[]> => {
    const {data, error} = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', userId)
        .order(orderBy, {ascending})
        .limit(limit);

    if (error) {
        console.error('Error fetching workout sessions:', error);
        return [];
    }

    return data || [];
};

/**
 * Get a workout session by ID
 * @param sessionId - The workout session ID
 * @returns The workout session or null if not found
 */
export const getWorkoutSession = async (sessionId: string): Promise<WorkoutSession | null> => {
    const {data, error} = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('id', sessionId)
        .maybeSingle();

    if (error) {
        console.error('Error fetching workout session:', error);
        return null;
    }

    return data;
};

/**
 * Get the current user's workout sessions
 * @param limit - Maximum number of sessions to return (default: 50)
 * @returns Array of workout sessions or empty array if none found
 */
export const getCurrentUserWorkoutSessions = async (limit = 50): Promise<WorkoutSession[]> => {
    const {data: {user}} = await supabase.auth.getUser();

    if (!user) {
        return [];
    }

    return getWorkoutSessions(user.id, limit);
};

/**
 * Create a new workout session
 * @param session - The workout session data to insert
 * @returns The created workout session or null if there was an error
 */
export const createWorkoutSession = async (
    session: WorkoutSessionInsert
): Promise<WorkoutSession | null> => {
    // Ensure environment is set
    const environment = getEnvironment();

    const {data, error} = await supabase
        .from('workout_sessions')
        .insert({...session, environment})
        .select()
        .maybeSingle();

    if (error) {
        console.error('Error creating workout session:', error);
        return null;
    }

    return data;
};

/**
 * Update a workout session
 * @param sessionId - The workout session ID
 * @param updates - The workout session data to update
 * @returns The updated workout session or null if there was an error
 */
export const updateWorkoutSession = async (
    sessionId: string,
    updates: WorkoutSessionUpdate
): Promise<WorkoutSession | null> => {
    const {data, error} = await supabase
        .from('workout_sessions')
        .update(updates)
        .eq('id', sessionId)
        .select()
        .maybeSingle();

    if (error) {
        console.error('Error updating workout session:', error);
        return null;
    }

    return data;
};

/**
 * Delete a workout session
 * @param sessionId - The workout session ID
 * @returns True if the workout session was deleted successfully, false otherwise
 */
export const deleteWorkoutSession = async (sessionId: string): Promise<boolean> => {
    const {error} = await supabase
        .from('workout_sessions')
        .delete()
        .eq('id', sessionId);

    if (error) {
        console.error('Error deleting workout session:', error);
        return false;
    }

    return true;
};

/**
 * Start a new workout session for the current user
 * @param workoutPlanId - Optional workout plan ID
 * @returns The created workout session or null if there was an error
 */
export const startWorkoutSession = async (workoutPlanId?: string): Promise<WorkoutSession | null> => {
    const {data: {user}} = await supabase.auth.getUser();

    if (!user) {
        console.error('No authenticated user found');
        return null;
    }

    return createWorkoutSession({
        user_id: user.id,
        workout_plan_id: workoutPlanId || null,
        start_time: new Date().toISOString(),
    });
};

/**
 * End a workout session
 * @param sessionId - The workout session ID
 * @param notes - Optional notes about the session
 * @param overallFeeling - Optional rating of how the session felt
 * @returns The updated workout session or null if there was an error
 */
export const endWorkoutSession = async (
    sessionId: string,
    notes?: string,
    overallFeeling?: string
): Promise<WorkoutSession | null> => {
    return updateWorkoutSession(sessionId, {
        end_time: new Date().toISOString(),
        notes,
        overall_feeling: overallFeeling,
    });
};

/**
 * Subscribe to real-time updates for a user's workout sessions
 * @param userId - The user's ID
 * @param callback - Function to call when data changes
 * @returns A function to unsubscribe
 */
export const subscribeToWorkoutSessions = (
    userId: string,
    callback: (session: WorkoutSession, eventType: 'INSERT' | 'UPDATE' | 'DELETE') => void
) => {
    const environment = getEnvironment();

    const subscription = supabase
        .channel('workout_sessions_changes')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'workout_sessions',
                filter: `user_id=eq.${userId} AND environment=eq.${environment}`,
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
