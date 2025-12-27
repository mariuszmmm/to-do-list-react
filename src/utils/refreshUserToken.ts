import { auth } from "../api/auth";
import { saveAutoRefreshSettingInLocalStorage } from "./localStorage";

export const refreshUserToken = async () => {
  const user = auth.currentUser();

  try {
    if (!user) {
      throw new Error("No user found");
    }
    const token = await user.jwt();
    process.env.NODE_ENV === "development" &&
      console.log("[refreshUserToken] Token odświeżony pomyślnie", {
        expiresIn: user.token?.expires_in,
        expiresAt: new Date(user.token?.expires_at || 0).toLocaleString(),
      });
    return token;
  } catch (error: any) {
    console.error("[refreshUserToken] Błąd podczas odświeżania tokena:", error);
    if (error.status === 401 || error.message === "No user found") {
      process.env.NODE_ENV === "development" &&
        console.log(
          "[refreshUserToken] Wylogowywanie użytkownika z powodu błędu 401"
        );
      await user?.logout();
      saveAutoRefreshSettingInLocalStorage(false);
      window.location.reload();
    }
    return null;
  }
};
