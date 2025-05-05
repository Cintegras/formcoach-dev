
import {useEffect, useState} from 'react';
import {supabase} from '@/integrations/supabase/client';
import {Session, User} from '@supabase/supabase-js';

// Define an interface for auth errors
interface AuthError {
    message: string;
    [key: string]: any;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

    const signIn = async (email: string, password: string): Promise<{ data: any, error: AuthError | null }> => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Sign in error:", error);
        return {data: null, error: error as AuthError};
    } finally {
      setLoading(false);
    }
  };

    const signUp = async (email: string, password: string): Promise<{ data: any, error: AuthError | null }> => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Sign up error:", error);
        return {data: null, error: error as AuthError};
    } finally {
      setLoading(false);
    }
  };

    const signOut = async (): Promise<{ error: AuthError | null }> => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error("Sign out error:", error);
        return {error: error as AuthError};
    } finally {
      setLoading(false);
    }
  };

  // Add isAuthenticated computed property
  const isAuthenticated = !!user;

  return {
    user,
    session,
    loading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
  };
}
