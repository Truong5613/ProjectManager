import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { Request, Response } from "express";
import { changeRoleSchema, createWorkspaceSchema, updateWorkspaceSchema, workspaceIdSchema } from "../validation/workspace.validation";
import { HTTPSTATUS } from "../config/http.config";
import { changeMemberRoleService, createWorkspaceService, deleteWorkspaceService, getAllWorkspacesUserIsMemberService, getWorkspaceAnalyticsService, getWorkspaceByIdService, getWorkspaceMembersService, updateWorkspaceByIdService } from "../services/workspace.service";
import { getMemberRoleInWorkspace } from "../services/member.service";
import { roleGuard } from "../utils/roleGuard";
import { Permissions } from "../enums/role.enum";
//tao 1 workspace moi
export const createNewWorkspaceController = asyncHandler(
    async (req: Request, res: Response) => {
        const body = createWorkspaceSchema.parse(req.body);

        const userid = req.user?._id;
        const {workspace} = await createWorkspaceService(userid, body);

        return res.status(HTTPSTATUS.CREATED).json({
            message: "Workspace created successfully",
            workspace,
        });
    }
)
//lay tat ca cac workspace cua user
export const getAllWorkspacesUserIsMemberController = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user?._id;
  
      const { workspaces } = await getAllWorkspacesUserIsMemberService(userId);
  
      return res.status(HTTPSTATUS.OK).json({
        message: "User workspaces fetched successfully",
        workspaces,
      });
    }
);
//lay workspace theo id
export const getWorkspacesByIdController = asyncHandler(
    async (req: Request, res: Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.id);
        const userId = req.user?._id;

        await getMemberRoleInWorkspace(userId, workspaceId);

        const { workspace } = await getWorkspaceByIdService(workspaceId);

        return res.status(HTTPSTATUS.OK).json({
            message: "Workspace fetched successfully",
            workspace,
        });
    }
);

//lay cac thanh vien cua workspace
export const getWorkspaceMembersController = asyncHandler(
    async (req: Request, res: Response) => {
      const workspaceId = workspaceIdSchema.parse(req.params.id);
      const userId = req.user?._id;
  
      const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
      roleGuard(role, [Permissions.VIEW_ONLY]);
  
      const { members, roles } = await getWorkspaceMembersService(workspaceId);
  
      return res.status(HTTPSTATUS.OK).json({
        message: "Workspace members retrieved successfully",
        members,
        roles,
      });
    }
  );
  
//Lay thong ke cua workspace
export const getWorkspaceAnalyticsController = asyncHandler(
    async (req: Request, res: Response) => {
      const workspaceId = workspaceIdSchema.parse(req.params.id);
      const userId = req.user?._id;
  
      const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
      roleGuard(role, [Permissions.VIEW_ONLY]);
  
      const { analytics } = await getWorkspaceAnalyticsService(workspaceId);
  
      return res.status(HTTPSTATUS.OK).json({
        message: "Workspace analytics retrieved successfully",
        analytics,
      });
    }
  );

//Thay doi vai tro cua thanh vien trong workspace
export const ChangeWorkspaceMemberRoleController = asyncHandler(
    async (req: Request, res: Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.id);
        const { memberId, roleId } = changeRoleSchema.parse(req.body);

        const userId = req.user?._id;

        const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
        roleGuard(role, [Permissions.CHANGE_MEMBER_ROLE]);

        const { member } = await changeMemberRoleService(
            workspaceId,
            memberId,
            roleId
          );
      
          return res.status(HTTPSTATUS.OK).json({
            message: "Member Role changed successfully",
            member,
          });
    }
);

//Thay doi thong tin workspace theo id
export const UpdateWorkspaceByIdController = asyncHandler(
    async (req: Request, res: Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.id);
        const { name, description } = updateWorkspaceSchema.parse(req.body);

        const userId = req.user?._id;

        const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
        roleGuard(role, [Permissions.EDIT_WORKSPACE]);

        const { workspace } = await updateWorkspaceByIdService(
        workspaceId,
        name,
        description
        );

        return res.status(HTTPSTATUS.OK).json({
        message: "Workspace updated successfully",
        workspace,
        });
    }
);

//Xoa workspace theo id
export const deleteWorkspaceByIdController = asyncHandler(
    async (req: Request, res: Response) => {
      const workspaceId = workspaceIdSchema.parse(req.params.id);
  
      const userId = req.user?._id;
  
      const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
      roleGuard(role, [Permissions.DELETE_WORKSPACE]);
  
      const { currentWorkspace } = await deleteWorkspaceService(
        workspaceId,
        userId
      );
  
      return res.status(HTTPSTATUS.OK).json({
        message: "Workspace deleted successfully",
        currentWorkspace,
      });
    }
  );