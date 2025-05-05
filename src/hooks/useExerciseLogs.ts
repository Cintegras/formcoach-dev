import {useCallback, useEffect, useState} from 'react';
import {
    addFormFeedback,
    createExerciseLog,
    deleteExerciseLog,
    ExerciseLog,
    ExerciseLogInsert,
    ExerciseLogUpdate,
    getExerciseLogs,
    logExercise,
    subscribeToExerciseLogs,
    updateExerciseLog
} from '@/services/supabase';

/**
 * Hook for accessing and managing exercise logs for a workout session
 * @param sessionId - The workout session ID
 * @param enableRealtime - Whether to enable real-time updates (default: true)
 */
export function useExerciseLogs(sessionId: string | null, enableRealtime = true): {
    logs: ExerciseLog[];
    loading: boolean;
    error: Error | null;
    logCompletedExercise: (
        exerciseId: string,
        setsCompleted: number,
        repsCompleted: string,
        weightsUsed: string,
        videoUrl?: string
    ) => Promise<ExerciseLog | null>;
    addFeedback: (
        logId: string,
        feedback: string,
        sorenessRating?: number
    ) => Promise<ExerciseLog | null>;
    createLog: (log: ExerciseLogInsert) => Promise<ExerciseLog | null>;
    updateLog: (logId: string, updates: ExerciseLogUpdate) => Promise<ExerciseLog | null>;
    deleteLog: (logId: string) => Promise<boolean>;
    refresh: () => void;
} {
    const [logs, setLogs] = useState<ExerciseLog[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    // Fetch logs when session ID changes
    const fetchLogs = useCallback(async () => {
        if (!sessionId) {
            setLogs([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const logsData = await getExerciseLogs(sessionId);
            setLogs(logsData);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch exercise logs'));
            console.error('Error fetching exercise logs:', err);
        } finally {
            setLoading(false);
        }
    }, [sessionId]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    // Set up real-time subscription
    useEffect(() => {
        if (!sessionId || !enableRealtime) return;

        const unsubscribe = subscribeToExerciseLogs(sessionId, (log, eventType) => {
            if (eventType === 'INSERT') {
                setLogs(prev => [...prev, log]);
            } else if (eventType === 'UPDATE') {
                setLogs(prev =>
                    prev.map(l => l.id === log.id ? log : l)
                );
            } else if (eventType === 'DELETE') {
                setLogs(prev =>
                    prev.filter(l => l.id !== log.id)
                );
            }
        });

        return () => {
            unsubscribe();
        };
    }, [sessionId, enableRealtime]);

    /**
     * Log a completed exercise
     * @param exerciseId - The exercise ID
     * @param setsCompleted - Number of sets completed
     * @param repsCompleted - JSON string of reps completed for each set
     * @param weightsUsed - JSON string of weights used for each set
     * @param videoUrl - Optional URL to a video of the exercise
     * @returns The created exercise log
     */
    const logCompletedExercise = async (
        exerciseId: string,
        setsCompleted: number,
        repsCompleted: string, // Change to string for JSON
        weightsUsed: string, // Change to string for JSON
        videoUrl?: string
    ): Promise<ExerciseLog | null> => {
        if (!sessionId) {
            setError(new Error('No active workout session'));
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            const newLog = await logExercise(
                sessionId,
                exerciseId,
                setsCompleted,
                repsCompleted,
                weightsUsed,
                videoUrl
            );

            if (newLog && !enableRealtime) {
                // If not using real-time, update the state manually
                setLogs(prev => [...prev, newLog]);
            }

            return newLog;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to log exercise'));
            console.error('Error logging exercise:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Add form feedback to an exercise log
     * @param logId - The exercise log ID
     * @param feedback - Feedback on the exercise form
     * @param sorenessRating - Optional rating of soreness (1-10)
     * @returns The updated exercise log
     */
    const addFeedback = async (
        logId: string,
        feedback: string,
        sorenessRating?: number
    ): Promise<ExerciseLog | null> => {
        setLoading(true);
        setError(null);

        try {
            const updatedLog = await addFormFeedback(logId, feedback, sorenessRating);

            if (updatedLog && !enableRealtime) {
                // If not using real-time, update the state manually
                setLogs(prev =>
                    prev.map(l => l.id === updatedLog.id ? updatedLog : l)
                );
            }

            return updatedLog;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to add form feedback'));
            console.error('Error adding form feedback:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Create a new exercise log
     * @param log - The exercise log data to create
     * @returns The created exercise log
     */
    const createLog = async (log: ExerciseLogInsert): Promise<ExerciseLog | null> => {
        setLoading(true);
        setError(null);

        try {
            const newLog = await createExerciseLog(log);

            if (newLog && !enableRealtime) {
                // If not using real-time, update the state manually
                setLogs(prev => [...prev, newLog]);
            }

            return newLog;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to create exercise log'));
            console.error('Error creating exercise log:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Update an exercise log
     * @param logId - The exercise log ID
     * @param updates - The exercise log data to update
     * @returns The updated exercise log
     */
    const updateLog = async (
        logId: string,
        updates: ExerciseLogUpdate
    ): Promise<ExerciseLog | null> => {
        setLoading(true);
        setError(null);

        try {
            const updatedLog = await updateExerciseLog(logId, updates);

            if (updatedLog && !enableRealtime) {
                // If not using real-time, update the state manually
                setLogs(prev =>
                    prev.map(l => l.id === updatedLog.id ? updatedLog : l)
                );
            }

            return updatedLog;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to update exercise log'));
            console.error('Error updating exercise log:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Delete an exercise log
     * @param logId - The exercise log ID
     * @returns True if the log was deleted successfully
     */
    const deleteLog = async (logId: string): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const success = await deleteExerciseLog(logId);

            if (success && !enableRealtime) {
                // If not using real-time, update the state manually
                setLogs(prev => prev.filter(l => l.id !== logId));
            }

            return success;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to delete exercise log'));
            console.error('Error deleting exercise log:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Refresh the exercise logs data
     */
    const refresh = () => {
        fetchLogs();
    };

    return {
        logs,
        loading,
        error,
        logCompletedExercise,
        addFeedback,
        createLog,
        updateLog,
        deleteLog,
        refresh,
    };
}
