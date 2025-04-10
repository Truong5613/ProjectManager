import { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUserQueryFn } from "@/lib/api";
import { UserType } from "@/types/api.type";
import useWorkspaceId from "@/hooks/use-workspace-id";
import useAuth from "@/hooks/api/use-auth";
import useGetWorkspaceQuery from "@/hooks/api/use-get-workspace";
import usePermissions from "@/hooks/use-permissions";
import { PermissionType } from "@/constant";

interface AuthContextType {
  user: UserType | null;
  workspace: any;
  hasPermission: (permission: PermissionType) => boolean;
  error: Error | null;
  isLoading: boolean;
  isFetching: boolean;
  workspaceLoading: boolean;
  refetchAuth: () => void;
  refetchWorkspace: () => void;
  setUser: (user: UserType | null) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const workspaceId = useWorkspaceId();

  const {
    data: authData,
    error: authError,
    isLoading,
    isFetching,
    refetch: refetchAuth,
  } = useAuth();

  const {
    data: workspaceData,
    error: workspaceError,
    isLoading: workspaceLoading,
    refetch: refetchWorkspace,
  } = useGetWorkspaceQuery(workspaceId);

  const permissions = usePermissions(authData?.user, workspaceData?.workspace);

  const hasPermission = (permission: PermissionType): boolean => {
    return permissions.includes(permission);
  };

  const [authUser, setAuthUser] = useState<UserType | null>(null);

  useEffect(() => {
    if (authData?.user) {
      setAuthUser(authData.user);
    }
  }, [authData]);

  const setUser = (user: UserType | null) => {
    setAuthUser(user);
  };

  const value: AuthContextType = {
    user: authUser,
    workspace: workspaceData?.workspace,
    hasPermission,
    error: authError || workspaceError,
    isLoading,
    isFetching,
    workspaceLoading,
    refetchAuth,
    refetchWorkspace,
    setUser,
    isAuthenticated: !!authUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
