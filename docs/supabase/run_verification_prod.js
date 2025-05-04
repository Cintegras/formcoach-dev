/**
 * Script to run the verification SQL for the production environment
 * This script checks:
 * - All data rows include environment = 'prod'
 * - No test/mocked data present
 * - Referential integrity of exercises, plans, and logs
 */

const {execSync} = require('child_process');
const fs = require('fs');
const path = require('path');

// Get the database connection string from .env file
require('dotenv').config();

// Function to run the verification script
function runProdVerification() {
    console.log('Running verification script for PRODUCTION environment...');
    console.log('Checking for environment = "prod", no test data, and referential integrity...');

    try {
        // Create the SQL queries for production verification
        const productionVerificationSql = `
-- Production Environment Verification Script
-- This script checks if all data in the production environment meets the requirements:
-- 1. All data rows include environment = 'prod'
-- 2. No test/mocked data present
-- 3. Referential integrity of exercises, plans, and logs

-- Set search path
SET search_path TO public;

-- 1. Check if all tables have environment = 'prod'
SELECT 'Environment Column Check' as check_type,
       table_name,
       CASE WHEN non_prod_count = 0 THEN 'PASS' ELSE 'FAIL' END as result,
       non_prod_count as non_prod_rows
FROM (
  SELECT 'profiles' as table_name, COUNT(*) as non_prod_count FROM profiles WHERE environment != 'prod'
  UNION ALL
  SELECT 'exercises' as table_name, COUNT(*) as non_prod_count FROM exercises WHERE environment != 'prod'
  UNION ALL
  SELECT 'workout_plans' as table_name, COUNT(*) as non_prod_count FROM workout_plans WHERE environment != 'prod'
  UNION ALL
  SELECT 'workout_plan_exercises' as table_name, COUNT(*) as non_prod_count FROM workout_plan_exercises WHERE environment != 'prod'
  UNION ALL
  SELECT 'workout_sessions' as table_name, COUNT(*) as non_prod_count FROM workout_sessions WHERE environment != 'prod'
  UNION ALL
  SELECT 'exercise_logs' as table_name, COUNT(*) as non_prod_count FROM exercise_logs WHERE environment != 'prod'
  UNION ALL
  SELECT 'progress_metrics' as table_name, COUNT(*) as non_prod_count FROM progress_metrics WHERE environment != 'prod'
) as env_checks
WHERE non_prod_count > 0;

-- 2. Check for test/mocked data
SELECT 'Test Data Check' as check_type,
       'Mock User Check' as check_name,
       CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END as result,
       COUNT(*) as count
FROM profiles 
WHERE id IN (
  'e49b1178-bbd0-4e19-8362-ce4971d63a45', -- Known mock user ID
  'df85e454-730d-460c-a34e-8e1fce3bf648'  -- Another known mock user ID
)
AND environment = 'prod';

-- Check for test exercise names (these should not be in production)
SELECT 'Test Data Check' as check_type,
       'Test Exercise Names' as check_name,
       CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END as result,
       COUNT(*) as count
FROM exercises
WHERE name LIKE 'Test%' OR name LIKE 'Mock%' OR name LIKE 'Dummy%'
AND environment = 'prod';

-- 3. Check referential integrity

-- 3.1 Check for exercise_logs with invalid exercise_id references
SELECT 'Referential Integrity Check' as check_type,
       'Exercise Logs -> Exercises' as check_name,
       CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END as result,
       COUNT(*) as invalid_references
FROM exercise_logs el
LEFT JOIN exercises e ON el.exercise_id = e.id AND e.environment = 'prod'
WHERE el.environment = 'prod'
AND e.id IS NULL
AND el.exercise_id IS NOT NULL;

-- 3.2 Check for workout_plan_exercises with invalid exercise_id references
SELECT 'Referential Integrity Check' as check_type,
       'Workout Plan Exercises -> Exercises' as check_name,
       CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END as result,
       COUNT(*) as invalid_references
FROM workout_plan_exercises wpe
LEFT JOIN exercises e ON wpe.exercise_id = e.id AND e.environment = 'prod'
WHERE wpe.environment = 'prod'
AND e.id IS NULL
AND wpe.exercise_id IS NOT NULL;

-- 3.3 Check for workout_plan_exercises with invalid workout_plan_id references
SELECT 'Referential Integrity Check' as check_type,
       'Workout Plan Exercises -> Workout Plans' as check_name,
       CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END as result,
       COUNT(*) as invalid_references
FROM workout_plan_exercises wpe
LEFT JOIN workout_plans wp ON wpe.workout_plan_id = wp.id AND wp.environment = 'prod'
WHERE wpe.environment = 'prod'
AND wp.id IS NULL
AND wpe.workout_plan_id IS NOT NULL;

-- 3.4 Check for exercise_logs with invalid workout_session_id references
SELECT 'Referential Integrity Check' as check_type,
       'Exercise Logs -> Workout Sessions' as check_name,
       CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END as result,
       COUNT(*) as invalid_references
FROM exercise_logs el
LEFT JOIN workout_sessions ws ON el.workout_session_id = ws.id AND ws.environment = 'prod'
WHERE el.environment = 'prod'
AND ws.id IS NULL
AND el.workout_session_id IS NOT NULL;

-- 3.5 Check for workout_sessions with invalid workout_plan_id references
SELECT 'Referential Integrity Check' as check_type,
       'Workout Sessions -> Workout Plans' as check_name,
       CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END as result,
       COUNT(*) as invalid_references
FROM workout_sessions ws
LEFT JOIN workout_plans wp ON ws.workout_plan_id = wp.id AND wp.environment = 'prod'
WHERE ws.environment = 'prod'
AND wp.id IS NULL
AND ws.workout_plan_id IS NOT NULL;

-- 3.6 Check for workout_plans with invalid user_id references
SELECT 'Referential Integrity Check' as check_type,
       'Workout Plans -> Profiles' as check_name,
       CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END as result,
       COUNT(*) as invalid_references
FROM workout_plans wp
LEFT JOIN profiles p ON wp.user_id = p.id
WHERE wp.environment = 'prod'
AND p.id IS NULL
AND wp.user_id IS NOT NULL;

-- 3.7 Check for workout_sessions with invalid user_id references
SELECT 'Referential Integrity Check' as check_type,
       'Workout Sessions -> Profiles' as check_name,
       CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END as result,
       COUNT(*) as invalid_references
FROM workout_sessions ws
LEFT JOIN profiles p ON ws.user_id = p.id
WHERE ws.environment = 'prod'
AND p.id IS NULL
AND ws.user_id IS NOT NULL;

-- 3.8 Check for progress_metrics with invalid user_id references
SELECT 'Referential Integrity Check' as check_type,
       'Progress Metrics -> Profiles' as check_name,
       CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END as result,
       COUNT(*) as invalid_references
FROM progress_metrics pm
LEFT JOIN profiles p ON pm.user_id = p.id
WHERE pm.environment = 'prod'
AND p.id IS NULL
AND pm.user_id IS NOT NULL;

-- 4. Additional Production-Specific Checks

-- 4.1 Check for RLS policies on all tables
SELECT 'RLS Policy Check' as check_type,
       table_name,
       CASE WHEN has_rls_policy = true THEN 'PASS' ELSE 'FAIL' END as result
FROM (
  SELECT tablename as table_name, 
         EXISTS (
           SELECT 1 FROM pg_policies 
           WHERE tablename = t.tablename 
           AND policyname LIKE '%environment%'
         ) as has_rls_policy
  FROM pg_tables t
  WHERE schemaname = 'public'
  AND tablename IN (
    'profiles', 'exercises', 'workout_plans', 'workout_plan_exercises', 
    'workout_sessions', 'exercise_logs', 'progress_metrics'
  )
) as rls_checks
WHERE has_rls_policy = false;

-- 4.2 Check for sensitive data exposure
SELECT 'Sensitive Data Check' as check_type,
       'Email Exposure' as check_name,
       CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END as result,
       COUNT(*) as count
FROM profiles
WHERE email LIKE '%test%' OR email LIKE '%example%' OR email LIKE '%dummy%'
AND environment = 'prod';

-- 5. Summary of all checks
SELECT 'OVERALL VERIFICATION' as verification,
       CASE 
         WHEN (
           -- Check if any environment column checks failed
           EXISTS (
             SELECT 1 FROM (
               SELECT COUNT(*) as non_prod_count FROM profiles WHERE environment != 'prod'
               UNION ALL
               SELECT COUNT(*) as non_prod_count FROM exercises WHERE environment != 'prod'
               UNION ALL
               SELECT COUNT(*) as non_prod_count FROM workout_plans WHERE environment != 'prod'
               UNION ALL
               SELECT COUNT(*) as non_prod_count FROM workout_plan_exercises WHERE environment != 'prod'
               UNION ALL
               SELECT COUNT(*) as non_prod_count FROM workout_sessions WHERE environment != 'prod'
               UNION ALL
               SELECT COUNT(*) as non_prod_count FROM exercise_logs WHERE environment != 'prod'
               UNION ALL
               SELECT COUNT(*) as non_prod_count FROM progress_metrics WHERE environment != 'prod'
             ) as env_checks
             WHERE non_prod_count > 0
           )
           -- Check if any test data checks failed
           OR EXISTS (
             SELECT 1 FROM profiles 
             WHERE id IN ('e49b1178-bbd0-4e19-8362-ce4971d63a45', 'df85e454-730d-460c-a34e-8e1fce3bf648')
             AND environment = 'prod'
           )
           OR EXISTS (
             SELECT 1 FROM exercises
             WHERE (name LIKE 'Test%' OR name LIKE 'Mock%' OR name LIKE 'Dummy%')
             AND environment = 'prod'
           )
           -- Check if any referential integrity checks failed
           OR EXISTS (
             SELECT 1 FROM exercise_logs el
             LEFT JOIN exercises e ON el.exercise_id = e.id AND e.environment = 'prod'
             WHERE el.environment = 'prod'
             AND e.id IS NULL
             AND el.exercise_id IS NOT NULL
           )
           OR EXISTS (
             SELECT 1 FROM workout_plan_exercises wpe
             LEFT JOIN exercises e ON wpe.exercise_id = e.id AND e.environment = 'prod'
             WHERE wpe.environment = 'prod'
             AND e.id IS NULL
             AND wpe.exercise_id IS NOT NULL
           )
           OR EXISTS (
             SELECT 1 FROM workout_plan_exercises wpe
             LEFT JOIN workout_plans wp ON wpe.workout_plan_id = wp.id AND wp.environment = 'prod'
             WHERE wpe.environment = 'prod'
             AND wp.id IS NULL
             AND wpe.workout_plan_id IS NOT NULL
           )
           OR EXISTS (
             SELECT 1 FROM exercise_logs el
             LEFT JOIN workout_sessions ws ON el.workout_session_id = ws.id AND ws.environment = 'prod'
             WHERE el.environment = 'prod'
             AND ws.id IS NULL
             AND el.workout_session_id IS NOT NULL
           )
           OR EXISTS (
             SELECT 1 FROM workout_sessions ws
             LEFT JOIN workout_plans wp ON ws.workout_plan_id = wp.id AND wp.environment = 'prod'
             WHERE ws.environment = 'prod'
             AND wp.id IS NULL
             AND ws.workout_plan_id IS NOT NULL
           )
           OR EXISTS (
             SELECT 1 FROM workout_plans wp
             LEFT JOIN profiles p ON wp.user_id = p.id
             WHERE wp.environment = 'prod'
             AND p.id IS NULL
             AND wp.user_id IS NOT NULL
           )
           OR EXISTS (
             SELECT 1 FROM workout_sessions ws
             LEFT JOIN profiles p ON ws.user_id = p.id
             WHERE ws.environment = 'prod'
             AND p.id IS NULL
             AND ws.user_id IS NOT NULL
           )
           OR EXISTS (
             SELECT 1 FROM progress_metrics pm
             LEFT JOIN profiles p ON pm.user_id = p.id
             WHERE pm.environment = 'prod'
             AND p.id IS NULL
             AND pm.user_id IS NOT NULL
           )
           -- Check if any RLS policy checks failed
           OR EXISTS (
             SELECT 1 FROM pg_tables t
             WHERE schemaname = 'public'
             AND tablename IN (
               'profiles', 'exercises', 'workout_plans', 'workout_plan_exercises', 
               'workout_sessions', 'exercise_logs', 'progress_metrics'
             )
             AND NOT EXISTS (
               SELECT 1 FROM pg_policies 
               WHERE tablename = t.tablename 
               AND policyname LIKE '%environment%'
             )
           )
           -- Check if any sensitive data checks failed
           OR EXISTS (
             SELECT 1 FROM profiles
             WHERE (email LIKE '%test%' OR email LIKE '%example%' OR email LIKE '%dummy%')
             AND environment = 'prod'
           )
         ) 
         THEN 'SOME CHECKS FAILED' 
         ELSE 'ALL CHECKS PASSED' 
       END as result;
`;

        // Write the SQL to a temporary file
        const tempSqlFile = path.join(__dirname, 'temp_verification_prod.sql');
        fs.writeFileSync(tempSqlFile, productionVerificationSql);

        // Execute the SQL using psql
        const result = execSync(`psql "${process.env.DATABASE_URL}" -f ${tempSqlFile}`, {encoding: 'utf8'});

        // Clean up the temporary file
        fs.unlinkSync(tempSqlFile);

        console.log('Verification Results:');
        console.log(result);

        // Check if the verification was successful
        if (result.includes('ALL CHECKS PASSED')) {
            console.log('\n✅ SUCCESS: Production environment verification passed!');
            console.log('- All data rows have environment = "prod"');
            console.log('- No test/mocked data present');
            console.log('- All referential integrity checks passed');
            console.log('- All tables have RLS policies with environment filtering');
            console.log('- No sensitive data exposure detected');
        } else {
            console.log('\n❌ WARNING: Some checks failed. Please review the results above.');

            // Provide more specific warnings based on the results
            if (result.includes('Environment Column Check') && result.includes('FAIL')) {
                console.log('⚠️ Some data rows do not have environment = "prod"');
            }

            if (result.includes('Test Data Check') && result.includes('FAIL')) {
                console.log('⚠️ Test/mocked data was found in the production environment');
            }

            if (result.includes('Referential Integrity Check') && result.includes('FAIL')) {
                console.log('⚠️ Referential integrity issues were found');
            }

            if (result.includes('RLS Policy Check') && result.includes('FAIL')) {
                console.log('⚠️ Some tables do not have RLS policies with environment filtering');
            }

            if (result.includes('Sensitive Data Check') && result.includes('FAIL')) {
                console.log('⚠️ Sensitive data exposure was detected');
            }
        }
    } catch (error) {
        console.error('Error running verification script:', error.message);
        if (error.stdout) {
            console.log('Output:', error.stdout);
        }
        if (error.stderr) {
            console.error('Error output:', error.stderr);
        }
    }
}

// Check if we're in production environment before running
const ENV = process.env.VITE_FORMCOACH_ENV || 'dev';
if (ENV !== 'prod') {
    console.error('❌ ERROR: This script should only be run in the production environment.');
    console.error('Current environment:', ENV);
    console.error('Please switch to the production environment (formcoach PyCharm project) and try again.');
    process.exit(1);
}

// Run the verification
runProdVerification();