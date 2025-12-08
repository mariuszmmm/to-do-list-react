import { useEffect, useRef, useCallback } from "react";
import { useAppSelector } from "./redux";
import {
  selectLoggedUserEmail,
  selectTokenRemainingMs,
} from "../features/AccountPage/accountSlice";
import { auth } from "../api/auth";

/**
 * Hook który proaktywnie odnawiać token przed jego wygaśnięciem
 * Odnawianie następuje 5 minut przed faktycznym wygaśnięciem
 * Czyta czas wygaśnięcia z Reduxu (useTokenCountdown)
 * Zapewnia, że użytkownik nigdy nie zostanie wylogowany podczas aktywnego użytku aplikacji
 */
export const useTokenRefresh = () => {
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);
  const tokenRemainingMs = useAppSelector(selectTokenRemainingMs);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false);
  const lastScheduledTimeRef = useRef<number>(0);

  // Funkcja do odnawiania tokena - stabilna przez useCallback
  const refreshToken = useCallback(async () => {
    // Zapobiegaj wielokrotnym jednoczesnym odnawianiom
    if (isRefreshingRef.current) {
      return;
    }

    const user = auth.currentUser();
    if (!user) {
      return;
    }

    try {
      isRefreshingRef.current = true;
      await user.jwt();

      if (process.env.NODE_ENV === "development") {
        console.log("Token odświeżony pomyślnie");
      }
    } catch (error) {
      console.error("Błąd podczas odnawiania tokena:", error);
      // Token refresh nie udał się, ale useTokenValidation go wyloguje
    } finally {
      isRefreshingRef.current = false;
    }
  }, []);

  // Effect do zarządzania timeoutem odnawiania
  useEffect(() => {
    // Wyczyść stary timeout jeśli istnieje
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }

    // Jeśli użytkownik nie jest zalogowany lub token wygasł, nie planuj niczego
    if (!loggedUserEmail || tokenRemainingMs <= 0) {
      lastScheduledTimeRef.current = 0;
      return;
    }

    // Odnawiaj 5 minut (300000ms) przed wygaśnięciem
    const refreshThreshold = 300000;
    const timeUntilRefresh = tokenRemainingMs - refreshThreshold;

    // Zaokrąglij do pełnych sekund aby uniknąć aktualizowania timeout'u co ms
    const roundedTimeUntilRefresh = Math.max(
      0,
      Math.floor(timeUntilRefresh / 1000) * 1000
    );

    // Jeśli zaokrąglona wartość się nie zmieniła, nie aktualizuj timeout'u
    if (
      roundedTimeUntilRefresh === lastScheduledTimeRef.current &&
      roundedTimeUntilRefresh > 0
    ) {
      return;
    }

    lastScheduledTimeRef.current = roundedTimeUntilRefresh;

    if (roundedTimeUntilRefresh > 0) {
      // Token jest jeszcze ważny, zaplanuj odnawianie
      refreshTimeoutRef.current = setTimeout(() => {
        refreshToken();
      }, roundedTimeUntilRefresh);

      if (process.env.NODE_ENV === "development") {
        console.log(
          `Następne odnawianie tokena za ${Math.round(
            roundedTimeUntilRefresh / 1000
          )}s`
        );
      }
    } else if (timeUntilRefresh > 0) {
      // Token wygasa za mniej niż 1 sekundę, ale > 0, odnawiaj natychmiast
      refreshToken();
    }

    // Czyszczenie
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }
    };
  }, [loggedUserEmail, tokenRemainingMs, refreshToken]);
};
