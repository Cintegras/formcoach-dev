import {supabase} from '@/integrations/supabase/client';
import {Database} from '@/integrations/supabase/types';
import {getEnvironment} from '@/lib/environment';
import {WorkoutPlan, WorkoutPlanExercise, WorkoutPlanExerciseInsert, WorkoutPlanExerciseUpdate, WorkoutPlanInsert, WorkoutPlanUpdate} from './types/workout-plans';

// Type definitions
// type WorkoutPlan = Database['public']['Tables']['workout_plans']['Row'];
// type WorkoutPlanInsert = Database['public']['Tables']['workout_plans']['Insert'];
// type WorkoutPlanUpdate = Database['public']['Tables']['workout_plans']['Update'];

// type WorkoutPlanExercise = Database['public']['Tables']['workout_plan_exercises']['Row'];
// type WorkoutPlanExerciseInsert = Database['public']['Tables']['workout_plan_exercises']['Insert'];
// type WorkoutPlanExerciseUpdate = Database['public']['Tables']['workout_plan_exercises']['Update'];

/**
 * Get all workout plans for a user
 * @param userId - The user's ID
 * @returns Array of workout plans or empty array if none found
 */
export const getWorkoutPlans = async (userId: string): Promise<WorkoutPlan[]> => {
    const {data, error} = await supabase
        .from('workout_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', {ascending: false});

    if (error) {
        console.error('Error fetching workout plans:', error);
        return [];
    }

    return data || [];
};

/**
 * Get a workout plan by ID
 * @param planId - The workout plan ID
 * @returns The workout plan or null if not found
 */
export const getWorkoutPlan = async (planId: string): Promise<WorkoutPlan | null> => {
    const {data, error} = await supabase
        .from('workout_plans')
        .select('*')
        .eq('id', planId)
        .single();

    if (error) {
        console.error('Error fetching workout plan:', error);
        return null;
    }

    return data;
};

/**
 * Get the current user's workout plans
 * @returns Array of workout plans or empty array if none found
 */
export const getCurrentUserWorkoutPlans = async (): Promise<WorkoutPlan[]> => {
    const {data: {user}} = await supabase.auth.getUser();

    if (!user) {
        return [];
    }

    return getWorkoutPlans(user.id);
};

/**
 * Create a new workout plan
 * @param plan - The workout plan data to insert
 * @returns The created workout plan or null if there was an error
 */
export const createWorkoutPlan = async (plan: WorkoutPlanInsert): Promise<WorkoutPlan | null> => {
    // Ensure environment is set
    const environment = getEnvironment();

    const {data, error} = await supabase
        .from('workout_plans')
        .insert({...plan, environment})
        .select()
        .single();

    if (error) {
        console.error('Error creating workout plan:', error);
        return null;
    }

    return data;
};

/**
 * Update a workout plan
 * @param planId - The workout plan ID
 * @param updates - The workout plan data to update
 * @returns The updated workout plan or null if there was an error
 */
export const updateWorkoutPlan = async (
    planId: string,
    updates: WorkoutPlanUpdate
): Promise<WorkoutPlan | null> => {
    const {data, error} = await supabase
        .from('workout_plans')
        .update(updates)
        .eq('id', planId)
        .select()
        .single();

    if (error) {
        console.error('Error updating workout plan:', error);
        return null;
    }

    return data;
};

/**
 * Delete a workout plan
 * @param planId - The workout plan ID
 * @returns True if the workout plan was deleted successfully, false otherwise
 */
export const deleteWorkoutPlan = async (planId: string): Promise<boolean> => {
    const {error} = await supabase
        .from('workout_plans')
        .delete()
        .eq('id', planId);

    if (error) {
        console.error('Error deleting workout plan:', error);
        return false;
    }

    return true;
};

/**
 * Get all exercises for a workout plan
 * @param planId - The workout plan ID
 * @returns Array of workout plan exercises or empty array if none found
 */
export const getWorkoutPlanExercises = async (planId: string): Promise<WorkoutPlanExercise[]> => {
    const {data, error} = await supabase
        .from('workout_plan_exercises')
        .select('*, exercises(*)')
        .eq('workout_plan_id', planId)
        .order('order_index', {ascending: true});

    if (error) {
        console.error('Error fetching workout plan exercises:', error);
        return [];
    }

    return data || [];
};

/**
 * Add an exercise to a workout plan
 * @param exercise - The workout plan exercise data to insert
 * @returns The created workout plan exercise or null if there was an error
 */
export const addExerciseToWorkoutPlan = async (
    exercise: WorkoutPlanExerciseInsert
): Promise<WorkoutPlanExercise | null> => {
    // Ensure environment is set
    const environment = getEnvironment();

    // Get the current highest order_index for this plan
    const {data: existingExercises} = await supabase
        .from('workout_plan_exercises')
        .select('order_index')
        .eq('workout_plan_id', exercise.workout_plan_id)
        .order('order_index', {ascending: false})
        .limit(1);

    const nextOrderIndex = existingExercises && existingExercises.length > 0
        ? (existingExercises[0].order_index || 0) + 1
        : 0;

    const {data, error} = await supabase
        .from('workout_plan_exercises')
        .insert({
            ...exercise,
            order_index: exercise.order_index ?? nextOrderIndex,
            environment
        })
        .select()
        .single();

    if (error) {
        console.error('Error adding exercise to workout plan:', error);
        return null;
    }

    return data;
};

/**
 * Update a workout plan exercise
 * @param exerciseId - The workout plan exercise ID
 * @param updates - The workout plan exercise data to update
 * @returns The updated workout plan exercise or null if there was an error
 */
export const updateWorkoutPlanExercise = async (
    exerciseId: string,
    updates: WorkoutPlanExerciseUpdate
): Promise<WorkoutPlanExercise | null> => {
    const {data, error} = await supabase
        .from('workout_plan_exercises')
        .update(updates)
        .eq('id', exerciseId)
        .select()
        .single();

    if (error) {
        console.error('Error updating workout plan exercise:', error);
        return null;
    }

    return data;
};

/**
 * Remove an exercise from a workout plan
 * @param exerciseId - The workout plan exercise ID
 * @returns True if the exercise was removed successfully, false otherwise
 */
export const removeExerciseFromWorkoutPlan = async (exerciseId: string): Promise<boolean> => {
    const {error} = await supabase
        .from('workout_plan_exercises')
        .delete()
        .eq('id', exerciseId);

    if (error) {
        console.error('Error removing exercise from workout plan:', error);
        return false;
    }

    return true;
};

/**
 * Reorder exercises in a workout plan
 * @param planId - The workout plan ID
 * @param exerciseIds - Array of exercise IDs in the desired order
 * @returns True if the exercises were reordered successfully, false otherwise
 */
export const reorderWorkoutPlanExercises = async (
    planId: string,
    exerciseIds: string[]
): Promise<boolean> => {
    try {
        // Update each exercise with its new order_index
        for (let i = 0; i < exerciseIds.length; i++) {
            const {error} = await supabase
                .from('workout_plan_exercises')
                .update({order_index: i})
                .eq('id', exerciseIds[i])
                .eq('workout_plan_id', planId);

            if (error) {
                console.error('Error reordering workout plan exercises:', error);
                return false;
            }
        }

        return true;
    } catch (error) {
        console.error('Error reordering workout plan exercises:', error);
        return false;
    }
};

/**
 * Subscribe to real-time updates for a workout plan
 * @param planId - The workout plan ID
 * @param callback - Function to call when data changes
 * @returns A function to unsubscribe
 */
export const subscribeToWorkoutPlan = (
    planId: string,
    callback: (plan: WorkoutPlan, eventType: 'UPDATE' | 'DELETE') => void
) => {
    const environment = getEnvironment();

    const subscription = supabase
        .channel('workout_plan_changes')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'workout_plans',
                filter: `id=eq.${planId} AND environment=eq.${environment}`,
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
 * Subscribe to real-time updates for exercises in a workout plan
 * @param planId - The workout plan ID
 * @param callback - Function to call when data changes
 * @returns A function to unsubscribe
 */
export const subscribeToWorkoutPlanExercises = (
    planId: string,
    callback: (exercise: WorkoutPlanExercise, eventType: 'INSERT' | 'UPDATE' | 'DELETE') => void
) => {
    const environment = getEnvironment();

    // Make sure planId is a string and not null or undefined
    if (!planId) {
        console.error('Invalid plan ID provided to subscribeToWorkoutPlanExercises');
        // Return a no-op unsubscribe function
        return () => {};
    }

    const subscription = supabase
        .channel('workout_plan_exercises_changes')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'workout_plan_exercises',
                filter: `workout_plan_id=eq.${planId} AND environment=eq.${environment}`,
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
