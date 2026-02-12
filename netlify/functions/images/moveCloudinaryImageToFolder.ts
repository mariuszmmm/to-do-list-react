import cloudinary, { validateCloudinaryConfig } from "../../config/cloudinary";

interface MoveImageParams {
  publicId: string;
  folder: string;
  oldPublicId?: string;
  userEmail?: string;
  listId?: string;
  listName?: string;
  taskId?: string;
}

export const moveCloudinaryImageToFolder = async ({
  publicId,
  oldPublicId,
  folder,
  userEmail,
  listId,
  listName,
  taskId,
}: MoveImageParams) => {
  const logPrefix = "[moveCloudinaryImageToFolder]";

  const configValidation = validateCloudinaryConfig();
  if (!configValidation.isValid) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: configValidation.error }),
    };
  }

  if (!publicId || !folder) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing publicId or folder parameters" }),
    };
  }

  try {
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
        console.warn(`${logPrefix} Failed to delete old image:`, oldPublicId, deleteError.message || deleteError);
      }
    }

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
