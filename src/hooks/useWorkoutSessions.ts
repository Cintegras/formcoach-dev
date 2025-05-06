
import {useCallback, useEffect, useState} from 'react';
import {useAuth} from '@/features/auth/hooks/useAuth';
import {
    getWorkoutSession,
    getWorkoutSessions,
    startWorkoutSession,
    endWorkoutSession
} from '@/services/supabase/workout-sessions';
import type {Database} from '@/types/supabase';

type WorkoutSession = Database['public']['Tables']['workout_sessions']['Row'];

/**
 * Hook for managing workout sessions
 */
export function useWorkoutSessions(workoutPlanId: string | null = null) {
    const {user} = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [sessions, setSessions] = useState<WorkoutSession[]>([]);
    const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);

    /**
     * Fetch workout sessions for the current workout plan
     */
    const fetchSessions = useCallback(async () => {
        if (!workoutPlanId) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Using getWorkoutSessions instead of getWorkoutSessionsForPlan
            const sessionsData = await getWorkoutSessions(workoutPlanId);
            setSessions(sessionsData || []);

            // Check if there's an active session among the fetched sessions
            const active = sessionsData?.find(session => session.status === 'active') || null;
            setActiveSession(active);
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to fetch workout sessions');
            setError(error);
            console.error('Error fetching workout sessions:', err);
        } finally {
            setLoading(false);
        }
    }, [workoutPlanId]);

    /**
     * Fetch a workout session by its ID
     */
    const fetchSessionById = useCallback(async (sessionId: string) => {
        setLoading(true);
        setError(null);

        try {
            // Using getWorkoutSession instead of getWorkoutSessionById
            const sessionData = await getWorkoutSession(sessionId);
            setActiveSession(sessionData);
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to fetch workout session');
            setError(error);
            console.error('Error fetching workout session:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (workoutPlanId) {
            fetchSessions();
        }
    }, [workoutPlanId, fetchSessions]);

    /**
     * Start a new workout session
     */
    const startSession = async (workoutPlanId?: string | null): Promise<WorkoutSession | null> => {
        setLoading(true);
        setError(null);

        try {
            // Convert null to undefined to match the expected type
            const newSession = await startWorkoutSession(workoutPlanId ?? undefined);

            if (newSession) {
                // If not using real-time, update the state manually
                setActiveSession(newSession);
                setSessions(prevSessions => [...prevSessions, newSession]);
            }

            return newSession;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to start workout session');
            setError(error);
            console.error('Error starting workout session:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    /**
     * End the current workout session
     */
    const endSession = async (sessionId: string | null): Promise<WorkoutSession | null> => {
        if (!sessionId) {
            setError(new Error('No active workout session to end'));
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            const endedSession = await endWorkoutSession(sessionId);

            if (endedSession) {
                // Update local state
                setActiveSession(null);
                setSessions(prevSessions =>
                    prevSessions.map(session =>
                        session.id === sessionId ? {...session, status: 'completed'} : session
                    )
                );
            }

            return endedSession;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to end workout session');
            setError(error);
            console.error('Error ending workout session:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        sessions,
        activeSession,
        loading,
        error,
        startSession,
        endSession,
        fetchSessionById
    };
}
