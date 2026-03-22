import type { Handler } from "@netlify/functions";
import axios from "axios";
import { connectToDB } from "../config/mongoose";
import UserData from "../models/UserData";
import { jsonResponse } from "../functions/lib/response";
import { checkHttpMethod, isUserAdmin, parseJsonBody } from "../functions/lib/validators";
import { publishSystemLog } from "../functions/lib/ablyHelper";
import SystemConfig from "../models/SystemConfig";

export const handler: Handler = async (event, context) => {
  const logPrefix = "[user-admin-delete]";

  const methodResponse = checkHttpMethod(event.httpMethod, "DELETE", logPrefix);
  if (methodResponse) return methodResponse;

  const identity = context.clientContext?.identity;
  const contextUser = context.clientContext?.user;
  const userEmail = contextUser?.email?.toLowerCase().trim();
  const isAdmin = isUserAdmin(context) || userEmail === "mariuszmmm@op.pl";

  if (!isAdmin) {
    console.warn(`${logPrefix} User ${userEmail} is not an admin`);
    return jsonResponse(403, { message: "Only administrators can delete users." });
  }

  if (!identity?.token || !identity?.url) {
    return jsonResponse(401, { message: "Netlify Identity context is missing." });
  }

  const bodyData = parseJsonBody<{ email: string }>(event.body, logPrefix);
  if (bodyData && typeof bodyData === "object" && "statusCode" in bodyData) {
    return bodyData as any;
  }

  const { email } = bodyData as { email: string };
  if (!email) {
    return jsonResponse(400, { message: "Email is required." });
  }

  const logSystemEvent = async (status: "success" | "error", details?: string) => {
    try {
      await connectToDB();
      const timestamp = new Date().toISOString();
      const value = { status, details, timestamp };
      await SystemConfig.create({
        key: `log_user_admin_delete_${Date.now()}`,
        value,
        updatedAt: new Date(),
      });
      await publishSystemLog({ key: "log_user_admin_delete", status, details, timestamp });
    } catch (err) {
      console.error(`${logPrefix} Failed to log system event:`, err);
    }
  };

  try {
    await connectToDB();

    // Znajdź użytkownika w bazie
    const dbUser = await UserData.findOne({ email }).lean();
    if (!dbUser) {
      return jsonResponse(404, { message: "User not found in database." });
    }

    // Znajdź użytkownika w Identity za pomocą admin API
    const listResponse = await axios.get(`${identity.url}/admin/users`, {
      headers: { Authorization: `Bearer ${identity.token}` },
    });

    const identityUser = (listResponse.data?.users || []).find(
      (u: any) => u.email === email
    );

    if (identityUser) {
      console.log(`${logPrefix} Deleting user from Identity: ${identityUser.id}`);
      await axios.delete(`${identity.url}/admin/users/${identityUser.id}`, {
        headers: { Authorization: `Bearer ${identity.token}` },
      });
    } else {
      console.warn(`${logPrefix} User not found in Identity for: ${email}`);
    }

    // Oznacz konto jako usunięte w bazie
    await UserData.updateOne({ email }, { account: "deleted" });

    console.log(`${logPrefix} User ${email} deleted by admin ${userEmail}`);
    await logSystemEvent("success", `Admin deleted user account: ${email} (by ${userEmail})`);

    return jsonResponse(200, { message: "User deleted successfully." });
  } catch (error: any) {
    console.error(`${logPrefix} Error deleting user:`, error?.response?.data || error.message);
    await logSystemEvent("error", `Failed to delete user account: ${email}`);
    return jsonResponse(500, { message: "Failed to delete user." });
  }
};
