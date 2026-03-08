import type { Handler, HandlerResponse } from "@netlify/functions";
import { jsonResponse, logError } from "../functions/lib/response";
import { getGoogleAccessToken } from "../functions/lib/googleDriveHelper";
import {
  checkClientContext,
  checkEventBody,
  checkAdminRole,
  checkHttpMethod,
  parseJsonBody,
} from "../functions/lib/validators";

const handler: Handler = async (event, context): Promise<HandlerResponse> => {
  const logPrefix = "[deleteBackupFromGoogleDrive]";

  const methodResponse = checkHttpMethod(event.httpMethod, "POST", logPrefix);
  if (methodResponse) return methodResponse;

  const bodyResponse = checkEventBody(event.body, logPrefix);
  if (bodyResponse) return bodyResponse;

  const authResponse = checkClientContext(context, logPrefix);
  if (authResponse) return authResponse;

  const adminResponse = checkAdminRole(context, logPrefix);
  if (adminResponse) return adminResponse;

  try {
    const parsedBody = parseJsonBody<{ fileId?: string; accessToken?: string }>(
      event.body,
      logPrefix,
    );

    if ("statusCode" in parsedBody) {
      return parsedBody;
    }

    let { fileId, accessToken } = parsedBody;

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

    console.log(`${logPrefix} Requesting deletion of fileId: ${fileId}`);

    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error(`${logPrefix} Google API Delete error:`, errorData);
        if (response.status === 401) {
          return jsonResponse(401, {
            message: "Google Drive authentication failed",
            source: "google-drive",
          });
        }
        return jsonResponse(response.status, {
          message: `Failed to delete backup: ${errorData}`,
        });
      }

      console.log(`${logPrefix} Google confirmed deletion (204) for ${fileId}`);
      return jsonResponse(204, { message: "Backup deleted successfully" });
    } catch (driveError) {
      console.error(`${logPrefix} Fetch error during delete:`, driveError);
      return jsonResponse(500, {
        message: "Connection to Google Drive failed",
      });
    }
  } catch (error) {
    logError("Unexpected error in delete handler", error, logPrefix);
    return jsonResponse(500, { message: "Internal server error" });
  }
};

export { handler };
