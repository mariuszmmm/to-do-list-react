import { HandlerContext, HandlerEvent } from "@netlify/functions";
import UserData from "../../models/UserData";
import { mapListsToResponse } from "../lib/mapListsToResponse";
import { jsonResponse, logError } from "../lib/response";
import { Data } from "../../../src/types";
import { publishAblyUpdate } from "../../config/ably";
import { deleteCloudinaryImagesByListId } from "../lib/cloudinaryHelper";

export const removeData = async (event: HandlerEvent, context: HandlerContext, logPrefix: string) => {
  try {
    const email = context.clientContext?.user.email as string;
    const body = event.body as string;

    const foundUser = await UserData.findOne({
      email,
      account: "active",
    }).exec();
    if (!foundUser) {
      console.warn(`${logPrefix} User not found`);
      return jsonResponse(404, { message: "User not found" });
    }

    let data: Data;
    try {
      data = JSON.parse(body) as Data;
    } catch (parseError) {
      console.warn(`${logPrefix} Invalid JSON in request body`);
      return jsonResponse(400, {
        message: "Invalid JSON in request body",
      });
    }

    if (!data.listId) {
      console.warn(`${logPrefix} No list ID provided`);
      return jsonResponse(400, { message: "No list ID provided" });
    }

    const listIndex = foundUser.lists.findIndex((list) => list.id === data.listId);

    if (listIndex !== -1) {
      if (foundUser.lists[listIndex].version !== data.version) {
        console.warn(`${logPrefix} Version mismatch for list ID: ${data.listId}`);
        return jsonResponse(409, {
          message: "Conflict detected: Version mismatch.",
          data: {
            email: foundUser.email,
            lists: foundUser.lists,
            conflict: true,
          },
        });
      }

      const listToDelete = foundUser.lists[listIndex];
      foundUser.lists.splice(listIndex, 1);
      const savedUser = await foundUser.save();
      if (!savedUser) {
        console.warn(`${logPrefix} Failed to save user data: ${email}`);
        return jsonResponse(500, { message: "Failed to save user data." });
      }

      try {
        await deleteCloudinaryImagesByListId(listToDelete.id, logPrefix);
        console.log(`${logPrefix} Successfully deleted images from Cloudinary for list ID: ${data.listId}`);
      } catch (cloudinaryError: any) {
        console.warn(`${logPrefix} Cloudinary deletion failed (non-blocking):`, cloudinaryError);
      }

      const lists = mapListsToResponse(savedUser.lists);

      try {
        await publishAblyUpdate(email, {
          action: "remove",
          timestamp: new Date().toISOString(),
          lists,
          deviceId: data.deviceId,
        });
      } catch (ablyError) {
        console.warn(`${logPrefix} Failed to publish Ably update for user: ${email}`);
      }

      return jsonResponse(200, {
        message: "Data updated successfully",
        data: {
          lists,
          deviceId: data.deviceId,
        },
      });
    } else {
      console.warn(`${logPrefix} List not found: ${data.listId}`);
      return jsonResponse(404, { message: "List not found" });
    }
  } catch (error) {
    logError("Failed to remove data", error, logPrefix);
    return jsonResponse(500, { message: "Internal server error" });
  }
};
