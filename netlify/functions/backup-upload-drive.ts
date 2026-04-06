import SystemConfig from "../models/SystemConfig";
import type { Handler } from "@netlify/functions";
import { connectToDB } from "../config/mongoose";
import { getAllUsersForBackup } from "../shared/lib/getAllUsersForBackup";
import { uploadBackupToGoogleDrive } from "../shared/lib/uploadBackupToGoogleDrive";
import { getGoogleAccessToken } from "../shared/lib/googleDriveHelper";
import {
  checkAdminRole,
  checkClientContext,
  checkEventBody,
  checkHttpMethod,
  parseJsonBody,
} from "../shared/lib/validators";
import { jsonResponse, logError } from "../shared/lib/response";
import { publishSystemLog } from "../shared/lib/ablyHelper";

const handler: Handler = async (event, context) => {
  const logPrefix = '[backup-upload-drive]';

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

      // Add a unique log entry for the history list
      await SystemConfig.create({
        key: `log_manualbackup_${Date.now()}`,
        value,
        updatedAt: new Date(),
      });

      // Notify admins in real-time
      await publishSystemLog({
        key: "log_manualbackup",
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
    const parsedBody = parseJsonBody<{ accessToken?: string }>(
      event.body,
      logPrefix,
    );

    if ("statusCode" in parsedBody) {
      return parsedBody;
    }

    let { accessToken } = parsedBody;

    // Use system refresh token if no access token provided by frontend
    if (!accessToken) {
      const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID?.replace(/"/g, "");
      const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET?.replace(
        /"/g,
        "",
      );
      const refreshToken =
        process.env.GOOGLE_BACKUP_REFRESH_TOKEN?.replace(/"/g, "") || "";

      if (clientId && clientSecret) {
        accessToken =
          (await getGoogleAccessToken(clientId, clientSecret, refreshToken)) ||
          undefined;
      }

      if (!accessToken) {
        console.warn(
          `${logPrefix} Missing Google environment variables or DB token. (ID: ${!!clientId}, Secret: ${!!clientSecret}, Token: ${!!refreshToken})`,
        );
      }
    }

    const { backupData, fileName } = await getAllUsersForBackup(email);

    if (!accessToken) {
      const authMsg = "Google Drive authentication failed";
      console.warn(`${logPrefix} ${authMsg}`);
      await updateStatus("error", authMsg);
      return jsonResponse(401, { message: authMsg, source: "google-drive" });
    }

    if (!backupData || !fileName) {
      console.warn(`${logPrefix} Missing required data for upload`);
      const msg = "Missing required data for upload";
      await updateStatus("error", msg);
      return jsonResponse(400, { message: msg });
    }

    const fileNameWithPrefix = `Backup_${fileName}`;
    const fileContent = JSON.stringify(backupData);

    try {
      const uploadResponse = await uploadBackupToGoogleDrive(
        fileNameWithPrefix,
        fileContent,
        accessToken,
        "Manual-Backup",
      );

      if (!uploadResponse.success) {
        if (uploadResponse.statusCode === 401) {
          const authMsg = "Google Drive authentication failed";
          console.warn(`${logPrefix} ${authMsg}: ${uploadResponse.message}`);
          await updateStatus("error", authMsg);
          return jsonResponse(401, {
            message: authMsg,
            source: "google-drive",
          });
        }
        throw new Error(uploadResponse.message);
      }

      await updateStatus(
        "success",
        `Manual backup completed successfully:\n ${fileNameWithPrefix}`,
      );

      return jsonResponse(200, {
        message: "Backup uploaded to Google Drive successfully",
      });
    } catch (driveError) {
      const driveMsg = "Failed to upload to Google Drive";
      console.warn(
        `${logPrefix} ${driveMsg}: ${
          driveError instanceof Error ? driveError.message : "Unknown error"
        }`,
      );
      await updateStatus("error", driveMsg);
      return jsonResponse(500, {
        message: driveMsg,
      });
    }
  } catch (error) {
    logError(
      "Unexpected error in uploadAllUsersToGoogleDrive handler",
      error,
      logPrefix,
    );
    await updateStatus(
      "error",
      "Unexpected error: " +
        (error instanceof Error ? error.message : "Unknown"),
    );
    return jsonResponse(500, {
      message: "Internal server error",
    });
  }
};

export { handler };
