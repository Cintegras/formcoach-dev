-- FormCoach Workout History SQL
-- This script populates realistic workout history for a single mock user in the FormCoach dev environment.
-- User ID: e49b1178-bbd0-4e19-8362-ce4971d63a45

-- Set environment to 'dev' for all inserts
SET
search_path TO public;

-- 1. Create profile for our mock user (if it doesn't exist)
INSERT INTO profiles (id, username, full_name, height, weight, fitness_level, goals, environment)
VALUES ('e49b1178-bbd0-4e19-8362-ce4971d63a45',
        'mockuser',
        'Mock User',
        175, -- height in cm
        80, -- weight in kg
        'intermediate',
        ARRAY['strength', 'muscle_gain'],
        'dev') ON CONFLICT (id) DO
UPDATE
    SET height = 175, weight = 80, fitness_level = 'intermediate', goals = ARRAY['strength', 'muscle_gain'];

-- 2. Create exercises (if they don't exist)
-- We'll create a variety of exercises for different muscle groups

-- Chest exercises
INSERT INTO exercises (id, name, description, muscle_groups, equipment, difficulty_level, environment)
VALUES (uuid_generate_v4(), 'Barbell Bench Press',
        'A compound chest exercise performed with a barbell while lying on a bench.', ARRAY['chest', 'triceps',
        'shoulders'], ARRAY['barbell', 'bench'], 'intermediate', 'dev'),
       (uuid_generate_v4(), 'Incline Dumbbell Press', 'A chest exercise performed with dumbbells on an inclined bench.',
        ARRAY['chest', 'shoulders'], ARRAY['dumbbells', 'incline bench'], 'intermediate', 'dev'),
       (uuid_generate_v4(), 'Push-ups', 'A bodyweight exercise targeting the chest, shoulders, and triceps.',
        ARRAY['chest', 'triceps', 'shoulders'], ARRAY['bodyweight'], 'beginner', 'dev') ON CONFLICT (name) DO NOTHING;

-- Back exercises
INSERT INTO exercises (id, name, description, muscle_groups, equipment, difficulty_level, environment)
VALUES (uuid_generate_v4(), 'Pull-ups', 'A bodyweight exercise targeting the back and biceps.', ARRAY['back', 'biceps'],
        ARRAY['pull-up bar'], 'intermediate', 'dev'),
       (uuid_generate_v4(), 'Barbell Rows', 'A compound back exercise performed with a barbell.', ARRAY['back',
        'biceps'], ARRAY['barbell'], 'intermediate', 'dev'),
       (uuid_generate_v4(), 'Lat Pulldown', 'A back exercise performed on a cable machine.', ARRAY['back', 'biceps'],
        ARRAY['cable machine'], 'beginner', 'dev') ON CONFLICT (name) DO NOTHING;

-- Leg exercises
INSERT INTO exercises (id, name, description, muscle_groups, equipment, difficulty_level, environment)
VALUES (uuid_generate_v4(), 'Barbell Squat', 'A compound leg exercise performed with a barbell.', ARRAY['quadriceps',
        'hamstrings', 'glutes'], ARRAY['barbell', 'squat rack'], 'intermediate', 'dev'),
       (uuid_generate_v4(), 'Romanian Deadlift', 'A hamstring-focused exercise performed with a barbell.',
        ARRAY['hamstrings', 'glutes', 'lower back'], ARRAY['barbell'], 'intermediate', 'dev'),
       (uuid_generate_v4(), 'Leg Press', 'A leg exercise performed on a leg press machine.', ARRAY['quadriceps',
        'hamstrings', 'glutes'], ARRAY['leg press machine'], 'beginner', 'dev') ON CONFLICT (name) DO NOTHING;

-- Shoulder exercises
INSERT INTO exercises (id, name, description, muscle_groups, equipment, difficulty_level, environment)
VALUES (uuid_generate_v4(), 'Overhead Press', 'A shoulder exercise performed with a barbell or dumbbells.',
        ARRAY['shoulders', 'triceps'], ARRAY['barbell', 'dumbbells'], 'intermediate', 'dev'),
       (uuid_generate_v4(), 'Lateral Raises', 'An isolation exercise for the lateral deltoids.', ARRAY['shoulders'],
        ARRAY['dumbbells'], 'beginner', 'dev') ON CONFLICT (name) DO NOTHING;

-- Arm exercises
INSERT INTO exercises (id, name, description, muscle_groups, equipment, difficulty_level, environment)
VALUES (uuid_generate_v4(), 'Bicep Curls', 'An isolation exercise for the biceps.', ARRAY['biceps'], ARRAY['dumbbells',
        'barbell'], 'beginner', 'dev'),
       (uuid_generate_v4(), 'Tricep Pushdowns', 'An isolation exercise for the triceps.', ARRAY['triceps'],
        ARRAY['cable machine'], 'beginner', 'dev') ON CONFLICT (name) DO NOTHING;

-- 3. Create a workout plan for our user
WITH new_workout_plan AS (
INSERT
INTO workout_plans (id, user_id, name, description, frequency, duration_weeks, is_active, environment)
VALUES (
    uuid_generate_v4(), 'e49b1178-bbd0-4e19-8362-ce4971d63a45', 'Full Body Strength Program', 'A comprehensive strength training program targeting all major muscle groups', '3x_weekly', 8, true, 'dev'
    )
    RETURNING id
    )

-- 4. Add exercises to the workout plan
-- We'll use the exercise IDs from our previous inserts
        , workout_plan_exercises_insert AS (
WITH exercise_ids AS (
    SELECT id, name FROM exercises
    WHERE name IN ('Barbell Bench Press', 'Pull-ups', 'Barbell Squat', 'Overhead Press', 'Bicep Curls', 'Romanian Deadlift', 'Lateral Raises', 'Tricep Pushdowns')
    AND environment = 'dev'
    )
INSERT
INTO workout_plan_exercises (workout_plan_id, exercise_id, day_of_week, sets, reps, rest_seconds, order_index,
                             environment)
SELECT
    (SELECT id FROM new_workout_plan), id, CASE
    WHEN name IN ('Barbell Bench Press', 'Pull-ups', 'Barbell Squat') THEN 'monday'
    WHEN name IN ('Overhead Press', 'Romanian Deadlift', 'Lat Pulldown') THEN 'wednesday'
    ELSE 'friday'
    END, 3,                            -- sets
    '8-12',                            -- reps
    90,                                -- rest_seconds
    ROW_NUMBER() OVER (ORDER BY name), -- order_index
    'dev'
FROM exercise_ids
    RETURNING workout_plan_id
    )

-- 5. Create workout sessions over a 4-week period
-- We'll create 12 sessions (3 per week for 4 weeks)
-- Week 1
        , week1_sessions AS (
INSERT
INTO workout_sessions (id, user_id, workout_plan_id, start_time, end_time, notes, overall_feeling, environment)
VALUES
    (uuid_generate_v4(), 'e49b1178-bbd0-4e19-8362-ce4971d63a45', (SELECT id FROM new_workout_plan), '2023-05-01 08:00:00', '2023-05-01 09:15:00', 'First session, feeling motivated', 'good', 'dev'), (uuid_generate_v4(), 'e49b1178-bbd0-4e19-8362-ce4971d63a45', (SELECT id FROM new_workout_plan), '2023-05-03 08:00:00', '2023-05-03 09:10:00', 'Still getting used to the routine', 'average', 'dev'), (uuid_generate_v4(), 'e49b1178-bbd0-4e19-8362-ce4971d63a45', (SELECT id FROM new_workout_plan), '2023-05-05 08:00:00', '2023-05-05 09:20:00', 'Feeling stronger already', 'good', 'dev')
    RETURNING id, start_time
    )

-- Week 2
        , week2_sessions AS (
INSERT
INTO workout_sessions (id, user_id, workout_plan_id, start_time, end_time, notes, overall_feeling, environment)
VALUES
    (uuid_generate_v4(), 'e49b1178-bbd0-4e19-8362-ce4971d63a45', (SELECT id FROM new_workout_plan), '2023-05-08 08:00:00', '2023-05-08 09:15:00', 'Good energy today', 'great', 'dev'), (uuid_generate_v4(), 'e49b1178-bbd0-4e19-8362-ce4971d63a45', (SELECT id FROM new_workout_plan), '2023-05-10 08:00:00', '2023-05-10 09:10:00', 'Feeling a bit tired but pushed through', 'average', 'dev'), (uuid_generate_v4(), 'e49b1178-bbd0-4e19-8362-ce4971d63a45', (SELECT id FROM new_workout_plan), '2023-05-12 08:00:00', '2023-05-12 09:20:00', 'Great pump today', 'great', 'dev')
    RETURNING id, start_time
    )

-- Week 3 (skipped one session to simulate variability)
        , week3_sessions AS (
INSERT
INTO workout_sessions (id, user_id, workout_plan_id, start_time, end_time, notes, overall_feeling, environment)
VALUES
    (uuid_generate_v4(), 'e49b1178-bbd0-4e19-8362-ce4971d63a45', (SELECT id FROM new_workout_plan), '2023-05-15 08:00:00', '2023-05-15 09:15:00', 'Back after weekend rest', 'good', 'dev'), (uuid_generate_v4(), 'e49b1178-bbd0-4e19-8362-ce4971d63a45', (SELECT id FROM new_workout_plan), '2023-05-19 08:00:00', '2023-05-19 09:20:00', 'Missed Wednesday due to work, but feeling strong today', 'good', 'dev')
    RETURNING id, start_time
    )

-- Week 4
        , week4_sessions AS (
INSERT
INTO workout_sessions (id, user_id, workout_plan_id, start_time, end_time, notes, overall_feeling, environment)
VALUES
    (uuid_generate_v4(), 'e49b1178-bbd0-4e19-8362-ce4971d63a45', (SELECT id FROM new_workout_plan), '2023-05-22 08:00:00', '2023-05-22 09:15:00', 'Increased weights on most exercises', 'great', 'dev'), (uuid_generate_v4(), 'e49b1178-bbd0-4e19-8362-ce4971d63a45', (SELECT id FROM new_workout_plan), '2023-05-24 08:00:00', '2023-05-24 09:10:00', 'Focused on form today', 'good', 'dev'), (uuid_generate_v4(), 'e49b1178-bbd0-4e19-8362-ce4971d63a45', (SELECT id FROM new_workout_plan), '2023-05-26 08:00:00', '2023-05-26 09:20:00', 'Last session of the month, feeling accomplished', 'great', 'dev')
    RETURNING id, start_time
    )

-- Week 5 (bonus sessions)
        , week5_sessions AS (
INSERT
INTO workout_sessions (id, user_id, workout_plan_id, start_time, end_time, notes, overall_feeling, environment)
VALUES
    (uuid_generate_v4(), 'e49b1178-bbd0-4e19-8362-ce4971d63a45', (SELECT id FROM new_workout_plan), '2023-05-29 08:00:00', '2023-05-29 09:15:00', 'Starting a new month strong', 'great', 'dev'), (uuid_generate_v4(), 'e49b1178-bbd0-4e19-8362-ce4971d63a45', (SELECT id FROM new_workout_plan), '2023-05-31 08:00:00', '2023-05-31 09:10:00', 'Consistent progress', 'good', 'dev')
    RETURNING id, start_time
    )

-- 6. Add exercise logs to each workout session
-- We'll use the session IDs from our CTEs

-- For Week 1, Session 1 (Monday - Chest, Back, Legs)
        , week1_session1_logs AS (
WITH exercise_data AS (
    SELECT id, name FROM exercises
    WHERE name IN ('Barbell Bench Press', 'Pull-ups', 'Barbell Squat')
    AND environment = 'dev'
    )
INSERT
INTO exercise_logs (workout_session_id, exercise_id, sets_completed, reps_completed, weights_used, form_feedback,
                    soreness_rating, environment)
SELECT
    (SELECT id FROM week1_sessions WHERE start_time = '2023-05-01 08:00:00'), id, 3, -- sets_completed
    CASE
    WHEN name = 'Barbell Bench Press' THEN ARRAY[8, 8, 7]
    WHEN name = 'Pull-ups' THEN ARRAY[6, 5, 5]
    WHEN name = 'Barbell Squat' THEN ARRAY[10, 8, 8]
    END,                                                                             -- reps_completed
    CASE
    WHEN name = 'Barbell Bench Press' THEN ARRAY[60, 60, 60]
    WHEN name = 'Pull-ups' THEN ARRAY[0, 0, 0]                                       -- bodyweight
    WHEN name = 'Barbell Squat' THEN ARRAY[70, 70, 70]
    END,                                                                             -- weights_used
    'First session, focusing on form', 3,                                            -- moderate soreness
    'dev'
FROM exercise_data;

-- For Week 1, Session 2 (Wednesday - Shoulders, Hamstrings, Back)
        , week1_session2_logs AS (
    WITH exercise_data AS (
    SELECT id, name FROM exercises
    WHERE name IN ('Overhead Press', 'Romanian Deadlift', 'Lat Pulldown')
    AND environment = 'dev'
    )
    INSERT INTO exercise_logs (workout_session_id, exercise_id, sets_completed, reps_completed, weights_used, form_feedback, soreness_rating, environment)
    SELECT
    (SELECT id FROM week1_sessions WHERE start_time = '2023-05-03 08:00:00'), id, 3, -- sets_completed
    CASE
    WHEN name = 'Overhead Press' THEN ARRAY[8, 7, 6]
    WHEN name = 'Romanian Deadlift' THEN ARRAY[10, 10, 8]
    WHEN name = 'Lat Pulldown' THEN ARRAY[10, 10, 8]
    END,                                                                             -- reps_completed
    CASE
    WHEN name = 'Overhead Press' THEN ARRAY[40, 40, 40]
    WHEN name = 'Romanian Deadlift' THEN ARRAY[80, 80, 80]
    WHEN name = 'Lat Pulldown' THEN ARRAY[50, 50, 50]
    END,                                                                             -- weights_used
    'Still getting used to the movements', 4,                                        -- higher soreness
    'dev'
    FROM exercise_data;

-- For Week 1, Session 3 (Friday - Arms, Accessories)
        , week1_session3_logs AS (
    WITH exercise_data AS (
    SELECT id, name FROM exercises
    WHERE name IN ('Bicep Curls', 'Tricep Pushdowns', 'Lateral Raises')
    AND environment = 'dev'
    )
    INSERT INTO exercise_logs (workout_session_id, exercise_id, sets_completed, reps_completed, weights_used, form_feedback, soreness_rating, environment)
    SELECT
    (SELECT id FROM week1_sessions WHERE start_time = '2023-05-05 08:00:00'), id, 3, -- sets_completed
    CASE
    WHEN name = 'Bicep Curls' THEN ARRAY[12, 10, 10]
    WHEN name = 'Tricep Pushdowns' THEN ARRAY[12, 12, 10]
    WHEN name = 'Lateral Raises' THEN ARRAY[12, 10, 10]
    END,                                                                             -- reps_completed
    CASE
    WHEN name = 'Bicep Curls' THEN ARRAY[15, 15, 15]
    WHEN name = 'Tricep Pushdowns' THEN ARRAY[25, 25, 25]
    WHEN name = 'Lateral Raises' THEN ARRAY[8, 8, 8]
    END,                                                                             -- weights_used
    'Good pump in the arms today', 2,                                                -- lower soreness
    'dev'
    FROM exercise_data;

-- For Week 2, Session 1 (Monday - Chest, Back, Legs) - Slight progression
        , week2_session1_logs AS (
    WITH exercise_data AS (
    SELECT id, name FROM exercises
    WHERE name IN ('Barbell Bench Press', 'Pull-ups', 'Barbell Squat')
    AND environment = 'dev'
    )
    INSERT INTO exercise_logs (workout_session_id, exercise_id, sets_completed, reps_completed, weights_used, form_feedback, soreness_rating, environment)
    SELECT
    (SELECT id FROM week2_sessions WHERE start_time = '2023-05-08 08:00:00'), id, 3, -- sets_completed
    CASE
    WHEN name = 'Barbell Bench Press' THEN ARRAY[9, 8, 8]
    WHEN name = 'Pull-ups' THEN ARRAY[7, 6, 5]
    WHEN name = 'Barbell Squat' THEN ARRAY[10, 10, 8]
    END,                                                                             -- reps_completed
    CASE
    WHEN name = 'Barbell Bench Press' THEN ARRAY[62.5, 62.5, 62.5]
    WHEN name = 'Pull-ups' THEN ARRAY[0, 0, 0]                                       -- bodyweight
    WHEN name = 'Barbell Squat' THEN ARRAY[75, 75, 75]
    END,                                                                             -- weights_used
    'Increased weights slightly, form is improving', 3,                              -- moderate soreness
    'dev'
    FROM exercise_data;

-- For Week 2, Session 2 (Wednesday - Shoulders, Hamstrings, Back) - Slight progression
        , week2_session2_logs AS (
    WITH exercise_data AS (
    SELECT id, name FROM exercises
    WHERE name IN ('Overhead Press', 'Romanian Deadlift', 'Lat Pulldown')
    AND environment = 'dev'
    )
    INSERT INTO exercise_logs (workout_session_id, exercise_id, sets_completed, reps_completed, weights_used, form_feedback, soreness_rating, environment)
    SELECT
    (SELECT id FROM week2_sessions WHERE start_time = '2023-05-10 08:00:00'), id, 3, -- sets_completed
    CASE
    WHEN name = 'Overhead Press' THEN ARRAY[8, 8, 7]
    WHEN name = 'Romanian Deadlift' THEN ARRAY[10, 10, 10]
    WHEN name = 'Lat Pulldown' THEN ARRAY[12, 10, 10]
    END,                                                                             -- reps_completed
    CASE
    WHEN name = 'Overhead Press' THEN ARRAY[42.5, 42.5, 42.5]
    WHEN name = 'Romanian Deadlift' THEN ARRAY[85, 85, 85]
    WHEN name = 'Lat Pulldown' THEN ARRAY[55, 55, 55]
    END,                                                                             -- weights_used
    'Feeling stronger on all lifts', 3,                                              -- moderate soreness
    'dev'
    FROM exercise_data;

-- Continue with similar patterns for remaining sessions, showing progression

-- For Week 4, Session 3 (Friday - Arms, Accessories) - Significant progression
        , week4_session3_logs AS (
    WITH exercise_data AS (
    SELECT id, name FROM exercises
    WHERE name IN ('Bicep Curls', 'Tricep Pushdowns', 'Lateral Raises')
    AND environment = 'dev'
    )
    INSERT INTO exercise_logs (workout_session_id, exercise_id, sets_completed, reps_completed, weights_used, form_feedback, soreness_rating, environment)
    SELECT
    (SELECT id FROM week4_sessions WHERE start_time = '2023-05-26 08:00:00'), id, 3, -- sets_completed
    CASE
    WHEN name = 'Bicep Curls' THEN ARRAY[12, 12, 10]
    WHEN name = 'Tricep Pushdowns' THEN ARRAY[15, 12, 12]
    WHEN name = 'Lateral Raises' THEN ARRAY[15, 12, 12]
    END,                                                                             -- reps_completed
    CASE
    WHEN name = 'Bicep Curls' THEN ARRAY[17.5, 17.5, 17.5]
    WHEN name = 'Tricep Pushdowns' THEN ARRAY[30, 30, 30]
    WHEN name = 'Lateral Raises' THEN ARRAY[10, 10, 10]
    END,                                                                             -- weights_used
    'Great progress over the month, arms feeling stronger', 2,                       -- lower soreness as adaptation occurs
    'dev'
    FROM exercise_data;

-- 7. Add progress metrics (weekly measurements)
        , progress_metrics_insert AS (
    INSERT INTO progress_metrics (user_id, metric_type, metric_value, recorded_date, notes, environment)
    VALUES
-- Week 1
    ('e49b1178-bbd0-4e19-8362-ce4971d63a45', 'weight', 80.0, '2023-05-01', 'Starting weight', 'dev'), ('e49b1178-bbd0-4e19-8362-ce4971d63a45', 'body_fat', 18.0, '2023-05-01', 'Starting body fat percentage', 'dev'), ('e49b1178-bbd0-4e19-8362-ce4971d63a45', 'strength_score', 100, '2023-05-01', 'Baseline strength assessment', 'dev'),

-- Week 2
    ('e49b1178-bbd0-4e19-8362-ce4971d63a45', 'weight', 79.5, '2023-05-08', 'Slight decrease', 'dev'), ('e49b1178-bbd0-4e19-8362-ce4971d63a45', 'body_fat', 17.8, '2023-05-08', 'Small improvement', 'dev'), ('e49b1178-bbd0-4e19-8362-ce4971d63a45', 'strength_score', 105, '2023-05-08', 'Improving strength', 'dev'),

-- Week 3
    ('e49b1178-bbd0-4e19-8362-ce4971d63a45', 'weight', 79.2, '2023-05-15', 'Continuing to lose fat', 'dev'), ('e49b1178-bbd0-4e19-8362-ce4971d63a45', 'body_fat', 17.5, '2023-05-15', 'Steady progress', 'dev'), ('e49b1178-bbd0-4e19-8362-ce4971d63a45', 'strength_score', 110, '2023-05-15', 'Consistent strength gains', 'dev'),

-- Week 4
    ('e49b1178-bbd0-4e19-8362-ce4971d63a45', 'weight', 79.0, '2023-05-22', 'Weight trending down', 'dev'), ('e49b1178-bbd0-4e19-8362-ce4971d63a45', 'body_fat', 17.0, '2023-05-22', 'Good progress on body composition', 'dev'), ('e49b1178-bbd0-4e19-8362-ce4971d63a45', 'strength_score', 115, '2023-05-22', 'Strength continuing to improve', 'dev'),

-- Week 5
    ('e49b1178-bbd0-4e19-8362-ce4971d63a45', 'weight', 78.8, '2023-05-29', 'Consistent progress', 'dev'), ('e49b1178-bbd0-4e19-8362-ce4971d63a45', 'body_fat', 16.8, '2023-05-29', 'Body fat continuing to decrease', 'dev'), ('e49b1178-bbd0-4e19-8362-ce4971d63a45', 'strength_score', 120, '2023-05-29', 'Significant strength improvement', 'dev')
    RETURNING id
    )

-- 8. Execute all CTEs and return success message
    SELECT 'Successfully created workout history for user e49b1178-bbd0-4e19-8362-ce4971d63a45' AS result;
