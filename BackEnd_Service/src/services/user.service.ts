import UserModel from "../models/user.model";
import { BadRequestException } from "../utils/appError";
import { uploadImageToCloudinary, deleteImageFromCloudinary } from "./cloudinary.service";

export const getCurrentUserService = async (userId: string) => {
  const user = await UserModel.findOne({
    _id: userId,
    isDeleted: { $ne: true } // Explicitly filter out deleted users
  })
    .populate("currentWorkspace")
    .select("-password");

  if (!user) {
    throw new BadRequestException("User not found");
  }

  return {
    user,
  };
};

export const updateUserProfileService = async (
  userId: string,
  data: {
    name?: string;
    profilePicture?: Express.Multer.File;
  }
) => {
  const user = await UserModel.findOne({
    _id: userId,
    isDeleted: { $ne: true } // Explicitly filter out deleted users
  });
  
  if (!user) {
    throw new BadRequestException("User not found");
  }

  if (data.name) {
    user.name = data.name;
  }

  if (data.profilePicture) {
    // Delete old image if exists
    if (user.profilePicturePublicId) {
      await deleteImageFromCloudinary(user.profilePicturePublicId);
    }

    // Upload new image
    const { url, publicId } = await uploadImageToCloudinary(data.profilePicture);
    user.profilePicture = url;
    user.profilePicturePublicId = publicId;
  }

  await user.save();

  return {
    user: user.omitPassword(),
  };
};

export const softDeleteUserService = async (userId: string) => {
  const user = await UserModel.findById(userId);
  
  if (!user) {
    throw new BadRequestException("User not found");
  }

  // Set isDeleted flag to true
  user.isDeleted = true;
  await user.save();

  return {
    message: "User deleted successfully",
  };
};

