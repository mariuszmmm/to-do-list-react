import type { Handler } from "@netlify/functions";
import { jsonResponse, logError } from "./lib/response";
import { checkAdminRole, checkHttpMethod, parseJsonBody } from "./lib/validators";

interface InviteRequestBody {
  email: string;
}

/**
 * Netlify Function to invite a new user using GoTrue Admin API.
 * Requires the caller to have the "admin" role.
 */
const handler: Handler = async (event, context) => {
  const logPrefix = "[inviteUser]";

  // 1. Check HTTP Method
  const methodResponse = checkHttpMethod(event.httpMethod, "POST", logPrefix);
  if (methodResponse) return methodResponse;

  // 2. Check Admin Role
  const adminResponse = checkAdminRole(context, logPrefix);
  if (adminResponse) return adminResponse;

  // 3. Parse Body
  const body = parseJsonBody<InviteRequestBody>(event.body, logPrefix);
  if ("statusCode" in body) return body as any;

  const { email } = body;
  if (!email || !email.includes("@")) {
    return jsonResponse(400, { message: "Valid email is required." });
  }

  try {
    const { identity } = context.clientContext!;
    const inviteUrl = `${identity!.url}/admin/invite`;
    const adminAuthHeader = `Bearer ${identity!.token}`;

    // 4. Call GoTrue Admin Invite API
    const response = await fetch(inviteUrl, {
      method: "POST",
      headers: { 
        Authorization: adminAuthHeader,
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ email }),
    });

    const data = (await response.json()) as any;

    if (!response.ok) {
      console.warn(`${logPrefix} Failed to invite user: ${response.status} - ${data.msg || response.statusText}`);
      return jsonResponse(response.status, { message: data.msg || response.statusText });
    }

    return jsonResponse(200, { 
      message: "Invitation sent successfully.",
      user: data
    });
  } catch (error) {
    logError("Failed to invite user", error, logPrefix);
    return jsonResponse(500, { message: "Internal server error" });
  }
};

module.exports = { handler };
