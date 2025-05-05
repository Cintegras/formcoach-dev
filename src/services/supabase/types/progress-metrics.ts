
import { Database } from '@/integrations/supabase/types';

// Export type definitions
export type ProgressMetric = Database['public']['Tables']['progress_metrics']['Row'];
export type ProgressMetricInsert = Database['public']['Tables']['progress_metrics']['Insert'];
export type ProgressMetricUpdate = Database['public']['Tables']['progress_metrics']['Update'];
