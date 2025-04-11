import { Router } from "express";
import { joinWorkspaceController, deleteMemberController } from "../controllers/member.controller";

const memberRoutes = Router();
// Tham gia workspace = inviteCode
memberRoutes.post("/workspace/:inviteCode/join", joinWorkspaceController);
// Xóa member khỏi workspace
memberRoutes.delete("/workspace/:workspaceId/member/:memberId", deleteMemberController);

export default memberRoutes;