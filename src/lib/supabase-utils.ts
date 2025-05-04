import {supabase} from '@/integrations/supabase/client';
import {PostgrestFilterBuilder} from '@supabase/postgrest-js';
import {getEnvironment} from '@/lib/environment';

/**
 * Apply environment filtering to a Supabase query
 * This ensures that all queries only return data for the current environment
 *
 * @param query The Supabase query to filter
 * @returns The query with environment filtering applied
 *
 * @example
 * // Basic usage
 * const { data } = await withEnvironmentFilter(
 *   supabase.from('profiles').select('*')
 * );
 *
 * // With additional filters
 * const { data } = await withEnvironmentFilter(
 *   supabase.from('profiles').select('*').eq('user_id', userId)
 * );
 */
export const withEnvironmentFilter = <T>(
    query: PostgrestFilterBuilder<any, any, T[]>
): PostgrestFilterBuilder<any, any, T[]> => {
    const ENV = getEnvironment();
    return query.eq('environment', ENV);
};
