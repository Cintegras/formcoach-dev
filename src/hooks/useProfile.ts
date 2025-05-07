import {useEffect, useRef, useState} from 'react';
import {useAuth} from '@/features/auth/hooks/useAuth';
import {createProfile, getProfile, updateProfile} from '@/services/supabase';
import {hasCompleteProfile} from '@/utils/profile-utils';
import type {Database} from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

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

        // Check if we should force profile setup
        const forceProfileSetup = localStorage.getItem("force_profile_setup") === "true";
        if (forceProfileSetup) {
            // Clear the flag
            localStorage.removeItem("force_profile_setup");
            // Return null profile to force profile setup
            setProfile(null);
            profileRef.current = null;
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
            // Ensure birthdate is a valid string if provided in updates
            const updatesWithValidBirthdate = {
                ...updates,
                // Make sure birthdate is not undefined if provided
                birthdate: updates.birthdate ?? profile?.birthdate ?? ""
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
            // First, try to get the existing profile to preserve user_type and tester_description
            const existingProfile = await getProfile(user.id);

            // Ensure birthdate is a valid string
            const profileDataWithValidBirthdate = {
                ...profileData,
                // Make sure birthdate is not undefined
                birthdate: profileData.birthdate ?? "",
                // Preserve user_type and tester_description if they exist in the current profile
                user_type: existingProfile?.user_type ?? null,
                tester_description: existingProfile?.tester_description ?? null
            };

            let newProfile: Profile | null = null;

            // If profile already exists, update it instead of creating a new one
            if (existingProfile) {
                console.log('Profile already exists, updating instead of creating');
                newProfile = await updateProfile(user.id, profileDataWithValidBirthdate);
            } else {
                // Create a new profile if one doesn't exist
                newProfile = await createProfile({
                    id: user.id,
                    ...profileDataWithValidBirthdate
                });
            }

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
