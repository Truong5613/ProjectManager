import { DashboardSkeleton } from "@/components/skeleton-loaders/dashboard-skeleton";
import useAuth from "@/hooks/api/use-auth";
import { Navigate, Outlet, useLocation, useSearchParams } from "react-router-dom";
import { isAuthRoute } from "./common/routePaths";

const AuthRoute = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const {data:authData,isLoading} = useAuth();
  const user = authData?.user;

  const _isAuthRoute = isAuthRoute(location.pathname);
  const returnUrl = searchParams.get("returnUrl");

  if(isLoading && !_isAuthRoute) return <DashboardSkeleton/>;

  if(!user) return <Outlet />;
  
  // If there's a return URL, navigate to it
  if (returnUrl) {
    return <Navigate to={returnUrl} replace />;
  }

  // Otherwise, navigate to the user's current workspace
  return <Navigate to={`workspace/${user.currentWorkspace?._id}`} replace />;
};

export default AuthRoute;
