import type { Handler } from "@netlify/functions";
import UserData, { UserDoc } from "../../models/UserData";
import { Data, Task } from "../../../src/types";
import { connectToDB } from "../../config/mongoose";
import { publishAblyUpdate } from "../../config/ably";
import { jsonResponse, logError } from "../lib/response";
import { mapListsToResponse } from "../lib/mapListsToResponse";
import {
  checkClientContext,
  checkEventBody,
  checkHttpMethod,
} from "../lib/validators";

const handler: Handler = async (event, context) => {
  const logPrefix = "[addData]";

  const methodResponse = checkHttpMethod(event.httpMethod, "PATCH", logPrefix);
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

    if (!data.list || typeof data.list !== "object") {
      console.warn(`${logPrefix} No valid list provided in request body`);
      return jsonResponse(400, {
        message: "No list provided or invalid list structure",
      });
    }
    if (
      !data.list.id ||
      !data.list.taskList ||
      !Array.isArray(data.list.taskList)
    ) {
      console.warn(`${logPrefix} List missing required fields`);
      return jsonResponse(400, {
        message: "List missing required fields (id, taskList)",
      });
    }

    const now = new Date().toISOString();
    const listIndex = foundUser.lists.findIndex(
      (list) => list.id === data.list?.id
    );

    let deletedTasksIds: string[] = [];
    if (listIndex !== -1) {
      const incomingList = data.list;
      const existingList = foundUser.lists[listIndex];
      // console.log("___________________________");
      // console.log(
      //   "test",
      //   data.list.taskList,
      //   incomingList.version,
      //   existingList.version,
      //   incomingList.version === existingList.version
      // );
      // console.log("___________________________");
      if (incomingList.version !== existingList.version) {
        console.warn(`${logPrefix} Version mismatch detected for list`);
        return jsonResponse(409, {
          message: "Conflict detected: Version mismatch.",
          data: {
            lists: foundUser.lists,
            conflict: true,
          },
        });
      }

      deletedTasksIds = incomingList.taskList
        .filter((task: Task) => task.status === "deleted")
        .map((task: Task) => task.id);

      console.log("deletedTasksIds", deletedTasksIds);

      const deletedTasks: Task[] = incomingList.taskList
        .filter((task) => task.status === "deleted")
        .map((task) => ({
          id: task.id,
          content: task.content,
          done: task.done,
          date: task.date,
          updatedAt: task.updatedAt,
          deletedAt: now,
        }));

      existingList.date = incomingList.date;
      existingList.name = incomingList.name;
      existingList.updatedAt = incomingList.updatedAt;
      existingList.taskList = incomingList.taskList.filter(
        (task: Task) => !deletedTasksIds.includes(task.id)
      );
      existingList.version = (existingList.version || 0) + 1;
      existingList.deletedTasks = [
        ...(existingList.deletedTasks || []),
        ...deletedTasks,
      ];
    } else {
      const newList = {
        ...data.list,
        version: 0,
      };
      foundUser.lists.push(newList);
    }

    let savedUser: UserDoc | null = null;
    try {
      savedUser = await foundUser.save();
    } catch (dbError) {
      const err = dbError as Error;
      if ((err as any).name === "VersionError") {
        console.warn(`${logPrefix} Version mismatch during save`);
        return jsonResponse(409, {
          message: "Conflict detected: Version mismatch during save.",
          data: {
            lists: foundUser.lists,
            conflict: true,
          },
        });
      }
      logError(`Database save error`, dbError, logPrefix);
      return jsonResponse(500, {
        message: "Database error during save",
      });
    }
    if (!savedUser) {
      console.warn(`${logPrefix} Save operation failed`);
      return jsonResponse(500, { message: "Failed to save data." });
    }
    console.log(`${logPrefix} Data updated successfully`);

    const lists = mapListsToResponse(savedUser.lists);
    const deviceId = data.deviceId;

    try {
      await publishAblyUpdate(email, {
        action: "addOrUpdate",
        timestamp: now,
        lists,
        deviceId,
        ...(deletedTasksIds.length ? { deletedTasksIds } : {}),
      });
      console.log(`${logPrefix} Ably notification sent successfully`);
    } catch (ablyError) {
      logError(`${logPrefix} Ably publish error`, ablyError, logPrefix);
    }

    return jsonResponse(200, {
      message: "Data updated successfully",
      data: {
        lists,
        deviceId,
        ...(deletedTasksIds.length ? { deletedTasksIds } : {}),
      },
    });
  } catch (error) {
    logError("Unexpected error in addData handler", error, logPrefix);
    return jsonResponse(500, {
      message: "Internal server error",
    });
  }
};

export { handler };
