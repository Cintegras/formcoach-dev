import React from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {useAuth} from '../hooks/useAuth';
import {useAdminAccess} from '@/hooks/useAdminAccess';
import LoadingIndicator from '@/components/LoadingIndicator';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading, error } = useAdminAccess();
  const location = useLocation();

    // Check admin status after authentication is complete

    // Show loading indicator while checking admin status
  if (authLoading || adminLoading) {
    return <LoadingIndicator fullScreen text="Checking admin access..." />;
  }

  if (error) {
    console.error("Admin access error:", error);
    return <Navigate to="/error" state={{ error: "Failed to check admin access" }} />;
  }

    // Restore the admin check but with a more informative message
  if (!isAdmin) {
      return (
          <div className="flex flex-col items-center justify-center h-screen bg-[#0C1518] text-white p-4">
              <h1 className="text-2xl font-bold text-[#B0E8E3] mb-4">Access Restricted</h1>
              <p className="text-center mb-6">
                  The Test Options page is only available to admin users.
              </p>
              <button
                  onClick={() => window.location.href = '/'}
                  className="px-4 py-2 bg-[#00C4B4] text-black rounded hover:bg-[#00C4B4]/80"
              >
                  Return to Home
              </button>
          </div>
      );
  }

  return <>{children}</>;
};

export default AdminRoute;
