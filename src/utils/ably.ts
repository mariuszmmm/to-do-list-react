import Ably from "ably";
import { getUserToken } from "./getUserToken";
import { getOrCreateDeviceId } from "./deviceId";
import { auth } from "../api/auth";

let ablyInstance: Ably.Realtime | null = null;

export const getAblyInstance = (): Ably.Realtime => {
  if (!ablyInstance) {
    ablyInstance = new Ably.Realtime({
      authCallback: async (tokenParams, callback) => {
        try {
          const userToken = await getUserToken();
          const email = auth.currentUser()?.email;

          if (!email) {
            callback("User not authenticated", null);
            return;
          }

          const deviceId = getOrCreateDeviceId();
          const response = await fetch(`/ably-auth?deviceId=${deviceId}`, {
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
    ablyInstance.close();
    ablyInstance = null;
  }
};
