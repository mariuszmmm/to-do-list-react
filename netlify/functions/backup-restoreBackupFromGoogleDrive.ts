import { downloadFileFromGoogleDrive } from "../utils/downloadFileFromGoogleDrive";
import type { Handler, HandlerResponse } from "@netlify/functions";
import { connectToDB } from "../config/mongoose";
import { restoreAllUsersFromBackupData } from "../utils/restoreAllUsersFromBackupData";
import { jsonResponse, logError } from "../utils/response";
import {
  checkClientContext,
  checkEventBody,
  checkAdminRole,
  checkHttpMethod,
  parseBackupRequest,
  validateBackupType,
  validateBackupUsers,
} from "../utils/validators";
import { findActiveUser } from "../utils/database";
import { BackupData } from "../../src/types";

const handler: Handler = async (event, context): Promise<HandlerResponse> => {
  const logPrefix = "[restoreBackupFromGoogleDrive]";

  const methodResponse = checkHttpMethod(event.httpMethod, "POST", logPrefix);
  if (methodResponse) return methodResponse;

  const bodyResponse = checkEventBody(event.body, logPrefix);
  if (bodyResponse) return bodyResponse;

  const authResponse = checkClientContext(context, logPrefix);
  if (authResponse) return authResponse;

  const adminResponse = checkAdminRole(context, logPrefix);
  if (adminResponse) return adminResponse;

  await connectToDB();

  try {
    const email = context.clientContext?.user.email as string;
    const body = event.body as string;

    const requestData = parseBackupRequest(body, logPrefix);

    if ("statusCode" in requestData) {
      return requestData;
    }

    const { fileId, accessToken } = requestData;

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
            `${logPrefix} Google Drive authentication failed: ${err.message}`
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
        "all-users-backup",
        logPrefix
      );
      if (typeResponse) {
        return typeResponse;
      }

      const usersResponse = validateBackupUsers(backupData.users, logPrefix);
      if (usersResponse) {
        return usersResponse;
      }

      const { restored, failed } = await restoreAllUsersFromBackupData(
        backupData
      );

      return jsonResponse(200, {
        restored,
        failed,
      });
    } catch (processError) {
      logError("Backup process error", processError, logPrefix);
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
