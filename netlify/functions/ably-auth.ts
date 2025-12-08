// netlify/functions/ably-auth.ts
import type { Handler } from "@netlify/functions";
import Ably from "ably";

const handler: Handler = async (event, context) => {
  // Sprawdź czy użytkownik jest uwierzytelniony
  if (!context.clientContext || !context.clientContext.user) {
    console.log("[ably-auth] Unauthorized - Missing client context");
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
    "[ably-auth] Generating token for user:",
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
        [`user:${email}:confirmation`]: ["subscribe"],
        "global:presence": ["subscribe", "presence"],
      },
      ttl: 3600000,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(tokenRequest),
    };
  } catch (error) {
    const err = error as Error;
    console.error("[ably-auth] Error generating token:", err);
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
