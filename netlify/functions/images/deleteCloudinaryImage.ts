import cloudinary, { validateCloudinaryConfig } from "../../config/cloudinary";
import { logError } from "../lib/response";

export const deleteCloudinaryImage = async (publicId?: string) => {
  const logPrefix = "[deleteCloudinaryImage]";

  const configValidation = validateCloudinaryConfig();
  if (!configValidation.isValid) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: configValidation.error }),
    };
  }

  if (!publicId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing publicId parameter" }),
    };
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, { invalidate: true });
    if (result?.result === "not found") {
      console.warn(`${logPrefix} Image not found in Cloudinary: ${publicId}`);
    }
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error: any) {
    logError("Unexpected error in deleteCloudinaryImage handler", error, logPrefix);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
