import { auth } from "../../api/auth";
import { refreshUserToken } from "./refreshUserToken";

export const getUserToken = async () => {
  const user = auth.currentUser();

  // Przywrócono standardowe zachowanie: odświeżamy tylko jeśli token faktycznie wygasł (remainingMs <= 0).
  // Korzystamy z refreshUserToken(), który posiada blokadę zapytań równoległych (refreshPromise).
  if (!user || !user.token) {
    return await refreshUserToken();
  }

  // Sprawdzamy czy token wygasł bez sztucznego bufora bezpieczeństwa.
  if (!user.token.expires_at || Date.now() >= user.token.expires_at) {
    return await refreshUserToken();
  }

  return user.token.access_token;
};
