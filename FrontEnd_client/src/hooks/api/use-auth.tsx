import { getCurrentUserQueryFn } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { CustomError } from "@/types/custom-error.type";
import { CurrentUserResponseType } from "@/types/api.type";

const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const query = useQuery<CurrentUserResponseType, CustomError>({
    queryKey: ["authUser"],
    queryFn: getCurrentUserQueryFn,
    staleTime: 5 * 60 * 1000, 
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !location.pathname.startsWith("/sign-in") && !location.pathname.startsWith("/sign-up"),
  });

  // Handle unauthorized error
  if (query.error?.errorCode === "ACCESS_UNAUTHORIZED") {
    // Don't redirect if we're on an invite route or auth routes
    const isInviteRoute = location.pathname.startsWith("/invite/workspace/");
    const isAuthRoute = location.pathname.startsWith("/sign-in") || 
                       location.pathname.startsWith("/sign-up") ||
                       location.pathname === "/";
    
    if (!isInviteRoute && !isAuthRoute) {
      // Preserve the return URL for invite routes
      const returnUrl = isInviteRoute ? encodeURIComponent(location.pathname) : undefined;
      navigate(returnUrl ? `/sign-in?returnUrl=${returnUrl}` : "/");
    }
  }

  return query;
};

export default useAuth;
