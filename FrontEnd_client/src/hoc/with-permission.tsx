import { PermissionType } from "@/constant";
import { useAuthContext } from "@/context/auth-provider";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const withPermission = (
  WarappedComponent: React.ComponentType,
  requiredPermission: PermissionType
) => {
  const WithPermission = (props: any) => {
    const {user, hasPermission, isLoading} = useAuthContext();
    const navigate = useNavigate();
    const workspaceId = useWorkspaceId();

    useEffect(()=>{
      if(!user || !hasPermission(requiredPermission)){
        navigate(`/workspace/${workspaceId}`);
      }
    },[hasPermission, user, navigate, workspaceId]);
    if (isLoading) {
      return <div>Loading...</div>
    }


    if (user && !hasPermission(requiredPermission)) {
      return ;
    }

    return <WarappedComponent {...props} />;
  };
  return WithPermission;
};

export default withPermission;
