import type { Handler } from "@netlify/functions";
import { connectToDB } from "../config/mongoose";
import { getAllUsersForBackup } from "../functions/lib/getAllUsersForBackup";
import { checkClientContext, checkHttpMethod, checkAdminRole } from "../functions/lib/validators";
import { jsonResponse, logError } from "../functions/lib/response";

const handler: Handler = async (event, context) => {
  const logPrefix = "[downloadAllUsers]";
  console.log(`!!!!   ${logPrefix} Handler invoked`, { event, context });

  const methodResponse = checkHttpMethod(event.httpMethod, "GET", logPrefix);
  if (methodResponse) return methodResponse;

  const authResponse = checkClientContext(context, logPrefix);
  if (authResponse) return authResponse;

  const adminResponse = checkAdminRole(context, logPrefix);
  if (adminResponse) return adminResponse;

  await connectToDB();

  try {
    const email = context.clientContext?.user.email as string;

    try {
      const { backupData, fileName } = await getAllUsersForBackup(email);
      return jsonResponse(
        200,
        { backupData, message: "Download successful" },
        {
          "Content-Disposition": `attachment; filename="${fileName}"`,
        },
      );
    } catch (err) {
      if (err instanceof Error && err.message === "No user data found") {
        console.warn(`${logPrefix} No user data found`);
        return jsonResponse(404, { message: "No user data found" });
      }
      throw err;
    }
  } catch (error) {
    logError("Unexpected error in downloadAllUsers handler", error, logPrefix);
    return jsonResponse(500, { message: "Internal server error" });
  }
};

export { handler };
