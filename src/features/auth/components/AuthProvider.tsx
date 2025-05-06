import React, {createContext, useEffect, useState} from 'react';
import {supabase} from '../../../services/supabase';
import {AuthContextType, AuthState} from '../types';

// Create the auth context with default values
export const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    isLoading: true,
    error: null,
    signUp: async () => {
    },
    signIn: async () => {
    },
    signOut: async () => {
    },
    resetPassword: async () => {
    },
});

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [state, setState] = useState<AuthState>({
        user: null,
        session: null,
        isLoading: true,
        error: null,
    });

    useEffect(() => {
        // Get the initial session
        const getInitialSession = async () => {
            try {
                const {data} = await supabase.auth.getSession();
                setState({
                    ...state,
                    user: data.session?.user ?? null,
                    session: data.session,
                    isLoading: false,
                });
            } catch (error) {
                setState({
                    ...state,
                    error: error as Error,
                    isLoading: false,
                });
            }
        };

        getInitialSession();

        // Set up the auth state listener
        const {data: authListener} = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setState({
                    ...state,
                    user: session?.user ?? null,
                    session,
                    isLoading: false,
                });
            }
        );

        // Clean up the listener when the component unmounts
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    // Auth methods
    const signUp = async (email: string, password: string) => {
        try {
            setState({...state, isLoading: true, error: null});
            const {error} = await supabase.auth.signUp({email, password});
            if (error) throw error;
        } catch (error) {
            setState({...state, error: error as Error, isLoading: false});
            throw error;
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            setState({...state, isLoading: true, error: null});
            const {error} = await supabase.auth.signInWithPassword({email, password});
            if (error) throw error;
        } catch (error) {
            setState({...state, error: error as Error, isLoading: false});
            throw error;
        }
    };

    const signOut = async () => {
        try {
            setState({...state, isLoading: true, error: null});
            const {error} = await supabase.auth.signOut();
            if (error) throw error;
        } catch (error) {
            setState({...state, error: error as Error, isLoading: false});
            throw error;
        }
    };

    const resetPassword = async (email: string) => {
        try {
            setState({...state, isLoading: true, error: null});
            const {error} = await supabase.auth.resetPasswordForEmail(email);
            if (error) throw error;
            setState({...state, isLoading: false});
        } catch (error) {
            setState({...state, error: error as Error, isLoading: false});
            throw error;
        }
    };

    const value = {
        ...state,
        signUp,
        signIn,
        signOut,
        resetPassword,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
