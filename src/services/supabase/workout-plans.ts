import { supabase } from './client';
import { Database } from './types';
import { withEnvironmentFilter } from '@/lib/supabase-utils';

// Type definitions for Workout Plans and Exercises
export type WorkoutPlan = Database['public']['Tables']['workout_plans']['Row'];
export type WorkoutPlanExercise = Database['public']['Tables']['workout_plan_exercises']['Row'];

/**
 * Fetches all workout plans for the current user.
 *
 * @param userId The ID of the user.
 * @returns A promise that resolves to an array of workout plans.
 */
export const getWorkoutPlans = async (userId: string): Promise<WorkoutPlan[]> => {
  try {
    const { data, error } = await withEnvironmentFilter(
      supabase
        .from('workout_plans')
        .select('*')
        .eq('user_id', userId)
    );

    if (error) {
      console.error('Error fetching workout plans:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching workout plans:', error);
    return [];
  }
};

/**
 * Fetches a single workout plan by ID.
 *
 * @param id The ID of the workout plan.
 * @returns A promise that resolves to the workout plan, or null if not found.
 */
export const getWorkoutPlan = async (id: string): Promise<WorkoutPlan | null> => {
  try {
    const { data, error } = await withEnvironmentFilter(
      supabase
        .from('workout_plans')
        .select('*')
        .eq('id', id)
        .single()
    );

    if (error) {
      console.error('Error fetching workout plan:', error);
      return null;
    }

    return data || null;
  } catch (error) {
    console.error('Error fetching workout plan:', error);
    return null;
  }
};

/**
 * Creates a new workout plan.
 *
 * @param workoutPlan The workout plan to create.
 * @returns A promise that resolves to the created workout plan, or null if creation fails.
 */
export const createWorkoutPlan = async (workoutPlan: Omit<WorkoutPlan, 'id' | 'created_at' | 'updated_at'>): Promise<WorkoutPlan | null> => {
  try {
    const { data, error } = await supabase
      .from('workout_plans')
      .insert([workoutPlan])
      .select('*')
      .single();

    if (error) {
      console.error('Error creating workout plan:', error);
      return null;
    }

    return data || null;
  } catch (error) {
    console.error('Error creating workout plan:', error);
    return null;
  }
};

/**
 * Updates an existing workout plan.
 *
 * @param id The ID of the workout plan to update.
 * @param updates The updates to apply to the workout plan.
 * @returns A promise that resolves to the updated workout plan, or null if update fails.
 */
export const updateWorkoutPlan = async (id: string, updates: Partial<WorkoutPlan>): Promise<WorkoutPlan | null> => {
  try {
    const { data, error } = await supabase
      .from('workout_plans')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating workout plan:', error);
      return null;
    }

    return data || null;
  } catch (error) {
    console.error('Error updating workout plan:', error);
    return null;
  }
};

/**
 * Deletes a workout plan by ID.
 *
 * @param id The ID of the workout plan to delete.
 * @returns A promise that resolves to true if the workout plan was successfully deleted, or false otherwise.
 */
export const deleteWorkoutPlan = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('workout_plans')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting workout plan:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting workout plan:', error);
    return false;
  }
};

/**
 * Fetches all exercises for a given workout plan.
 *
 * @param workoutPlanId The ID of the workout plan.
 * @returns A promise that resolves to an array of exercises for the workout plan.
 */
export const getWorkoutPlanExercises = async (workoutPlanId: string): Promise<WorkoutPlanExercise[]> => {
  try {
    const { data, error } = await withEnvironmentFilter(
      supabase
        .from('workout_plan_exercises')
        .select('*')
        .eq('workout_plan_id', workoutPlanId)
    );

    if (error) {
      console.error('Error fetching workout plan exercises:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching workout plan exercises:', error);
    return [];
  }
};

/**
 * Adds an exercise to a workout plan.
 *
 * @param exercise The exercise to add to the workout plan.
 * @returns A promise that resolves to the added exercise, or null if the operation fails.
 */
export const addWorkoutPlanExercise = async (exercise: Omit<WorkoutPlanExercise, 'id' | 'created_at'>): Promise<WorkoutPlanExercise | null> => {
  try {
    const { data, error } = await supabase
      .from('workout_plan_exercises')
      .insert([exercise])
      .select('*')
      .single();

    if (error) {
      console.error('Error adding workout plan exercise:', error);
      return null;
    }

    return data || null;
  } catch (error) {
    console.error('Error adding workout plan exercise:', error);
    return null;
  }
};

/**
 * Updates an exercise in a workout plan.
 *
 * @param id The ID of the exercise to update.
 * @param updates The updates to apply to the exercise.
 * @returns A promise that resolves to the updated exercise, or null if the operation fails.
 */
export const updateWorkoutPlanExercise = async (id: string, updates: Partial<WorkoutPlanExercise>): Promise<WorkoutPlanExercise | null> => {
  try {
    const { data, error } = await supabase
      .from('workout_plan_exercises')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating workout plan exercise:', error);
      return null;
    }

    return data || null;
  } catch (error) {
    console.error('Error updating workout plan exercise:', error);
    return null;
  }
};

/**
 * Deletes an exercise from a workout plan.
 *
 * @param id The ID of the exercise to delete.
 * @returns A promise that resolves to true if the exercise was successfully deleted, or false otherwise.
 */
export const deleteWorkoutPlanExercise = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('workout_plan_exercises')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting workout plan exercise:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting workout plan exercise:', error);
    return false;
  }
};

/**
 * Subscribes to changes in workout plan exercises for a specific workout plan.
 *
 * @param plan_id The ID of the workout plan to subscribe to.
 * @param callback A callback function that will be called with the latest exercises whenever changes occur.
 * @returns An object with an unsubscribe method to stop listening for changes.
 */
export const subscribeToWorkoutPlanExercises = (
  plan_id: string | null | undefined,
  callback: (exercises: WorkoutPlanExercise[]) => void
) => {
  if (!plan_id) {
    console.error('No plan ID provided to subscription');
    return { unsubscribe: () => {} };
  }

  const channel = supabase
    .channel(`workout_plan_exercises_${plan_id}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'workout_plan_exercises',
        filter: `workout_plan_id=eq.${plan_id}`,
      },
      () => {
        // When changes occur, fetch the latest exercises
        getWorkoutPlanExercises(plan_id).then((exercises) => {
          if (exercises) {
            callback(exercises);
          }
        });
      }
    )
    .subscribe();

  return channel;
};
