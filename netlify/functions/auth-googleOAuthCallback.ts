import type { Handler } from "@netlify/functions";
import { checkEventBody, checkHttpMethod } from "./lib/validators";
import { jsonResponse, logError } from "./lib/response";
import { connectToDB } from "../config/mongoose";
import UserData from "../models/UserData";
import SystemConfig from "../models/SystemConfig";
import { publishSystemLog } from "./lib/ablyHelper";

const handler: Handler = async (event, context) => {
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

    const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID?.replace(/"/g, "");
    const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET?.replace(
      /"/g,
      "",
    );
    const redirectUri = process.env.GOOGLE_DRIVE_REDIRECT_URI?.replace(
      /"/g,
      "",
    );

    if (!clientId || !clientSecret || !redirectUri) {
      logError(
        `${logPrefix} Missing Google configuration`,
        new Error("Missing environment variables"),
        logPrefix,
      );
      return jsonResponse(500, {
        message:
          "Server configuration error - missing Google Drive credentials",
      });
    }

    process.env.NODE_ENV === "development" &&
      console.log(
        `[googleOAuthCallback] Exchanging code for token. Redirect URI: ${redirectUri}`,
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

    // Save refresh token to database if provided
    if (tokenData.refresh_token) {
      try {
        await connectToDB();

        // Get user from Netlify Identity context
        const userEmail = context.clientContext?.user?.email;
        if (userEmail) {
          await UserData.findOneAndUpdate(
            { email: userEmail },
            { googleRefreshToken: tokenData.refresh_token },
            { upsert: true },
          );

          // Log this as a system event and clear backup error status
          try {
            const logEntry = {
              status: "success",
              details: `Google OAuth refresh token updated for ${userEmail}`,
              timestamp: new Date().toISOString(),
            };
            await SystemConfig.create({
              key: `log_oauth_${Date.now()}`,
              value: logEntry,
              updatedAt: new Date(),
            });

            // Clear the backup error status so the modal won't show anymore
            await SystemConfig.findOneAndUpdate(
              { key: "lastAutoBackupStatus" },
              {
                value: {
                  status: "success",
                  details: "Authorization refreshed via Google OAuth",
                  timestamp: new Date().toISOString(),
                },
                updatedAt: new Date(),
              },
              { upsert: true },
            );

            // Notify admins in real-time
            await publishSystemLog({
              key: "log_oauth",
              ...logEntry,
            });
          } catch (logErr) {
            console.error(`${logPrefix} Failed to create system log:`, logErr);
          }

          console.log(
            `${logPrefix} Refresh token saved to DB for ${userEmail}`,
          );
        }
      } catch (dbError) {
        console.error(
          `${logPrefix} Error saving refresh token to DB:`,
          dbError,
        );
      }

      console.log(`${logPrefix} !!! PERMANENT REFRESH TOKEN OBTAINED !!!`);
      console.log(`${logPrefix} Copy this to GOOGLE_BACKUP_REFRESH_TOKEN:`);
      console.log(tokenData.refresh_token);
      console.log(`${logPrefix} ------------------------------------------`);
    }

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
      logPrefix,
    );
    return jsonResponse(500, {
      message: "Internal server error",
    });
  }
};

export { handler };
