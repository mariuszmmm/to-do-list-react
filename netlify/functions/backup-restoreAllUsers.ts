import type { Handler } from "@netlify/functions";
import { connectToDB } from "../config/mongoose";
import { restoreAllUsersFromBackupData } from "../functions/lib/restoreAllUsersFromBackupData";
import {
  checkAdminRole,
  checkClientContext,
  checkEventBody,
  checkHttpMethod,
} from "../functions/lib/validators";
import { BackupData } from "../../src/types";
import { jsonResponse, logError } from "../functions/lib/response";

const handler: Handler = async (event, context) => {
  const logPrefix = "[restoreAllUsers]";

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

    const { restored, failed } = await restoreAllUsersFromBackupData(
      backupData
    );

    return jsonResponse(200, {
      message: `Restored ${restored} users, ${failed} failed`,
      restored,
      failed,
    });
  } catch (error) {
    logError("Error restoring users", error, logPrefix);
    return jsonResponse(500, { message: "Internal server error" });
  }
};

export { handler };
