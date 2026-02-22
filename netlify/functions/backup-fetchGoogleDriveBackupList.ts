import type { Handler, HandlerResponse } from "@netlify/functions";
import { jsonResponse, logError } from "../functions/lib/response";
import { getGoogleAccessToken } from "../functions/lib/googleDriveHelper";
import {
  checkClientContext,
  checkAdminRole,
  checkHttpMethod,
  checkEventBody,
  parseJsonBody,
} from "../functions/lib/validators";

const handler: Handler = async (event, context): Promise<HandlerResponse> => {
  const logPrefix = "[fetchGoogleDriveBackupList]";

  const methodResponse = checkHttpMethod(event.httpMethod, "POST", logPrefix);
  if (methodResponse) return methodResponse;

  const bodyResponse = checkEventBody(event.body, logPrefix);
  if (bodyResponse) return bodyResponse;

  const authResponse = checkClientContext(context, logPrefix);
  if (authResponse) return authResponse;

  const adminResponse = checkAdminRole(context, logPrefix);
  if (adminResponse) return adminResponse;

  try {
    const parsedBody = parseJsonBody<{ googleAccessToken?: string }>(
      event.body,
      logPrefix,
    );

    if ("statusCode" in parsedBody) {
      return parsedBody;
    }

    let { googleAccessToken } = parsedBody;

    if (!googleAccessToken) {
      const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
      const refreshToken = process.env.GOOGLE_BACKUP_REFRESH_TOKEN;

      if (clientId && clientSecret && refreshToken) {
        googleAccessToken =
          (await getGoogleAccessToken(clientId, clientSecret, refreshToken)) ||
          undefined;
      }
    }

    if (!googleAccessToken) {
      const authMsg = "Google Drive authentication failed";
      console.warn(`${logPrefix} ${authMsg}`);
      return jsonResponse(401, { message: authMsg, source: "google-drive" });
    }

    try {
      // 1. Find the folder(s)
      const folderResponse = await fetch(
        "https://www.googleapis.com/drive/v3/files?q=name='To-do-list_Backups' and mimeType='application/vnd.google-apps.folder' and trashed=false&fields=files(id,name,createdTime)&orderBy=createdTime",
        {
          headers: { Authorization: `Bearer ${googleAccessToken}` },
        },
      );

      if (!folderResponse.ok) {
        const errorData = await folderResponse.text();
        console.error(`${logPrefix} Folder search error:`, errorData);
        return jsonResponse(folderResponse.status, {
          message: "Failed to search for backup folder",
        });
      }

      const folderData = await folderResponse.json();
      console.log(
        `${logPrefix} Found ${folderData.files?.length || 0} matching folders.`,
      );

      if (!folderData.files || folderData.files.length === 0) {
        return jsonResponse(200, {
          message: "No backup folder found",
          files: [],
        });
      }

      // If multiple folders exist, we use the one that was created FIRST (likely the original one)
      // or at least we log it.
      const folderId = folderData.files[0].id;
      console.log(
        `${logPrefix} Using folderId: ${folderId} (${folderData.files[0].name})`,
      );

      // 2. List JSON files in that folder
      const backupsResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files?q='${folderId}' in parents and mimeType='application/json' and trashed=false&orderBy=modifiedTime desc&fields=files(id,name,modifiedTime,size)`,
        {
          headers: { Authorization: `Bearer ${googleAccessToken}` },
        },
      );

      if (!backupsResponse.ok) {
        const errorData = await backupsResponse.text();
        console.error(`${logPrefix} Backups search error:`, errorData);
        return jsonResponse(backupsResponse.status, {
          message: "Failed to list backups",
        });
      }

      const backupsData = await backupsResponse.json();
      console.log(
        `${logPrefix} Found ${backupsData.files?.length || 0} backups in folder.`,
      );

      return jsonResponse(200, {
        message: "Backups listed successfully",
        files: backupsData.files || [],
      });
    } catch (driveError) {
      console.error(`${logPrefix} Google Drive API error:`, driveError);
      return jsonResponse(500, {
        message: "Connection to Google Drive failed",
      });
    }
  } catch (error) {
    logError("Unexpected error in fetch handler", error, logPrefix);
    return jsonResponse(500, { message: "Internal server error" });
  }
};

export { handler };
