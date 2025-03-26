import { Router } from "express";
import { createProjectController, deleteProjectController, getAllProjectsController, getProjectAnalyticsController, getProjectByIdAndWorkspaceIdController, updateProjectController } from "../controllers/project.controller";

const projectRoutes = Router();
// Route Tao moi, cap nhat, xoa project
projectRoutes.post("/workspace/:workspaceId/create", createProjectController)
projectRoutes.put("/:id/workspace/:workspaceId/update",updateProjectController);
projectRoutes.delete("/:id/workspace/:workspaceId/delete",deleteProjectController);

// Route Lay danh sach project
projectRoutes.get("/workspace/:workspaceId/all", getAllProjectsController)
// Route Lay thong tin cua project theo id
projectRoutes.get("/:id/workspace/:workspaceId",getProjectByIdAndWorkspaceIdController);
// Route Lay thong tin analytics cua project
projectRoutes.get("/:id/workspace/:workspaceId/analytics",getProjectAnalyticsController);


export default projectRoutes;