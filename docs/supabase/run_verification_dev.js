/**
 * Script to run the verification SQL for the development environment
 * This script checks:
 * - All data rows include environment = 'dev'
 * - Referential integrity of exercises, plans, and logs
 */

import {execSync} from 'child_process';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import dotenv from 'dotenv';

// Get the database connection string from .env file
dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to run the verification script
function runDevVerification() {
    console.log('Running verification script for DEVELOPMENT environment...');
    console.log('Checking for environment = "dev" and referential integrity...');

    try {
        // Create the SQL queries for development verification
        const devVerificationSql = `
-- Development Environment Verification Script
-- This script checks if all data in the development environment meets the requirements:
-- 1. All data rows include environment = 'dev'
-- 2. Referential integrity of exercises, plans, and logs

-- Set search path
SET search_path TO public;

-- 1. Check if all tables have environment = 'dev'
SELECT 'Environment Column Check' as check_type,
       table_name,
       CASE WHEN non_dev_count = 0 THEN 'PASS' ELSE 'FAIL' END as result,
       non_dev_count as non_dev_rows
FROM (
  SELECT 'profiles' as table_name, COUNT(*) as non_dev_count FROM profiles WHERE environment != 'dev'
  UNION ALL
  SELECT 'exercises' as table_name, COUNT(*) as non_dev_count FROM exercises WHERE environment != 'dev'
  UNION ALL
  SELECT 'workout_plans' as table_name, COUNT(*) as non_dev_count FROM workout_plans WHERE environment != 'dev'
  UNION ALL
  SELECT 'workout_plan_exercises' as table_name, COUNT(*) as non_dev_count FROM workout_plan_exercises WHERE environment != 'dev'
  UNION ALL
  SELECT 'workout_sessions' as table_name, COUNT(*) as non_dev_count FROM workout_sessions WHERE environment != 'dev'
  UNION ALL
  SELECT 'exercise_logs' as table_name, COUNT(*) as non_dev_count FROM exercise_logs WHERE environment != 'dev'
  UNION ALL
  SELECT 'progress_metrics' as table_name, COUNT(*) as non_dev_count FROM progress_metrics WHERE environment != 'dev'
) as env_checks
WHERE non_dev_count > 0;

-- 2. Check referential integrity

-- 2.1 Check for exercise_logs with invalid exercise_id references
SELECT 'Referential Integrity Check' as check_type,
       'Exercise Logs -> Exercises' as check_name,
       CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END as result,
       COUNT(*) as invalid_references
FROM exercise_logs el
LEFT JOIN exercises e ON el.exercise_id = e.id AND e.environment = 'dev'
WHERE el.environment = 'dev'
AND e.id IS NULL
AND el.exercise_id IS NOT NULL;

-- 2.2 Check for workout_plan_exercises with invalid exercise_id references
SELECT 'Referential Integrity Check' as check_type,
       'Workout Plan Exercises -> Exercises' as check_name,
       CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END as result,
       COUNT(*) as invalid_references
FROM workout_plan_exercises wpe
LEFT JOIN exercises e ON wpe.exercise_id = e.id AND e.environment = 'dev'
WHERE wpe.environment = 'dev'
AND e.id IS NULL
AND wpe.exercise_id IS NOT NULL;

-- 2.3 Check for workout_plan_exercises with invalid workout_plan_id references
SELECT 'Referential Integrity Check' as check_type,
       'Workout Plan Exercises -> Workout Plans' as check_name,
       CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END as result,
       COUNT(*) as invalid_references
FROM workout_plan_exercises wpe
LEFT JOIN workout_plans wp ON wpe.workout_plan_id = wp.id AND wp.environment = 'dev'
WHERE wpe.environment = 'dev'
AND wp.id IS NULL
AND wpe.workout_plan_id IS NOT NULL;

-- 2.4 Check for exercise_logs with invalid workout_session_id references
SELECT 'Referential Integrity Check' as check_type,
       'Exercise Logs -> Workout Sessions' as check_name,
       CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END as result,
       COUNT(*) as invalid_references
FROM exercise_logs el
LEFT JOIN workout_sessions ws ON el.workout_session_id = ws.id AND ws.environment = 'dev'
WHERE el.environment = 'dev'
AND ws.id IS NULL
AND el.workout_session_id IS NOT NULL;

-- 2.5 Check for workout_sessions with invalid workout_plan_id references
SELECT 'Referential Integrity Check' as check_type,
       'Workout Sessions -> Workout Plans' as check_name,
       CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END as result,
       COUNT(*) as invalid_references
FROM workout_sessions ws
LEFT JOIN workout_plans wp ON ws.workout_plan_id = wp.id AND wp.environment = 'dev'
WHERE ws.environment = 'dev'
AND wp.id IS NULL
AND ws.workout_plan_id IS NOT NULL;

-- 2.6 Check for workout_plans with invalid user_id references
SELECT 'Referential Integrity Check' as check_type,
       'Workout Plans -> Profiles' as check_name,
       CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END as result,
       COUNT(*) as invalid_references
FROM workout_plans wp
LEFT JOIN profiles p ON wp.user_id = p.id
WHERE wp.environment = 'dev'
AND p.id IS NULL
AND wp.user_id IS NOT NULL;

-- 2.7 Check for workout_sessions with invalid user_id references
SELECT 'Referential Integrity Check' as check_type,
       'Workout Sessions -> Profiles' as check_name,
       CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END as result,
       COUNT(*) as invalid_references
FROM workout_sessions ws
LEFT JOIN profiles p ON ws.user_id = p.id
WHERE ws.environment = 'dev'
AND p.id IS NULL
AND ws.user_id IS NOT NULL;

-- 2.8 Check for progress_metrics with invalid user_id references
SELECT 'Referential Integrity Check' as check_type,
       'Progress Metrics -> Profiles' as check_name,
       CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END as result,
       COUNT(*) as invalid_references
FROM progress_metrics pm
LEFT JOIN profiles p ON pm.user_id = p.id
WHERE pm.environment = 'dev'
AND p.id IS NULL
AND pm.user_id IS NOT NULL;

-- 3. Summary of all checks
SELECT 'OVERALL VERIFICATION' as verification,
       CASE 
         WHEN (
           -- Check if any environment column checks failed
           EXISTS (
             SELECT 1 FROM (
               SELECT COUNT(*) as non_dev_count FROM profiles WHERE environment != 'dev'
               UNION ALL
               SELECT COUNT(*) as non_dev_count FROM exercises WHERE environment != 'dev'
               UNION ALL
               SELECT COUNT(*) as non_dev_count FROM workout_plans WHERE environment != 'dev'
               UNION ALL
               SELECT COUNT(*) as non_dev_count FROM workout_plan_exercises WHERE environment != 'dev'
               UNION ALL
               SELECT COUNT(*) as non_dev_count FROM workout_sessions WHERE environment != 'dev'
               UNION ALL
               SELECT COUNT(*) as non_dev_count FROM exercise_logs WHERE environment != 'dev'
               UNION ALL
               SELECT COUNT(*) as non_dev_count FROM progress_metrics WHERE environment != 'dev'
             ) as env_checks
             WHERE non_dev_count > 0
           )
           -- Check if any referential integrity checks failed
           OR EXISTS (
             SELECT 1 FROM exercise_logs el
             LEFT JOIN exercises e ON el.exercise_id = e.id AND e.environment = 'dev'
             WHERE el.environment = 'dev'
             AND e.id IS NULL
             AND el.exercise_id IS NOT NULL
           )
           OR EXISTS (
             SELECT 1 FROM workout_plan_exercises wpe
             LEFT JOIN exercises e ON wpe.exercise_id = e.id AND e.environment = 'dev'
             WHERE wpe.environment = 'dev'
             AND e.id IS NULL
             AND wpe.exercise_id IS NOT NULL
           )
           OR EXISTS (
             SELECT 1 FROM workout_plan_exercises wpe
             LEFT JOIN workout_plans wp ON wpe.workout_plan_id = wp.id AND wp.environment = 'dev'
             WHERE wpe.environment = 'dev'
             AND wp.id IS NULL
             AND wpe.workout_plan_id IS NOT NULL
           )
           OR EXISTS (
             SELECT 1 FROM exercise_logs el
             LEFT JOIN workout_sessions ws ON el.workout_session_id = ws.id AND ws.environment = 'dev'
             WHERE el.environment = 'dev'
             AND ws.id IS NULL
             AND el.workout_session_id IS NOT NULL
           )
           OR EXISTS (
             SELECT 1 FROM workout_sessions ws
             LEFT JOIN workout_plans wp ON ws.workout_plan_id = wp.id AND wp.environment = 'dev'
             WHERE ws.environment = 'dev'
             AND wp.id IS NULL
             AND ws.workout_plan_id IS NOT NULL
           )
           OR EXISTS (
             SELECT 1 FROM workout_plans wp
             LEFT JOIN profiles p ON wp.user_id = p.id
             WHERE wp.environment = 'dev'
             AND p.id IS NULL
             AND wp.user_id IS NOT NULL
           )
           OR EXISTS (
             SELECT 1 FROM workout_sessions ws
             LEFT JOIN profiles p ON ws.user_id = p.id
             WHERE ws.environment = 'dev'
             AND p.id IS NULL
             AND ws.user_id IS NOT NULL
           )
           OR EXISTS (
             SELECT 1 FROM progress_metrics pm
             LEFT JOIN profiles p ON pm.user_id = p.id
             WHERE pm.environment = 'dev'
             AND p.id IS NULL
             AND pm.user_id IS NOT NULL
           )
         ) 
         THEN 'SOME CHECKS FAILED' 
         ELSE 'ALL CHECKS PASSED' 
       END as result;
`;

        // Write the SQL to a temporary file
        const tempSqlFile = path.join(__dirname, 'temp_verification_dev.sql');
        fs.writeFileSync(tempSqlFile, devVerificationSql);

        // Execute the SQL using psql
        const result = execSync(`psql "${process.env.DATABASE_URL}" -f ${tempSqlFile}`, {encoding: 'utf8'});

        // Clean up the temporary file
        fs.unlinkSync(tempSqlFile);

        console.log('Verification Results:');
        console.log(result);

        // Check if the verification was successful
        if (result.includes('ALL CHECKS PASSED')) {
            console.log('\n✅ SUCCESS: Development environment verification passed!');
            console.log('- All data rows have environment = "dev"');
            console.log('- All referential integrity checks passed');
            return true;
        } else {
            console.log('\n❌ WARNING: Some checks failed. Please review the results above.');

            // Provide more specific warnings based on the results
            if (result.includes('Environment Column Check') && result.includes('FAIL')) {
                console.log('⚠️ Some data rows do not have environment = "dev"');
            }

            if (result.includes('Referential Integrity Check') && result.includes('FAIL')) {
                console.log('⚠️ Referential integrity issues were found');
            }
            return false;
        }
    } catch (error) {
        console.error('Error running verification script:', error.message);
        if (error.stdout) {
            console.log('Output:', error.stdout);
        }
        if (error.stderr) {
            console.error('Error output:', error.stderr);
        }
        return false;
    }
}

// Run the verification
const verificationPassed = runDevVerification();

// Export the verification function for use in other scripts
export {runDevVerification};

// Exit with appropriate code for CI/CD pipelines
process.exit(verificationPassed ? 0 : 1);