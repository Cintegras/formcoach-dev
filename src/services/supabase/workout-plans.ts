import {supabase} from './client';
import {Database} from '@/integrations/supabase/types';
import {WorkoutPlan, WorkoutPlanExercise} from './types';

// Export workout plan functions
export const getWorkoutPlans = async (userId: string): Promise<WorkoutPlan[]> => {
  const { data, error } = await supabase
    .from('workout_plans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getWorkoutPlan = async (planId: string): Promise<WorkoutPlan | null> => {
  const { data, error } = await supabase
    .from('workout_plans')
    .select('*')
    .eq('id', planId)
      .maybeSingle();

  if (error) throw error;
  return data;
};

export const createWorkoutPlan = async (plan: Database['public']['Tables']['workout_plans']['Insert']): Promise<WorkoutPlan | null> => {
  const { data, error } = await supabase
    .from('workout_plans')
    .insert(plan)
    .select('*')
      .maybeSingle();

  if (error) throw error;
  return data;
};

export const updateWorkoutPlan = async (
  planId: string, 
  updates: Database['public']['Tables']['workout_plans']['Update']
): Promise<WorkoutPlan | null> => {
  const { data, error } = await supabase
    .from('workout_plans')
    .update(updates)
    .eq('id', planId)
    .select('*')
      .maybeSingle();

  if (error) throw error;
  return data;
};

export const deleteWorkoutPlan = async (planId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('workout_plans')
    .delete()
    .eq('id', planId);

  if (error) throw error;
  return true;
};

// Workout plan exercise functions
export const getWorkoutPlanExercises = async (planId: string): Promise<WorkoutPlanExercise[]> => {
  const { data, error } = await supabase
    .from('workout_plan_exercises')
    .select('*')
    .eq('workout_plan_id', planId)
    .order('order_index', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const addExerciseToWorkoutPlan = async (
  exercise: Database['public']['Tables']['workout_plan_exercises']['Insert']
): Promise<WorkoutPlanExercise | null> => {
  const { data, error } = await supabase
    .from('workout_plan_exercises')
    .insert(exercise)
    .select('*')
      .maybeSingle();

  if (error) throw error;
  return data;
};

export const updateWorkoutPlanExercise = async (
  exerciseId: string,
  updates: Database['public']['Tables']['workout_plan_exercises']['Update']
): Promise<WorkoutPlanExercise | null> => {
  const { data, error } = await supabase
    .from('workout_plan_exercises')
    .update(updates)
    .eq('id', exerciseId)
    .select('*')
      .maybeSingle();

  if (error) throw error;
  return data;
};

export const removeExerciseFromWorkoutPlan = async (exerciseId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('workout_plan_exercises')
    .delete()
    .eq('id', exerciseId);

  if (error) throw error;
  return true;
};

export const reorderWorkoutPlanExercises = async (planId: string, exerciseIds: string[]): Promise<boolean> => {
  // Update each exercise with its new order
  const updates = exerciseIds.map((id, index) => ({
    id,
    order_index: index
  }));

  const { error } = await supabase
    .from('workout_plan_exercises')
    .upsert(updates);

  if (error) throw error;
  return true;
};

// Real-time subscriptions
export const subscribeToWorkoutPlan = (
  planId: string,
  callback: (plan: WorkoutPlan, eventType: 'INSERT' | 'UPDATE' | 'DELETE') => void
): (() => void) => {
  const channel = supabase
    .channel(`workout_plan_${planId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'workout_plans',
        filter: `id=eq.${planId}`,
      },
      (payload) => {
        const eventType = payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE';
        callback(payload.new as WorkoutPlan, eventType);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const subscribeToWorkoutPlanExercises = (
  planId: string,
  callback: (exercise: WorkoutPlanExercise, eventType: 'INSERT' | 'UPDATE' | 'DELETE') => void
): (() => void) => {
  const channel = supabase
    .channel(`workout_plan_exercises_${planId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'workout_plan_exercises',
        filter: `workout_plan_id=eq.${planId}`,
      },
      (payload) => {
        const eventType = payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE';
        callback(payload.new as WorkoutPlanExercise, eventType);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
