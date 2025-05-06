
import { useEffect, useState } from 'react';
import { useProfile } from '@/hooks/useProfile';

/**
 * Custom hook to determine if current user has admin access
 * @returns Object with isAdmin boolean, loading state, and any error
 */
export const useAdminAccess = () => {
  const { profile, loading, error: profileError } = useProfile();
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    if (profile && !loading) {
      const userType = profile.user_type || 'user';
      // Check if user has any of the allowed roles
      setIsAdmin(['admin', 'super_user', 'beta_tester'].includes(userType));
    } else {
      setIsAdmin(false);
    }
  }, [profile, loading]);

  return {
    isAdmin,
    loading,
    error: profileError,
  };
};
