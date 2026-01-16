import { getBackupFileName } from "./../functions/lib/getBackupFileName";
import type { Handler } from "@netlify/functions";
import { connectToDB } from "../config/mongoose";
import UserData from "../models/UserData";
import {
  checkClientContext,
  checkHttpMethod,
} from "../functions/lib/validators";
import { jsonResponse, logError } from "../functions/lib/response";
import { BackupData } from "../../src/types";

const handler: Handler = async (event, context) => {
  const logPrefix = "[downloadUserLists]";

  const methodResponse = checkHttpMethod(event.httpMethod, "GET", logPrefix);
  if (methodResponse) return methodResponse;

  const authResponse = checkClientContext(context, logPrefix);
  if (authResponse) return authResponse;

  await connectToDB();

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

    let totalTasks = 0;
    lists.forEach((list) => {
      if (Array.isArray(list.taskList)) {
        totalTasks += list.taskList.length;
      }
    });

    const now = new Date();
    const fileName = getBackupFileName("user-lists-backup", now);

    const backupData: BackupData = {
      version: "1.0",
      timestamp: now.toISOString(),
      createdBy: email,
      user: email,
      fileName,
      backupType: "user-lists-backup",
      lists,
      totalLists: lists.length,
      totalTasks,
    };

    return jsonResponse(
      200,
      { backupData, message: "Download successful" },
      {
        "Content-Disposition": `attachment; filename="${fileName}"`,
      }
    );
  } catch (error) {
    logError("Unexpected error in downloadUserLists handler", error, logPrefix);
    return jsonResponse(500, { message: "Internal server error" });
  }
};

export { handler };
