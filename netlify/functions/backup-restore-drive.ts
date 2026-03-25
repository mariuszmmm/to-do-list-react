import { downloadFileFromGoogleDrive } from "../shared/lib/downloadFileFromGoogleDrive";
import type { Handler, HandlerResponse } from "@netlify/functions";
import { connectToDB } from "../config/mongoose";
import { restoreAllUsersFromBackupData } from "../shared/lib/restoreAllUsersFromBackupData";
import { jsonResponse, logError } from "../shared/lib/response";
import { getGoogleAccessToken } from "../shared/lib/googleDriveHelper";
import {
  checkClientContext,
  checkEventBody,
  checkAdminRole,
  checkHttpMethod,
  parseBackupRequest,
  validateBackupType,
  validateBackupUsers,
} from "../shared/lib/validators";
import { findActiveUser } from "../shared/lib/database";
import { BackupData } from "../../src/types";
import SystemConfig from "../models/SystemConfig";
import { publishSystemLog } from "../shared/lib/ablyHelper";

const handler: Handler = async (event, context): Promise<HandlerResponse> => {
  const logPrefix = '[backup-restore-drive]';

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
        key: `log_restore_gd_${Date.now()}`,
        value,
        updatedAt: new Date(),
      });
      await publishSystemLog({
        key: "log_restore_gd",
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

    const requestData = parseBackupRequest(body, logPrefix);

    if ("statusCode" in requestData) {
      return requestData;
    }

    let { fileId, accessToken }: { fileId?: string; accessToken?: string } =
      requestData;

    // Use system refresh token if no access token provided by frontend
    if (!accessToken) {
      const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
      const refreshToken = process.env.GOOGLE_BACKUP_REFRESH_TOKEN || "";

      if (clientId && clientSecret) {
        accessToken =
          (await getGoogleAccessToken(clientId, clientSecret, refreshToken)) ||
          undefined;
      }
    }

    if (!accessToken) {
      const authMsg = "Google Drive authentication failed";
      console.warn(`${logPrefix} ${authMsg}`);
      return jsonResponse(401, { message: authMsg, source: "google-drive" });
    }

    if (!fileId) {
      console.warn(`${logPrefix} Missing fileId`);
      return jsonResponse(400, { message: "Missing fileId" });
    }

    const userData = await findActiveUser(email, logPrefix);
    if ("statusCode" in userData) {
      return userData;
    }

    try {
      let backupResult: BackupData;
      try {
        backupResult = await downloadFileFromGoogleDrive(fileId, accessToken);
      } catch (err: any) {
        if (err && err.status === 401) {
          console.warn(
            `${logPrefix} Google Drive authentication failed: ${err.message}`,
          );
          return jsonResponse(401, {
            message: "Google Drive authentication failed.",
            source: "google-drive",
          });
        }
        throw err;
      }

      const backupData = backupResult;
      const typeResponse = validateBackupType(
        backupData.backupType,
        "all-users",
        logPrefix,
      );
      if (typeResponse) {
        return typeResponse;
      }

      const usersResponse = validateBackupUsers(backupData.users, logPrefix);
      if (usersResponse) {
        return usersResponse;
      }

      const { restored, failed } =
        await restoreAllUsersFromBackupData(backupData);

      const msg = `Restored ${restored} users, ${failed} failed from Google Drive`;
      await updateStatus("success", msg);

      return jsonResponse(200, {
        message: msg,
        restored,
        failed,
      });
    } catch (processError) {
      logError("Backup process error", processError, logPrefix);
      await updateStatus(
        "error",
        "Restore from GD failed: " +
          (processError instanceof Error
            ? processError.message
            : "Internal error"),
      );
      return jsonResponse(500, {
        message: "Failed to restore from Google Drive",
      });
    }
  } catch (error) {
    logError("Unexpected error", error, logPrefix);
    return jsonResponse(500, { message: "Internal server error" });
  }
};

export { handler };
