import {useEffect, useState} from 'react';
import {supabase} from '@/integrations/supabase/client';
import {useToast} from '@/components/ui/use-toast';

// This function accepts a number[] but converts to string[] for the query
const fetchExerciseLogsById = async (ids: number[]) => {
  try {
    // Convert number[] to string[] for the .in() method
    const stringIds = ids.map(id => id.toString());

    const { data, error } = await supabase
      .from('exercise_logs')
      .select('*')
      .in('id', stringIds);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching exercise logs by id:', error);
    return { data: null, error };
  }
};

// Create a hook that matches the interface expected by LogWorkout.tsx and WorkoutReview.tsx
export const useExerciseLogs = (sessionId: string | number | null, includeCompleted: boolean = false) => {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const {toast} = useToast();

    // Fetch logs for a specific session
    useEffect(() => {
        const fetchSessionLogs = async () => {
            if (!sessionId) {
                setLogs([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                let query = supabase
                    .from('exercise_logs')
                    .select('*')
                    .eq('session_id', sessionId);

                if (!includeCompleted) {
                    query = query.eq('completed', false);
                }

                const {data, error} = await query;

                if (error) {
                    throw new Error(error.message || 'Failed to fetch exercise logs');
                }

                setLogs(data || []);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('An unknown error occurred'));
                toast({
                    title: 'Error',
                    description: err instanceof Error ? err.message : 'Failed to fetch exercise logs',
                    variant: 'destructive',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchSessionLogs();
    }, [sessionId, includeCompleted, toast]);

    // Function to log a completed exercise
    const logCompletedExercise = async (
        exerciseId: string,
        setsCompleted: number,
        repsCompleted: string | number[],
        weightsUsed: string | number[],
        videoUrl?: string
    ) => {
        try {
            // Ensure repsCompleted and weightsUsed are arrays of numbers
            const repsArray = typeof repsCompleted === 'string'
                ? JSON.parse(repsCompleted)
                : repsCompleted;

            const weightsArray = typeof weightsUsed === 'string'
                ? JSON.parse(weightsUsed)
                : weightsUsed;

            const exerciseData = {
                exercise_id: exerciseId,
                session_id: sessionId,
                sets_completed: setsCompleted,
                reps_completed: repsArray,
                weights_used: weightsArray,
                video_url: videoUrl,
                completed: true
            };

            const {data, error} = await supabase
                .from('exercise_logs')
                .upsert(exerciseData)
                .select();

            if (error) {
                throw new Error(error.message || 'Failed to log exercise');
            }

            // Update the local state with the new log
            setLogs(prevLogs => {
                const existingLogIndex = prevLogs.findIndex(log => log.id === data[0].id);
                if (existingLogIndex >= 0) {
                    return [
                        ...prevLogs.slice(0, existingLogIndex),
                        data[0],
                        ...prevLogs.slice(existingLogIndex + 1)
                    ];
                } else {
                    return [...prevLogs, data[0]];
                }
            });

            return {data: data[0], error: null};
        } catch (err) {
            console.error('Error logging exercise:', err);
            toast({
                title: 'Error',
                description: err instanceof Error ? err.message : 'Failed to log exercise',
                variant: 'destructive',
            });
            return {data: null, error: err};
        }
    };

    return {
        logs,
        loading,
        error,
        logCompletedExercise
    };
};

// Export the function to be used elsewhere
export { fetchExerciseLogsById };
