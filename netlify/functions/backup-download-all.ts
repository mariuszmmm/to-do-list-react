import type { Handler } from "@netlify/functions";
import { connectToDB } from "../config/mongoose";
import { getAllUsersForBackup } from "../shared/lib/getAllUsersForBackup";
import {
  checkClientContext,
  checkHttpMethod,
  checkAdminRole,
} from "../shared/lib/validators";
import { jsonResponse, logError } from "../shared/lib/response";
import SystemConfig from "../models/SystemConfig";
import { publishSystemLog } from "../shared/lib/ablyHelper";

const handler: Handler = async (event, context) => {
  const logPrefix = '[backup-download-all]';

  const methodResponse = checkHttpMethod(event.httpMethod, "GET", logPrefix);
  if (methodResponse) return methodResponse;

  const authResponse = checkClientContext(context, logPrefix);
  if (authResponse) return authResponse;

  const adminResponse = checkAdminRole(context, logPrefix);
  if (adminResponse) return adminResponse;

  await connectToDB();

  const updateStatus = async (
    status: "success" | "error",
    details?: string,
  ) => {
    try {
      const timestamp = new Date().toISOString();
      const value = { status, details, timestamp };
      await SystemConfig.create({
        key: `log_backup_disk_all_${Date.now()}`,
        value,
        updatedAt: new Date(),
      });
      await publishSystemLog({
        key: "log_backup_disk_all",
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

    try {
      const { backupData, fileName } = await getAllUsersForBackup(email);
      await updateStatus("success", `Full backup downloaded by ${email}`);
      return jsonResponse(
        200,
        { backupData, message: "Download successful" },
        {
          "Content-Disposition": `attachment; filename="${fileName}"`,
        },
      );
    } catch (err) {
      if (err instanceof Error && err.message === "No user data found") {
        console.warn(`${logPrefix} No user data found`);
        await updateStatus("error", "Download failed: No user data found");
        return jsonResponse(404, { message: "No user data found" });
      }
      throw err;
    }
  } catch (error) {
    logError("Unexpected error in downloadAllUsers handler", error, logPrefix);
    await updateStatus("error", "Download failed: Internal server error");
    return jsonResponse(500, { message: "Internal server error" });
  }
};

export { handler };
