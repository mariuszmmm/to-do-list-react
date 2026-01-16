import type { Handler } from "@netlify/functions";
import { connectToDB } from "../config/mongoose";
import { getAllUsersForBackup } from "../functions/lib/getAllUsersForBackup";
import { uploadBackupToGoogleDrive } from "../functions/lib/uploadBackupToGoogleDrive";
import {
  checkAdminRole,
  checkClientContext,
  checkEventBody,
  checkHttpMethod,
} from "../functions/lib/validators";
import { jsonResponse, logError } from "../functions/lib/response";

const handler: Handler = async (event, context) => {
  const logPrefix = "[uploadAllUsersToGoogleDrive]";

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
    let parsedBody: { accessToken?: string };

    try {
      parsedBody = JSON.parse(body);
    } catch (parseError) {
      console.warn(`${logPrefix} Invalid JSON in request body`);
      return jsonResponse(400, { message: "Invalid JSON in request body" });
    }

    const { accessToken } = parsedBody;
    const { backupData, fileName } = await getAllUsersForBackup(email);

    if (!accessToken || !backupData || !fileName) {
      console.warn(`${logPrefix} Missing required data for upload`);
      return jsonResponse(400, { message: "Missing required data for upload" });
    }

    const fileContent = JSON.stringify(backupData);

    try {
      const uploadResponse = await uploadBackupToGoogleDrive(
        fileName,
        fileContent,
        accessToken
      );

      if (!uploadResponse.success) {
        if (uploadResponse.statusCode === 401) {
          console.warn(
            `${logPrefix} Google Drive authentication failed: ${uploadResponse.message}`
          );
          return jsonResponse(401, {
            message: "Google Drive authentication failed",
            source: "google-drive",
          });
        }
        throw new Error(uploadResponse.message);
      }

      return jsonResponse(200, {
        message: "Backup uploaded to Google Drive successfully",
      });
    } catch (driveError) {
      console.warn(
        `${logPrefix} Failed to upload to Google Drive: ${
          driveError instanceof Error ? driveError.message : "Unknown error"
        }`
      );
      return jsonResponse(500, {
        message: "Failed to upload to Google Drive",
      });
    }
  } catch (error) {
    logError(
      "Unexpected error in uploadAllUsersToGoogleDrive handler",
      error,
      logPrefix
    );
    return jsonResponse(500, {
      message: "Internal server error",
    });
  }
};

export { handler };
