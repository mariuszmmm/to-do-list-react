import type { Handler } from "@netlify/functions";
import { checkEventBody, checkHttpMethod } from "../utils/validators";
import { jsonResponse, logError } from "../utils/response";

const handler: Handler = async (event) => {
  const logPrefix = "[googleOAuthCallback]";

  const methodResponse = checkHttpMethod(event.httpMethod, "POST", logPrefix);
  if (methodResponse) return methodResponse;

  const bodyResponse = checkEventBody(event.body, logPrefix);
  if (bodyResponse) return bodyResponse;

  try {
    const body = event.body as string;
    let parsedBody: { code?: string };

    try {
      parsedBody = JSON.parse(body);
    } catch (parseError) {
      console.warn(`${logPrefix} Invalid JSON in request body`);
      return jsonResponse(400, { message: "Invalid JSON in request body" });
    }

    const { code } = parsedBody;

    if (!code) {
      console.warn(`${logPrefix} Authorization code is required`);
      return jsonResponse(400, { message: "Authorization code is required" });
    }

    const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_DRIVE_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      logError(
        `${logPrefix} Missing Google configuration`,
        new Error("Missing environment variables"),
        logPrefix
      );
      return jsonResponse(500, {
        message:
          "Server configuration error - missing Google Drive credentials",
      });
    }

    process.env.NODE_ENV === "development" &&
      console.log(
        `[googleOAuthCallback] Exchanging code for token. Redirect URI: ${redirectUri}`
      );

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }).toString(),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.warn(`${logPrefix} Token exchange failed:`, errorData);
      return jsonResponse(400, {
        message: "Failed to exchange authorization code for token",
      });
    }

    const tokenData = await tokenResponse.json();

    return jsonResponse(200, {
      success: true,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresIn: tokenData.expires_in,
      message: "Authorization successful",
    });
  } catch (error) {
    logError(
      "Unexpected error in googleOAuthCallback handler",
      error,
      logPrefix
    );
    return jsonResponse(500, {
      message: "Internal server error",
    });
  }
};

export { handler };
