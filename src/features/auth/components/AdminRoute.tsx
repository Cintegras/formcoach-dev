
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAdminAccess } from '@/hooks/useAdminAccess';
import LoadingIndicator from '@/components/LoadingIndicator';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const { isAdmin, loading: adminLoading, error } = useAdminAccess();
  const location = useLocation();
  
  if (loading || adminLoading) {
    return <LoadingIndicator fullScreen text="Checking admin access..." />;
  }

  if (error) {
    console.error("Admin access error:", error);
    return <Navigate to="/error" state={{ error: "Failed to check admin access" }} />;
  }

  if (!isAdmin) {
    // Redirect to home page if not an admin
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
