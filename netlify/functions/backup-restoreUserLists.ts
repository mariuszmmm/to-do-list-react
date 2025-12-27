import { List } from "../../src/types/list";
import { nanoid } from "nanoid";
import type { Handler } from "@netlify/functions";
import UserData from "../models/UserData";
import { connectToDB } from "../config/mongoose";
import { publishAblyUpdate } from "../config/ably";
import {
  checkClientContext,
  checkEventBody,
  checkHttpMethod,
} from "../utils/validators";
import { BackupData, Task } from "../../src/types";
import { jsonResponse, logError } from "../utils/response";

const handler: Handler = async (event, context) => {
  const logPrefix = "[restoreUserLists]";

  const methodResponse = checkHttpMethod(event.httpMethod, "POST", logPrefix);
  if (methodResponse) return methodResponse;

  const bodyResponse = checkEventBody(event.body, logPrefix);
  if (bodyResponse) return bodyResponse;

  const authResponse = checkClientContext(context, logPrefix);
  if (authResponse) return authResponse;

  await connectToDB();

  try {
    const email = context.clientContext?.user.email as string;
    const body = event.body as string;
    let parsedBody: { backupData: BackupData };

    try {
      parsedBody = JSON.parse(body);
    } catch (parseError) {
      console.warn(`${logPrefix} Invalid JSON in request body`);
      return jsonResponse(400, { message: "Invalid JSON in request body" });
    }

    const { backupData } = parsedBody;

    if (!backupData) {
      console.warn(`${logPrefix} Missing backupData`);
      return jsonResponse(400, { message: "Missing backupData" });
    }

    const isAllUsersBackup =
      backupData.backupType === "all-users-backup" &&
      Array.isArray(backupData.users);
    const isUserListsBackup =
      backupData.backupType === "user-lists-backup" &&
      Array.isArray(backupData.lists);

    if (!isAllUsersBackup && !isUserListsBackup) {
      console.warn(`${logPrefix} Invalid backup format for restore`);
      return jsonResponse(400, {
        message: "Invalid backup format for restore",
      });
    }

    const foundUser = await UserData.findOne({
      email,
      account: "active",
    }).exec();
    if (!foundUser) {
      console.warn(`${logPrefix} User not found: ${email}`);
      return jsonResponse(404, { message: "User not found" });
    }

    let listsToRestore: List[];

    if (Array.isArray(backupData.lists)) {
      listsToRestore = backupData.lists;
    } else if (Array.isArray(backupData.users)) {
      const backupUser = backupData.users.find(
        (user: { email: string; lists: List[] }) => user.email === email
      );
      if (!backupUser || !Array.isArray(backupUser.lists)) {
        console.warn(`${logPrefix} User lists not found in backup`);
        return jsonResponse(400, {
          message: "Invalid backup format: user lists not found",
        });
      }
      listsToRestore = backupUser.lists;
    } else {
      console.warn(`${logPrefix} Invalid backup format`);
      return jsonResponse(400, {
        message: "Invalid backup format: missing lists",
      });
    }

    const currentDate = new Date().toISOString();
    const normalizedLists: List[] = listsToRestore.map(
      (list: List & { taskList: Task[] }) => ({
        id: list.id || nanoid(8),
        name: list.name || "Untitled List",
        date: list.date || currentDate,
        updatedAt: list.updatedAt || currentDate,
        version: list.version || 0,
        taskList: Array.isArray(list.taskList)
          ? list.taskList.map((task: any) => ({
              ...task,
              id: task.id || nanoid(8),
              content: task.content || "",
              done: typeof task.done === "boolean" ? task.done : false,
              date: task.date || currentDate,
              updatedAt: task.updatedAt || currentDate,
            }))
          : [],
      })
    );

    foundUser.lists = normalizedLists;
    await foundUser.save();

    await publishAblyUpdate(email, {
      action: "restore",
      timestamp: new Date().toISOString(),
      lists: normalizedLists,
    });

    return jsonResponse(200, {
      message: "User lists restored successfully",
      listsCount: normalizedLists.length,
    });
  } catch (error) {
    logError("Unexpected error", error, logPrefix);
    return jsonResponse(500, { message: "Internal server error" });
  }
};

export { handler };
