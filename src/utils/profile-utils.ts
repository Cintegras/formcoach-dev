import type {Database} from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

export const hasCompleteProfile = (profile: Profile | null): boolean => {
    return !!profile?.birthdate && !!profile?.height && !!profile?.full_name;
};
