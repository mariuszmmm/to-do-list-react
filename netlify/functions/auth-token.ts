// netlify/functions/auth-token.ts
import type { Handler } from "@netlify/functions";
import Ably from "ably";

const handler: Handler = async (event, context) => {
  // Sprawdź czy użytkownik jest uwierzytelniony
  if (!context.clientContext || !context.clientContext.user) {
    console.log("[auth-token] Unauthorized - Missing client context");
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Unauthorized" }),
    };
  }

  const { email }: { email: string } = context.clientContext.user;

  // Pobierz deviceId z query params
  const deviceId = event.queryStringParameters?.deviceId;

  if (!deviceId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "deviceId is required" }),
    };
  }

  console.log(
    "[auth-token] Generating token for user:",
    email,
    "device:",
    deviceId
  );

  try {
    // Utwórz klienta Ably z kluczem API (tylko server-side!)
    const ably = new Ably.Rest({
      key: process.env.ABLY_API_KEY,
    });

    const uniqueClientId = `${email}:${deviceId}`;

    // Wygeneruj TokenRequest z odpowiednimi uprawnieniami
    const tokenRequest = await ably.auth.createTokenRequest({
      clientId: uniqueClientId,
      capability: {
        [`user:${email}:lists`]: ["subscribe"],
        "global:presence": ["subscribe", "presence"],
      },
      // ttl: 3600000, // Token ważny przez 1 godzinę  - domyślnie
      ttl: 60 * 1000, // Token ważny przez 1 minutę - do testów
    });

    return {
      statusCode: 200,
      body: JSON.stringify(tokenRequest),
    };
  } catch (error) {
    const err = error as Error;
    console.error("[auth-token] Error generating token:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to generate token",
        error: err.message,
      }),
    };
  }
};

module.exports = { handler };
