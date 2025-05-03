-- Initial schema setup for PRODUCTION environment
-- This file contains the initial database schema setup for the production environment

-- Enable UUID extension
CREATE
EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE profiles
(
    id            UUID REFERENCES auth.users PRIMARY KEY,
    username      TEXT UNIQUE,
    full_name     TEXT,
    avatar_url    TEXT,
    height        NUMERIC,
    weight        NUMERIC,
    fitness_level TEXT,
    goals         TEXT[],
    environment TEXT NOT NULL DEFAULT 'prod',
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exercise library
CREATE TABLE exercises
(
    id                      UUID PRIMARY KEY         DEFAULT uuid_generate_v4(),
    name                    TEXT NOT NULL,
    description             TEXT,
    muscle_groups           TEXT[],
    equipment               TEXT[],
    difficulty_level        TEXT,
    demonstration_video_url TEXT,
    environment TEXT NOT NULL DEFAULT 'prod',
    created_at              TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workout plans
CREATE TABLE workout_plans
(
    id             UUID PRIMARY KEY         DEFAULT uuid_generate_v4(),
    user_id        UUID REFERENCES profiles (id) ON DELETE CASCADE,
    name           TEXT NOT NULL,
    description    TEXT,
    frequency      TEXT,
    duration_weeks INTEGER,
    is_active      BOOLEAN                  DEFAULT true,
    environment TEXT NOT NULL DEFAULT 'prod',
    created_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workout plan exercises
CREATE TABLE workout_plan_exercises
(
    id              UUID PRIMARY KEY         DEFAULT uuid_generate_v4(),
    workout_plan_id UUID REFERENCES workout_plans (id) ON DELETE CASCADE,
    exercise_id     UUID REFERENCES exercises (id),
    day_of_week     TEXT,
    sets            INTEGER,
    reps            TEXT,
    rest_seconds    INTEGER,
    notes           TEXT,
    order_index     INTEGER,
    environment TEXT NOT NULL DEFAULT 'prod',
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workout sessions
CREATE TABLE workout_sessions
(
    id              UUID PRIMARY KEY         DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES profiles (id) ON DELETE CASCADE,
    workout_plan_id UUID REFERENCES workout_plans (id),
    start_time      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time        TIMESTAMP WITH TIME ZONE,
    notes           TEXT,
    overall_feeling TEXT,
    environment TEXT NOT NULL DEFAULT 'prod',
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exercise logs
CREATE TABLE exercise_logs
(
    id                 UUID PRIMARY KEY         DEFAULT uuid_generate_v4(),
    workout_session_id UUID REFERENCES workout_sessions (id) ON DELETE CASCADE,
    exercise_id        UUID REFERENCES exercises (id),
    sets_completed     INTEGER,
    reps_completed     INTEGER[],
    weights_used       NUMERIC[],
    video_url          TEXT,
    form_feedback      TEXT,
    soreness_rating    INTEGER,
    environment TEXT NOT NULL DEFAULT 'prod',
    created_at         TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI form analysis
CREATE TABLE form_analyses
(
    id                      UUID PRIMARY KEY         DEFAULT uuid_generate_v4(),
    exercise_log_id         UUID REFERENCES exercise_logs (id) ON DELETE CASCADE,
    video_url               TEXT,
    analysis_status         TEXT                     DEFAULT 'pending',
    form_score              NUMERIC,
    feedback                TEXT,
    detected_issues         TEXT[],
    improvement_suggestions TEXT[],
    joint_angles            JSON,
    environment TEXT NOT NULL DEFAULT 'prod',
    created_at              TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at              TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User progress metrics
CREATE TABLE progress_metrics
(
    id            UUID PRIMARY KEY         DEFAULT uuid_generate_v4(),
    user_id       UUID REFERENCES profiles (id) ON DELETE CASCADE,
    metric_type   TEXT,
    metric_value  NUMERIC,
    recorded_date DATE                     DEFAULT CURRENT_DATE,
    notes         TEXT,
    environment TEXT NOT NULL DEFAULT 'prod',
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles table RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE
POLICY "Users can view their own profile"
  ON profiles FOR
SELECT
    USING (auth.uid() = id AND environment = 'prod');

CREATE
POLICY "Users can update their own profile"
  ON profiles FOR
UPDATE
    USING (auth.uid() = id AND environment = 'prod');

-- Workout plans RLS
ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;

CREATE
POLICY "Users can view their own workout plans"
  ON workout_plans FOR
SELECT
    USING (auth.uid() = user_id AND environment = 'prod');

CREATE
POLICY "Users can create their own workout plans"
  ON workout_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id AND environment = 'prod');

CREATE
POLICY "Users can update their own workout plans"
  ON workout_plans FOR
UPDATE
    USING (auth.uid() = user_id AND environment = 'prod');

CREATE
POLICY "Users can delete their own workout plans"
  ON workout_plans FOR DELETE
USING (auth.uid() = user_id AND environment = 'prod');

-- Workout plan exercises RLS
ALTER TABLE workout_plan_exercises ENABLE ROW LEVEL SECURITY;

CREATE
POLICY "Users can view their own workout plan exercises"
  ON workout_plan_exercises FOR
SELECT
    USING (auth.uid() IN (
    SELECT user_id FROM workout_plans wp
    WHERE wp.id = workout_plan_exercises.workout_plan_id
    ) AND environment = 'prod');

CREATE
POLICY "Users can create their own workout plan exercises"
  ON workout_plan_exercises FOR INSERT
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM workout_plans wp 
    WHERE wp.id = workout_plan_exercises.workout_plan_id
  ) AND environment = 'prod');

CREATE
POLICY "Users can update their own workout plan exercises"
  ON workout_plan_exercises FOR
UPDATE
    USING (auth.uid() IN (
    SELECT user_id FROM workout_plans wp
    WHERE wp.id = workout_plan_exercises.workout_plan_id
    ) AND environment = 'prod');

CREATE
POLICY "Users can delete their own workout plan exercises"
  ON workout_plan_exercises FOR DELETE
USING (auth.uid() IN (
    SELECT user_id FROM workout_plans wp 
    WHERE wp.id = workout_plan_exercises.workout_plan_id
  ) AND environment = 'prod');

-- Workout sessions RLS
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;

CREATE
POLICY "Users can view their own workout sessions"
  ON workout_sessions FOR
SELECT
    USING (auth.uid() = user_id AND environment = 'prod');

CREATE
POLICY "Users can create their own workout sessions"
  ON workout_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id AND environment = 'prod');

CREATE
POLICY "Users can update their own workout sessions"
  ON workout_sessions FOR
UPDATE
    USING (auth.uid() = user_id AND environment = 'prod');

CREATE
POLICY "Users can delete their own workout sessions"
  ON workout_sessions FOR DELETE
USING (auth.uid() = user_id AND environment = 'prod');

-- Exercise logs RLS
ALTER TABLE exercise_logs ENABLE ROW LEVEL SECURITY;

CREATE
POLICY "Users can view their own exercise logs"
  ON exercise_logs FOR
SELECT
    USING (auth.uid() IN (
    SELECT user_id FROM workout_sessions ws
    WHERE ws.id = exercise_logs.workout_session_id
    ) AND environment = 'prod');

CREATE
POLICY "Users can create their own exercise logs"
  ON exercise_logs FOR INSERT
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM workout_sessions ws 
    WHERE ws.id = exercise_logs.workout_session_id
  ) AND environment = 'prod');

CREATE
POLICY "Users can update their own exercise logs"
  ON exercise_logs FOR
UPDATE
    USING (auth.uid() IN (
    SELECT user_id FROM workout_sessions ws
    WHERE ws.id = exercise_logs.workout_session_id
    ) AND environment = 'prod');

CREATE
POLICY "Users can delete their own exercise logs"
  ON exercise_logs FOR DELETE
USING (auth.uid() IN (
    SELECT user_id FROM workout_sessions ws 
    WHERE ws.id = exercise_logs.workout_session_id
  ) AND environment = 'prod');

-- Form analyses RLS
ALTER TABLE form_analyses ENABLE ROW LEVEL SECURITY;

CREATE
POLICY "Users can view their own form analyses"
  ON form_analyses FOR
SELECT
    USING (auth.uid() IN (
    SELECT ws.user_id FROM workout_sessions ws
    JOIN exercise_logs el ON ws.id = el.workout_session_id
    WHERE el.id = form_analyses.exercise_log_id
    ) AND environment = 'prod');

-- Progress metrics RLS
ALTER TABLE progress_metrics ENABLE ROW LEVEL SECURITY;

CREATE
POLICY "Users can view their own progress metrics"
  ON progress_metrics FOR
SELECT
    USING (auth.uid() = user_id AND environment = 'prod');

CREATE
POLICY "Users can create their own progress metrics"
  ON progress_metrics FOR INSERT
  WITH CHECK (auth.uid() = user_id AND environment = 'prod');

CREATE
POLICY "Users can update their own progress metrics"
  ON progress_metrics FOR
UPDATE
    USING (auth.uid() = user_id AND environment = 'prod');

CREATE
POLICY "Users can delete their own progress metrics"
  ON progress_metrics FOR DELETE
USING (auth.uid() = user_id AND environment = 'prod');

-- Exercises table (public read access, admin-only write)
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

CREATE
POLICY "Exercises are viewable by all users"
  ON exercises FOR
SELECT
    USING (environment = 'prod');

-- Function to update updated_at timestamp
CREATE
OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at
= NOW();
RETURN NEW;
END;
$$
LANGUAGE plpgsql;

-- Add trigger to profiles table
CREATE TRIGGER update_profiles_modtime
    BEFORE UPDATE
    ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Add trigger to workout_plans table
CREATE TRIGGER update_workout_plans_modtime
    BEFORE UPDATE
    ON workout_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Add trigger to form_analyses table
CREATE TRIGGER update_form_analyses_modtime
    BEFORE UPDATE
    ON form_analyses
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();
