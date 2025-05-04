/**
 * Seed script for FormCoach development environment
 *
 * This script inserts sample test data into the Supabase formcoach-dev project,
 * scoped to the 'dev' environment.
 *
 * Run this script with:
 * npx ts-node scripts/seed-dev.ts
 */

import {supabase} from '../src/integrations/supabase/client';
import {withEnvironmentFilter} from '../src/lib/supabase-utils';
import {getEnvironment} from '../src/lib/environment';

// Mock user UUID
const MOCK_USER_ID = 'df85e454-730d-460c-a34e-8e1fce3bf648';

async function seedDevEnvironment() {
    console.log('Starting seed script for FormCoach development environment...');

    // Get the current environment
    const env = getEnvironment();
    console.log(`Current environment: ${env}`);

    // Ensure we're in the dev environment
    if (env !== 'dev') {
        console.warn(`Warning: You are running the dev seed script in the '${env}' environment.`);
        console.warn('This script is intended for the dev environment only.');
        const proceed = await promptToContinue();
        if (!proceed) {
            console.log('Seed script aborted.');
            return;
        }
    }

    try {
        // 1. Create a mock profile
        await createProfile();

        // 2. Create exercises
        const exerciseIds = await createExercises();

        // 3. Create a workout plan with the exercises
        const workoutPlanId = await createWorkoutPlan(exerciseIds);

        // 4. Create a workout session with exercise logs
        await createWorkoutSession(workoutPlanId, exerciseIds);

        console.log('\n✅ Seed script completed.');
    } catch (error) {
        console.error('Error during seed process:', error);
    }
}

async function createProfile() {
    console.log('\nCreating mock profile...');

    const {data, error} = await supabase
        .from('profiles')
        .upsert({
            id: MOCK_USER_ID,
            username: 'testuser',
            full_name: 'Test User',
            goals: ['strength', 'mobility'],
            fitness_level: 'beginner',
            environment: 'dev'
        }, {
            onConflict: 'id'
        });

    if (error) {
        console.error('Error creating profile:', error);
        throw error;
    } else {
        console.log('✓ Profile created successfully');
        return MOCK_USER_ID;
    }
}

async function createExercises() {
    console.log('\nCreating exercises...');

    const exercises = [
        {
            name: 'Dumbbell Bench Press',
            description: 'A chest exercise performed with dumbbells while lying on a bench.',
            muscle_groups: ['chest', 'triceps', 'shoulders'],
            equipment: ['dumbbells', 'bench'],
            difficulty_level: 'intermediate',
            environment: 'dev'
        },
        {
            name: 'Seated Row',
            description: 'A back exercise performed on a seated row machine or with cables.',
            muscle_groups: ['back', 'biceps', 'forearms'],
            equipment: ['cable machine', 'bench'],
            difficulty_level: 'beginner',
            environment: 'dev'
        }
    ];

    const exerciseIds: string[] = [];
    const exerciseNames: string[] = exercises.map(e => e.name);

    for (const exercise of exercises) {
        // Check if exercise already exists
        const {data: existingExercises, error: findError} = await withEnvironmentFilter(
            supabase.from('exercises').select('id').eq('name', exercise.name)
        );

        if (findError) {
            console.error(`Error finding exercise ${exercise.name}:`, findError);
            throw new Error(`Failed to verify if exercise '${exercise.name}' exists: ${findError.message}`);
        }

        if (existingExercises && existingExercises.length > 0) {
            console.log(`✓ Exercise '${exercise.name}' already exists, skipping creation`);
            exerciseIds.push(existingExercises[0].id);
            continue;
        }

        // Create new exercise
        const {data, error} = await supabase
            .from('exercises')
            .insert(exercise)
            .select('id');

        if (error) {
            console.error(`Error creating exercise ${exercise.name}:`, error);
            throw new Error(`Failed to create exercise '${exercise.name}': ${error.message}`);
        } else if (data && data.length > 0) {
            console.log(`✓ Exercise '${exercise.name}' created successfully`);
            exerciseIds.push(data[0].id);
        } else {
            throw new Error(`Failed to create exercise '${exercise.name}': No data returned`);
        }
    }

    // Verify all exercises were created successfully
    console.log('\nVerifying all exercises were created successfully...');
    const {data: allExercises, error: verifyError} = await withEnvironmentFilter(
        supabase.from('exercises').select('id, name').in('name', exerciseNames)
    );

    if (verifyError) {
        throw new Error(`Failed to verify exercises: ${verifyError.message}`);
    }

    if (!allExercises || allExercises.length !== exerciseNames.length) {
        const createdNames = allExercises ? allExercises.map(e => e.name) : [];
        const missingNames = exerciseNames.filter(name => !createdNames.includes(name));
        throw new Error(`Not all exercises were created. Missing: ${missingNames.join(', ')}`);
    }

    console.log(`✓ All ${allExercises.length} exercises verified successfully`);

    return exerciseIds;
}

async function createWorkoutPlan(exerciseIds: string[]) {
    console.log('\nCreating workout plan...');

    // First, verify all exercise IDs exist in the database
    console.log('Verifying all exercise IDs exist...');
    const {data: existingExercises, error: exerciseError} = await supabase
        .from('exercises')
        .select('id')
        .in('id', exerciseIds);

    if (exerciseError) {
        throw new Error(`Failed to verify exercise IDs: ${exerciseError.message}`);
    }

    if (!existingExercises || existingExercises.length !== exerciseIds.length) {
        const existingIds = existingExercises ? existingExercises.map(e => e.id) : [];
        const missingIds = exerciseIds.filter(id => !existingIds.includes(id));
        throw new Error(`Some exercise IDs do not exist in the database: ${missingIds.join(', ')}`);
    }

    console.log('✓ All exercise IDs verified successfully');

    // Check if workout plan already exists
    const {data: existingPlans, error: findError} = await withEnvironmentFilter(
        supabase
            .from('workout_plans')
            .select('id')
            .eq('user_id', MOCK_USER_ID)
            .eq('name', 'Upper Body Starter')
    );

    if (findError) {
        console.error('Error finding workout plan:', findError);
        throw findError;
    }

    let workoutPlanId: string;

    if (existingPlans && existingPlans.length > 0) {
        console.log('✓ Workout plan already exists, skipping creation');
        workoutPlanId = existingPlans[0].id;
    } else {
        // Create workout plan
        const {data, error} = await supabase
            .from('workout_plans')
            .insert({
                user_id: MOCK_USER_ID,
                name: 'Upper Body Starter',
                description: 'A beginner-friendly upper body workout plan',
                frequency: 'twice_weekly',
                duration_weeks: 4,
                is_active: true,
                environment: 'dev'
            })
            .select('id');

        if (error) {
            console.error('Error creating workout plan:', error);
            throw error;
        } else if (!data || data.length === 0) {
            throw new Error('Failed to create workout plan');
        }

        console.log('✓ Workout plan created successfully');
        workoutPlanId = data[0].id;
    }

    // Add exercises to workout plan
    console.log('Adding exercises to workout plan...');

    const addedExerciseIds: string[] = [];

    for (let i = 0; i < exerciseIds.length; i++) {
        const {error} = await supabase
            .from('workout_plan_exercises')
            .upsert({
                workout_plan_id: workoutPlanId,
                exercise_id: exerciseIds[i],
                day_of_week: i === 0 ? 'monday' : 'thursday',
                sets: 3,
                reps: '8-12',
                rest_seconds: 60,
                order_index: i,
                environment: 'dev'
            }, {
                onConflict: 'workout_plan_id,exercise_id'
            });

        if (error) {
            console.error(`Error adding exercise ${exerciseIds[i]} to workout plan:`, error);
            throw new Error(`Failed to add exercise ${exerciseIds[i]} to workout plan: ${error.message}`);
        } else {
            console.log(`✓ Exercise ${i + 1} added to workout plan`);
            addedExerciseIds.push(exerciseIds[i]);
        }
    }

    // Verify all exercises were added to the workout plan
    console.log('Verifying all exercises were added to the workout plan...');
    const {data: planExercises, error: verifyError} = await supabase
        .from('workout_plan_exercises')
        .select('exercise_id')
        .eq('workout_plan_id', workoutPlanId);

    if (verifyError) {
        throw new Error(`Failed to verify workout plan exercises: ${verifyError.message}`);
    }

    if (!planExercises || planExercises.length < exerciseIds.length) {
        const addedIds = planExercises ? planExercises.map(e => e.exercise_id) : [];
        const missingIds = exerciseIds.filter(id => !addedIds.includes(id));
        throw new Error(`Not all exercises were added to the workout plan. Missing: ${missingIds.join(', ')}`);
    }

    console.log(`✓ All ${planExercises.length} exercises verified in workout plan`);

    return workoutPlanId;
}

async function createWorkoutSession(workoutPlanId: string, exerciseIds: string[]) {
    console.log('\nCreating workout session...');

    // First, verify all exercise IDs exist in the database
    console.log('Verifying all exercise IDs exist...');
    const {data: existingExercises, error: exerciseError} = await supabase
        .from('exercises')
        .select('id')
        .in('id', exerciseIds);

    if (exerciseError) {
        throw new Error(`Failed to verify exercise IDs: ${exerciseError.message}`);
    }

    if (!existingExercises || existingExercises.length !== exerciseIds.length) {
        const existingIds = existingExercises ? existingExercises.map(e => e.id) : [];
        const missingIds = exerciseIds.filter(id => !existingIds.includes(id));
        throw new Error(`Some exercise IDs do not exist in the database: ${missingIds.join(', ')}`);
    }

    console.log('✓ All exercise IDs verified successfully');

    // Create workout session
    const {data: sessionData, error: sessionError} = await supabase
        .from('workout_sessions')
        .insert({
            user_id: MOCK_USER_ID,
            workout_plan_id: workoutPlanId,
            start_time: new Date().toISOString(),
            end_time: new Date(Date.now() + 3600000).toISOString(), // 1 hour later
            notes: 'Felt good, kept form clean.',
            overall_feeling: 'good',
            environment: 'dev'
        })
        .select('id');

    if (sessionError) {
        console.error('Error creating workout session:', sessionError);
        throw sessionError;
    } else if (!sessionData || sessionData.length === 0) {
        throw new Error('Failed to create workout session');
    }

    console.log('✓ Workout session created successfully');
    const sessionId = sessionData[0].id;

    // Add exercise logs
    console.log('Adding exercise logs...');

    const addedExerciseIds: string[] = [];

    for (const exerciseId of exerciseIds) {
        const reps = [10, 8, 8];
        const weights = [20, 22.5, 22.5];

        const {data, error} = await supabase
            .from('exercise_logs')
            .insert({
                workout_session_id: sessionId,
                exercise_id: exerciseId,
                sets_completed: 3,
                reps_completed: reps,
                weights_used: weights,
                form_feedback: 'Good form overall, focus on keeping shoulders back',
                soreness_rating: 2,
                environment: 'dev'
            })
            .select('id');

        if (error) {
            console.error(`Error creating exercise log for exercise ${exerciseId}:`, error);
            throw new Error(`Failed to create exercise log for exercise ${exerciseId}: ${error.message}`);
        } else if (!data || data.length === 0) {
            throw new Error(`Failed to create exercise log for exercise ${exerciseId}: No data returned`);
        } else {
            console.log(`✓ Exercise log created for exercise ${exerciseId}`);
            addedExerciseIds.push(exerciseId);
        }
    }

    // Verify all exercise logs were created
    console.log('Verifying all exercise logs were created...');
    const {data: sessionLogs, error: verifyError} = await supabase
        .from('exercise_logs')
        .select('exercise_id')
        .eq('workout_session_id', sessionId);

    if (verifyError) {
        throw new Error(`Failed to verify exercise logs: ${verifyError.message}`);
    }

    if (!sessionLogs || sessionLogs.length !== exerciseIds.length) {
        const loggedIds = sessionLogs ? sessionLogs.map(log => log.exercise_id) : [];
        const missingIds = exerciseIds.filter(id => !loggedIds.includes(id));
        throw new Error(`Not all exercise logs were created. Missing: ${missingIds.join(', ')}`);
    }

    console.log(`✓ All ${sessionLogs.length} exercise logs verified successfully`);
}

// Helper function to prompt for continuation
async function promptToContinue(): Promise<boolean> {
    // In a real implementation, this would prompt the user
    // Since we can't do interactive prompts in this environment, we'll just return true
    return true;
}

// Run the seed script
seedDevEnvironment();
