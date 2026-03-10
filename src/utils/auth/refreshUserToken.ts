import { auth } from "../../api/auth";
import { syncToIndexedDB } from "../storage/storageSync";

export const refreshUserToken = async () => {
  const user = auth.currentUser();

  const waitingForConfirmation = sessionStorage.getItem(
    "waitingForConfirmation",
  );
  if (waitingForConfirmation) {
    return null;
  }

  try {
    if (!user) {
      // Jeśli nie ma użytkownika, nie ma sensu odświeżać ani przeładowywać strony
      return null;
    }
    const token = await user.jwt();
    return token;
  } catch (error: any) {
    console.error("[refreshUserToken] Błąd podczas odświeżania tokena:", error);

    // Przeładowujemy tylko jeśli mamy stan błędu sugerujący nieaktualną sesję
    // i faktycznie mamy kogo wylogować.
    if (user && (error.status === 401 || error.status === 400)) {
      const email = user.email;
      try {
        if (email) {
          sessionStorage.setItem("session_expired_email", email);
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
        }
        localStorage.removeItem("gotrue.user");
        window.location.reload();
      }
    }
    return null;
  }
};
