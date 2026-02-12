import type { Handler, HandlerResponse } from "@netlify/functions";
import { jsonResponse, logError } from "../functions/lib/response";
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
    const parsedBody = parseJsonBody<{ googleAccessToken?: string }>(event.body, logPrefix);

    if ("statusCode" in parsedBody) {
      return parsedBody;
    }

    const { googleAccessToken } = parsedBody;

    if (!googleAccessToken) {
      console.warn(`${logPrefix} Missing googleAccessToken`);
      return jsonResponse(400, { message: "Missing googleAccessToken" });
    }

    try {
      const folderResponse = await fetch(
        "https://www.googleapis.com/drive/v3/files?q=name='to-do-list-backup' and mimeType='application/vnd.google-apps.folder' and trashed=false&fields=files(id)",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${googleAccessToken}`,
          },
        },
      );

      if (!folderResponse.ok) {
        if (folderResponse.status === 401) {
          console.warn(`${logPrefix} Google Drive authentication failed`);
          return jsonResponse(401, {
            message: "Google Drive authentication failed",
            source: "google-drive",
          });
        }

        const errorData = await folderResponse.text();
        console.error(`${logPrefix} Folder search error:`, errorData);
        return jsonResponse(folderResponse.status, {
          message: "Failed to search for backup folder",
        });
      }

      const folderData = await folderResponse.json();

      if (!folderData.files || folderData.files.length === 0) {
        return jsonResponse(200, {
          message: "No backup folder found",
          files: [],
        });
      }

      const folderId = folderData.files[0].id;

      const backupsResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files?q='${folderId}' in parents and name contains 'backup-' and mimeType='application/json' and trashed=false&orderBy=modifiedTime%20desc&fields=files(id,name,modifiedTime)`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${googleAccessToken}`,
          },
        },
      );

      if (!backupsResponse.ok) {
        if (backupsResponse.status === 401) {
          console.warn(`${logPrefix} Google Drive authentication failed`);
          return jsonResponse(401, {
            message: "Google Drive authentication failed",
            source: "google-drive",
          });
        }

        const errorData = await backupsResponse.text();
        console.error(`${logPrefix} Backups search error:`, errorData);
        return jsonResponse(backupsResponse.status, {
          message: "Failed to list backups",
        });
      }

      const backupsData = await backupsResponse.json();

      return jsonResponse(200, {
        message: "Backups listed successfully",
        files: backupsData.files || [],
      });
    } catch (driveError) {
      console.error(
        `${logPrefix} Failed to fetch from Google Drive: ${
          driveError instanceof Error ? driveError.message : "Unknown error"
        }`,
      );
      return jsonResponse(500, {
        message: "Failed to fetch backup list from Google Drive",
      });
    }
  } catch (error) {
    logError("Unexpected error in fetchGoogleDriveBackupList handler", error, logPrefix);
    return jsonResponse(500, {
      message: "Internal server error",
    });
  }
};

export { handler };
