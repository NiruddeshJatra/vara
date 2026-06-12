import { Navigate } from "react-router-dom";

interface ProtectedAdminRouteProps {
  children: JSX.Element;
}

// Admin dashboard is parked for v2 (operations run in Django admin at launch).
// AdminAuthContext was removed with the localStorage token plumbing, so this
// gate simply redirects until the dashboard is revived.
export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  void children;
  return <Navigate to="/" replace />;
}
