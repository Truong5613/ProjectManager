import { Router } from "express";
import { ChangeWorkspaceMemberRoleController, createNewWorkspaceController, deleteWorkspaceByIdController, getAllWorkspacesUserIsMemberController, getWorkspaceAnalyticsController, getWorkspaceMembersController, getWorkspacesByIdController, UpdateWorkspaceByIdController } from "../controllers/workspace.controller";
import { get } from "http";



const workspaceRoute = Router();
// Tao moi , Cap nhat , Xoa Workspace
workspaceRoute.post("/create/new", createNewWorkspaceController);
workspaceRoute.put("/update/:id", UpdateWorkspaceByIdController);
workspaceRoute.delete("/delete/:id", deleteWorkspaceByIdController);
//Lay tat ca workspace ma user la thanh vien
workspaceRoute.get("/all", getAllWorkspacesUserIsMemberController);
//lay thong ke cua workspcae = id
workspaceRoute.get("/analytics/:id", getWorkspaceAnalyticsController);
//Lay workspace theo id
workspaceRoute.get("/:id", getWorkspacesByIdController);
//Thay doi vai tro cua thanh vien trong workspace
workspaceRoute.put("/change/members/role/:id", ChangeWorkspaceMemberRoleController);
//Lay tat ca thanh vien trong workspace
workspaceRoute.get("/members/:id", getWorkspaceMembersController);





export default workspaceRoute;