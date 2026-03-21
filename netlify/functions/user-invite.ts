import type { Handler } from "@netlify/functions";
import axios from "axios";
import { jsonResponse } from "../functions/lib/response";
import {
  checkHttpMethod,
  parseJsonBody,
  isUserAdmin,
} from "../functions/lib/validators";

export const handler: Handler = async (event, context) => {
  const logPrefix = "[user-invite]";

  // 1. Sprawdź metodę HTTP
  const methodResponse = checkHttpMethod(event.httpMethod, "POST", logPrefix);
  if (methodResponse) return methodResponse;

  // 2. Sprawdź kontekst Identity
  const identity = context.clientContext?.identity;
  const contextUser = context.clientContext?.user;

  if (!identity || !identity.token || !identity.url) {
    console.warn(`${logPrefix} No identity context found`);
    return jsonResponse(401, {
      message: "Netlify Identity context is missing.",
    });
  }

  // 3. Parsuj body
  const bodyData = parseJsonBody<{ email: string }>(event.body, logPrefix);

  // Jeśli parseJsonBody zwrócił HandlerResponse (błąd), to znaczy że jest błąd
  if (bodyData && typeof bodyData === "object" && "statusCode" in bodyData) {
    return bodyData as any;
  }

  const { email } = bodyData as { email: string };
  if (!email) {
    return jsonResponse(400, { message: "Email is required." });
  }

  // 4. Autoryzacja Admina (zgodnie z auth-ablyAuth.ts)
  const userEmail = contextUser?.email?.toLowerCase().trim();
  const isAdmin = isUserAdmin(context) || userEmail === "mariuszmmm@op.pl";

  if (!isAdmin) {
    console.warn(`${logPrefix} User ${userEmail} is not an admin`);
    return jsonResponse(403, {
      message: "Only administrators can invite users.",
    });
  }

  const { token, url } = identity;

  console.log(`${logPrefix} Processed by user: ${userEmail}`);
  console.log(`${logPrefix} Sending invite to: ${email}`);
  console.log(`${logPrefix} Target Identity URL: ${url}/invite`);

  try {
    // Uwaga: W środowisku produkcyjnym musimy upewnić się, że token przekazywany przez frontend
    // ma uprawnienia administratora w systemie Identity (role 'admin').
    const response = await axios({
      method: "POST",
      url: `${url}/invite`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: {
        email,
      },
    });

    console.log(`${logPrefix} Invite sent successfully to ${email}`);

    return jsonResponse(200, {
      message: "Invitation sent successfully",
      data: response.data,
    });
  } catch (error: any) {
    const errorData = error?.response?.data;
    const errorStatus = error?.response?.status || 500;

    console.error(`${logPrefix} Error status = ${errorStatus}`);
    console.error(`${logPrefix} Error data:`, JSON.stringify(errorData || {}));
    console.error(`${logPrefix} axios message: ${error.message}`);

    // Specjalna obsługa 401/403 z GoTrue - to najczęstszy powód problemów w produkcji/dev
    if (errorStatus === 401 || errorStatus === 403) {
      return jsonResponse(errorStatus, {
        message:
          "Identity server rejected the invitation. This usually means your token is invalid or lacks 'admin' role.",
        error: errorData,
      });
    }

    return jsonResponse(errorStatus, {
      message: "Failed to send invitation. Check server logs.",
      error: errorData || error.message,
    });
  }
};
