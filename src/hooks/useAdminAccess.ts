
import { useEffect, useState } from 'react';
import { useProfile } from '@/hooks/useProfile';

/**
 * Custom hook to determine if current user has admin access
 * @returns Object with hasAccess boolean and loading state
 */
export const useAdminAccess = () => {
  const { profile, loading } = useProfile();
  const [hasAccess, setHasAccess] = useState(false);
  
  useEffect(() => {
    if (profile && !loading) {
      const userType = profile.user_type || 'user';
      // Check if user has any of the allowed roles
      setHasAccess(['admin', 'super_user', 'beta_tester'].includes(userType));
    } else {
      setHasAccess(false);
    }
  }, [profile, loading]);

  return {
    hasAccess,
    loading,
  };
};
