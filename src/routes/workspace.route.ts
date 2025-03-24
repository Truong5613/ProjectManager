import { Router } from "express";
import { ChangeWorkspaceMemberRoleController, createNewWorkspaceController, deleteWorkspaceByIdController, getAllWorkspacesUserIsMemberController, getWorkspaceAnalyticsController, getWorkspaceMembersController, getWorkspacesByIdController, UpdateWorkspaceByIdController } from "../controllers/workspace.controller";
import { get } from "http";



const workspaceRoute = Router();

workspaceRoute.post("/create/new", createNewWorkspaceController);
workspaceRoute.put("/update/:id", UpdateWorkspaceByIdController);
workspaceRoute.delete("/delete/:id", deleteWorkspaceByIdController);

workspaceRoute.get("/all", getAllWorkspacesUserIsMemberController);

workspaceRoute.get("/analytics/:id", getWorkspaceAnalyticsController);
workspaceRoute.get("/:id", getWorkspacesByIdController);

workspaceRoute.put("/change/members/role/:id", ChangeWorkspaceMemberRoleController);
workspaceRoute.get("/members/:id", getWorkspaceMembersController);





export default workspaceRoute;