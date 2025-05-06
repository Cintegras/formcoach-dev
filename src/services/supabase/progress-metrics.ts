import {supabase} from '@/integrations/supabase/client';
import {Database} from '@/integrations/supabase/types';

// Type definitions
type ProgressMetric = Database['public']['Tables']['progress_metrics']['Row'];
type ProgressMetricInsert = Database['public']['Tables']['progress_metrics']['Insert'];
type ProgressMetricUpdate = Database['public']['Tables']['progress_metrics']['Update'];

/**
 * Get all progress metrics for a user
 * @param userId - The user's ID
 * @param metricType - Optional filter by metric type
 * @param limit - Maximum number of metrics to return (default: 100)
 * @returns Array of progress metrics or empty array if none found
 */
export const getProgressMetrics = async (
    userId: string,
    metricType?: string,
    limit = 100
): Promise<ProgressMetric[]> => {
    let query = supabase
        .from('progress_metrics')
        .select('*')
        .eq('user_id', userId)
        .order('recorded_date', {ascending: false})
        .limit(limit);

    if (metricType) {
        query = query.eq('metric_type', metricType);
    }

    const {data, error} = await query;

    if (error) {
        console.error('Error fetching progress metrics:', error);
        return [];
    }

    return data || [];
};

/**
 * Get a progress metric by ID
 * @param metricId - The progress metric ID
 * @returns The progress metric or null if not found
 */
export const getProgressMetric = async (metricId: string): Promise<ProgressMetric | null> => {
    const {data, error} = await supabase
        .from('progress_metrics')
        .select('*')
        .eq('id', metricId)
        .maybeSingle();

    if (error) {
        console.error('Error fetching progress metric:', error);
        return null;
    }

    return data;
};

/**
 * Get the current user's progress metrics
 * @param metricType - Optional filter by metric type
 * @param limit - Maximum number of metrics to return (default: 100)
 * @returns Array of progress metrics or empty array if none found
 */
export const getCurrentUserProgressMetrics = async (
    metricType?: string,
    limit = 100
): Promise<ProgressMetric[]> => {
    const {data: {user}} = await supabase.auth.getUser();

    if (!user) {
        return [];
    }

    return getProgressMetrics(user.id, metricType, limit);
};

/**
 * Create a new progress metric
 * @param metric - The progress metric data to insert
 * @returns The created progress metric or null if there was an error
 */
export const createProgressMetric = async (
    metric: ProgressMetricInsert
): Promise<ProgressMetric | null> => {
    // Set recorded_date to today if not provided
    const recordedDate = metric.recorded_date || new Date().toISOString().split('T')[0];

    const {data, error} = await supabase
        .from('progress_metrics')
        .insert({...metric, recorded_date: recordedDate})
        .select()
        .maybeSingle();

    if (error) {
        console.error('Error creating progress metric:', error);
        return null;
    }

    return data;
};

/**
 * Update a progress metric
 * @param metricId - The progress metric ID
 * @param updates - The progress metric data to update
 * @returns The updated progress metric or null if there was an error
 */
export const updateProgressMetric = async (
    metricId: string,
    updates: ProgressMetricUpdate
): Promise<ProgressMetric | null> => {
    const {data, error} = await supabase
        .from('progress_metrics')
        .update(updates)
        .eq('id', metricId)
        .select()
        .maybeSingle();

    if (error) {
        console.error('Error updating progress metric:', error);
        return null;
    }

    return data;
};

/**
 * Delete a progress metric
 * @param metricId - The progress metric ID
 * @returns True if the progress metric was deleted successfully, false otherwise
 */
export const deleteProgressMetric = async (metricId: string): Promise<boolean> => {
    const {error} = await supabase
        .from('progress_metrics')
        .delete()
        .eq('id', metricId);

    if (error) {
        console.error('Error deleting progress metric:', error);
        return false;
    }

    return true;
};

/**
 * Track a new body measurement
 * @param userId - The user's ID
 * @param metricType - Type of metric (e.g., 'weight', 'body_fat', 'chest', 'waist', etc.)
 * @param value - The measurement value
 * @param notes - Optional notes about the measurement
 * @param date - Optional date of the measurement (defaults to today)
 * @returns The created progress metric or null if there was an error
 */
export const trackBodyMeasurement = async (
    userId: string,
    metricType: string,
    value: number,
    notes?: string,
    date?: string
): Promise<ProgressMetric | null> => {
    return createProgressMetric({
        user_id: userId,
        metric_type: metricType,
        metric_value: value,
        notes,
        recorded_date: date,
    });
};

/**
 * Get the history of a specific metric type for a user
 * @param userId - The user's ID
 * @param metricType - Type of metric to retrieve
 * @param limit - Maximum number of records to return (default: 30)
 * @returns Array of progress metrics for the specified type
 */
export const getMetricHistory = async (
    userId: string,
    metricType: string,
    limit = 30
): Promise<ProgressMetric[]> => {
    const {data, error} = await supabase
        .from('progress_metrics')
        .select('*')
        .eq('user_id', userId)
        .eq('metric_type', metricType)
        .order('recorded_date', {ascending: true})
        .limit(limit);

    if (error) {
        console.error(`Error fetching ${metricType} history:`, error);
        return [];
    }

    return data || [];
};

/**
 * Get the latest value for a specific metric type
 * @param userId - The user's ID
 * @param metricType - Type of metric to retrieve
 * @returns The latest progress metric or null if none found
 */
export const getLatestMetricValue = async (
    userId: string,
    metricType: string
): Promise<ProgressMetric | null> => {
    const {data, error} = await supabase
        .from('progress_metrics')
        .select('*')
        .eq('user_id', userId)
        .eq('metric_type', metricType)
        .order('recorded_date', {ascending: false})
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error(`Error fetching latest ${metricType}:`, error);
        return null;
    }

    return data;
};

/**
 * Get the latest weight metric for a user
 * @param userId - The user's ID
 * @returns The latest weight metric or null if none found
 *
 * -- RLS POLICY (if missing):
 * -- CREATE POLICY "Allow user to read own metrics"
 * -- ON public.progress_metrics
 * -- FOR SELECT
 * -- USING (auth.uid() = user_id);
 */
export const getLatestWeight = async (
    userId: string
): Promise<ProgressMetric | null> => {
    const {data, error} = await supabase
        .from('progress_metrics')
        .select('*')
        .eq('user_id', userId)
        .eq('metric_type', 'weight')
        .order('recorded_date', {ascending: false})
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error('Error fetching latest weight:', error.message);
        return null;
    }

    return data;
};

/**
 * Subscribe to real-time updates for a user's progress metrics
 * @param userId - The user's ID
 * @param callback - Function to call when data changes
 * @returns A function to unsubscribe
 */
export const subscribeToProgressMetrics = (
    userId: string,
    callback: (metric: ProgressMetric, eventType: 'INSERT' | 'UPDATE' | 'DELETE') => void
) => {
    const subscription = supabase
        .channel('progress_metrics_changes')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'progress_metrics',
                filter: `user_id=eq.${userId}`,
            },
            (payload) => {
                // @ts-ignore - payload.new and payload.old types are not properly defined
                callback(payload.new || payload.old, payload.eventType);
            }
        )
        .subscribe();

    // Return unsubscribe function
    return () => {
        supabase.removeChannel(subscription);
    };
};
