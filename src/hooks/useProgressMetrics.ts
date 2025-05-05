import {useCallback, useEffect, useState} from 'react';
import {useAuth} from '@/features/auth/hooks/useAuth';
import {
    createProgressMetric,
    deleteProgressMetric,
    getLatestMetricValue,
    getMetricHistory,
    getProgressMetrics,
    ProgressMetric,
    ProgressMetricInsert,
    ProgressMetricUpdate,
    subscribeToProgressMetrics,
    trackBodyMeasurement,
    updateProgressMetric
} from '@/services/supabase';

/**
 * Hook for accessing and managing progress metrics
 * @param metricType - Optional filter by metric type
 * @param limit - Maximum number of metrics to return (default: 50)
 * @param enableRealtime - Whether to enable real-time updates (default: true)
 */
export function useProgressMetrics(
    metricType?: string,
    limit = 50,
    enableRealtime = true
) {
    const {user} = useAuth();
    const [metrics, setMetrics] = useState<ProgressMetric[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    // Fetch metrics when user or metricType changes
    const fetchMetrics = useCallback(async () => {
        if (!user) {
            setMetrics([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const metricsData = await getProgressMetrics(user.id, metricType, limit);
            setMetrics(metricsData);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch progress metrics'));
            console.error('Error fetching progress metrics:', err);
        } finally {
            setLoading(false);
        }
    }, [user, metricType, limit]);

    useEffect(() => {
        fetchMetrics();
    }, [fetchMetrics]);

    // Set up real-time subscription
    useEffect(() => {
        if (!user || !enableRealtime) return;

        const unsubscribe = subscribeToProgressMetrics(user.id, (metric, eventType) => {
            // If filtering by metric type, only process events for that type
            if (metricType && metric.metric_type !== metricType) return;

            if (eventType === 'INSERT') {
                setMetrics(prev => [metric, ...prev].slice(0, limit));
            } else if (eventType === 'UPDATE') {
                setMetrics(prev =>
                    prev.map(m => m.id === metric.id ? metric : m)
                );
            } else if (eventType === 'DELETE') {
                setMetrics(prev =>
                    prev.filter(m => m.id !== metric.id)
                );
            }
        });

        return () => {
            unsubscribe();
        };
    }, [user, metricType, limit, enableRealtime]);

    /**
     * Track a new body measurement
     * @param type - Type of metric (e.g., 'weight', 'body_fat', 'chest', 'waist', etc.)
     * @param value - The measurement value
     * @param notes - Optional notes about the measurement
     * @param date - Optional date of the measurement (defaults to today)
     * @returns The created progress metric
     */
    const trackMeasurement = async (
        type: string,
        value: number,
        notes?: string,
        date?: string
    ): Promise<ProgressMetric | null> => {
        if (!user) {
            setError(new Error('No authenticated user'));
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            const newMetric = await trackBodyMeasurement(user.id, type, value, notes, date);

            if (newMetric && !enableRealtime) {
                // If not using real-time, update the state manually
                // Only add to state if it matches the current filter
                if (!metricType || newMetric.metric_type === metricType) {
                    setMetrics(prev => [newMetric, ...prev].slice(0, limit));
                }
            }

            return newMetric;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to track measurement'));
            console.error('Error tracking measurement:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Create a new progress metric
     * @param metric - The progress metric data to create
     * @returns The created progress metric
     */
    const createMetric = async (
        metric: Omit<ProgressMetricInsert, 'user_id'>
    ): Promise<ProgressMetric | null> => {
        if (!user) {
            setError(new Error('No authenticated user'));
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            const newMetric = await createProgressMetric({
                ...metric,
                user_id: user.id
            });

            if (newMetric && !enableRealtime) {
                // If not using real-time, update the state manually
                // Only add to state if it matches the current filter
                if (!metricType || newMetric.metric_type === metricType) {
                    setMetrics(prev => [newMetric, ...prev].slice(0, limit));
                }
            }

            return newMetric;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to create progress metric'));
            console.error('Error creating progress metric:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Update a progress metric
     * @param metricId - The progress metric ID
     * @param updates - The progress metric data to update
     * @returns The updated progress metric
     */
    const updateMetric = async (
        metricId: string,
        updates: ProgressMetricUpdate
    ): Promise<ProgressMetric | null> => {
        setLoading(true);
        setError(null);

        try {
            const updatedMetric = await updateProgressMetric(metricId, updates);

            if (updatedMetric && !enableRealtime) {
                // If not using real-time, update the state manually
                // Only update in state if it matches the current filter
                if (!metricType || updatedMetric.metric_type === metricType) {
                    setMetrics(prev =>
                        prev.map(m => m.id === updatedMetric.id ? updatedMetric : m)
                    );
                } else {
                    // If it no longer matches the filter, remove it
                    setMetrics(prev =>
                        prev.filter(m => m.id !== updatedMetric.id)
                    );
                }
            }

            return updatedMetric;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to update progress metric'));
            console.error('Error updating progress metric:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Delete a progress metric
     * @param metricId - The progress metric ID
     * @returns True if the metric was deleted successfully
     */
    const deleteMetric = async (metricId: string): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const success = await deleteProgressMetric(metricId);

            if (success && !enableRealtime) {
                // If not using real-time, update the state manually
                setMetrics(prev => prev.filter(m => m.id !== metricId));
            }

            return success;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to delete progress metric'));
            console.error('Error deleting progress metric:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Get the history of a specific metric type
     * @param type - Type of metric to retrieve
     * @param historyLimit - Maximum number of records to return (default: 30)
     * @returns Array of progress metrics for the specified type
     */
    const getHistory = async (
        type: string,
        historyLimit = 30
    ): Promise<ProgressMetric[]> => {
        if (!user) {
            setError(new Error('No authenticated user'));
            return [];
        }

        setLoading(true);
        setError(null);

        try {
            return await getMetricHistory(user.id, type, historyLimit);
        } catch (err) {
            setError(err instanceof Error ? err : new Error(`Failed to get ${type} history`));
            console.error(`Error getting ${type} history:`, err);
            return [];
        } finally {
            setLoading(false);
        }
    };

    /**
     * Get the latest value for a specific metric type
     * @param type - Type of metric to retrieve
     * @returns The latest progress metric or null if none found
     */
    const getLatest = async (type: string): Promise<ProgressMetric | null> => {
        if (!user) {
            setError(new Error('No authenticated user'));
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            return await getLatestMetricValue(user.id, type);
        } catch (err) {
            setError(err instanceof Error ? err : new Error(`Failed to get latest ${type}`));
            console.error(`Error getting latest ${type}:`, err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Refresh the progress metrics data
     */
    const refresh = () => {
        fetchMetrics();
    };

    return {
        metrics,
        loading,
        error,
        trackMeasurement,
        createMetric,
        updateMetric,
        deleteMetric,
        getHistory,
        getLatest,
        refresh,
    };
}