import { auth } from "../../api/auth";
import { refreshUserToken } from "./refreshUserToken";
import { getTokenExpiresIn } from "./tokenUtils";

export const getUserToken = async () => {
  const user = auth.currentUser();

  if (!user || !user.token) {
    process.env.NODE_ENV === "development" && console.log("[getUserToken] Brak użytkownika lub tokena");
    return await refreshUserToken();
  }

  const remainingMs = getTokenExpiresIn(user);
  const remainingSeconds = Math.floor(remainingMs / 1000);
  process.env.NODE_ENV === "development" &&
    console.log("[getUserToken] Pozostały czas ważności tokena (s):", remainingSeconds);

  if (remainingMs <= 0) {
    process.env.NODE_ENV === "development" && console.log("[getUserToken] Token wygasł, próba odświeżenia");
    return await refreshUserToken();
  }

  return user.token.access_token;
};
