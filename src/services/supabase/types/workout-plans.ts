
import { Database } from '@/integrations/supabase/types';

// Export type definitions
export type WorkoutPlan = Database['public']['Tables']['workout_plans']['Row'];
export type WorkoutPlanInsert = Database['public']['Tables']['workout_plans']['Insert'];
export type WorkoutPlanUpdate = Database['public']['Tables']['workout_plans']['Update'];

export type WorkoutPlanExercise = Database['public']['Tables']['workout_plan_exercises']['Row'];
export type WorkoutPlanExerciseInsert = Database['public']['Tables']['workout_plan_exercises']['Insert'];
export type WorkoutPlanExerciseUpdate = Database['public']['Tables']['workout_plan_exercises']['Update'];
