-- Data Verification Report
-- This script generates a comprehensive report to verify that all workout history data
-- was entered correctly for user e49b1178-bbd0-4e19-8362-ce4971d63a45

-- Set environment to 'dev' for all queries
SET
search_path TO public;

-- Create a temporary table to store verification results
CREATE
TEMP TABLE verification_results (
    check_name TEXT,
    status TEXT,
    details TEXT
);

-- 1. User Profile Verification
INSERT INTO verification_results
SELECT 'User Profile',
       CASE WHEN COUNT(*) > 0 THEN 'PASS' ELSE 'FAIL' END,
       'Found ' || COUNT(*) || ' profile(s) for the mock user'
FROM profiles
WHERE id = 'e49b1178-bbd0-4e19-8362-ce4971d63a45'
  AND environment = 'dev';

-- 2. Exercises Verification
INSERT INTO verification_results
SELECT 'Exercises',
       CASE WHEN COUNT(*) >= 10 THEN 'PASS' ELSE 'FAIL' END,
       'Found ' || COUNT(*) || ' exercises (expected at least 10)'
FROM exercises
WHERE environment = 'dev'
  AND name IN (
               'Barbell Bench Press', 'Incline Dumbbell Press', 'Push-ups',
               'Pull-ups', 'Barbell Rows', 'Lat Pulldown',
               'Barbell Squat', 'Romanian Deadlift', 'Leg Press',
               'Overhead Press', 'Lateral Raises',
               'Bicep Curls', 'Tricep Pushdowns'
    );

-- 3. Workout Plan Verification
INSERT INTO verification_results
SELECT 'Workout Plan',
       CASE WHEN COUNT(*) > 0 THEN 'PASS' ELSE 'FAIL' END,
       'Found ' || COUNT(*) || ' workout plan(s) for the mock user'
FROM workout_plans
WHERE user_id = 'e49b1178-bbd0-4e19-8362-ce4971d63a45'
  AND environment = 'dev';

-- 4. Workout Plan Exercises Verification
INSERT INTO verification_results
SELECT 'Workout Plan Exercises',
       CASE WHEN COUNT(*) >= 5 THEN 'PASS' ELSE 'FAIL' END,
       'Found ' || COUNT(*) || ' workout plan exercises (expected at least 5)'
FROM workout_plan_exercises wpe
         JOIN workout_plans wp ON wpe.workout_plan_id = wp.id
WHERE wp.user_id = 'e49b1178-bbd0-4e19-8362-ce4971d63a45'
  AND wpe.environment = 'dev';

-- 5. Workout Sessions Verification
INSERT INTO verification_results
SELECT 'Workout Sessions',
       CASE WHEN COUNT(*) >= 12 THEN 'PASS' ELSE 'FAIL' END,
       'Found ' || COUNT(*) || ' workout sessions (expected at least 12)'
FROM workout_sessions
WHERE user_id = 'e49b1178-bbd0-4e19-8362-ce4971d63a45'
  AND environment = 'dev';

-- 6. Exercise Logs Verification
INSERT INTO verification_results
SELECT 'Exercise Logs',
       CASE WHEN COUNT(*) >= 24 THEN 'PASS' ELSE 'FAIL' END,
       'Found ' || COUNT(*) || ' exercise logs (expected at least 24)'
FROM exercise_logs el
         JOIN workout_sessions ws ON el.workout_session_id = ws.id
WHERE ws.user_id = 'e49b1178-bbd0-4e19-8362-ce4971d63a45'
  AND el.environment = 'dev';

-- 7. Progress Metrics Verification
INSERT INTO verification_results
SELECT 'Progress Metrics',
       CASE WHEN COUNT(*) >= 10 THEN 'PASS' ELSE 'FAIL' END,
       'Found ' || COUNT(*) || ' progress metrics (expected at least 10)'
FROM progress_metrics
WHERE user_id = 'e49b1178-bbd0-4e19-8362-ce4971d63a45'
  AND environment = 'dev';

-- 8. Weight Progression Verification
WITH first_week_logs AS (SELECT el.exercise_id, el.weights_used, e.name as exercise_name, ws.start_time
                         FROM exercise_logs el
                                  JOIN workout_sessions ws ON el.workout_session_id = ws.id
                                  JOIN exercises e ON el.exercise_id = e.id
                         WHERE ws.user_id = 'e49b1178-bbd0-4e19-8362-ce4971d63a45'
                           AND el.environment = 'dev'
                         ORDER BY ws.start_time ASC
    LIMIT 10
    )
   , last_week_logs AS (
SELECT el.exercise_id, el.weights_used, e.name as exercise_name, ws.start_time
FROM exercise_logs el
    JOIN workout_sessions ws
ON el.workout_session_id = ws.id
    JOIN exercises e ON el.exercise_id = e.id
WHERE ws.user_id = 'e49b1178-bbd0-4e19-8362-ce4971d63a45'
  AND el.environment = 'dev'
ORDER BY ws.start_time DESC
    LIMIT 10
    ),
    progression_check AS (
SELECT
    COUNT (*) as progressed_exercises, (SELECT COUNT (DISTINCT exercise_id) FROM first_week_logs) as total_exercises
FROM (
    SELECT fw.exercise_id, fw.exercise_name
    FROM first_week_logs fw
    JOIN last_week_logs lw ON fw.exercise_id = lw.exercise_id
    WHERE lw.weights_used[1] > fw.weights_used[1]
    ) as progression
    )
INSERT
INTO verification_results
SELECT 'Weight Progression',
       CASE WHEN progressed_exercises > 0 THEN 'PASS' ELSE 'FAIL' END,
       progressed_exercises || ' out of ' || total_exercises || ' exercises show weight progression'
FROM progression_check;

-- 9. Soreness Rating Variability Check
WITH soreness_stats AS (SELECT COUNT(DISTINCT soreness_rating) as unique_ratings,
                               MIN(soreness_rating)            as min_rating,
                               MAX(soreness_rating)            as max_rating
                        FROM exercise_logs el
                                 JOIN workout_sessions ws ON el.workout_session_id = ws.id
                        WHERE ws.user_id = 'e49b1178-bbd0-4e19-8362-ce4971d63a45'
                          AND el.environment = 'dev'
                          AND soreness_rating IS NOT NULL)
INSERT
INTO verification_results
SELECT 'Soreness Variability',
       CASE WHEN unique_ratings >= 2 THEN 'PASS' ELSE 'FAIL' END,
       'Found ' || unique_ratings || ' different soreness ratings (range: ' || min_rating || '-' || max_rating || ')'
FROM soreness_stats;

-- 10. Session Spacing Check
WITH session_dates
         AS (SELECT start_time::date as session_date, LEAD(start_time::date) OVER (ORDER BY start_time) as next_session_date
             FROM workout_sessions
             WHERE user_id = 'e49b1178-bbd0-4e19-8362-ce4971d63a45'
               AND environment = 'dev'
             ORDER BY start_time),
     date_diffs AS (SELECT COUNT(*)                                           as total_intervals,
                           COUNT(DISTINCT (next_session_date - session_date)) as unique_intervals,
                           MAX(next_session_date - session_date)              as max_days_between
                    FROM session_dates
                    WHERE next_session_date IS NOT NULL)
INSERT
INTO verification_results
SELECT 'Session Spacing',
       CASE WHEN unique_intervals >= 2 THEN 'PASS' ELSE 'FAIL' END,
       'Found ' || unique_intervals || ' different intervals between sessions (max: ' || max_days_between || ' days)'
FROM date_diffs;

-- 11. Overall Time Period Check
WITH date_range AS (SELECT MIN(start_time::date)                         as first_date,
                           MAX(start_time::date)                         as last_date,
                           MAX(start_time::date) - MIN(start_time::date) as date_range_days
                    FROM workout_sessions
                    WHERE user_id = 'e49b1178-bbd0-4e19-8362-ce4971d63a45'
                      AND environment = 'dev')
INSERT
INTO verification_results
SELECT 'Time Period Coverage',
       CASE WHEN date_range_days >= 21 THEN 'PASS' ELSE 'FAIL' END,
       'Sessions span ' || date_range_days || ' days from ' || first_date || ' to ' || last_date ||
       ' (expected at least 21 days)'
FROM date_range;

-- Generate the final report
SELECT check_name as "Check",
       status     as "Status",
       details    as "Details"
FROM verification_results
ORDER BY check_name;

-- Overall verification result
SELECT 'OVERALL VERIFICATION'                                                                    as "Summary",
       CASE WHEN COUNT(*) = 0 THEN 'ALL CHECKS PASSED ✅' ELSE 'SOME CHECKS FAILED ❌' END         as "Result",
       COUNT(*) || ' out of ' || (SELECT COUNT(*) FROM verification_results) || ' checks failed' as "Details"
FROM verification_results
WHERE status = 'FAIL';

-- Clean up
DROP TABLE verification_results;