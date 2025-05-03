import {Session, User} from '@supabase/supabase-js';

export interface AuthState {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    error: Error | null;
}

export interface AuthContextType extends AuthState {
    signUp: (email: string, password: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
}