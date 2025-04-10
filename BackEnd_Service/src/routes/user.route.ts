import { Router } from "express";
import { getCurrentUserController, updateUserProfileController } from "../controllers/user.controller";
import { passportAuthenticateJwt } from "../config/passport.config";
import { upload } from "../middlewares/upload.middleware";

const userRoutes = Router();

//Lay nguoi dung hien tai
userRoutes.get("/current", getCurrentUserController);

//Update profile picture and name
userRoutes.patch(
  "/update-profile",
  passportAuthenticateJwt,
  upload.single('profilePicture'),
  updateUserProfileController
);

export default userRoutes;