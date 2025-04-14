import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import PageLoader from '@/components/common/PageLoader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireCompleteProfile?: boolean;
}

/**
 * ProtectedRoute component to handle authentication-based routing
 * @param children - The components to render if authentication requirements are met
 * @param requireAuth - If true, requires authentication. If false, requires no authentication.
 * @param requireCompleteProfile - If true, requires the user to complete their profile.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAuth = true, requireCompleteProfile = false }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <PageLoader />;
  }
  
  if (requireAuth && !isAuthenticated) {
    // Redirect to login page but save the attempted location
    return <Navigate to="/auth/login/" state={{ from: location }} replace />;
  }
  
  if (!requireAuth && isAuthenticated) {
    // Redirect to advertisements page if already authenticated
    return <Navigate to="/advertisements" replace />;
  }

  if (requireCompleteProfile && !user?.profileCompleted) {
    return <Navigate to="/auth/complete-profile" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;