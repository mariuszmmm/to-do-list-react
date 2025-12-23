import type { Handler } from "@netlify/functions";
import Ably from "ably";
import { jsonResponse, logError } from "../utils/response";
import { checkHttpMethod } from "../utils/validators";

const handler: Handler = async (event, context) => {
  const logPrefix = "[ably-auth]";

  const methodResponse = checkHttpMethod(event.httpMethod, "GET", logPrefix);
  if (methodResponse) return methodResponse;

  const emailParam = event.queryStringParameters?.email;
  const deviceId = event.queryStringParameters?.deviceId;
  const isAuthenticated = context?.clientContext?.user !== undefined;
  const email = isAuthenticated
    ? context?.clientContext?.user?.email
    : emailParam;

  if (!email) {
    console.warn(`${logPrefix} Unauthorized request: missing email`);
    return jsonResponse(401, {
      message: "Missing email",
    });
  }

  if (!deviceId) {
    console.warn(`${logPrefix} DeviceId is required`);
    return jsonResponse(400, { message: "DeviceId is required" });
  }

  try {
    const ably = new Ably.Rest({ key: process.env.ABLY_API_KEY });
    const uniqueClientId = `${email}:${deviceId}`;
    const capability = isAuthenticated
      ? {
          [`user:${email}:lists`]: ["subscribe"] as const,
          [`user:${email}:confirmation`]: ["subscribe"] as const,
          "global:presence": ["subscribe", "presence"] as const,
        }
      : {
          [`user:${email}:confirmation`]: ["subscribe"] as const,
        };

    const tokenRequest = await ably.auth.createTokenRequest({
      clientId: uniqueClientId,
      capability: capability as any,
      ttl: 3600000,
    });

    return jsonResponse(200, tokenRequest as any);
  } catch (error) {
    logError("Error generating token", error, logPrefix);
    return jsonResponse(500, { message: "Failed to generate token" });
  }
};

export { handler };
