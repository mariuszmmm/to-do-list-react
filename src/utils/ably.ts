import Ably from "ably";
import { getUserToken } from "./getUserToken";

const ably = new Ably.Realtime({
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

export default ably;
