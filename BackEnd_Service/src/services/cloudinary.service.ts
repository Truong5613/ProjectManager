import cloudinary from '../config/cloudinary.config';
import { BadRequestException } from '../utils/appError';
import fs from 'fs';

export const uploadImageToCloudinary = async (file: Express.Multer.File) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'profile_pictures',
      resource_type: 'auto',
    });

    // Delete the temporary file after upload
    fs.unlinkSync(file.path);

    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    // Delete the temporary file if upload fails
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    throw new BadRequestException('Error uploading image to Cloudinary');
  }
};

export const deleteImageFromCloudinary = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new BadRequestException('Error deleting image from Cloudinary');
  }
}; 