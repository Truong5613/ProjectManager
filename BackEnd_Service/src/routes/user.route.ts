import { Router } from "express";
import { getCurrentUserController, updateUserProfileController } from "../controllers/user.controller";

const userRoutes = Router();
//Lay nguoi dung hien tai
userRoutes.get("/current", getCurrentUserController);

// Update user profile
userRoutes.put("/profile", updateUserProfileController);

export default userRoutes;