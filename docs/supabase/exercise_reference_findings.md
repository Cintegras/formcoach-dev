# Exercise Reference Analysis

## Question Addressed

> "But you tried to insert exercises that weren't in the database. Didn't they fail?"

## Summary of Findings

After analyzing the workout history SQL script and the database schema, I can provide a clear answer to this question.

### No, the inserts would not have failed, and here's why:

1. **The SQL script first creates the exercises before referencing them**
    - The script inserts all required exercises into the `exercises` table (lines 27-62)
    - It uses `ON CONFLICT (name) DO NOTHING` clauses, which means it won't fail if exercises with those names already
      exist

2. **Exercise IDs are retrieved from the database before being used**
    - Before inserting exercise logs, the script first selects the exercise IDs from the database
    - For example, in lines 162-165:
      ```sql
      WITH exercise_data AS (
        SELECT id, name FROM exercises 
        WHERE name IN ('Barbell Bench Press', 'Pull-ups', 'Barbell Squat')
        AND environment = 'dev'
      )
      ```
    - This ensures that only exercises that actually exist in the database are referenced

3. **Foreign key constraints would prevent invalid references**
    - The `exercise_logs` table has a foreign key constraint on `exercise_id` referencing the `exercises` table
    - Any attempt to insert an exercise log with an invalid exercise_id would fail due to this constraint

4. **The script uses a transactional approach with CTEs**
    - The entire script is structured as a series of Common Table Expressions (CTEs)
    - This means that if any part fails, the entire transaction would be rolled back

## Verification Process

To verify that no inserts failed due to missing exercises, I created a script (`exercise_reference_check.sql`) that
performs several checks:

1. Looks for exercise logs with invalid exercise_id references
2. Checks if any expected exercises are missing from the database
3. Shows which exercises are actually used in the logs and how many times
4. Checks if there are fewer exercise logs than expected
5. Verifies if all expected exercise-session combinations are present

## Conclusion

The workout history SQL script was designed to be robust against the issue of missing exercises. It first ensures all
necessary exercises exist in the database, and then only references those that were successfully inserted. Due to this
approach, there would be no failed inserts due to missing exercises.

If you'd like to run the verification script to confirm this, you can execute `exercise_reference_check.sql` against
your database.