# FormCoach Workout History Verification

This document explains how to verify that the workout history data for the mock user was entered correctly into the
FormCoach development database.

## Files Created for Verification

- **workout_history.sql**: The main SQL script that populates the database with realistic workout history data for a
  mock user (`user_id = 'e49b1178-bbd0-4e19-8362-ce4971d63a45'`).

- **verification_script.sql**: A basic SQL script that checks if the required data exists in the database.

- **data_verification_report.sql**: A comprehensive SQL script that generates a detailed report on the quality of the
  workout history data.

- **run_verification.js**: A Node.js script that executes the verification SQL and displays the results.

- **data_verification_summary.md**: A document that explains the verification process, the checks performed, and how to
  interpret the results.

- **exercise_reference_check.sql**: A SQL script that specifically checks for any issues with exercise references,
  ensuring that no inserts failed due to missing exercises.

- **exercise_reference_findings.md**: A detailed explanation of how the workout history SQL script handles exercise
  references and why inserts would not fail due to missing exercises.

## How to Verify the Data

### Option 1: Using the SQL Script Directly

1. Open your PostgreSQL client (e.g., pgAdmin, PyCharm Database tool)
2. Connect to your FormCoach development database
3. Open and execute the `data_verification_report.sql` script
4. Review the results in the query output

### Option 2: Using the Node.js Script

1. Make sure you have Node.js installed
2. Make sure your `.env` file contains the `DATABASE_URL` variable
3. Run the script with:
   ```
   node run_verification.js
   ```
4. Review the output in the console

## What is Being Verified

The verification scripts check that:

1. The mock user profile exists
2. At least 10 exercises were created
3. A workout plan exists for the user
4. At least 5 exercises were added to the workout plan
5. At least 12 workout sessions were created
6. At least 24 exercise logs were created
7. At least 10 progress metrics were recorded
8. Weights increased over time for at least one exercise
9. Soreness ratings vary (at least 2 different ratings)
10. Sessions have variable spacing (at least 2 different intervals)
11. Sessions span at least 3 weeks (21 days)

## Expected Results

If all checks pass, you should see a result like:

```
Check                 | Status | Details
----------------------|--------|--------------------------------------------------
Exercise Logs         | PASS   | Found 36 exercise logs (expected at least 24)
Exercises             | PASS   | Found 12 exercises (expected at least 10)
Progress Metrics      | PASS   | Found 15 progress metrics (expected at least 10)
Session Spacing       | PASS   | Found 3 different intervals between sessions (max: 4 days)
Soreness Variability  | PASS   | Found 3 different soreness ratings (range: 2-4)
Time Period Coverage  | PASS   | Sessions span 28 days from 2023-05-01 to 2023-05-29 (expected at least 21 days)
User Profile          | PASS   | Found 1 profile(s) for the mock user
Weight Progression    | PASS   | 3 out of 5 exercises show weight progression
Workout Plan          | PASS   | Found 1 workout plan(s) for the mock user
Workout Plan Exercises| PASS   | Found 8 workout plan exercises (expected at least 5)
Workout Sessions      | PASS   | Found 12 workout sessions (expected at least 12)

Summary              | Result            | Details
---------------------|-------------------|---------------------------
OVERALL VERIFICATION | ALL CHECKS PASSED | 0 out of 11 checks failed
```

## Troubleshooting

If any checks fail, you may need to:

1. Check if the workout_history.sql script was executed successfully
2. Verify that you're connecting to the correct database
3. Ensure that the environment is set to 'dev'
4. Check for any error messages during the SQL execution

For more detailed information about the verification process,
see [data_verification_summary.md](data_verification_summary.md).

## Conclusion

If all verification checks pass, it confirms that the workout history data was entered correctly and meets all the
requirements specified in the original task. The mock user now has a realistic workout history that can be used for
development and testing purposes.
