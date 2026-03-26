import { List } from "../../src/types/list";
import { nanoid } from "nanoid";
import type { Handler } from "@netlify/functions";
import UserData from "../models/UserData";
import NotificationModel from "../models/Notification";
import { connectToDB } from "../config/mongoose";
import { publishAblyUpdate } from "../config/ably";
import {
  checkClientContext,
  checkEventBody,
  checkHttpMethod,
} from "../shared/lib/validators";
import { BackupData, Task } from "../../src/types";
import { jsonResponse, logError } from "../shared/lib/response";
import SystemConfig from "../models/SystemConfig";
import { publishSystemLog } from "../shared/lib/ablyHelper";

const handler: Handler = async (event, context) => {
  const logPrefix = "[backup-restore-user]";

  const methodResponse = checkHttpMethod(event.httpMethod, "POST", logPrefix);
  if (methodResponse) return methodResponse;

  const bodyResponse = checkEventBody(event.body, logPrefix);
  if (bodyResponse) return bodyResponse;

  const authResponse = checkClientContext(context, logPrefix);
  if (authResponse) return authResponse;

  await connectToDB();

  const updateStatus = async (
    status: "success" | "error",
    details?: string,
  ) => {
    try {
      const timestamp = new Date().toISOString();
      const value = { status, details, timestamp };
      await SystemConfig.create({
        key: `log_restore_disk_${Date.now()}`,
        value,
        updatedAt: new Date(),
      });
      await publishSystemLog({
        key: "log_restore_disk",
        status,
        details,
        timestamp,
      });
    } catch (err) {
      console.error(`${logPrefix} Failed to update SystemConfig:`, err);
    }
  };

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
      backupData.backupType === "all-users" && Array.isArray(backupData.users);
    const isUserListsBackup =
      backupData.backupType === "user-lists" && Array.isArray(backupData.lists);

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
        (user: { email: string; lists: List[] }) => user.email === email,
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
        id: list.id || nanoid(),
        name: list.name || "Untitled List",
        date: list.date || currentDate,
        updatedAt: list.updatedAt || currentDate,
        version: list.version || 0,
        taskList: Array.isArray(list.taskList)
          ? list.taskList.map((task: any) => ({
              ...task,
              id: task.id || nanoid(),
              content: task.content || "",
              done: typeof task.done === "boolean" ? task.done : false,
              date: task.date || currentDate,
              updatedAt: task.updatedAt || currentDate,
            }))
          : [],
      }),
    );

    await UserData.findOneAndUpdate(
      { email, account: "active" },
      { $set: { lists: normalizedLists } },
      { returnDocument: "after" }
    );

    // Restore user-specific notifications if present
    const notificationsToRestore = Array.isArray(backupData.notifications)
      ? backupData.notifications.filter((n) => n.userEmail === email)
      : [];

    if (notificationsToRestore.length > 0) {
      for (const notif of notificationsToRestore) {
        try {
          await NotificationModel.findOneAndUpdate(
            {
              userEmail: email,
              send_after: notif.send_after,
              content: notif.content,
            },
            { ...notif, userEmail: email }, // Ensure it stays assigned to current user
            { upsert: true },
          );
        } catch (err) {
          console.error(
            `Failed to restore user notification for ${email}`,
            err,
          );
        }
      }
    }

    await updateStatus(
      "success",
      `User data (lists & notifications) restored for ${email}`,
    );

    await publishAblyUpdate(email, {
      action: "restore",
      timestamp: new Date().toISOString(),
      lists: normalizedLists,
    });

    return jsonResponse(200, {
      message: "User lists and notifications restored successfully",
      listsCount: normalizedLists.length,
      notificationsCount: notificationsToRestore.length,
    });
  } catch (error) {
    logError("Unexpected error", error, logPrefix);
    await updateStatus(
      "error",
      "Restore failed: " +
        (error instanceof Error ? error.message : "Internal error"),
    );
    return jsonResponse(500, { message: "Internal server error" });
  }
};

export { handler };
