import { auth } from "../api/auth";

export const refreshUserToken = async () => {
  try {
    const user = auth.currentUser();
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
  } catch (error) {
    console.error("[refreshUserToken] Błąd podczas odświeżania tokena:", error);
    return null;
  }
};
