import { getBackupFileName } from "../shared/lib/getBackupFileName";
import type { Handler } from "@netlify/functions";
import { connectToDB } from "../config/mongoose";
import UserData from "../models/UserData";
import NotificationModel from "../models/Notification";
import { checkClientContext, checkHttpMethod } from "../shared/lib/validators";
import { jsonResponse, logError } from "../shared/lib/response";
import { BackupData, BackupType } from "../../src/types";
import SystemConfig from "../models/SystemConfig";
import { publishSystemLog } from "../shared/lib/ablyHelper";

const handler: Handler = async (event, context) => {
  const logPrefix = "[backup-download-user]";

  const methodResponse = checkHttpMethod(event.httpMethod, "GET", logPrefix);
  if (methodResponse) return methodResponse;

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
        key: `log_backup_disk_user_${Date.now()}`,
        value,
        updatedAt: new Date(),
      });
      await publishSystemLog({
        key: "log_backup_disk_user",
        status,
        details,
        timestamp,
      });
    } catch (err) {
      console.error(`${logPrefix} Failed to update SystemConfig:`, err);
    }
  };

  try {
    const email = context.clientContext!.user.email as string;

    const foundUser = await UserData.findOne({
      email,
      account: "active",
    }).exec();
    if (!foundUser) {
      console.warn(`${logPrefix} User not found: ${email}`);
      return jsonResponse(404, { message: "User not found" });
    }

    const lists = foundUser.lists || [];
    const notifications = await NotificationModel.find({
      userEmail: email,
    }).exec();

    let totalTasks = 0;
    lists.forEach((list) => {
      if (Array.isArray(list.taskList)) {
        totalTasks += list.taskList.length;
      }
    });

    const now = new Date();
    const backupType: BackupType = "user-lists";
    const fileName = getBackupFileName("user-lists", now);

    const backupData: BackupData = {
      version: "1.1",
      timestamp: now.toISOString(),
      createdBy: email,
      user: email,
      fileName,
      backupType,
      lists,
      notifications: notifications.map((notif) =>
        typeof notif.toObject === "function" ? notif.toObject() : notif,
      ),
      totalLists: lists.length,
      totalTasks,
    };

    await updateStatus("success", `User backup downloaded by ${email}`);

    return jsonResponse(
      200,
      { backupData, message: "Download successful" },
      {
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    );
  } catch (error) {
    logError("Unexpected error in downloadUserLists handler", error, logPrefix);
    await updateStatus("error", "Download failed: Internal server error");
    return jsonResponse(500, { message: "Internal server error" });
  }
};

export { handler };
