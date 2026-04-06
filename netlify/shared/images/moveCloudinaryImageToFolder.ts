import cloudinary, { validateCloudinaryConfig } from "../../config/cloudinary";
import UserData from "../../models/UserData";
import { connectToDB } from "../../config/mongoose";
import { Image } from "../../../src/types";
import { publishAblyUpdate } from "../../config/ably";
import { HandlerContext } from "@netlify/functions";
import { jsonResponse, logError } from "../lib/response";
import updateTaskImageInUserData from "../lib/updateTaskImageInUserData";

interface MoveImageParams {
  publicId: string;
  folder: string;
  oldPublicId: string;
  userEmail: string;
  listId: string;
  listName: string;
  taskId: string;
  deviceId: string;
}

export const moveCloudinaryImageToFolder = async (
  {
    publicId,
    oldPublicId,
    folder,
    userEmail,
    listId,
    listName,
    taskId,
    deviceId,
  }: MoveImageParams,
  context: HandlerContext,
  logPrefix: string,
) => {
  await connectToDB();

  const configValidation = validateCloudinaryConfig();
  if (!configValidation.isValid) {
    return jsonResponse(500, { error: configValidation.error });
  }

  if (!publicId || !folder) {
    return jsonResponse(400, {
      error: "Missing publicId or folder parameters",
    });
  }

  try {
    const email = context.clientContext?.user.email as string;
    const user = await UserData.findOne({ email, account: "active" }).exec();
    if (!user) {
      return jsonResponse(404, { error: "User not found" });
    }

    const contextParts = [
      userEmail && `userEmail=${userEmail}`,
      listId && `listId=${listId}`,
      listName && `listName=${listName}`,
      taskId && `taskId=${taskId}`,
    ].filter(Boolean);

    const tags = ["app-todolist-image", "active"];
    const result = await cloudinary.api.update(publicId, {
      asset_folder: `Todo-list/${folder}`,
      tags,
      context: contextParts.join("|"),
    });

    if (oldPublicId) {
      try {
        await cloudinary.api.delete_resources([oldPublicId]);
      } catch (deleteError: any) {
        console.warn(
          `${logPrefix} Failed to delete old image:`,
          oldPublicId,
          deleteError.message || deleteError,
        );
      }
    }

    const image: Image = {
      imageUrl: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      createdAt: result.created_at,
      displayName: result.display_name,
      originalFilename: result.original_filename,
    };

    const success = await updateTaskImageInUserData({
      userEmail,
      listId,
      taskId,
      image,
    });

    if (!success) {
      throw new Error("Failed to update task image in user data");
    }

    const updatedUser = await UserData.findOne({
      email,
      account: "active",
    }).exec();
    const now = new Date().toISOString();
    await publishAblyUpdate(email, {
      action: "addOrUpdate",
      timestamp: now,
      lists: updatedUser?.lists,
      deviceId,
    });

    return jsonResponse(200, {
      success: true,
      message: "Image moved successfully",
      result: image,
    });
  } catch (error: any) {
    logError("Error moving image in Cloudinary:", error, logPrefix);
    return jsonResponse(500, {
      success: false,
      error: "Failed to move image",
      details: error.message,
    });
  }
};
