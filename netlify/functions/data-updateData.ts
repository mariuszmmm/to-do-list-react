import type { Handler } from "@netlify/functions";
import UserData from "../models/UserData";
import { connectToDB } from "../config/mongoose";
import { publishAblyUpdate } from "../config/ably";
import {
  checkClientContext,
  checkEventBody,
  checkHttpMethod,
} from "../utils/validators";
import { jsonResponse, logError } from "../utils/response";
import { Data } from "../../src/types";
import { mapListsToResponse } from "../utils/mapListsToResponse";

const handler: Handler = async (event, context) => {
  const logPrefix = "[updateData]";

  const methodResponse = checkHttpMethod(event.httpMethod, "PUT", logPrefix);
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

    if (!Array.isArray(data.lists)) {
      console.warn(`${logPrefix} No lists provided or invalid lists structure`);
      return jsonResponse(400, {
        message: "No lists provided or invalid lists structure",
      });
    }

    for (const incomingList of data.lists) {
      const dbList = foundUser.lists.find((l) => l.id === incomingList.id);
      if (dbList && dbList.version !== incomingList.version) {
        console.warn(
          `${logPrefix} Version mismatch for list ID: ${incomingList.id}`
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
    }

    data.lists.forEach((incomingList) => {
      const idx = foundUser.lists.findIndex((l) => l.id === incomingList.id);
      if (idx !== -1) {
        const dbList = foundUser.lists[idx];
        const changed =
          dbList.name !== incomingList.name ||
          dbList.date !== incomingList.date ||
          JSON.stringify(dbList.taskList) !==
            JSON.stringify(incomingList.taskList);
        if (changed) {
          dbList.name = incomingList.name;
          dbList.date = incomingList.date;
          dbList.taskList = incomingList.taskList;
          dbList.version = (incomingList.version || 0) + 1;
        } else {
          console.log(
            `${logPrefix} No changes detected for list:`,
            incomingList.id
          );
        }
      } else {
        foundUser.lists.push({ ...incomingList, version: 0 });
      }
    });

    const sortedLists = data.lists.map((incomingList) => {
      const currentList = foundUser.lists.find((l) => l.id === incomingList.id);
      return currentList ? currentList : { ...incomingList, version: 0 };
    });
    foundUser.lists.splice(0, foundUser.lists.length);
    sortedLists.forEach((listItem) => foundUser.lists.push(listItem));

    const savedUser = await foundUser.save();
    if (!savedUser) {
      console.warn(`${logPrefix} Failed to save user data: ${email}`);
      return jsonResponse(500, { message: "Failed to save user data." });
    }

    const lists = mapListsToResponse(savedUser.lists);

    try {
      await publishAblyUpdate(email, {
        action: "update",
        timestamp: new Date().toISOString(),
        lists,
        deviceId: data.deviceId,
      });
    } catch (ablyError) {
      logError("Failed to publish Ably update", ablyError, logPrefix);
    }

    return jsonResponse(200, {
      message: "Data updated successfully",
      data: {
        lists,
        deviceId: data.deviceId,
      },
    });
  } catch (error) {
    logError("Unexpected error in updateData handler", error, logPrefix);
    return jsonResponse(500, { message: "Internal server error" });
  }
};

export { handler };
