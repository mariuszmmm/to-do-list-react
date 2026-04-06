import {
  checkClientContext,
  checkEventBody,
  checkHttpMethod,
  parseJsonBody,
} from "../shared/lib/validators";
import { jsonResponse, logError } from "../shared/lib/response";
import { connectToDB } from "../config/mongoose";
import UserData from "../models/UserData";

const handler: Handler = async (event, context) => {
  const logPrefix = '[auth-google-refresh]';

  const methodResponse = checkHttpMethod(event.httpMethod, "POST", logPrefix);
  if (methodResponse) return methodResponse;

  const bodyResponse = checkEventBody(event.body, logPrefix);
  if (bodyResponse) return bodyResponse;

  const authResponse = checkClientContext(context, logPrefix);
  if (authResponse) return authResponse;

  try {
    const parsedBody = parseJsonBody<{ refreshToken?: string }>(
      event.body,
      logPrefix,
    );

    if ("statusCode" in parsedBody) {
      return parsedBody;
    }

    let { refreshToken } = parsedBody;

    const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID?.replace(/"/g, "");
    const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET?.replace(
      /"/g,
      "",
    );

    if (!clientId || !clientSecret) {
      logError(
        "Missing Google OAuth credentials",
        new Error("Missing environment variables"),
        logPrefix,
      );
      return jsonResponse(500, { message: "Server configuration error" });
    }

    // Try to fetch from DB if not in request body
    if (!refreshToken) {
      try {
        await connectToDB();

        const userEmail = context.clientContext?.user?.email;
        if (userEmail) {
          const userDoc = await UserData.findOne({ email: userEmail });
          refreshToken = userDoc?.googleRefreshToken;
        }
      } catch (dbError) {
        console.error(`${logPrefix} DB fetch error:`, dbError);
      }
    }

    if (!refreshToken) {
      console.warn(`${logPrefix} Missing refreshToken`);
      return jsonResponse(400, { message: "Refresh token is required" });
    }

    console.log(
      `${logPrefix} Attempting to refresh token. ID: ${!!clientId}, Secret: ${!!clientSecret}`,
    );

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
      logPrefix,
    );
    return jsonResponse(500, {
      message: "Internal server error",
    });
  }
};

export { handler };
