import { useEffect, useRef, useCallback } from "react";
import { useAppSelector } from "./redux";
import { selectLoggedUserEmail } from "../features/AccountPage/accountSlice";
import { auth } from "../api/auth";
import { getTokenExpiresIn } from "../utils/tokenUtils";

/**
 * Hook który proaktywnie odnawia token przed jego wygaśnięciem
 * Odnawianie następuje 5 minut przed faktycznym wygaśnięciem
 * Sprawdza ważność tokena bezpośrednio z auth.currentUser()
 * Zapewnia, że użytkownik nigdy nie zostanie wylogowany podczas aktywnego użytku aplikacji
 */
export const useTokenRefresh = () => {
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

  // Effect do zarządzania odnawianiem tokena
  useEffect(() => {
    if (!loggedUserEmail) {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }
      return;
    }

    // Funkcja sprawdzająca czy czas na refresh
    const checkAndScheduleRefresh = () => {
      const user = auth.currentUser();
      if (!user) {
        return;
      }

      const tokenRemainingMs = getTokenExpiresIn(user);

      // Jeśli token wygasł, nic nie rób (useTokenValidation wyloguje)
      if (tokenRemainingMs <= 0) {
        return;
      }

      // Odnawiaj 5 minut (300000ms) przed wygaśnięciem
      const refreshThreshold = 300000;
      const timeUntilRefresh = tokenRemainingMs - refreshThreshold;

      // Jeśli już zaplanowano refresh, nie rób nic
      if (refreshTimeoutRef.current) {
        return;
      }

      if (timeUntilRefresh <= 0) {
        // Czas na refresh teraz
        refreshToken();
      } else if (timeUntilRefresh < 60000) {
        // Mniej niż minuta do refreshu, zaplanuj dokładny timeout
        refreshTimeoutRef.current = setTimeout(() => {
          refreshToken();
          refreshTimeoutRef.current = null;
        }, timeUntilRefresh);

        if (process.env.NODE_ENV === "development") {
          console.log(
            `Odnawianie tokena zaplanowane za ${Math.round(
              timeUntilRefresh / 1000
            )}s`
          );
        }
      }
    };

    // Sprawdź natychmiast
    checkAndScheduleRefresh();

    // Sprawdzaj co minutę czy czas na refresh
    checkIntervalRef.current = setInterval(checkAndScheduleRefresh, 60000);

    // Czyszczenie
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }
    };
  }, [loggedUserEmail, refreshToken]);
};
