import {supabase} from '@/integrations/supabase/client';
import {ExerciseLog} from './types';

// Export exercise log functions
export const getExerciseLogs = async (sessionId: string): Promise<ExerciseLog[]> => {
  const { data, error } = await supabase
    .from('exercise_logs')
    .select('*')
    .eq('workout_session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data || []) as unknown as ExerciseLog[];
};

export const logExercise = async (
  sessionId: string,
  exerciseId: string,
  setsCompleted: number,
  repsCompleted: number[],
  weightsUsed: number[],
  videoUrl?: string
): Promise<ExerciseLog | null> => {
  const insertData = {
    workout_session_id: sessionId,
    exercise_id: exerciseId,
    sets_completed: setsCompleted,
    reps_completed: repsCompleted,
    weights_used: weightsUsed,
      video_url: videoUrl
  };

  const { data, error } = await supabase
    .from('exercise_logs')
    .insert(insertData as any)
    .select('*')
      .maybeSingle();

  if (error) throw error;
  return data as unknown as ExerciseLog;
};

export const addFormFeedback = async (
  logId: string,
  feedback: string,
  sorenessRating?: number
): Promise<ExerciseLog | null> => {
  const { data, error } = await supabase
    .from('exercise_logs')
    .update({
      form_feedback: feedback,
      soreness_rating: sorenessRating
    })
    .eq('id', logId)
    .select('*')
      .maybeSingle();

  if (error) throw error;
  return data as unknown as ExerciseLog;
};

// Create exercise log with proper type
export const createExerciseLog = async (
  log: {
    workout_session_id?: string | null;
    exercise_id?: string | null;
    sets_completed?: number | null;
    reps_completed?: number[] | null;
    weights_used?: number[] | null;
    video_url?: string | null;
    form_feedback?: string | null;
  }
): Promise<ExerciseLog | null> => {
  const insertData = {
      ...log
  };

  const { data, error } = await supabase
    .from('exercise_logs')
    .insert(insertData as any)
    .select('*')
      .maybeSingle();

  if (error) throw error;
  return data as unknown as ExerciseLog;
};

export const updateExerciseLog = async (
  logId: string,
  updates: {
    sets_completed?: number | null;
    reps_completed?: number[] | null;
    weights_used?: number[] | null;
    video_url?: string | null;
    form_feedback?: string | null;
    soreness_rating?: number | null;
  }
): Promise<ExerciseLog | null> => {
  const { data, error } = await supabase
    .from('exercise_logs')
    .update(updates)
    .eq('id', logId)
    .select('*')
      .maybeSingle();

  if (error) throw error;
  return data as unknown as ExerciseLog;
};

export const deleteExerciseLog = async (logId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('exercise_logs')
    .delete()
      .eq('id', logId);

  if (error) throw error;
  return true;
};

// Real-time subscriptions
export const subscribeToExerciseLogs = (
  sessionId: string,
  callback: (log: ExerciseLog, eventType: 'INSERT' | 'UPDATE' | 'DELETE') => void
): (() => void) => {
  const channel = supabase
    .channel(`exercise_logs_${sessionId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'exercise_logs',
        filter: `workout_session_id=eq.${sessionId}`,
      },
      (payload) => {
        const eventType = payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE';
        callback(payload.new as ExerciseLog, eventType);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
