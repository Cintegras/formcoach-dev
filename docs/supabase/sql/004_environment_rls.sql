-- Environment-based Row Level Security (RLS) Implementation
-- This file sets up RLS policies based on app.environment setting

-- Create a custom function to set the environment variable
CREATE
OR REPLACE FUNCTION set_app_environment()
RETURNS VOID AS $$
DECLARE
db_name TEXT;
BEGIN
    -- Get the current database name
SELECT current_database()
INTO db_name;

-- Set environment based on database name
IF
db_name LIKE '%prod%' THEN
        EXECUTE 'SET app.environment = ''prod''';
    ELSIF
db_name LIKE '%stage%' THEN
        EXECUTE 'SET app.environment = ''stage''';
ELSE
        -- Default to 'dev' for development database or if not specified
        EXECUTE 'SET app.environment = ''dev''';
END IF;
END;
$$
LANGUAGE plpgsql;

-- Create a startup function that will be called via ALTER DATABASE ... SET
CREATE
OR REPLACE FUNCTION public.on_session_start()
RETURNS VOID AS $$
BEGIN
    PERFORM
set_app_environment();
END;
$$
LANGUAGE plpgsql;

-- Set the function to run at the start of each session
-- Note: This requires superuser privileges and should be run by a database administrator
-- ALTER DATABASE current_database() SET session_preload_libraries = 'auto_explain';
-- ALTER DATABASE current_database() SET shared_preload_libraries = 'auto_explain';
-- ALTER DATABASE current_database() SET auto_explain.log_min_duration = 0;

-- Create a SQL function that users can call at the beginning of their sessions
CREATE
OR REPLACE FUNCTION initialize_session()
RETURNS VOID AS $$
BEGIN
    PERFORM
set_app_environment();
END;
$$
LANGUAGE plpgsql;

-- Add documentation on how to use this in client code
COMMENT
ON FUNCTION initialize_session() IS
'Call this function at the start of each database session to set the app.environment variable.
Example usage: SELECT initialize_session();';

-- Create a trigger that runs on table access to ensure environment is set
CREATE
OR REPLACE FUNCTION ensure_environment_set()
RETURNS TRIGGER AS $$
BEGIN
    -- Try to get current setting, set it if not already set
BEGIN
        PERFORM
current_setting('app.environment', true);
EXCEPTION
        WHEN OTHERS THEN
            PERFORM set_app_environment();
END;
RETURN NEW;
END;
$$
LANGUAGE plpgsql;

-- Add triggers to tables to ensure environment is set on access
-- For profiles table
CREATE TRIGGER set_environment_profiles
    BEFORE INSERT OR
UPDATE OR
DELETE OR
SELECT
ON public.profiles
    FOR EACH STATEMENT EXECUTE FUNCTION ensure_environment_set();

-- For exercises table
CREATE TRIGGER set_environment_exercises
    BEFORE INSERT OR
UPDATE OR
DELETE OR
SELECT
ON public.exercises
    FOR EACH STATEMENT EXECUTE FUNCTION ensure_environment_set();

-- For workout_plans table
CREATE TRIGGER set_environment_workout_plans
    BEFORE INSERT OR
UPDATE OR
DELETE OR
SELECT
ON public.workout_plans
    FOR EACH STATEMENT EXECUTE FUNCTION ensure_environment_set();

-- For workout_plan_exercises table
CREATE TRIGGER set_environment_workout_plan_exercises
    BEFORE INSERT OR
UPDATE OR
DELETE OR
SELECT
ON public.workout_plan_exercises
    FOR EACH STATEMENT EXECUTE FUNCTION ensure_environment_set();

-- For workout_sessions table
CREATE TRIGGER set_environment_workout_sessions
    BEFORE INSERT OR
UPDATE OR
DELETE OR
SELECT
ON public.workout_sessions
    FOR EACH STATEMENT EXECUTE FUNCTION ensure_environment_set();

-- For exercise_logs table
CREATE TRIGGER set_environment_exercise_logs
    BEFORE INSERT OR
UPDATE OR
DELETE OR
SELECT
ON public.exercise_logs
    FOR EACH STATEMENT EXECUTE FUNCTION ensure_environment_set();

-- For form_analyses table
CREATE TRIGGER set_environment_form_analyses
    BEFORE INSERT OR
UPDATE OR
DELETE OR
SELECT
ON public.form_analyses
    FOR EACH STATEMENT EXECUTE FUNCTION ensure_environment_set();

-- For progress_metrics table
CREATE TRIGGER set_environment_progress_metrics
    BEFORE INSERT OR
UPDATE OR
DELETE OR
SELECT
ON public.progress_metrics
    FOR EACH STATEMENT EXECUTE FUNCTION ensure_environment_set();

-- For equipment table (if it exists)
DO
$$
BEGIN
    IF
EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'equipment') THEN
        EXECUTE 'CREATE TRIGGER set_environment_equipment
                BEFORE INSERT OR UPDATE OR DELETE OR SELECT ON public.equipment
                FOR EACH STATEMENT EXECUTE FUNCTION ensure_environment_set()';
END IF;
END $$;

-- Create a generic RLS policy for tables with environment column
-- This is a template that should be applied to each table with an environment column

-- Example for the equipment table mentioned in the issue description:
-- Enable RLS on the table
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;

-- Create policy for all operations based on environment
CREATE
POLICY "Allow access for active environment"
ON public.equipment
FOR ALL
USING (environment = current_setting('app.environment', true))
WITH CHECK (environment = current_setting('app.environment', true));

-- Documentation for session startup
COMMENT
ON FUNCTION set_environment_variable() IS
'Sets the app.environment variable at session start. 
In dev database: Use SET app.environment = ''dev'' for dev workflows or SET app.environment = ''stage'' for stage workflows.
In prod database: Use SET app.environment = ''prod'' unless environment column or RLS is removed.
Defaults to ''dev'' if no explicit environment is provided.';

-- Add similar policies for all other tables with environment column
-- For example:
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE
POLICY "Allow access for active environment"
ON public.profiles
FOR ALL
USING (environment = current_setting('app.environment', true))
WITH CHECK (environment = current_setting('app.environment', true));

ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
CREATE
POLICY "Allow access for active environment"
ON public.exercises
FOR ALL
USING (environment = current_setting('app.environment', true))
WITH CHECK (environment = current_setting('app.environment', true));

ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
CREATE
POLICY "Allow access for active environment"
ON public.workout_plans
FOR ALL
USING (environment = current_setting('app.environment', true))
WITH CHECK (environment = current_setting('app.environment', true));

ALTER TABLE public.workout_plan_exercises ENABLE ROW LEVEL SECURITY;
CREATE
POLICY "Allow access for active environment"
ON public.workout_plan_exercises
FOR ALL
USING (environment = current_setting('app.environment', true))
WITH CHECK (environment = current_setting('app.environment', true));

ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
CREATE
POLICY "Allow access for active environment"
ON public.workout_sessions
FOR ALL
USING (environment = current_setting('app.environment', true))
WITH CHECK (environment = current_setting('app.environment', true));

ALTER TABLE public.exercise_logs ENABLE ROW LEVEL SECURITY;
CREATE
POLICY "Allow access for active environment"
ON public.exercise_logs
FOR ALL
USING (environment = current_setting('app.environment', true))
WITH CHECK (environment = current_setting('app.environment', true));

ALTER TABLE public.form_analyses ENABLE ROW LEVEL SECURITY;
CREATE
POLICY "Allow access for active environment"
ON public.form_analyses
FOR ALL
USING (environment = current_setting('app.environment', true))
WITH CHECK (environment = current_setting('app.environment', true));

ALTER TABLE public.progress_metrics ENABLE ROW LEVEL SECURITY;
CREATE
POLICY "Allow access for active environment"
ON public.progress_metrics
FOR ALL
USING (environment = current_setting('app.environment', true))
WITH CHECK (environment = current_setting('app.environment', true));
