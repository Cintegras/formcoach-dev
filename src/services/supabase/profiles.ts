import {supabase} from '@/integrations/supabase/client';
import {Database} from '@/integrations/supabase/types';
import {getEnvironment} from '@/lib/environment';

// Type definitions
type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

// Dummy UUIDs for development
export const DUMMY_USER_IDS = {
    JACK: '00000000-0000-0000-0000-000000000001',
    GINGER: '00000000-0000-0000-0000-000000000002',
};

/**
 * Get a user's profile by ID
 * @param userId - The user's ID
 * @returns The user's profile or null if not found
 */
export const getProfile = async (userId: string): Promise<Profile | null> => {
    const {data, error} = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching profile:', error);
        return null;
    }

    return data;
};

/**
 * Get the current user's profile
 * @returns The current user's profile or null if not authenticated
 */
export const getCurrentProfile = async (): Promise<Profile | null> => {
    const {data: {user}} = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    return getProfile(user.id);
};

/**
 * Create a new profile
 * @param profile - The profile data to insert
 * @returns The created profile or null if there was an error
 */
export const createProfile = async (profile: ProfileInsert): Promise<Profile | null> => {
    // Ensure environment is set
    const environment = getEnvironment();

    const {data, error} = await supabase
        .from('profiles')
        .insert({...profile, environment})
        .select()
        .single();

    if (error) {
        console.error('Error creating profile:', error);
        return null;
    }

    return data;
};

/**
 * Update a user's profile
 * @param userId - The user's ID
 * @param updates - The profile data to update
 * @returns The updated profile or null if there was an error
 */
export const updateProfile = async (userId: string, updates: ProfileUpdate): Promise<Profile | null> => {
    const {data, error} = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

    if (error) {
        console.error('Error updating profile:', error);
        return null;
    }

    return data;
};

/**
 * Delete a user's profile
 * @param userId - The user's ID
 * @returns True if the profile was deleted successfully, false otherwise
 */
export const deleteProfile = async (userId: string): Promise<boolean> => {
    const {error} = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

    if (error) {
        console.error('Error deleting profile:', error);
        return false;
    }

    return true;
};