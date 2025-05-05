
import { Database } from '@/integrations/supabase/types';

// Export type definitions
export type ExerciseLog = Database['public']['Tables']['exercise_logs']['Row'];
export type ExerciseLogInsert = Database['public']['Tables']['exercise_logs']['Insert'];
export type ExerciseLogUpdate = Database['public']['Tables']['exercise_logs']['Update'];
