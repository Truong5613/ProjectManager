import { Router } from "express";
import { getCurrentUserController } from "../controllers/user.controller";

const userRoutes = Router();
//Lay nguoi dung hien tai
userRoutes.get("/current", getCurrentUserController);

export default userRoutes;