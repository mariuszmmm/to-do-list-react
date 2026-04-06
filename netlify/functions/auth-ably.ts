import type { Handler } from "@netlify/functions";
import * as Ably from "ably";
import { jsonResponse, logError } from "../shared/lib/response";
import { checkHttpMethod, isUserAdmin } from "../shared/lib/validators";

const handler: Handler = async (event, context) => {
  const logPrefix = '[auth-ably]';

  const methodResponse = checkHttpMethod(event.httpMethod, "GET", logPrefix);
  if (methodResponse) return methodResponse;

  const emailParam = event.queryStringParameters?.email;
  const deviceId = event.queryStringParameters?.deviceId;

  const contextUser = context?.clientContext?.user;
  const isAuthenticated = contextUser !== undefined;

  // Bezpieczeństwo: Jeśli nie ma contextUser, dopuszczamy emailParam jako "pendingEmail",
  // ale wtedy przyznajemy TYLKO uprawnienia do kanału potwierdzenia.
  const email = (contextUser?.email || emailParam)
    ?.toLowerCase()
    .trim();

  // Rozszerzona detekcja admina dla środowiska lokalnego i głównego usera
  const isAdmin = isUserAdmin(context) || email === "mariuszmmm@op.pl";

  console.log(
    `${logPrefix} Auth check: email=${email}, isAuthenticated=${isAuthenticated}, isAdmin=${isAdmin}`,
  );

  if (!email) {
    return jsonResponse(401, { message: "Missing email" });
  }

  if (!deviceId) {
    return jsonResponse(400, { message: "DeviceId is required" });
  }

  try {
    const ably = new Ably.Rest({
      key: process.env.ABLY_API_KEY,
      queryTime: true,
    });

    const serverTime = await ably.time();
    const uniqueClientId = `${email}:${deviceId}`;

    // Definiujemy uprawnienia w zależności od statusu autentykacji
    let capability: any = {};

    if (isAuthenticated) {
      // Pełne uprawnienia dla zalogowanego użytkownika
      capability = {
        [`user:${email}:lists`]: ["subscribe", "publish", "history"],
        [`user:${email}:confirmation`]: ["subscribe", "publish"],
        [`user:${email}:presence`]: ["subscribe", "presence"],
        "global:presence-admins": ["subscribe", "presence"],
      };

      if (isAdmin) {
        capability["system:logs"] = ["subscribe"];
      }
    } else {
      // Ograniczone uprawnienia dla użytkownika oczekującego na potwierdzenie (niezalogowanego)
      capability = {
        [`user:${email}:confirmation`]: ["subscribe"],
      };
    }

    const tokenRequest = await ably.auth.createTokenRequest({
      clientId: uniqueClientId,
      capability: capability,
      ttl: 3600000,
      timestamp: serverTime,
    });

    return jsonResponse(200, tokenRequest as any);
  } catch (error) {
    logError("Error generating token", error, logPrefix);
    return jsonResponse(500, { message: "Failed to generate token" });
  }
};

export { handler };
