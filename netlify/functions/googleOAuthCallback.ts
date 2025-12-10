// Netlify function to exchange authorization code for Google Drive access token
import type { Handler } from "@netlify/functions";

const handler: Handler = async (event) => {
  process.env.NODE_ENV === "development" &&
    console.log("[googleOAuthCallback] Function invoked");

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method not allowed" }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { code } = body;

    if (!code) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Authorization code is required" }),
      };
    }

    const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_DRIVE_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      console.error("[googleOAuthCallback] Missing Google configuration");
      return {
        statusCode: 500,
        body: JSON.stringify({
          message:
            "Server configuration error - missing Google Drive credentials",
        }),
      };
    }

    process.env.NODE_ENV === "development" &&
      console.log(
        `[googleOAuthCallback] Exchanging code for token. Redirect URI: ${redirectUri}`
      );

    // Exchange authorization code for access token
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
      console.error("[googleOAuthCallback] Token exchange failed:", errorData);
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Failed to exchange authorization code for token",
          error: errorData,
        }),
      };
    }

    const tokenData = await tokenResponse.json();
    process.env.NODE_ENV === "development" &&
      console.log(`[googleOAuthCallback] Token exchange successful`);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: true,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresIn: tokenData.expires_in,
        message: "Authorization successful",
      }),
    };
  } catch (error) {
    console.error("[googleOAuthCallback] Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};

export { handler };
