import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import { getCurrentUserService, updateUserProfileService } from "../services/user.service";

export const getCurrentUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const { user } = await getCurrentUserService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "User fetch successfully",
      user,
    });
  }
);

export const updateUserProfileController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { name } = req.body;
    const profilePicture = req.file;

    const { user } = await updateUserProfileService(userId, {
      name,
      profilePicture,
    });

    return res.status(HTTPSTATUS.OK).json({
      message: "Profile updated successfully",
      user,
    });
  }
);

