import { v2 as cloudinary } from "cloudinary";

const api_key = process.env.CLOUDINARY_API_KEY;
const api_secret = process.env.CLOUDINARY_API_SECRET;
const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
const upload_preset = process.env.CLOUDINARY_UPLOAD_PRESET;

cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
});

export const validateCloudinaryConfig = () => {
  if (!api_key || !api_secret || !cloud_name || !upload_preset) {
    return {
      isValid: false,
      error: "Missing Cloudinary configuration",
    };
  }
  return { isValid: true };
};

export { api_key, api_secret, cloud_name, upload_preset };

export default cloudinary;
