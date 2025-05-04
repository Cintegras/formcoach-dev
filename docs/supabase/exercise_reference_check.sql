-- Exercise Reference Check Script
-- This script checks if there are any exercise_logs that reference exercises that don't exist

-- Set environment to 'dev' for all queries
SET
search_path TO public;

-- 1. Check for exercise_logs with invalid exercise_id references
SELECT 'Exercise Logs with Invalid References' as check_type,
       COUNT(*) as count
FROM exercise_logs el
    LEFT JOIN exercises e
ON el.exercise_id = e.id
WHERE el.environment = 'dev'
  AND e.id IS NULL
  AND el.exercise_id IS NOT NULL;

-- 2. Check for specific exercises referenced in workout_history.sql
SELECT 'Missing Exercises Check' as check_type,
       name                      as exercise_name,
       'MISSING'                 as status
FROM (VALUES ('Barbell Bench Press'),
             ('Incline Dumbbell Press'),
             ('Push-ups'),
             ('Pull-ups'),
             ('Barbell Rows'),
             ('Lat Pulldown'),
             ('Barbell Squat'),
             ('Romanian Deadlift'),
             ('Leg Press'),
             ('Overhead Press'),
             ('Lateral Raises'),
             ('Bicep Curls'),
             ('Tricep Pushdowns')) as expected_exercises(name)
WHERE name NOT IN (SELECT name
                   FROM exercises
                   WHERE environment = 'dev');

-- 3. Check which exercises are actually used in exercise_logs
SELECT 'Exercises Used in Logs' as check_type,
       e.name                   as exercise_name,
       COUNT(*)                 as usage_count
FROM exercise_logs el
         JOIN exercises e ON el.exercise_id = e.id
WHERE el.environment = 'dev'
GROUP BY e.name
ORDER BY COUNT(*) DESC;

-- 4. Check for any exercise_logs that might have failed to insert
-- This is more difficult to determine directly, but we can check if there are fewer logs than expected
SELECT 'Exercise Logs Count Check' as check_type,
       COUNT(*)                    as actual_count,
       CASE
           WHEN COUNT(*) < 24 THEN 'POTENTIAL ISSUE - Fewer logs than expected'
           ELSE 'OK - Expected number of logs found'
           END                     as status
FROM exercise_logs el
         JOIN workout_sessions ws ON el.workout_session_id = ws.id
WHERE ws.user_id = 'e49b1178-bbd0-4e19-8362-ce4971d63a45'
  AND el.environment = 'dev';

-- 5. Check if all expected exercise combinations are present in the logs
WITH expected_combinations AS (SELECT session_date, exercise_name
                               FROM (VALUES ('2023-05-01', 'Barbell Bench Press'),
                                            ('2023-05-01', 'Pull-ups'),
                                            ('2023-05-01', 'Barbell Squat'),
                                            ('2023-05-03', 'Overhead Press'),
                                            ('2023-05-03', 'Romanian Deadlift'),
                                            ('2023-05-03', 'Lat Pulldown'),
                                            ('2023-05-05', 'Bicep Curls'),
                                            ('2023-05-05', 'Tricep Pushdowns'),
                                            ('2023-05-05', 'Lateral Raises')) as expected(session_date, exercise_name)),
     actual_combinations AS (SELECT ws.start_time::date as session_date, e.name as exercise_name
                             FROM exercise_logs el
                                      JOIN workout_sessions ws ON el.workout_session_id = ws.id
                                      JOIN exercises e ON el.exercise_id = e.id
                             WHERE ws.user_id = 'e49b1178-bbd0-4e19-8362-ce4971d63a45'
                               AND el.environment = 'dev')
SELECT 'Missing Exercise-Session Combinations' as check_type,
       ec.session_date,
       ec.exercise_name,
       'MISSING'                               as status
FROM expected_combinations ec
         LEFT JOIN actual_combinations ac
                   ON ec.session_date = ac.session_date
                       AND ec.exercise_name = ac.exercise_name
WHERE ac.exercise_name IS NULL
ORDER BY ec.session_date, ec.exercise_name;