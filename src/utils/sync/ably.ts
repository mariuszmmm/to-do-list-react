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
              callback(
                "User not authenticated - cannot extract email from token",
                null,
              );
              return;
            }

            const response = await fetch(
              `/auth-ablyAuth?deviceId=${deviceId}`,
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

          const pendingEmail = getPendingConfirmationEmail();

          if (!pendingEmail) {
            callback("No token available", null);
            return;
          }

          const response = await fetch(
            `/auth-ablyAuth?email=${pendingEmail}&deviceId=${deviceId}`,
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
    const errorMsg = err instanceof Error ? err.message : String(err);

    // Ignore harmless errors during cleanup
    if (
      errorMsg.includes("timeout") ||
      errorMsg.includes("superseded") ||
      errorMsg.includes("Connection closed") ||
      errorMsg.includes("detached") ||
      errorMsg.includes("detaching") ||
      errorMsg.includes("Channel operation failed") ||
      errorMsg.includes("attach") || // Catch "Unable to attach"
      errorMsg.includes("reason unknown")
    ) {
      return;
    }
    console.warn("[Ably] silent detach error:", errorMsg);
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
      (err.message.includes("detached") ||
        err.message.includes("Channel operation failed"))
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
