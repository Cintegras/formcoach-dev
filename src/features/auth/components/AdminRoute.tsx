
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAccess } from '@/hooks/useAdminAccess';
import LoadingIndicator from '@/components/LoadingIndicator';

/**
 * A component that restricts access to admin routes
 * Redirects to home if user doesn't have admin access
 */
const AdminRoute: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { hasAccess, loading } = useAdminAccess();

  if (loading) {
    return <LoadingIndicator />;
  }

  if (!hasAccess) {
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
