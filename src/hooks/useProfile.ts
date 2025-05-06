
import {useEffect, useRef, useState} from 'react';
import {useAuth} from '@/features/auth/hooks/useAuth';
import {createProfile, getProfile, Profile, ProfileUpdate, updateProfile} from '@/services/supabase';
import {hasCompleteProfile} from '@/utils/profile-utils';

/**
 * Hook for accessing and managing the current user's profile
 */
export function useProfile() {
    const {user, loading: authLoading} = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    // Add profile cache with useRef to persist across renders
    const profileCache = useRef<{ [key: string]: Profile | null }>({});
    // Add a ref to track the current profile to prevent null resets during re-renders
    const profileRef = useRef<Profile | null>(null);

    // Fetch profile when user changes or auth loading state changes
    useEffect(() => {
        // Set loading to true when auth is loading
        if (authLoading) {
            setLoading(true);
            return;
        }

        if (!user) {
            // Check localStorage fallback before setting profile to null
            const hasProfileComplete = localStorage.getItem("profile_complete") === "true";
            if (!hasProfileComplete) {
                setProfile(null);
                profileRef.current = null;
            }
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            setLoading(true);
            setError(null);

            // Check cache first
            if (profileCache.current[user.id]) {
                setProfile(profileCache.current[user.id]);
                profileRef.current = profileCache.current[user.id];
                setLoading(false);
                return;
            }

            try {
                const profileData = await getProfile(user.id);
                // Cache the result
                profileCache.current[user.id] = profileData;
                setProfile(profileData);
                profileRef.current = profileData;

                // Update localStorage based on profile completeness
                if (hasCompleteProfile(profileData)) {
                    localStorage.setItem("profile_complete", "true");
                }
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch profile'));
                console.error('Error fetching profile:', err);

                // Check localStorage fallback if profile fetch fails
                const hasProfileComplete = localStorage.getItem("profile_complete") === "true";
                if (hasProfileComplete) {
                    console.log("Using localStorage fallback for profile_complete");
                }
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
            // Make sure birthdate is not undefined if provided in updates
            const updatesWithValidBirthdate = {
                ...updates,
                birthdate: updates.birthdate || undefined
            };

            const updatedProfile = await updateProfile(user.id, updatesWithValidBirthdate);
            if (updatedProfile) {
                // Update state and cache
                setProfile(updatedProfile);
                profileRef.current = updatedProfile;
                profileCache.current[user.id] = updatedProfile;

                // Update localStorage if profile is now complete
                if (hasCompleteProfile(updatedProfile)) {
                    localStorage.setItem("profile_complete", "true");
                }
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
            // Ensure birthdate is not undefined
            const profileDataWithValidBirthdate = {
                ...profileData,
                birthdate: profileData.birthdate as string // Cast to string to ensure it's not undefined
            };

            const newProfile = await createProfile({
                id: user.id,
                ...profileDataWithValidBirthdate
            });

            if (newProfile) {
                // Update state and cache
                setProfile(newProfile);
                profileRef.current = newProfile;
                profileCache.current[user.id] = newProfile;

                // Update localStorage if profile is complete
                if (hasCompleteProfile(newProfile)) {
                    localStorage.setItem("profile_complete", "true");
                }
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
