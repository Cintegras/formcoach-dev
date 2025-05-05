import {useCallback, useEffect, useState} from 'react';
import {useAuth} from '@/features/auth/hooks/useAuth';
import {
    createWorkoutSession,
    deleteWorkoutSession,
    endWorkoutSession,
    getWorkoutSessions,
    startWorkoutSession,
    subscribeToWorkoutSessions,
    updateWorkoutSession,
    WorkoutSession,
    WorkoutSessionInsert,
    WorkoutSessionUpdate
} from '@/services/supabase';

/**
 * Hook for accessing and managing workout sessions
 * @param limit - Maximum number of sessions to fetch (default: 20)
 * @param enableRealtime - Whether to enable real-time updates (default: true)
 */
export function useWorkoutSessions(limit = 20, enableRealtime = true) {
    const {user} = useAuth();
    const [sessions, setSessions] = useState<WorkoutSession[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);

    // Fetch sessions when user changes
    const fetchSessions = useCallback(async () => {
        if (!user) {
            setSessions([]);
            setActiveSession(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const sessionsData = await getWorkoutSessions(user.id, limit);
            setSessions(sessionsData);

            // Check if there's an active session (no end_time)
            const active = sessionsData.find(session => !session.end_time);
            setActiveSession(active || null);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch workout sessions'));
            console.error('Error fetching workout sessions:', err);
        } finally {
            setLoading(false);
        }
    }, [user, limit]);

    useEffect(() => {
        fetchSessions();
    }, [fetchSessions]);

    // Set up real-time subscription
    useEffect(() => {
        if (!user || !enableRealtime) return;

        const unsubscribe = subscribeToWorkoutSessions(user.id, (session, eventType) => {
            if (eventType === 'INSERT') {
                setSessions(prev => [session, ...prev].slice(0, limit));
                if (!session.end_time) {
                    setActiveSession(session);
                }
            } else if (eventType === 'UPDATE') {
                setSessions(prev =>
                    prev.map(s => s.id === session.id ? session : s)
                );

                // Update active session if this is the active one
                if (activeSession?.id === session.id) {
                    setActiveSession(session.end_time ? null : session);
                }
            } else if (eventType === 'DELETE') {
                setSessions(prev =>
                    prev.filter(s => s.id !== session.id)
                );

                // Clear active session if this was the active one
                if (activeSession?.id === session.id) {
                    setActiveSession(null);
                }
            }
        });

        return () => {
            unsubscribe();
        };
    }, [user, enableRealtime, limit, activeSession]);

    /**
     * Start a new workout session
     * @param workoutPlanId - Optional workout plan ID
     * @returns The created workout session
     */
    const startSession = async (workoutPlanId?: string): Promise<WorkoutSession | null> => {
        if (!user) {
            setError(new Error('No authenticated user'));
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            const newSession = await startWorkoutSession(workoutPlanId);

            if (newSession) {
                // If not using real-time, update the state manually
                if (!enableRealtime) {
                    setSessions(prev => [newSession, ...prev]);
                    setActiveSession(newSession);
                }
            }

            return newSession;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to start workout session'));
            console.error('Error starting workout session:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    /**
     * End the active workout session
     * @param notes - Optional notes about the session
     * @param overallFeeling - Optional rating of how the session felt
     * @returns The updated workout session
     */
    const endSession = async (
        notes?: string,
        overallFeeling?: string
    ): Promise<WorkoutSession | null> => {
        if (!activeSession) {
            setError(new Error('No active workout session'));
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            const updatedSession = await endWorkoutSession(
                activeSession.id,
                notes,
                overallFeeling
            );

            if (updatedSession && !enableRealtime) {
                // If not using real-time, update the state manually
                setSessions(prev =>
                    prev.map(s => s.id === updatedSession.id ? updatedSession : s)
                );
                setActiveSession(null);
            }

            return updatedSession;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to end workout session'));
            console.error('Error ending workout session:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Create a new workout session
     * @param session - The workout session data to create
     * @returns The created workout session
     */
    const createSession = async (
        session: WorkoutSessionInsert
    ): Promise<WorkoutSession | null> => {
        setLoading(true);
        setError(null);

        try {
            const newSession = await createWorkoutSession(session);

            if (newSession && !enableRealtime) {
                // If not using real-time, update the state manually
                setSessions(prev => [newSession, ...prev]);
                if (!newSession.end_time) {
                    setActiveSession(newSession);
                }
            }

            return newSession;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to create workout session'));
            console.error('Error creating workout session:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Update a workout session
     * @param sessionId - The workout session ID
     * @param updates - The workout session data to update
     * @returns The updated workout session
     */
    const updateSession = async (
        sessionId: string,
        updates: WorkoutSessionUpdate
    ): Promise<WorkoutSession | null> => {
        setLoading(true);
        setError(null);

        try {
            const updatedSession = await updateWorkoutSession(sessionId, updates);

            if (updatedSession && !enableRealtime) {
                // If not using real-time, update the state manually
                setSessions(prev =>
                    prev.map(s => s.id === updatedSession.id ? updatedSession : s)
                );

                // Update active session if this is the active one
                if (activeSession?.id === sessionId) {
                    setActiveSession(updatedSession.end_time ? null : updatedSession);
                }
            }

            return updatedSession;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to update workout session'));
            console.error('Error updating workout session:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Delete a workout session
     * @param sessionId - The workout session ID
     * @returns True if the session was deleted successfully
     */
    const deleteSession = async (sessionId: string): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const success = await deleteWorkoutSession(sessionId);

            if (success && !enableRealtime) {
                // If not using real-time, update the state manually
                setSessions(prev => prev.filter(s => s.id !== sessionId));

                // Clear active session if this was the active one
                if (activeSession?.id === sessionId) {
                    setActiveSession(null);
                }
            }

            return success;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to delete workout session'));
            console.error('Error deleting workout session:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Refresh the workout sessions data
     */
    const refresh = () => {
        fetchSessions();
    };

    return {
        sessions,
        activeSession,
        loading,
        error,
        startSession,
        endSession,
        createSession,
        updateSession,
        deleteSession,
        refresh,
    };
}