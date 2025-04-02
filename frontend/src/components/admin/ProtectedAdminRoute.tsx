import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../../contexts/AdminAuthContext";
import PageLoader from "@/components/common/PageLoader";

interface ProtectedAdminRouteProps {
  children: JSX.Element;
}

export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const { isAdmin, loading } = useAdminAuth();
  
  if (loading) {
    return <PageLoader />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
} 