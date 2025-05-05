import {supabase} from './client';
import {Database} from '@/integrations/supabase/types';
import {ExerciseLog} from './types';

// Export exercise log functions
export const getExerciseLogs = async (sessionId: string): Promise<ExerciseLog[]> => {
  const { data, error } = await supabase
    .from('exercise_logs')
    .select('*')
    .eq('workout_session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const logExercise = async (
  sessionId: string,
  exerciseId: string,
  setsCompleted: number,
  repsCompleted: string, // JSON string with reps data
  weightsUsed: string, // JSON string with weights data
  videoUrl?: string
): Promise<ExerciseLog | null> => {
  const { data, error } = await supabase
    .from('exercise_logs')
    .insert({
      workout_session_id: sessionId,
      exercise_id: exerciseId,
      sets_completed: setsCompleted,
      reps_completed: repsCompleted,
      weights_used: weightsUsed,
      video_url: videoUrl
    } as Database['public']['Tables']['exercise_logs']['Insert'])
    .select('*')
    .single();

  if (error) throw error;
  return data;
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
    .single();

  if (error) throw error;
  return data;
};

// Fix the invalid property error by using appropriate type
export const createExerciseLog = async (
  log: Database['public']['Tables']['exercise_logs']['Insert']
): Promise<ExerciseLog | null> => {
  const { data, error } = await supabase
    .from('exercise_logs')
    .insert(log)
    .select('*')
    .single();

  if (error) throw error;
  return data;
};

export const updateExerciseLog = async (
  logId: string,
  updates: Database['public']['Tables']['exercise_logs']['Update']
): Promise<ExerciseLog | null> => {
  const { data, error } = await supabase
    .from('exercise_logs')
    .update(updates)
    .eq('id', logId)
    .select('*')
    .single();

  if (error) throw error;
  return data;
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
