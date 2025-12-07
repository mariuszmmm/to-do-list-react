import { auth } from "../api/auth";
import { isTokenValid } from "./tokenUtils";

export const getUserToken = async () => {
  const user = auth.currentUser();

  if (!user || !user.token) {
    return null;
  }

  const refreshToken = async () => {
    try {
      const user = auth.currentUser();
      if (!user) {
        throw new Error("No user found");
      }
      const token = await user.jwt();
      return token;
    } catch (error) {
      console.error("Error renewing token", error);
      return null;
    }
  };

  // Sprawdź czy token jest jeszcze ważny (z buforem 60s)
  if (!isTokenValid(user, 60000)) {
    return await refreshToken();
  } else {
    return user.token.access_token;
  }
};
