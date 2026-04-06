import * as Ably from "ably";
import { getUserToken } from "../auth/getUserToken";
import { getOrCreateDeviceId } from "../storage/deviceId";

let ablyInstance: Ably.Realtime | null = null;
let pendingConfirmationEmail: string | null = null;

export const setPendingConfirmationEmail = (email: string | null) => {
  pendingConfirmationEmail = email ? email.toLowerCase().trim() : null;
};

const getPendingConfirmationEmail = () => pendingConfirmationEmail;

const getEmailFromToken = (token: string): string | null => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload.email || null;
  } catch (err) {
    console.error("[getEmailFromToken] Error decoding token:", err);
    return null;
  }
};

let currentAblyEmail: string | null = null;

export const getAblyInstance = (): Ably.Realtime => {
  const userToken = localStorage.getItem("gotrue.user")
    ? JSON.parse(localStorage.getItem("gotrue.user")!).token?.access_token
    : null;
  const rawEmail = userToken ? getEmailFromToken(userToken) : null;
  const email = rawEmail?.toLowerCase().trim() || null;

  // Jeśli użytkownik się zmienił, zamknij stare połączenie
  if (ablyInstance && email !== currentAblyEmail) {
    closeAblyConnection();
  }

  if (!ablyInstance) {
    currentAblyEmail = email;
    ablyInstance = new Ably.Realtime({
      queryTime: true,
      authCallback: async (tokenParams, callback) => {
        try {
          const deviceId = getOrCreateDeviceId();
          const userToken = await getUserToken();

          if (userToken) {
            const rawEmail = getEmailFromToken(userToken);
            const email = rawEmail?.toLowerCase().trim();

            if (!email) {
              callback(
                "User not authenticated - cannot extract email from token",
                null,
              );
              return;
            }

            const response = await fetch(
              `/auth-ably?deviceId=${deviceId}&email=${encodeURIComponent(email)}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${userToken}`,
                },
              },
            );

            if (!response.ok) {
              const errorData = await response.json();
              callback(errorData.message || response.statusText, null);
              return;
            }

            const ablyTokenRequest = await response.json();
            callback(null, ablyTokenRequest);
            return;
          }

          const pendingEmail = getPendingConfirmationEmail()?.toLowerCase().trim();

          if (!pendingEmail) {
            callback("No token available", null);
            return;
          }

          const response = await fetch(
            `/auth-ably?email=${encodeURIComponent(pendingEmail)}&deviceId=${deviceId}`,
            { method: "GET" },
          );

          if (!response.ok) {
            const errorData = await response.json();
            callback(errorData.message || response.statusText, null);
            return;
          }

          const ablyTokenRequest = await response.json();
          callback(null, ablyTokenRequest);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : String(err);
          callback(errorMessage, null);
        }
      },
    });
  }

  return ablyInstance;
};

export const closeAblyConnection = () => {
  if (ablyInstance) {
    try {
      ablyInstance.close();
    } catch (err) {
      console.error("[Ably] Error closing connection:", err);
    } finally {
      ablyInstance = null;
      currentAblyEmail = null;
    }
  }
};

const withTimeout = async <T>(
  promise: Promise<T>,
  timeoutMs: number,
  label: string,
): Promise<T> => {
  let timeoutId: NodeJS.Timeout | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error(`${label} timeout after ${timeoutMs}ms`));
        }, timeoutMs);
      }),
    ]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
};

export const isAblyErrorSilent = (err: any): boolean => {
  const errorMsg =
    err instanceof Error ? err.message : typeof err === "string" ? err : "";

  if (!errorMsg) {
    if (typeof err === "object" && err !== null && "message" in err) {
      return isAblyErrorSilent(err.message);
    }
    return false;
  }

  return (
    errorMsg.includes("timeout") ||
    errorMsg.includes("superseded") ||
    errorMsg.includes("Connection closed") ||
    errorMsg.includes("detached") ||
    errorMsg.includes("detaching") ||
    errorMsg.includes("Channel operation failed") ||
    errorMsg.includes("attach") || // catch "Unable to attach"
    errorMsg.includes("reason unknown")
  );
};

export const safeDetachChannel = async (
  channel: Ably.RealtimeChannel,
  timeoutMs = 3000,
) => {
  try {
    // If connection is already closing or closed, detaching is not needed/possible
    const connectionState =
      (channel as any).realtime?.connection?.state ||
      (channel as any).ably?.connection?.state;
    if (connectionState === "closing" || connectionState === "closed") {
      return;
    }

    // If channel is already detached or detaching, don't do anything
    if (
      channel.state === "detached" ||
      channel.state === "detaching" ||
      channel.state === "failed"
    ) {
      return;
    }

    // Wrap the call to handle potential synchronous throws from Ably v2
    const detachPromise = (async () => {
      try {
        return await channel.detach();
      } catch (e) {
        // Re-throw to be caught by withTimeout's catch
        throw e;
      }
    })();

    await withTimeout(detachPromise, timeoutMs, "Channel detach");
  } catch (err) {
    if (isAblyErrorSilent(err)) {
      return;
    }
    console.warn("[Ably] silent detach error:", err);
  }
};

export const safePresenceLeave = async (
  presence: Ably.RealtimePresence,
  data?: Record<string, unknown>,
  timeoutMs = 3000,
) => {
  try {
    await withTimeout(presence.leave(data), timeoutMs, "Presence leave");
  } catch (err) {
    if (isAblyErrorSilent(err)) {
      return;
    }
    console.error("[Ably] presence leave error:", err);
  }
};
