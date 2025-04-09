import { Router } from "express";
import { createTaskController, deleteTaskController, getAllTasksController, getTaskByIdController, updateTaskController } from "../controllers/task.controller";

const taskRoutes = Router();
//Tao,cap nhat, xoa task cho project trong workspace
taskRoutes.post("/project/:projectId/workspace/:workspaceId/create", createTaskController);
taskRoutes.delete("/:id/workspace/:workspaceId/delete", deleteTaskController);
taskRoutes.put("/:id/project/:projectId/workspace/:workspaceId/update",updateTaskController);

//Lay tat ca cac Task trong Workspace
taskRoutes.get("/workspace/:workspaceId/all", getAllTasksController);

//Lay Task theo id
taskRoutes.get("/:id/project/:projectId/workspace/:workspaceId",getTaskByIdController);

export default taskRoutes;