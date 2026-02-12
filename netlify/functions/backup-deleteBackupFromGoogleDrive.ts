import type { Handler, HandlerResponse } from "@netlify/functions";
import { jsonResponse, logError } from "../functions/lib/response";
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
    const parsedBody = parseJsonBody<{ fileId?: string; accessToken?: string }>(event.body, logPrefix);

    if ("statusCode" in parsedBody) {
      return parsedBody;
    }

    const { fileId, accessToken } = parsedBody;

    if (!fileId || !accessToken) {
      console.warn(`${logPrefix} Missing fileId or accessToken`);
      return jsonResponse(400, { message: "Missing fileId or accessToken" });
    }

    try {
      const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.warn(`${logPrefix} Google Drive authentication failed`);
          return jsonResponse(401, {
            message: "Google Drive authentication failed",
            source: "google-drive",
          });
        }

        const errorData = await response.text();
        console.error(`${logPrefix} Delete error:`, errorData);
        return jsonResponse(response.status, {
          message: "Failed to delete backup from Google Drive",
        });
      }

      return jsonResponse(204, {
        message: "Backup deleted successfully",
      });
    } catch (driveError) {
      console.error(
        `${logPrefix} Failed to delete from Google Drive: ${
          driveError instanceof Error ? driveError.message : "Unknown error"
        }`,
      );
      return jsonResponse(500, {
        message: "Failed to delete backup from Google Drive",
      });
    }
  } catch (error) {
    logError("Unexpected error in deleteBackupFromGoogleDrive handler", error, logPrefix);
    return jsonResponse(500, {
      message: "Internal server error",
    });
  }
};

export { handler };
