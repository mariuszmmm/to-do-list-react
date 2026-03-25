import type { Handler } from "@netlify/functions";
import { connectToDB } from "../config/mongoose";
import { restoreAllUsersFromBackupData } from "../shared/lib/restoreAllUsersFromBackupData";
import {
  checkAdminRole,
  checkClientContext,
  checkEventBody,
  checkHttpMethod,
} from "../shared/lib/validators";
import { BackupData } from "../../src/types";
import { jsonResponse, logError } from "../shared/lib/response";
import SystemConfig from "../models/SystemConfig";
import { publishSystemLog } from "../shared/lib/ablyHelper";

const handler: Handler = async (event, context) => {
  const logPrefix = '[backup-restore-all]';

  const methodResponse = checkHttpMethod(event.httpMethod, "POST", logPrefix);
  if (methodResponse) return methodResponse;

  const bodyResponse = checkEventBody(event.body, logPrefix);
  if (bodyResponse) return bodyResponse;

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

    if (!Array.isArray(backupData.users)) {
      console.warn(`${logPrefix} Invalid backupData structure`);
      return jsonResponse(400, { message: "Invalid backup data structure" });
    }

    const { restored, failed } =
      await restoreAllUsersFromBackupData(backupData);

    const msg = `Restored ${restored} users, ${failed} failed`;
    await updateStatus("success", msg);

    return jsonResponse(200, {
      message: msg,
      restored,
      failed,
    });
  } catch (error) {
    logError("Error restoring users", error, logPrefix);
    await updateStatus(
      "error",
      "Restoration failed: " +
        (error instanceof Error ? error.message : "Internal error"),
    );
    return jsonResponse(500, { message: "Internal server error" });
  }
};

export { handler };
