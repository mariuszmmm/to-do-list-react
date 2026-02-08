import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const moveCloudinaryImageToFolder = async (imageId?: string, folder?: string) => {
  const logPrefix = "[moveCloudinaryImageToFolder]";

  if (!imageId || !folder) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing imageId or folder parameters" }),
    };
  }

  if (!process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing Cloudinary configuration" }),
    };
  }

  try {
    const result = await cloudinary.api.update(imageId, {
      asset_folder: `Todo-list/${folder}`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Image moved successfully",
        result,
      }),
    };
  } catch (error: any) {
    console.error(`${logPrefix} Error moving image:`, error.message || error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to move image",
        details: error.message,
      }),
    };
  }
};
