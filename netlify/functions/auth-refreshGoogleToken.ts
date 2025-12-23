import type { Handler } from "@netlify/functions";
import {
  checkClientContext,
  checkEventBody,
  checkHttpMethod,
} from "../utils/validators";
import { jsonResponse, logError } from "../utils/response";

const handler: Handler = async (event, context) => {
  const logPrefix = "[refreshGoogleToken]";

  const methodResponse = checkHttpMethod(event.httpMethod, "POST", logPrefix);
  if (methodResponse) return methodResponse;

  const bodyResponse = checkEventBody(event.body, logPrefix);
  if (bodyResponse) return bodyResponse;

  const authResponse = checkClientContext(context, logPrefix);
  if (authResponse) return authResponse;

  try {
    const body = event.body as string;
    let parsedBody: { refreshToken?: string };

    try {
      parsedBody = JSON.parse(body);
    } catch (parseError) {
      console.warn(`${logPrefix} Invalid JSON in request body`);
      return jsonResponse(400, { message: "Invalid JSON in request body" });
    }

    const { refreshToken } = parsedBody;

    if (!refreshToken) {
      console.warn(`${logPrefix} Missing refreshToken`);
      return jsonResponse(400, { message: "Refresh token is required" });
    }

    const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      logError(
        "Missing Google OAuth credentials",
        new Error("Missing environment variables"),
        logPrefix
      );
      return jsonResponse(500, { message: "Server configuration error" });
    }

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.warn(`${logPrefix} Google API error:`, errorData);
      return jsonResponse(response.status, {
        message: "Failed to refresh access token",
      });
    }

    const data = await response.json();

    return jsonResponse(200, {
      accessToken: data.access_token,
      expiresIn: data.expires_in,
    });
  } catch (error) {
    logError(
      "Unexpected error in refreshGoogleToken handler",
      error,
      logPrefix
    );
    return jsonResponse(500, {
      message: "Internal server error",
    });
  }
};

export { handler };
