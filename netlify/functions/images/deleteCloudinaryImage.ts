import { HandlerContext } from "@netlify/functions";
import cloudinary, { validateCloudinaryConfig } from "../../config/cloudinary";
import { connectToDB } from "../../config/mongoose";
import { logError, jsonResponse } from "../lib/response";
import UserData from "../../models/UserData";
import { publishAblyUpdate } from "../../config/ably";
import updateTaskImageInUserData from "../lib/updateTaskImageInUserData";

interface DeleteImageParams {
  publicId: string;
  folder: string;
  userEmail: string;
  listId?: string;
  listName?: string;
  taskId?: string;
  deviceId: string;
}

export const deleteCloudinaryImage = async (
  { publicId, userEmail, listId, taskId, deviceId }: DeleteImageParams,
  context: HandlerContext,
  logPrefix: string,
) => {
  await connectToDB();

  const configValidation = validateCloudinaryConfig();
  if (!configValidation.isValid) {
    return jsonResponse(500, { error: configValidation.error });
  }

  if (!publicId) {
    return jsonResponse(400, { error: "Missing publicId parameter" });
  }

  try {
    const email = context.clientContext?.user.email as string;
    const user = await UserData.findOne({ email, account: "active" }).exec();
    if (!user) {
      return jsonResponse(404, { error: "User not found" });
    }

    const result = await cloudinary.uploader.destroy(publicId, { invalidate: true });
    if (result?.result === "not found") {
      console.warn(`${logPrefix} Image not found in Cloudinary: ${publicId}`);
    }

    const success = await updateTaskImageInUserData({
      userEmail,
      listId,
      taskId,
      image: null,
    });

    if (!success) {
      throw new Error("Failed to update task image in user data");
    }

    const updatedUser = await UserData.findOne({ email, account: "active" }).exec();
    const now = new Date().toISOString();
    await publishAblyUpdate(email, {
      action: "addOrUpdate",
      timestamp: now,
      lists: updatedUser?.lists,
      deviceId,
    });

    return jsonResponse(200, {
      success: true,
      message: "Image deleted successfully",
      result,
    });
  } catch (error: any) {
    logError("Error deleting image from Cloudinary:", error, logPrefix);
    return jsonResponse(500, {
      success: false,
      error: "Internal Server Error",
      details: error.message,
    });
  }
};
