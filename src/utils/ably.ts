import Ably from "ably";
import { getUserToken } from "./getUserToken";

let ablyInstance: Ably.Realtime | null = null;

export const getAblyInstance = (): Ably.Realtime => {
  if (!ablyInstance) {
    ablyInstance = new Ably.Realtime({
      authCallback: async (tokenParams, callback) => {
        try {
          const userToken = await getUserToken();
          const response = await fetch("/auth-token", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          });

          if (!response.ok) {
            throw new Error(response.statusText);
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
