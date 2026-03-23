import type { Handler } from "@netlify/functions";
import axios from "axios";
import { jsonResponse } from "../functions/lib/response";
import {
  checkHttpMethod,
  parseJsonBody,
  isUserAdmin,
} from "../functions/lib/validators";
import { connectToDB } from "../config/mongoose";
import SystemConfig from "../models/SystemConfig";
import UserData from "../models/UserData";
import { publishSystemLog } from "../functions/lib/ablyHelper";

export const handler: Handler = async (event, context) => {
  const logPrefix = "[user-invite]";

  const logSystemEvent = async (
    status: "success" | "error",
    details?: string,
    stats?: any,
  ) => {
    try {
      await connectToDB();
      const timestamp = new Date().toISOString();
      const value = { status, details, stats, timestamp };

      await SystemConfig.create({
        key: `log_user_invite_${Date.now()}`,
        value,
        updatedAt: new Date(),
      });

      await publishSystemLog({
        key: "log_user_invite",
        status,
        details,
        timestamp,
        stats,
      });
    } catch (err) {
      console.error(`${logPrefix} Failed to log system event:`, err);
    }
  };

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

    // Aktualizacja statusu w MongoDB, aby użytkownik nie był już "deleted"
    try {
      await connectToDB();
      const dbUser = await UserData.findOne({ email: email.toLowerCase().trim() });
      if (dbUser) {
        console.log(`${logPrefix} Updating DB user ${email} status to 'pending'`);
        await UserData.updateOne(
          { email: email.toLowerCase().trim() },
          { account: "pending" }
        );
      }
    } catch (dbError) {
      console.error(`${logPrefix} Failed to update user status in DB:`, dbError);
      // Nie przerywamy, bo zaproszenie w Identity poszło pomyślnie
    }

    await logSystemEvent("success", `Successfully invited user: ${email}`, { email });

    return jsonResponse(200, {
      message: "Invitation sent successfully",
      data: response.data,
    });
  } catch (error: any) {
    const errorData = error?.response?.data;
    const errorStatus = error?.response?.status || 500;

    // Specjalna procedura dla błędu 422 - zaproszenie było już wysłane, ale użytkownik go nie potwierdził
    if (
      errorStatus === 422 &&
      errorData?.msg === "Email address already registered by another user"
    ) {
      try {
        console.log(`${logPrefix} Checking if user ${email} is unconfirmed to resend invite...`);
        // Wyszukaj użytkowników korzystając z admin API
        const listResponse = await axios.get(`${url}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const users = listResponse.data?.users || [];
        const existingUser = users.find((u: any) => u.email === email);

        // Jeśli użytkownik istnieje i nie skonsumował linku potwierdzającego:
        if (existingUser && !existingUser.confirmed_at) {
          console.log(`${logPrefix} Unconfirmed user found. Deleting ID: ${existingUser.id} to regenerate invite...`);
          
          // Usunięcie niepotwierdzonego użytkownika
          await axios.delete(`${url}/admin/users/${existingUser.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          // Wyślij zaproszenie ponownie
          const retryResponse = await axios({
            method: "POST",
            url: `${url}/invite`,
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            data: { email },
          });

          console.log(`${logPrefix} Re-invite sent successfully to ${email}`);

          // Aktualizacja statusu w MongoDB również w ścieżce re-invite
          try {
            await connectToDB();
            const dbUser = await UserData.findOne({ email: email.toLowerCase().trim() });
            if (dbUser) {
              console.log(`${logPrefix} Updating DB user ${email} status to 'pending' (retry path)`);
              await UserData.updateOne(
                { email: email.toLowerCase().trim() },
                { account: "pending" }
              );
            }
          } catch (dbError) {
            console.error(`${logPrefix} Failed to update user status in DB (retry path):`, dbError);
          }

          await logSystemEvent("success", `Resent invitation to unconfirmed user: ${email}`, { email, isResend: true });

          return jsonResponse(200, {
            message: "Invitation resent successfully",
            data: retryResponse.data,
          });
        } else if (existingUser && existingUser.confirmed_at) {
          console.log(`${logPrefix} Discarding retry mapping. User is already fully confirmed.`);
        }
      } catch (retryError: any) {
        console.error(`${logPrefix} Failed to resend invite / delete old unconfirmed user account:`, retryError?.response?.data || retryError.message);
        // W przypadku błędu procedury naprawczej, puszczamy pierwotny błąd 422 niżej
      }
    }

    console.error(`${logPrefix} Error status = ${errorStatus}`);
    console.error(`${logPrefix} Error data:`, JSON.stringify(errorData || {}));
    console.error(`${logPrefix} axios message: ${error.message}`);

    // Specjalna obsługa 401/403 z GoTrue - to najczęstszy powód problemów w produkcji/dev
    if (errorStatus === 401 || errorStatus === 403) {
      await logSystemEvent("error", `Identity server rejected invitation for ${email}`, { error: errorData || error.message });
      return jsonResponse(errorStatus, {
        message:
          "Identity server rejected the invitation. This usually means your token is invalid or lacks 'admin' role.",
        error: errorData,
      });
    }

    await logSystemEvent("error", `Failed to send invitation to ${email}`, { error: errorData || error.message });
    return jsonResponse(errorStatus, {
      message: "Failed to send invitation. Check server logs.",
      error: errorData || error.message,
    });
  }
};
