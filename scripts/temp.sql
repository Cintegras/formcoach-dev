-- Migration: stage_002_update_schema.sql
-- Purpose: Configure environment defaults and RLS policies for staging in shared formcoach-dev project
-- Author: Junie
-- Date: 2023-11-15

BEGIN;

-- Update environment column defaults from 'dev' to 'stage' for all tables
ALTER TABLE profiles
    ALTER COLUMN environment SET DEFAULT 'stage';
ALTER TABLE exercises
    ALTER COLUMN environment SET DEFAULT 'stage';
ALTER TABLE workout_plans
    ALTER COLUMN environment SET DEFAULT 'stage';
ALTER TABLE workout_plan_exercises
    ALTER COLUMN environment SET DEFAULT 'stage';
ALTER TABLE workout_sessions
    ALTER COLUMN environment SET DEFAULT 'stage';
ALTER TABLE exercise_logs
    ALTER COLUMN environment SET DEFAULT 'stage';
ALTER TABLE form_analyses
    ALTER COLUMN environment SET DEFAULT 'stage';
ALTER TABLE progress_metrics
    ALTER COLUMN environment SET DEFAULT 'stage';

-- Drop and recreate RLS policies for profiles
DROP
POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP
POLICY IF EXISTS "Users can update their own profile" ON profiles;

CREATE
POLICY "Users can view their own profile"
  ON profiles FOR
SELECT
    USING (auth.uid() = id AND environment = 'stage');

CREATE
POLICY "Users can update their own profile"
  ON profiles FOR
UPDATE
    USING (auth.uid() = id AND environment = 'stage');

-- Drop and recreate RLS policies for workout_plans
DROP
POLICY IF EXISTS "Users can view their own workout plans" ON workout_plans;
DROP
POLICY IF EXISTS "Users can create their own workout plans" ON workout_plans;
DROP
POLICY IF EXISTS "Users can update their own workout plans" ON workout_plans;
DROP
POLICY IF EXISTS "Users can delete their own workout plans" ON workout_plans;

CREATE
POLICY "Users can view their own workout plans"
  ON workout_plans FOR
SELECT
    USING (auth.uid() = user_id AND environment = 'stage');

CREATE
POLICY "Users can create their own workout plans"
  ON workout_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id AND environment = 'stage');

CREATE
POLICY "Users can update their own workout plans"
  ON workout_plans FOR
UPDATE
    USING (auth.uid() = user_id AND environment = 'stage');

CREATE
POLICY "Users can delete their own workout plans"
  ON workout_plans FOR DELETE
USING (auth.uid() = user_id AND environment = 'stage');

-- Drop and recreate RLS policies for workout_plan_exercises
DROP
POLICY IF EXISTS "Users can view their own workout plan exercises" ON workout_plan_exercises;
DROP
POLICY IF EXISTS "Users can create their own workout plan exercises" ON workout_plan_exercises;
DROP
POLICY IF EXISTS "Users can update their own workout plan exercises" ON workout_plan_exercises;
DROP
POLICY IF EXISTS "Users can delete their own workout plan exercises" ON workout_plan_exercises;

CREATE
POLICY "Users can view their own workout plan exercises"
  ON workout_plan_exercises FOR
SELECT
    USING (auth.uid() IN (
    SELECT user_id FROM workout_plans wp
    WHERE wp.id = workout_plan_exercises.workout_plan_id) AND environment = 'stage');

CREATE
POLICY "Users can create their own workout plan exercises"
  ON workout_plan_exercises FOR INSERT
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM workout_plans wp 
    WHERE wp.id = workout_plan_exercises.workout_plan_id) AND environment = 'stage');

CREATE
POLICY "Users can update their own workout plan exercises"
  ON workout_plan_exercises FOR
UPDATE
    USING (auth.uid() IN (
    SELECT user_id FROM workout_plans wp
    WHERE wp.id = workout_plan_exercises.workout_plan_id) AND environment = 'stage');

CREATE
POLICY "Users can delete their own workout plan exercises"
  ON workout_plan_exercises FOR DELETE
USING (auth.uid() IN (
    SELECT user_id FROM workout_plans wp 
    WHERE wp.id = workout_plan_exercises.workout_plan_id) AND environment = 'stage');

-- Drop and recreate RLS policies for workout_sessions
DROP
POLICY IF EXISTS "Users can view their own workout sessions" ON workout_sessions;
DROP
POLICY IF EXISTS "Users can create their own workout sessions" ON workout_sessions;
DROP
POLICY IF EXISTS "Users can update their own workout sessions" ON workout_sessions;
DROP
POLICY IF EXISTS "Users can delete their own workout sessions" ON workout_sessions;

CREATE
POLICY "Users can view their own workout sessions"
  ON workout_sessions FOR
SELECT
    USING (auth.uid() = user_id AND environment = 'stage');

CREATE
POLICY "Users can create their own workout sessions"
  ON workout_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id AND environment = 'stage');

CREATE
POLICY "Users can update their own workout sessions"
  ON workout_sessions FOR
UPDATE
    USING (auth.uid() = user_id AND environment = 'stage');

CREATE
POLICY "Users can delete their own workout sessions"
  ON workout_sessions FOR DELETE
USING (auth.uid() = user_id AND environment = 'stage');

-- Drop and recreate RLS policies for exercise_logs
DROP
POLICY IF EXISTS "Users can view their own exercise logs" ON exercise_logs;
DROP
POLICY IF EXISTS "Users can create their own exercise logs" ON exercise_logs;
DROP
POLICY IF EXISTS "Users can update their own exercise logs" ON exercise_logs;
DROP
POLICY IF EXISTS "Users can delete their own exercise logs" ON exercise_logs;

CREATE
POLICY "Users can view their own exercise logs"
  ON exercise_logs FOR
SELECT
    USING (auth.uid() IN (
    SELECT user_id FROM workout_sessions ws
    WHERE ws.id = exercise_logs.workout_session_id) AND environment = 'stage');

CREATE
POLICY "Users can create their own exercise logs"
  ON exercise_logs FOR INSERT
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM workout_sessions ws 
    WHERE ws.id = exercise_logs.workout_session_id) AND environment = 'stage');

CREATE
POLICY "Users can update their own exercise logs"
  ON exercise_logs FOR
UPDATE
    USING (auth.uid() IN (
    SELECT user_id FROM workout_sessions ws
    WHERE ws.id = exercise_logs.workout_session_id) AND environment = 'stage');

CREATE
POLICY "Users can delete their own exercise logs"
  ON exercise_logs FOR DELETE
USING (auth.uid() IN (
    SELECT user_id FROM workout_sessions ws 
    WHERE ws.id = exercise_logs.workout_session_id) AND environment = 'stage');

-- Drop and recreate RLS policies for form_analyses
DROP
POLICY IF EXISTS "Users can view their own form analyses" ON form_analyses;

CREATE
POLICY "Users can view their own form analyses"
  ON form_analyses FOR
SELECT
    USING (auth.uid() IN (
    SELECT ws.user_id FROM workout_sessions ws
    JOIN exercise_logs el ON ws.id = el.workout_session_id
    WHERE el.id = form_analyses.exercise_log_id) AND environment = 'stage');

-- Drop and recreate RLS policies for progress_metrics
DROP
POLICY IF EXISTS "Users can view their own progress metrics" ON progress_metrics;
DROP
POLICY IF EXISTS "Users can create their own progress metrics" ON progress_metrics;
DROP
POLICY IF EXISTS "Users can update their own progress metrics" ON progress_metrics;
DROP
POLICY IF EXISTS "Users can delete their own progress metrics" ON progress_metrics;

CREATE
POLICY "Users can view their own progress metrics"
  ON progress_metrics FOR
SELECT
    USING (auth.uid() = user_id AND environment = 'stage');

CREATE
POLICY "Users can create their own progress metrics"
  ON progress_metrics FOR INSERT
  WITH CHECK (auth.uid() = user_id AND environment = 'stage');

CREATE
POLICY "Users can update their own progress metrics"
  ON progress_metrics FOR
UPDATE
    USING (auth.uid() = user_id AND environment = 'stage');

CREATE
POLICY "Users can delete their own progress metrics"
  ON progress_metrics FOR DELETE
USING (auth.uid() = user_id AND environment = 'stage');

-- Drop and recreate RLS policies for exercises
DROP
POLICY IF EXISTS "Exercises are viewable by all users" ON exercises;

CREATE
POLICY "Exercises are viewable by all users"
  ON exercises FOR
SELECT
    USING (environment = 'stage');

COMMIT;