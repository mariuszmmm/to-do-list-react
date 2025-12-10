// netlify/functions/ably-auth.ts
import type { Handler } from "@netlify/functions";
import Ably from "ably";

const handler: Handler = async (event, context) => {
  // Pobierz email z query params (dla confirmation channel bez JWT)
  const emailParam = event.queryStringParameters?.email;
  const deviceId = event.queryStringParameters?.deviceId;

  // Sprawdź czy użytkownik jest uwierzytelniony (dla pełnych uprawnień)
  const isAuthenticated = context?.clientContext?.user !== undefined;
  const email = isAuthenticated
    ? context?.clientContext?.user?.email
    : emailParam;

  if (!email) {
    process.env.NODE_ENV === "development" &&
      console.log("[ably-auth] Unauthorized - Missing email");
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Missing email" }),
    };
  }

  if (!deviceId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "deviceId is required" }),
    };
  }

  process.env.NODE_ENV === "development" &&
    console.log(
      "[ably-auth] Generating token for user:",
      email,
      "device:",
      deviceId,
      "authenticated:",
      isAuthenticated
    );

  try {
    // Utwórz klienta Ably z kluczem API (tylko server-side!)
    const ably = new Ably.Rest({
      key: process.env.ABLY_API_KEY,
    });

    const uniqueClientId = `${email}:${deviceId}`;

    // Jeśli nie zalogowany, tylko confirmation channel
    const capability = isAuthenticated
      ? {
          [`user:${email}:lists`]: ["subscribe"] as const,
          [`user:${email}:confirmation`]: ["subscribe"] as const,
          "global:presence": ["subscribe", "presence"] as const,
        }
      : {
          // Tylko confirmation channel dla niezalogowanych
          [`user:${email}:confirmation`]: ["subscribe"] as const,
        };

    // Wygeneruj TokenRequest z odpowiednimi uprawnieniami
    const tokenRequest = await ably.auth.createTokenRequest({
      clientId: uniqueClientId,
      capability: capability as any,
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
