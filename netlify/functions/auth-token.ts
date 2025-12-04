// netlify/functions/auth-token.ts
import type { Handler } from "@netlify/functions";
import Ably from "ably";

const handler: Handler = async (event, context) => {
  // Sprawdź czy użytkownik jest uwierzytelniony
  if (!context.clientContext || !context.clientContext.user) {
    console.log("Unauthorized - Missing client context");
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Unauthorized" }),
    };
  }

  const { email }: { email: string } = context.clientContext.user;
  console.log("Generating token for user:", email);

  try {
    // Utwórz klienta Ably z kluczem API (tylko server-side!)
    const ably = new Ably.Rest({
      key: process.env.ABLY_API_KEY,
    });

    // Wygeneruj TokenRequest z odpowiednimi uprawnieniami
    const tokenRequest = await ably.auth.createTokenRequest({
      clientId: email,
      capability: {
        [`user:${email}:lists`]: ["subscribe", "presence"],
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify(tokenRequest),
    };
  } catch (error) {
    const err = error as Error;
    console.error("Error generating token:", err);
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
