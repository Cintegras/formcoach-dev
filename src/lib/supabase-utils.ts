import {PostgrestFilterBuilder} from '@supabase/postgrest-js';

/**
 * Previously applied environment filtering to a Supabase query
 * Now simply returns the query as-is since environment column has been removed
 *
 * @param query The Supabase query
 * @returns The original query unchanged
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
    // Environment column has been removed, so we just return the query as-is
    return query;
};
