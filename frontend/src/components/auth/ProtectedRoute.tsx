import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import PageLoader from '@/components/common/PageLoader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

/**
 * ProtectedRoute component to handle authentication-based routing
 * @param children - The components to render if authentication requirements are met
 * @param requireAuth - Whether authentication is required (default: true)
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true 
}) => {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();
  
  // Show loader while checking authentication
  if (loading) {
    return <PageLoader variant="ripple" />;
  }
  
  // If auth is required but user is not logged in, redirect to login
  if (requireAuth && !isLoggedIn()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If user is logged in but tries to access auth pages (login/register), redirect to home
  if (!requireAuth && isLoggedIn()) {
    return <Navigate to="/" replace />;
  }
  
  // If authentication requirements are met, render children
  return <>{children}</>;
};

export default ProtectedRoute;
