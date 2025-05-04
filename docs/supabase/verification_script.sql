-- SQL Verification Script
-- This script checks if all data from workout_history.sql was entered correctly

-- Set environment to 'dev' for all queries
SET
search_path TO public;

-- 1. Check if the mock user profile exists
SELECT 'User Profile Check'                               as check_type,
       CASE WHEN COUNT(*) > 0 THEN 'PASS' ELSE 'FAIL' END as result,
       COUNT(*) as count
FROM profiles
WHERE id = 'e49b1178-bbd0-4e19-8362-ce4971d63a45'
  AND environment = 'dev';

-- 2. Check if exercises were created
SELECT 'Exercises Check'                                    as check_type,
       CASE WHEN COUNT(*) >= 10 THEN 'PASS' ELSE 'FAIL' END as result,
       COUNT(*) as count
FROM exercises
WHERE environment = 'dev'
  AND name IN (
    'Barbell Bench Press'
    , 'Incline Dumbbell Press'
    , 'Push-ups'
    , 'Pull-ups'
    , 'Barbell Rows'
    , 'Lat Pulldown'
    , 'Barbell Squat'
    , 'Romanian Deadlift'
    , 'Leg Press'
    , 'Overhead Press'
    , 'Lateral Raises'
    , 'Bicep Curls'
    , 'Tricep Pushdowns'
    );

-- 3. Check if workout plan was created
SELECT 'Workout Plan Check'                               as check_type,
       CASE WHEN COUNT(*) > 0 THEN 'PASS' ELSE 'FAIL' END as result,
       COUNT(*) as count
FROM workout_plans
WHERE user_id = 'e49b1178-bbd0-4e19-8362-ce4971d63a45'
  AND environment = 'dev'
  AND name = 'Full Body Strength Program';

-- 4. Check if workout plan exercises were added
SELECT 'Workout Plan Exercises Check'                      as check_type,
       CASE WHEN COUNT(*) >= 5 THEN 'PASS' ELSE 'FAIL' END as result,
       COUNT(*) as count
FROM workout_plan_exercises wpe
    JOIN workout_plans wp
ON wpe.workout_plan_id = wp.id
WHERE wp.user_id = 'e49b1178-bbd0-4e19-8362-ce4971d63a45'
  AND wpe.environment = 'dev';

-- 5. Check if workout sessions were created (should be at least 12)
SELECT 'Workout Sessions Check'                             as check_type,
       CASE WHEN COUNT(*) >= 12 THEN 'PASS' ELSE 'FAIL' END as result,
       COUNT(*) as count
FROM workout_sessions
WHERE user_id = 'e49b1178-bbd0-4e19-8362-ce4971d63a45'
  AND environment = 'dev';

-- 6. Check if exercise logs were created
SELECT 'Exercise Logs Check'                                as check_type,
       CASE WHEN COUNT(*) >= 24 THEN 'PASS' ELSE 'FAIL' END as result,
       COUNT(*) as count
FROM exercise_logs el
    JOIN workout_sessions ws
ON el.workout_session_id = ws.id
WHERE ws.user_id = 'e49b1178-bbd0-4e19-8362-ce4971d63a45'
  AND el.environment = 'dev';

-- 7. Check if progress metrics were created
SELECT 'Progress Metrics Check'                             as check_type,
       CASE WHEN COUNT(*) >= 10 THEN 'PASS' ELSE 'FAIL' END as result,
       COUNT(*) as count
FROM progress_metrics
WHERE user_id = 'e49b1178-bbd0-4e19-8362-ce4971d63a45'
  AND environment = 'dev';

-- 8. Check for progression in weights used (should increase over time)
WITH first_session AS (SELECT el.exercise_id, el.weights_used, ws.start_time
                       FROM exercise_logs el
                                JOIN workout_sessions ws ON el.workout_session_id = ws.id
                       WHERE ws.user_id = 'e49b1178-bbd0-4e19-8362-ce4971d63a45'
                         AND el.environment = 'dev'
                       ORDER BY ws.start_time ASC
    LIMIT 3
    )
   , last_session AS (
SELECT el.exercise_id, el.weights_used, ws.start_time
FROM exercise_logs el
    JOIN workout_sessions ws
ON el.workout_session_id = ws.id
WHERE ws.user_id = 'e49b1178-bbd0-4e19-8362-ce4971d63a45'
  AND el.environment = 'dev'
ORDER BY ws.start_time DESC
    LIMIT 3
    )
SELECT 'Weight Progression Check'                         as check_type,
       CASE WHEN COUNT(*) > 0 THEN 'PASS' ELSE 'FAIL' END as result,
       COUNT(*) as count
FROM (
    SELECT fs.exercise_id
    FROM first_session fs
    JOIN last_session ls ON fs.exercise_id = ls.exercise_id
    WHERE ls.weights_used[1] > fs.weights_used[1]
    ) as progression;

-- 9. Summary of all checks
SELECT 'OVERALL VERIFICATION'                                                        as verification,
       CASE WHEN COUNT(*) = 0 THEN 'ALL CHECKS PASSED' ELSE 'SOME CHECKS FAILED' END as result,
       COUNT(*)                                                                      as failed_checks
FROM (
         -- User Profile
         SELECT 1
         FROM profiles
         WHERE id = 'e49b1178-bbd0-4e19-8362-ce4971d63a45'
           AND environment = 'dev'
         HAVING COUNT(*) = 0

         UNION ALL

         -- Exercises
         SELECT 1
         FROM exercises
         WHERE environment = 'dev'
           AND name IN (
                        'Barbell Bench Press', 'Incline Dumbbell Press', 'Push-ups',
                        'Pull-ups', 'Barbell Rows', 'Lat Pulldown',
                        'Barbell Squat', 'Romanian Deadlift', 'Leg Press',
                        'Overhead Press', 'Lateral Raises',
                        'Bicep Curls', 'Tricep Pushdowns'
             )
         HAVING COUNT(*) < 10

         UNION ALL

         -- Workout Plan
         SELECT 1
         FROM workout_plans
         WHERE user_id = 'e49b1178-bbd0-4e19-8362-ce4971d63a45'
           AND environment = 'dev'
           AND name = 'Full Body Strength Program'
         HAVING COUNT(*) = 0

         UNION ALL

         -- Workout Plan Exercises
         SELECT 1
         FROM workout_plan_exercises wpe
                  JOIN workout_plans wp ON wpe.workout_plan_id = wp.id
         WHERE wp.user_id = 'e49b1178-bbd0-4e19-8362-ce4971d63a45'
           AND wpe.environment = 'dev'
         HAVING COUNT(*) < 5

         UNION ALL

         -- Workout Sessions
         SELECT 1
         FROM workout_sessions
         WHERE user_id = 'e49b1178-bbd0-4e19-8362-ce4971d63a45'
           AND environment = 'dev'
         HAVING COUNT(*) < 12

         UNION ALL

         -- Exercise Logs
         SELECT 1
         FROM exercise_logs el
                  JOIN workout_sessions ws ON el.workout_session_id = ws.id
         WHERE ws.user_id = 'e49b1178-bbd0-4e19-8362-ce4971d63a45'
           AND el.environment = 'dev'
         HAVING COUNT(*) < 24

         UNION ALL

         -- Progress Metrics
         SELECT 1
         FROM progress_metrics
         WHERE user_id = 'e49b1178-bbd0-4e19-8362-ce4971d63a45'
           AND environment = 'dev'
         HAVING COUNT(*) < 10) as failed;