import type { Handler } from "@netlify/functions";
import UserData from "../models/UserData";
import { publishAblyUpdate } from "../config/ably";
import { connectToDB } from "../config/mongoose";
import {
  checkClientContext,
  checkEventBody,
  checkHttpMethod,
} from "../utils/validators";
import { jsonResponse, logError } from "../utils/response";
import { Data } from "../../src/types";
import { mapListsToResponse } from "../utils/mapListsToResponse";

const handler: Handler = async (event, context) => {
  const logPrefix = "[removeData]";

  const methodResponse = checkHttpMethod(event.httpMethod, "DELETE", logPrefix);
  if (methodResponse) return methodResponse;

  const bodyResponse = checkEventBody(event.body, logPrefix);
  if (bodyResponse) return bodyResponse;

  const authResponse = checkClientContext(context, logPrefix);
  if (authResponse) return authResponse;

  await connectToDB();

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

    const listIndex = foundUser.lists.findIndex(
      (list) => list.id === data.listId
    );

    if (listIndex !== -1) {
      if (foundUser.lists[listIndex].version !== data.version) {
        console.warn(
          `${logPrefix} Version mismatch for list ID: ${data.listId}`
        );
        return jsonResponse(409, {
          message: "Conflict detected: Version mismatch.",
          data: {
            email: foundUser.email,
            lists: foundUser.lists,
            conflict: true,
          },
        });
      }

      foundUser.lists.splice(listIndex, 1);
      const savedUser = await foundUser.save();
      if (!savedUser) {
        console.warn(`${logPrefix} Failed to save user data: ${email}`);
        return jsonResponse(500, { message: "Failed to save user data." });
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
        console.warn(
          `${logPrefix} Failed to publish Ably update for user: ${email}`
        );
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

export { handler };
