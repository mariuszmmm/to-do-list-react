import { auth } from "../../api/auth";
import { syncToIndexedDB } from "../storage/storageSync";
import { saveCurrentAccount, markSessionAsExpired } from "./multiAccount";

let refreshPromise: Promise<string | null> | null = null;

export const refreshUserToken = async () => {
  // Jeśli odświeżanie jest już w toku, zwróć istniejący promise
  if (refreshPromise) {
    return refreshPromise;
  }

  const user = auth.currentUser();

  const waitingForConfirmation = sessionStorage.getItem(
    "waitingForConfirmation",
  );
  if (waitingForConfirmation) {
    return null;
  }

  refreshPromise = (async () => {
    try {
      if (!user) {
        // Jeśli nie ma użytkownika, nie ma sensu odświeżać ani przeładowywać strony
        return null;
      }
      const token = await user.jwt();

      // Po udanym odświeżeniu, aktualizujemy dane w multi-account storage,
      // aby zapisać nowo wygenerowany (zrotowany) refresh token.
      saveCurrentAccount();

      return token;
    } catch (error: any) {
      console.error(
        "[refreshUserToken] Błąd podczas odświeżania tokena:",
        error,
      );

      // Przeładowujemy tylko jeśli mamy stan błędu sugerujący nieaktualną sesję
      // i faktycznie mamy kogo wylogować.
      if (user && (error.status === 401 || error.status === 400)) {
        const email = user.email;
        try {
          if (email) {
            sessionStorage.setItem("session_expired_email", email);
            markSessionAsExpired(email);
          }
          await user.logout();
          await syncToIndexedDB("gotrue.user", null);
          window.location.reload();
        } catch (logoutError) {
          console.error(
            "[refreshUserToken] Błąd podczas wylogowywania:",
            logoutError,
          );
          // Na wypadek zawieszenia logoutu, usuwamy dane ręcznie i przeładowujemy
          if (email) {
            sessionStorage.setItem("session_expired_email", email);
            markSessionAsExpired(email);
          }
          localStorage.removeItem("gotrue.user");
          window.location.reload();
        }
      }
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};
