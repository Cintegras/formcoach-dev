
import { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import type { ProgressMetric } from '@/services/supabase/types/progress-metrics';

// Function to log a completed exercise
export const logCompletedExercise = async (
  workoutSessionId: string,
  exerciseId: string,
  setsCompleted: number,
  repsCompleted: number[],
  weightsUsed: number[]
) => {
  try {
    const { data, error } = await supabase
      .from('exercise_logs')
      .insert({
        workout_session_id: workoutSessionId, 
        exercise_id: exerciseId,
        sets_completed: setsCompleted,
        reps_completed: repsCompleted,
        weights_used: weightsUsed
      })
      .select();

    if (error) {
      console.error('Error logging exercise:', error);
      return null;
    }

    return data[0];
  } catch (err) {
    console.error('Error in logCompletedExercise:', err);
    return null;
  }
};

/**
 * Hook for managing exercise logs
 */
export function useExerciseLogs() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Log a completed exercise
   */
  const logExercise = async (
    workoutSessionId: string,
    exerciseId: string,
    setsCompleted: number,
    repsCompleted: number[],
    weightsUsed: number[]
  ) => {
    setLoading(true);
    setError(null);

    try {
      const result = await logCompletedExercise(
        workoutSessionId,
        exerciseId,
        setsCompleted,
        repsCompleted,
        weightsUsed
      );
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to log exercise');
      setError(error);
      console.error('Error logging exercise:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    logExercise,
    loading,
    error
  };
}
