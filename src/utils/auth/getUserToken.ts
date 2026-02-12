import { auth } from "../../api/auth";
import { refreshUserToken } from "./refreshUserToken";
import { getTokenExpiresIn } from "./tokenUtils";

export const getUserToken = async () => {
  const user = auth.currentUser();

  if (!user || !user.token) {
    return await refreshUserToken();
  }

  const remainingMs = getTokenExpiresIn(user);
  const remainingSeconds = Math.floor(remainingMs / 1000);

  process.env.NODE_ENV === "development" &&
    console.log(
      `[getUserToken] Remaining token time: ${remainingSeconds} seconds (${new Date(
        Date.now() + remainingMs,
      ).toISOString()})`,
    );

  if (remainingMs <= 0) {
    return await refreshUserToken();
  }

  return user.token.access_token;
};
