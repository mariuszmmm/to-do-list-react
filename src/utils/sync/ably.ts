import Ably from "ably";
import { getUserToken } from "../auth/getUserToken";
import { getOrCreateDeviceId } from "../storage/deviceId";

let ablyInstance: Ably.Realtime | null = null;
let pendingConfirmationEmail: string | null = null;

export const setPendingConfirmationEmail = (email: string | null) => {
  pendingConfirmationEmail = email;
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

export const getAblyInstance = (): Ably.Realtime => {
  if (!ablyInstance) {
    ablyInstance = new Ably.Realtime({
      authCallback: async (tokenParams, callback) => {
        try {
          const deviceId = getOrCreateDeviceId();
          const userToken = await getUserToken();

          if (userToken) {
            const email = getEmailFromToken(userToken);

            if (!email) {
              callback("User not authenticated - cannot extract email from token", null);
              return;
            }

            const response = await fetch(`/auth-ablyAuth?deviceId=${deviceId}`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            });

            if (!response.ok) {
              const errorData = await response.json();
              callback(errorData.message || response.statusText, null);
              return;
            }

            const ablyTokenRequest = await response.json();
            callback(null, ablyTokenRequest);
            return;
          }

          const pendingEmail = getPendingConfirmationEmail();

          if (!pendingEmail) {
            callback("No token available", null);
            return;
          }

          const response = await fetch(`/auth-ablyAuth?email=${pendingEmail}&deviceId=${deviceId}`, { method: "GET" });

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
    }
  }
};

const withTimeout = async <T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> => {
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

export const safeDetachChannel = async (channel: Ably.RealtimeChannel, timeoutMs = 3000) => {
  try {
    await withTimeout(channel.detach(), timeoutMs, "Channel detach");
  } catch (err) {
    if (err instanceof Error && err.message.includes("timeout")) {
      console.warn("[Ably] detach timeout, proceeding: ", err.message);
      return;
    }
    if (err instanceof Error && err.message.includes("superseded")) {
      return;
    }
    if (err instanceof Error && err.message.includes("Connection closed")) {
      return;
    }
    console.error("[Ably] detach error:", err);
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
    if (err instanceof Error && err.message.includes("timeout")) {
      console.warn("[Ably] presence leave timeout, proceeding: ", err.message);
      return;
    }
    if (
      err instanceof Error &&
      (err.message.includes("detached") || err.message.includes("Channel operation failed"))
    ) {
      return;
    }
    if (err instanceof Error && err.message.includes("Connection closed")) {
      return;
    }
    if (typeof err === "object" && err !== null && "message" in err) {
      const errorMessage = String(err.message);
      if (errorMessage.includes("Connection closed")) {
        return;
      }
    }
    console.error("[Ably] presence leave error:", err);
  }
};
