# Step 3 Implementation: RLS Policies

This document provides instructions for implementing Step 3 (Implement and Test RLS Policies) from the
DATABASE_SCHEMA_IMPLEMENTATION_STEPS.md file.

## Instructions for Implementing RLS Policies

1. Log in to your Supabase account
2. Select your FormCoach project
3. Navigate to the SQL Editor (left sidebar)
4. Click "New Query" to create a new SQL script
5. Copy and paste the following SQL code:

```sql
-- Profiles table RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);
  
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Workout plans RLS
ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own workout plans"
  ON workout_plans FOR SELECT
  USING (auth.uid() = user_id);
  
CREATE POLICY "Users can create their own workout plans"
  ON workout_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own workout plans"
  ON workout_plans FOR UPDATE
  USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete their own workout plans"
  ON workout_plans FOR DELETE
  USING (auth.uid() = user_id);

-- Workout plan exercises RLS
ALTER TABLE workout_plan_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own workout plan exercises"
  ON workout_plan_exercises FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM workout_plans wp 
    WHERE wp.id = workout_plan_exercises.workout_plan_id
  ));
  
CREATE POLICY "Users can create their own workout plan exercises"
  ON workout_plan_exercises FOR INSERT
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM workout_plans wp 
    WHERE wp.id = workout_plan_exercises.workout_plan_id
  ));
  
CREATE POLICY "Users can update their own workout plan exercises"
  ON workout_plan_exercises FOR UPDATE
  USING (auth.uid() IN (
    SELECT user_id FROM workout_plans wp 
    WHERE wp.id = workout_plan_exercises.workout_plan_id
  ));
  
CREATE POLICY "Users can delete their own workout plan exercises"
  ON workout_plan_exercises FOR DELETE
  USING (auth.uid() IN (
    SELECT user_id FROM workout_plans wp 
    WHERE wp.id = workout_plan_exercises.workout_plan_id
  ));

-- Workout sessions RLS
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own workout sessions"
  ON workout_sessions FOR SELECT
  USING (auth.uid() = user_id);
  
CREATE POLICY "Users can create their own workout sessions"
  ON workout_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own workout sessions"
  ON workout_sessions FOR UPDATE
  USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete their own workout sessions"
  ON workout_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Exercise logs RLS
ALTER TABLE exercise_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own exercise logs"
  ON exercise_logs FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM workout_sessions ws 
    WHERE ws.id = exercise_logs.workout_session_id
  ));
  
CREATE POLICY "Users can create their own exercise logs"
  ON exercise_logs FOR INSERT
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM workout_sessions ws 
    WHERE ws.id = exercise_logs.workout_session_id
  ));
  
CREATE POLICY "Users can update their own exercise logs"
  ON exercise_logs FOR UPDATE
  USING (auth.uid() IN (
    SELECT user_id FROM workout_sessions ws 
    WHERE ws.id = exercise_logs.workout_session_id
  ));
  
CREATE POLICY "Users can delete their own exercise logs"
  ON exercise_logs FOR DELETE
  USING (auth.uid() IN (
    SELECT user_id FROM workout_sessions ws 
    WHERE ws.id = exercise_logs.workout_session_id
  ));

-- Form analyses RLS
ALTER TABLE form_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own form analyses"
  ON form_analyses FOR SELECT
  USING (auth.uid() IN (
    SELECT ws.user_id FROM workout_sessions ws 
    JOIN exercise_logs el ON ws.id = el.workout_session_id
    WHERE el.id = form_analyses.exercise_log_id
  ));

-- Progress metrics RLS
ALTER TABLE progress_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progress metrics"
  ON progress_metrics FOR SELECT
  USING (auth.uid() = user_id);
  
CREATE POLICY "Users can create their own progress metrics"
  ON progress_metrics FOR INSERT
  WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own progress metrics"
  ON progress_metrics FOR UPDATE
  USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete their own progress metrics"
  ON progress_metrics FOR DELETE
  USING (auth.uid() = user_id);

-- Exercises table (public read access, admin-only write)
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Exercises are viewable by all users"
  ON exercises FOR SELECT
  USING (true);
```

6. Execute the SQL code by clicking the "Run" button

## Testing RLS Policies

After implementing the RLS policies, you should test them to ensure they work correctly:

1. Create a test user through the Supabase Auth UI or API
2. Use the SQL Editor to run the following test queries:

```sql
-- 1. Set the role to the authenticated user (replace with actual user ID)
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claim.sub = 'user-uuid-here';

-- 2. Try to select from profiles
SELECT * FROM profiles;

-- 3. Try to insert into workout_plans
INSERT INTO workout_plans (user_id, name, description)
VALUES ('user-uuid-here', 'Test Plan', 'This is a test plan');

-- 4. Try to select from workout_plans with a different user ID
SELECT * FROM workout_plans WHERE user_id != 'user-uuid-here';
```

The last query should return no results if RLS is working correctly, as users should only be able to see their own
workout plans.

## Verification

After implementing and testing the RLS policies, verify them by:

1. Going to the "Table Editor" in the Supabase dashboard
2. Clicking on each table
3. Clicking on "Policies" for each table to verify RLS policies are in place
4. Ensure that each table has the appropriate policies for SELECT, INSERT, UPDATE, and DELETE operations

## Completion

Once you've implemented, tested, and verified the RLS policies, you've successfully completed Step 3 of the database
schema implementation process.