import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "./redux";
import {
  selectLoggedUserEmail,
  setLoggedUser,
  setAccountMode,
} from "../features/AccountPage/accountSlice";
import { openModal } from "../Modal/modalSlice";
import { auth } from "../api/auth";
import { getTokenExpiresIn } from "../utils/tokenUtils";
import { getAutoRefreshSettingFromLocalStorage } from "../utils/localStorage";

/**
 * Hook który monitoruje ważność tokena bezpośrednio z auth.currentUser()
 * i wylogowuje użytkownika gdy token wygaśnie
 * Sprawdza co 5 sekund
 */
export const useTokenValidation = () => {
  const dispatch = useAppDispatch();
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);
  const hasReceivedValidTokenRef = useRef(false);
  const validationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false);

  useEffect(() => {
    if (!loggedUserEmail) {
      // Użytkownik się wylogował, resetuj flag i wyczyść interwał
      hasReceivedValidTokenRef.current = false;
      if (validationIntervalRef.current) {
        clearInterval(validationIntervalRef.current);
        validationIntervalRef.current = null;
      }
      return;
    }

    // Funkcja sprawdzająca ważność tokena
    const checkTokenValidity = () => {
      const user = auth.currentUser();
      if (!user) {
        return;
      }

      const tokenRemainingMs = getTokenExpiresIn(user);

      // Poczekaj na pierwszy ważny token (> 0)
      if (tokenRemainingMs > 0) {
        hasReceivedValidTokenRef.current = true;
      }

      // Nie wylogowujemy przy wygaśnięciu access tokena
      // Wylogowanie nastąpi tylko gdy refresh token wylegnie/stanie się nieważny
      // (błąd w user.jwt() w getUserToken)
      if (hasReceivedValidTokenRef.current && tokenRemainingMs <= 0) {
        const autoRefreshEnabled = getAutoRefreshSettingFromLocalStorage();

        if (autoRefreshEnabled) {
          // Automatyczne odświeżenie tokena
          if (process.env.NODE_ENV === "development") {
            process.env.NODE_ENV === "development" &&
              console.log(
                "[useTokenValidation] Access token wygasł lokalnie - próbuję odświeżyć token (auto-refresh włączony)"
              );
          }

          // Odśwież token tylko raz na cykl, by uniknąć spamu
          if (!isRefreshingRef.current) {
            isRefreshingRef.current = true;
            user
              .jwt()
              .catch((error) => {
                console.error(
                  "[useTokenValidation] Błąd przy automatycznym odświeżeniu tokena:",
                  error
                );
                // W razie błędu getUserToken i tak zwróci null i wywoła ścieżkę onError/modal
              })
              .finally(() => {
                isRefreshingRef.current = false;
              });
          }
        } else {
          // Strict mode - wylogowanie na wygaśnięcie tokena
          if (process.env.NODE_ENV === "development") {
            process.env.NODE_ENV === "development" &&
              console.log(
                "[useTokenValidation] Access token wygasł lokalnie - wylogowuję (auto-refresh wyłączony)"
              );
          }

          if (!isRefreshingRef.current) {
            isRefreshingRef.current = true;
            user
              .logout()
              .catch((error) => {
                console.error(
                  "[useTokenValidation] Błąd przy wylogowaniu:",
                  error
                );
              })
              .finally(() => {
                dispatch(setLoggedUser(null));
                dispatch(setAccountMode("login"));
                dispatch(
                  openModal({
                    title: { key: "modal.logout.title" },
                    message: { key: "modal.logout.message.success" },
                    type: "info",
                  })
                );
                isRefreshingRef.current = false;
              });
          }
        }
      }
    };

    // Sprawdź natychmiast
    checkTokenValidity();

    // Sprawdzaj co 5 sekund
    validationIntervalRef.current = setInterval(checkTokenValidity, 5000);

    return () => {
      if (validationIntervalRef.current) {
        clearInterval(validationIntervalRef.current);
        validationIntervalRef.current = null;
      }
    };
  }, [loggedUserEmail, dispatch]);
};
