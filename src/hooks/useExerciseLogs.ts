
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getEnvironment } from '@/lib/environment';
import { ExerciseLog } from '@/services/supabase/types';
import {
  getExerciseLogs,
  createExerciseLog,
  updateExerciseLog,
  deleteExerciseLog,
  subscribeToExerciseLogs,
  logExercise
} from '@/services/supabase/exercise-logs';

export function useExerciseLogs(sessionId: string) {
  const [logs, setLogs] = useState<ExerciseLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLogs = useCallback(async () => {
    if (!sessionId) {
      setLogs([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getExerciseLogs(sessionId);
      setLogs(data);
    } catch (err) {
      console.error('Error fetching exercise logs:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  const addLog = useCallback(async (
    exerciseId: string,
    sets: number,
    reps: number[],
    weights: number[],
    videoUrl?: string
  ) => {
    if (!sessionId) return null;

    try {
      const newLog = await createExerciseLog({
        workout_session_id: sessionId,
        exercise_id: exerciseId,
        sets_completed: sets,
        reps_completed: reps,
        weights_used: weights,
        video_url: videoUrl,
      });

      if (newLog) {
        setLogs(current => [...current, newLog]);
      }
      return newLog;
    } catch (err) {
      console.error('Error adding exercise log:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    }
  }, [sessionId]);
  
  // Added the logCompletedExercise function to fix the TypeScript error
  const logCompletedExercise = useCallback(async (
    exerciseId: string,
    setsCompleted: number,
    repsCompleted: number[],
    weightsUsed: number[],
    videoUrl?: string
  ) => {
    if (!sessionId) return null;

    try {
      const newLog = await logExercise(
        sessionId,
        exerciseId,
        setsCompleted,
        repsCompleted,
        weightsUsed,
        videoUrl
      );

      if (newLog) {
        setLogs(current => [...current, newLog]);
      }
      return newLog;
    } catch (err) {
      console.error('Error logging completed exercise:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    }
  }, [sessionId]);

  const updateLog = useCallback(async (
    logId: string,
    updates: {
      sets_completed?: number;
      reps_completed?: number[];
      weights_used?: number[];
      video_url?: string;
      form_feedback?: string;
      soreness_rating?: number;
    }
  ) => {
    try {
      const updatedLog = await updateExerciseLog(logId, updates);
      
      if (updatedLog) {
        setLogs(current => 
          current.map(log => log.id === logId ? updatedLog : log)
        );
      }
      return updatedLog;
    } catch (err) {
      console.error('Error updating exercise log:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    }
  }, []);

  const removeLog = useCallback(async (logId: string) => {
    try {
      const success = await deleteExerciseLog(logId);
      if (success) {
        setLogs(current => current.filter(log => log.id !== logId));
      }
      return success;
    } catch (err) {
      console.error('Error removing exercise log:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return false;
    }
  }, []);

  // Set up real-time subscription to exercise logs
  useEffect(() => {
    if (!sessionId) return;

    fetchLogs();

    const unsubscribe = subscribeToExerciseLogs(
      sessionId,
      (log, eventType) => {
        if (eventType === 'INSERT') {
          setLogs(current => [...current, log]);
        } else if (eventType === 'UPDATE') {
          setLogs(current => 
            current.map(item => item.id === log.id ? log : item)
          );
        } else if (eventType === 'DELETE') {
          setLogs(current => 
            current.filter(item => item.id !== log.id)
          );
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [sessionId, fetchLogs]);

  return {
    logs,
    loading,
    error,
    fetchLogs,
    addLog,
    updateLog,
    removeLog,
    logCompletedExercise
  };
}
