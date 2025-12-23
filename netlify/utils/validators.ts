import type { HandlerResponse, HandlerContext } from "@netlify/functions";
import { jsonResponse } from "./response";

export function checkHttpMethod(
  method: string | undefined,
  allowedMethod: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  logPrefix = "[checkHttpMethod]"
): HandlerResponse | null {
  if (method !== allowedMethod) {
    console.warn(`${logPrefix} Invalid HTTP method: ${method}`);
    return jsonResponse(405, {
      message: `Invalid HTTP method. Only ${allowedMethod} is allowed.`,
    });
  }
  return null;
}

export function checkEventBody(
  body: string | null | undefined,
  logPrefix = "[checkEventBody]"
): HandlerResponse | null {
  if (!body) {
    console.warn(`${logPrefix} Missing event body`);
    return jsonResponse(400, { message: "Request body is required." });
  }
  return null;
}

export function checkClientContext(
  context: HandlerContext,
  logPrefix = "[checkClientContext]"
): HandlerResponse | null {
  if (!context.clientContext?.user) {
    console.warn(`${logPrefix} Unauthorized access attempt`);
    return jsonResponse(401, {
      message: "Authentication required. Please log in to continue.",
      source: "user",
    });
  }
  return null;
}

export function checkAdminRole(
  context: HandlerContext,
  logPrefix = "[checkAdminRole]"
): HandlerResponse | null {
  if (
    context.clientContext?.user.app_metadata?.roles?.includes("admin") !== true
  ) {
    console.warn(`${logPrefix} Admin access denied`);
    return jsonResponse(403, {
      message: "Insufficient permissions. Administrator access required.",
    });
  }
  return null;
}

export function parseBackupRequest(
  body: string | null | undefined,
  logPrefix = "[parseBackupRequest]"
): HandlerResponse | { fileId: string; accessToken: string } {
  if (!body) {
    console.warn(`${logPrefix} Empty or missing body for parsing`);
    return jsonResponse(400, { message: "Request body is required." });
  }

  try {
    const { fileId, accessToken } = JSON.parse(body) as {
      fileId?: string;
      accessToken?: string;
    };

    if (!fileId || !accessToken) {
      console.warn(`${logPrefix} Missing fileId or accessToken`);
      return jsonResponse(400, {
        message:
          "Both 'fileId' and 'accessToken' are required in the request body.",
      });
    }

    return { fileId, accessToken };
  } catch (e) {
    console.warn(`${logPrefix} Invalid JSON in body`);
    return jsonResponse(400, { message: "Malformed JSON in request body." });
  }
}

export function validateBackupType(
  backupType: string,
  expectedType = "all-users-backup",
  logPrefix = "[validateBackupType]"
): HandlerResponse | null {
  if (backupType !== expectedType) {
    console.warn(
      `${logPrefix} Invalid backup format – expected '${expectedType}'`
    );
    return jsonResponse(400, {
      message: `Invalid backup type. Expected '${expectedType}'.`,
    });
  }
  return null;
}

export function validateBackupUsers(
  users: unknown,
  logPrefix = "[validateBackupUsers]"
): HandlerResponse | null {
  if (!Array.isArray(users)) {
    console.warn(`${logPrefix} Missing or invalid backupData.users`);
    return jsonResponse(400, {
      message: "The backup data must include a valid list of users.",
    });
  }
  return null;
}

export function checkWebhookSecret(
  logPrefix = "[checkWebhookSecret]"
): HandlerResponse | string {
  const SECRET = process.env.WEBHOOK_SECRET;
  if (!SECRET) {
    console.error(`${logPrefix} Missing WEBHOOK_SECRET environment variable`);
    return jsonResponse(500, {
      message: "Server configuration error. Please contact the administrator.",
    });
  }
  return SECRET;
}

export function checkWebhookSignature(
  headers: Record<string, string | string[] | undefined>,
  logPrefix = "[checkWebhookSignature]"
): HandlerResponse | string {
  const signature = headers["x-webhook-signature"];
  if (!signature || typeof signature !== "string") {
    console.error(`${logPrefix} Missing signature in headers`);
    return jsonResponse(400, {
      message: "Missing or invalid webhook signature in headers.",
    });
  }
  return signature;
}
