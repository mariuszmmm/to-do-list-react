import { auth } from "../api/auth";
import { getTokenExpiresIn } from "./tokenUtils";

export const getUserToken = async () => {
  const user = auth.currentUser();

  if (!user || !user.token) {
    process.env.NODE_ENV === "development" &&
      console.log("[getUserToken] Brak użytkownika lub tokena");
    return null;
  }

  const refreshToken = async () => {
    try {
      const user = auth.currentUser();
      if (!user) {
        throw new Error("No user found");
      }
      const token = await user.jwt();
      process.env.NODE_ENV === "development" &&
        console.log("[getUserToken] Token odświeżony pomyślnie", {
          expiresIn: user.token?.expires_in,
          expiresAt: new Date(user.token?.expires_at || 0).toLocaleString(),
        });
      return token;
    } catch (error) {
      console.error("[getUserToken] Błąd podczas odświeżania tokena:", error);
      return null;
    }
  };

  // Odśwież token tylko jeśli wygasł lokalnie
  const remainingMs = getTokenExpiresIn(user);
  process.env.NODE_ENV === "development" &&
    console.log(
      "[getUserToken] Pozostały czas ważności tokena (ms):",
      remainingMs
    );

  if (remainingMs <= 0) {
    process.env.NODE_ENV === "development" &&
      console.log("[getUserToken] Token wygasł, próba odświeżenia");
    return await refreshToken();
  }

  return user.token.access_token;
};
