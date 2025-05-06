
import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import type { ProgressMetric } from '@/services/supabase/types/progress-metrics';
import type { ExerciseLog } from '@/services/supabase/types/exercise-logs';

// Function to log a completed exercise
export const logCompletedExercise = async (
  workoutSessionId: string,
  exerciseId: string,
  setsCompleted: number,
  repsCompleted: number[] | string,
  weightsUsed: number[] | string,
  videoUrl?: string
) => {
  try {
    const { data, error } = await supabase
      .from('exercise_logs')
      .insert({
        workout_session_id: workoutSessionId, 
        exercise_id: exerciseId,
        sets_completed: setsCompleted,
        reps_completed: repsCompleted,
        weights_used: weightsUsed,
        video_url: videoUrl
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
export function useExerciseLogs(workoutSessionId: string | null = null, fetchLogs: boolean = false) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [logs, setLogs] = useState<ExerciseLog[]>([]);

  // Fetch logs if fetchLogs is true and we have a workoutSessionId
  useEffect(() => {
    if (!fetchLogs || !workoutSessionId) {
      return;
    }

    const fetchExerciseLogs = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('exercise_logs')
          .select('*')
          .eq('workout_session_id', workoutSessionId);

        if (error) {
          throw new Error(error.message);
        }

        setLogs(data || []);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch exercise logs');
        setError(error);
        console.error('Error fetching exercise logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExerciseLogs();
  }, [workoutSessionId, fetchLogs]);

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
    logs,
    logExercise,
    logCompletedExercise,
    loading,
    error
  };
}
