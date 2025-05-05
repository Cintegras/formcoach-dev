
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getEnvironment } from '@/lib/environment';

export function useExercises() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const environment = getEnvironment();

  const fetchExercises = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('environment', environment as string)
        .order('name', { ascending: true });

      if (error) throw error;
      setExercises(data || []);
    } catch (err) {
      console.error('Error fetching exercises:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [environment]);

  // Get a single exercise by ID
  const getExercise = useCallback(async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('environment', environment as string)
        .eq('id', id as string)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching exercise:', err);
      return null;
    }
  }, [environment]);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  return {
    exercises,
    loading,
    error,
    fetchExercises,
    getExercise
  };
}
