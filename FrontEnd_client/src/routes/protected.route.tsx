import { DashboardSkeleton } from "@/components/skeleton-loaders/dashboard-skeleton";
import useAuth from "@/hooks/api/use-auth";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AUTH_ROUTES } from "@/config/routes.config";

const ProtectedRoute = () => {
  const location = useLocation();
  const {data:authData,isLoading} = useAuth();
  const user = authData?.user;

  if(isLoading) return <DashboardSkeleton/>;
  if (!user) {
    // Preserve the current path as returnUrl
    const returnUrl = encodeURIComponent(location.pathname);
    return <Navigate to={`${AUTH_ROUTES.SIGN_IN}?returnUrl=${returnUrl}`} replace />;
  }

  return <Outlet/>;
};

export default ProtectedRoute;
