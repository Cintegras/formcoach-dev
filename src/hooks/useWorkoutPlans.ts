import {useCallback, useEffect, useState} from 'react';
import {useAuth} from '@/features/auth/hooks/useAuth';
import {
    addExerciseToWorkoutPlan,
    createWorkoutPlan,
    deleteWorkoutPlan,
    getWorkoutPlan,
    getWorkoutPlanExercises,
    getWorkoutPlans,
    removeExerciseFromWorkoutPlan,
    reorderWorkoutPlanExercises,
    subscribeToWorkoutPlan,
    subscribeToWorkoutPlanExercises,
    updateWorkoutPlan,
    updateWorkoutPlanExercise,
    WorkoutPlan,
    WorkoutPlanExercise,
    WorkoutPlanExerciseInsert,
    WorkoutPlanExerciseUpdate,
    WorkoutPlanInsert,
    WorkoutPlanUpdate
} from '@/services/supabase';

/**
 * Hook for accessing and managing workout plans
 * @param enableRealtime - Whether to enable real-time updates (default: true)
 */
export function useWorkoutPlans(enableRealtime = true) {
    const {user} = useAuth();
    const [plans, setPlans] = useState<WorkoutPlan[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    // Fetch plans when user changes
    const fetchPlans = useCallback(async () => {
        if (!user) {
            setPlans([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const plansData = await getWorkoutPlans(user.id);
            setPlans(plansData);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch workout plans'));
            console.error('Error fetching workout plans:', err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchPlans();
    }, [fetchPlans]);

    /**
     * Create a new workout plan
     * @param plan - The workout plan data to create
     * @returns The created workout plan
     */
    const createPlan = async (plan: Omit<WorkoutPlanInsert, 'user_id'>): Promise<WorkoutPlan | null> => {
        if (!user) {
            setError(new Error('No authenticated user'));
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            const newPlan = await createWorkoutPlan({
                ...plan,
                user_id: user.id
            });

            if (newPlan) {
                // Update state manually (real-time updates are handled per-plan)
                setPlans(prev => [newPlan, ...prev]);
            }

            return newPlan;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to create workout plan'));
            console.error('Error creating workout plan:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Update a workout plan
     * @param planId - The workout plan ID
     * @param updates - The workout plan data to update
     * @returns The updated workout plan
     */
    const updatePlan = async (
        planId: string,
        updates: WorkoutPlanUpdate
    ): Promise<WorkoutPlan | null> => {
        setLoading(true);
        setError(null);

        try {
            const updatedPlan = await updateWorkoutPlan(planId, updates);

            if (updatedPlan) {
                // Update state manually (real-time updates are handled per-plan)
                setPlans(prev =>
                    prev.map(p => p.id === updatedPlan.id ? updatedPlan : p)
                );
            }

            return updatedPlan;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to update workout plan'));
            console.error('Error updating workout plan:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Delete a workout plan
     * @param planId - The workout plan ID
     * @returns True if the plan was deleted successfully
     */
    const deletePlan = async (planId: string): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const success = await deleteWorkoutPlan(planId);

            if (success) {
                // Update state manually
                setPlans(prev => prev.filter(p => p.id !== planId));
            }

            return success;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to delete workout plan'));
            console.error('Error deleting workout plan:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Refresh the workout plans data
     */
    const refresh = () => {
        fetchPlans();
    };

    return {
        plans,
        loading,
        error,
        createPlan,
        updatePlan,
        deletePlan,
        refresh,
    };
}

/**
 * Hook for accessing and managing a specific workout plan and its exercises
 * @param planId - The workout plan ID
 * @param enableRealtime - Whether to enable real-time updates (default: true)
 */
export function useWorkoutPlan(planId: string | null, enableRealtime = true) {
    const [plan, setPlan] = useState<WorkoutPlan | null>(null);
    const [exercises, setExercises] = useState<WorkoutPlanExercise[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    // Fetch plan and exercises when plan ID changes
    const fetchPlanAndExercises = useCallback(async () => {
        if (!planId) {
            setPlan(null);
            setExercises([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Fetch plan and exercises in parallel
            const [planData, exercisesData] = await Promise.all([
                getWorkoutPlan(planId),
                getWorkoutPlanExercises(planId)
            ]);

            setPlan(planData);
            setExercises(exercisesData);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch workout plan'));
            console.error('Error fetching workout plan:', err);
        } finally {
            setLoading(false);
        }
    }, [planId]);

    useEffect(() => {
        fetchPlanAndExercises();
    }, [fetchPlanAndExercises]);

    // Set up real-time subscriptions
    useEffect(() => {
        if (!planId || !enableRealtime) return;

        // Subscribe to plan changes
        const unsubscribePlan = subscribeToWorkoutPlan(planId, (updatedPlan, eventType) => {
            if (eventType === 'UPDATE') {
                setPlan(updatedPlan);
            } else if (eventType === 'DELETE') {
                setPlan(null);
                setExercises([]);
            }
        });

        // Subscribe to exercise changes
        const unsubscribeExercises = subscribeToWorkoutPlanExercises(planId, (exercise, eventType) => {
            if (eventType === 'INSERT') {
                setExercises(prev => [...prev, exercise]);
            } else if (eventType === 'UPDATE') {
                setExercises(prev =>
                    prev.map(e => e.id === exercise.id ? exercise : e)
                );
            } else if (eventType === 'DELETE') {
                setExercises(prev =>
                    prev.filter(e => e.id !== exercise.id)
                );
            }
        });

        return () => {
            unsubscribePlan();
            unsubscribeExercises();
        };
    }, [planId, enableRealtime]);

    /**
     * Update the workout plan
     * @param updates - The workout plan data to update
     * @returns The updated workout plan
     */
    const updatePlan = async (updates: WorkoutPlanUpdate): Promise<WorkoutPlan | null> => {
        if (!planId) {
            setError(new Error('No workout plan ID provided'));
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            const updatedPlan = await updateWorkoutPlan(planId, updates);

            if (updatedPlan && !enableRealtime) {
                // If not using real-time, update the state manually
                setPlan(updatedPlan);
            }

            return updatedPlan;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to update workout plan'));
            console.error('Error updating workout plan:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Add an exercise to the workout plan
     * @param exercise - The exercise data to add
     * @returns The created workout plan exercise
     */
    const addExercise = async (
        exercise: Omit<WorkoutPlanExerciseInsert, 'workout_plan_id'>
    ): Promise<WorkoutPlanExercise | null> => {
        if (!planId) {
            setError(new Error('No workout plan ID provided'));
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            const newExercise = await addExerciseToWorkoutPlan({
                ...exercise,
                workout_plan_id: planId
            });

            if (newExercise && !enableRealtime) {
                // If not using real-time, update the state manually
                setExercises(prev => [...prev, newExercise]);
            }

            return newExercise;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to add exercise to workout plan'));
            console.error('Error adding exercise to workout plan:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Update an exercise in the workout plan
     * @param exerciseId - The workout plan exercise ID
     * @param updates - The exercise data to update
     * @returns The updated workout plan exercise
     */
    const updateExercise = async (
        exerciseId: string,
        updates: WorkoutPlanExerciseUpdate
    ): Promise<WorkoutPlanExercise | null> => {
        setLoading(true);
        setError(null);

        try {
            const updatedExercise = await updateWorkoutPlanExercise(exerciseId, updates);

            if (updatedExercise && !enableRealtime) {
                // If not using real-time, update the state manually
                setExercises(prev =>
                    prev.map(e => e.id === updatedExercise.id ? updatedExercise : e)
                );
            }

            return updatedExercise;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to update exercise in workout plan'));
            console.error('Error updating exercise in workout plan:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Remove an exercise from the workout plan
     * @param exerciseId - The workout plan exercise ID
     * @returns True if the exercise was removed successfully
     */
    const removeExercise = async (exerciseId: string): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const success = await removeExerciseFromWorkoutPlan(exerciseId);

            if (success && !enableRealtime) {
                // If not using real-time, update the state manually
                setExercises(prev => prev.filter(e => e.id !== exerciseId));
            }

            return success;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to remove exercise from workout plan'));
            console.error('Error removing exercise from workout plan:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Reorder exercises in the workout plan
     * @param exerciseIds - Array of exercise IDs in the desired order
     * @returns True if the exercises were reordered successfully
     */
    const reorderExercises = async (exerciseIds: string[]): Promise<boolean> => {
        if (!planId) {
            setError(new Error('No workout plan ID provided'));
            return false;
        }

        setLoading(true);
        setError(null);

        try {
            const success = await reorderWorkoutPlanExercises(planId, exerciseIds);

            if (success && !enableRealtime) {
                // If not using real-time, update the state manually
                // Create a map of id -> index
                const orderMap = exerciseIds.reduce((map, id, index) => {
                    map[id] = index;
                    return map;
                }, {} as Record<string, number>);

                // Sort the exercises based on the new order
                setExercises(prev => {
                    const updated = prev.map(e => ({
                        ...e,
                        order_index: orderMap[e.id] ?? e.order_index
                    }));

                    return updated.sort((a, b) =>
                        (a.order_index ?? 0) - (b.order_index ?? 0)
                    );
                });
            }

            return success;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to reorder exercises'));
            console.error('Error reordering exercises:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Refresh the workout plan and exercises data
     */
    const refresh = () => {
        fetchPlanAndExercises();
    };

    return {
        plan,
        exercises,
        loading,
        error,
        updatePlan,
        addExercise,
        updateExercise,
        removeExercise,
        reorderExercises,
        refresh,
    };
}