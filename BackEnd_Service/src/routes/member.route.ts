import { Router } from "express";
import { joinWorkspaceController } from "../controllers/member.controller";

const memberRoutes = Router();
// Tham gia workspace = inviteCode
memberRoutes.post("/workspace/:inviteCode/join", joinWorkspaceController);

export default memberRoutes;