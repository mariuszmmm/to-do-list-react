import type { Handler } from "@netlify/functions";
import * as Ably from "ably";
import { jsonResponse, logError } from "../functions/lib/response";
import { checkHttpMethod, isUserAdmin } from "../functions/lib/validators";

const handler: Handler = async (event, context) => {
  const logPrefix = "[ably-auth]";

  const methodResponse = checkHttpMethod(event.httpMethod, "GET", logPrefix);
  if (methodResponse) return methodResponse;

  const emailParam = event.queryStringParameters?.email;
  const deviceId = event.queryStringParameters?.deviceId;
  
  const contextUser = context?.clientContext?.user;
  const isAuthenticated = contextUser !== undefined;
  
  // Bezpieczeństwo: W produkcji ufamy TYLKO e-mailowi z tokenu (contextUser).
  // Parametr emailParam dopuszczamy tylko lokalnie dla ułatwienia debugowania/dev.
  const isLocalDev = process.env.NETLIFY_DEV === "true" || process.env.NODE_ENV === "development";
  const email = (contextUser?.email || (isLocalDev ? emailParam : null))?.toLowerCase().trim();
  
  // Rozszerzona detekcja admina dla środowiska lokalnego i głównego usera
  const isAdmin = isUserAdmin(context) || (email === "mariuszzmmm@op.pl" || email === "poradyserwisowe@op.pl" || email === "naprawaprzemysl@gmail.com");

  console.log(`${logPrefix} Auth check: email=${email}, isAuthenticated=${isAuthenticated}, isAdmin=${isAdmin}`);

  if (!email) {
    return jsonResponse(401, { message: "Missing email" });
  }

  if (!deviceId) {
    return jsonResponse(400, { message: "DeviceId is required" });
  }

  try {
    const ably = new Ably.Rest({ 
      key: process.env.ABLY_API_KEY,
      queryTime: true 
    });
    
    const serverTime = await ably.time();
    const uniqueClientId = `${email}:${deviceId}`;
    
    const capability: any = {
      [`user:${email}:lists`]: ["subscribe", "publish", "history"],
      [`user:${email}:confirmation`]: ["subscribe", "publish"],
      [`user:${email}:presence`]: ["subscribe", "presence"],
      "global:presence-admins": ["subscribe", "presence"],
    };

    if (isAdmin) {
      capability["system:logs"] = ["subscribe"];
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
