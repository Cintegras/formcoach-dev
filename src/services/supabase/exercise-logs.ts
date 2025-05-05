
import {supabase} from '@/integrations/supabase/client';
import {getEnvironment} from '@/lib/environment';
import {ExerciseLog} from './types';

// Export exercise log functions
export const getExerciseLogs = async (sessionId: string): Promise<ExerciseLog[]> => {
  const { data, error } = await supabase
    .from('exercise_logs')
    .select('*')
    .eq('environment', getEnvironment())
    .eq('workout_session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data || []) as unknown as ExerciseLog[];
};

export const logExercise = async (
  sessionId: string,
  exerciseId: string,
  setsCompleted: number,
  repsCompleted: string, // JSON string with reps data
  weightsUsed: string, // JSON string with weights data
  videoUrl?: string
): Promise<ExerciseLog | null> => {
  const insertData = {
    workout_session_id: sessionId,
    exercise_id: exerciseId,
    sets_completed: setsCompleted,
    reps_completed: JSON.parse(repsCompleted),
    weights_used: JSON.parse(weightsUsed),
    video_url: videoUrl,
    environment: getEnvironment()
  };

  const { data, error } = await supabase
    .from('exercise_logs')
    .insert(insertData as any)
    .select('*')
    .single();

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
    .eq('environment', getEnvironment())
    .select('*')
    .single();

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
    ...log,
    environment: getEnvironment()
  };

  const { data, error } = await supabase
    .from('exercise_logs')
    .insert(insertData as any)
    .select('*')
    .single();

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
    .eq('environment', getEnvironment())
    .select('*')
    .single();

  if (error) throw error;
  return data as unknown as ExerciseLog;
};

export const deleteExerciseLog = async (logId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('exercise_logs')
    .delete()
    .eq('id', logId)
    .eq('environment', getEnvironment());

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
