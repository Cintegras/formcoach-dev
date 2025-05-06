-- Update RLS policies to remove environment clause
-- This script updates all RLS policies to use only auth.uid() = user_id

-- Update profiles table policies
DROP
POLICY IF EXISTS "Allow access for active environment" ON public.profiles;
CREATE
POLICY "Allow users to read own profile"
ON public.profiles 
FOR
SELECT
    USING (auth.uid() = user_id);

CREATE
POLICY "Allow users to update own profile"
ON public.profiles 
FOR
UPDATE
    USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE
POLICY "Allow users to insert own profile"
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Update progress_metrics table policies
DROP
POLICY IF EXISTS "Allow access for active environment" ON public.progress_metrics;
CREATE
POLICY "Allow users to read own metrics"
ON public.progress_metrics 
FOR
SELECT
    USING (auth.uid() = user_id);

CREATE
POLICY "Allow users to update own metrics"
ON public.progress_metrics 
FOR
UPDATE
    USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE
POLICY "Allow users to insert own metrics"
ON public.progress_metrics 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE
POLICY "Allow users to delete own metrics"
ON public.progress_metrics 
FOR DELETE
USING (auth.uid() = user_id);

-- Update exercise_logs table policies
DROP
POLICY IF EXISTS "Allow access for active environment" ON public.exercise_logs;
CREATE
POLICY "Allow users to read own logs"
ON public.exercise_logs 
FOR
SELECT
    USING (auth.uid() = user_id);

CREATE
POLICY "Allow users to update own logs"
ON public.exercise_logs 
FOR
UPDATE
    USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE
POLICY "Allow users to insert own logs"
ON public.exercise_logs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE
POLICY "Allow users to delete own logs"
ON public.exercise_logs 
FOR DELETE
USING (auth.uid() = user_id);

-- Update form_analyses table policies
DROP
POLICY IF EXISTS "Allow access for active environment" ON public.form_analyses;
CREATE
POLICY "Allow users to read own analyses"
ON public.form_analyses 
FOR
SELECT
    USING (auth.uid() = user_id);

CREATE
POLICY "Allow users to update own analyses"
ON public.form_analyses 
FOR
UPDATE
    USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE
POLICY "Allow users to insert own analyses"
ON public.form_analyses 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE
POLICY "Allow users to delete own analyses"
ON public.form_analyses 
FOR DELETE
USING (auth.uid() = user_id);

-- Remove environment-related triggers and functions
DROP TRIGGER IF EXISTS set_environment_profiles ON public.profiles;
DROP TRIGGER IF EXISTS set_environment_exercises ON public.exercises;
DROP TRIGGER IF EXISTS set_environment_workout_plans ON public.workout_plans;
DROP TRIGGER IF EXISTS set_environment_workout_plan_exercises ON public.workout_plan_exercises;
DROP TRIGGER IF EXISTS set_environment_workout_sessions ON public.workout_sessions;
DROP TRIGGER IF EXISTS set_environment_exercise_logs ON public.exercise_logs;
DROP TRIGGER IF EXISTS set_environment_form_analyses ON public.form_analyses;
DROP TRIGGER IF EXISTS set_environment_progress_metrics ON public.progress_metrics;
DROP TRIGGER IF EXISTS set_environment_equipment ON public.equipment;

-- Drop environment-related functions
DROP FUNCTION IF EXISTS ensure_environment_set();
DROP FUNCTION IF EXISTS set_app_environment();
DROP FUNCTION IF EXISTS initialize_session();
DROP FUNCTION IF EXISTS on_session_start();