
import {Profile} from '@/services/supabase';

export const hasCompleteProfile = (profile: Profile | null): boolean => {
    return !!profile?.birthdate && !!profile?.height && !!profile?.full_name;
};
