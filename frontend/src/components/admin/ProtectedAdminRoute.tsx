import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../../contexts/AdminAuthContext";

interface ProtectedAdminRouteProps {
  children: JSX.Element;
}

export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const { isAdmin } = useAdminAuth();
  
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
} 