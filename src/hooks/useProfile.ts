import {useEffect, useRef, useState} from 'react';
import {useAuth} from '@/features/auth/hooks/useAuth';
import {createProfile, getProfile, Profile, ProfileUpdate, updateProfile} from '@/services/supabase';

/**
 * Hook for accessing and managing the current user's profile
 */
export function useProfile() {
    const {user, loading: authLoading} = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    // Add profile cache
    const profileCache = useRef<{ [key: string]: Profile | null }>({});

    // Fetch profile when user changes or auth loading state changes
    useEffect(() => {
        // Don't fetch if auth is still loading
        if (authLoading) {
            return;
        }

        if (!user) {
            setProfile(null);
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            setLoading(true);
            setError(null);

            // Check cache first
            if (profileCache.current[user.id]) {
                setProfile(profileCache.current[user.id]);
                setLoading(false);
                return;
            }

            try {
                const profileData = await getProfile(user.id);
                // Cache the result
                profileCache.current[user.id] = profileData;
                setProfile(profileData);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch profile'));
                console.error('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user, authLoading]);

    /**
     * Update the current user's profile
     * @param updates - The profile data to update
     * @returns The updated profile
     */
    const update = async (updates: ProfileUpdate): Promise<Profile | null> => {
        if (!user) {
            setError(new Error('No authenticated user'));
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            const updatedProfile = await updateProfile(user.id, updates);
            if (updatedProfile) {
                setProfile(updatedProfile);
            }
            return updatedProfile;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to update profile'));
            console.error('Error updating profile:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Create a profile for the current user
     * @param profileData - The profile data to create
     * @returns The created profile
     */
    const create = async (profileData: Omit<ProfileUpdate, 'id'>): Promise<Profile | null> => {
        if (!user) {
            setError(new Error('No authenticated user'));
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            const newProfile = await createProfile({
                id: user.id,
                ...profileData
            });

            if (newProfile) {
                setProfile(newProfile);
            }
            return newProfile;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to create profile'));
            console.error('Error creating profile:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        profile,
        loading,
        error,
        update,
        create,
    };
}
