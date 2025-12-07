import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "./redux";
import {
  selectLoggedUserEmail,
  setLoggedUserEmail,
  setAccountMode,
} from "../features/AccountPage/accountSlice";
import { isTokenValid, getTokenExpiresIn } from "../utils/tokenUtils";
import { auth } from "../api/auth";
import { openModal } from "../Modal/modalSlice";

/**
 * Hook który monitoruje ważność tokena i wylogowuje użytkownika gdy token wygaśnie
 * Sprawdza ważność tokena okresowo i gdy użytkownik się zaloguje
 */
export const useTokenValidation = () => {
  const dispatch = useAppDispatch();
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!loggedUserEmail) {
      // Użytkownik nie jest zalogowany, wyczyść istniejący interwał
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
      return;
    }

    // Funkcja do sprawdzenia ważności tokena
    const checkTokenValidity = () => {
      const user = auth.currentUser();

      if (!user) {
        // Użytkownik zniknął z auth ale wciąż jest w stanie Redux
        dispatch(setLoggedUserEmail(null));
        dispatch(setAccountMode("login"));
        dispatch(
          openModal({
            message: { key: "modal.logout.message.success" },
            type: "info",
          })
        );
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
          checkIntervalRef.current = null;
        }
        return;
      }

      if (!isTokenValid(user)) {
        // Token wygasł
        console.warn("Token wygasł, wylogowywanie użytkownika");
        dispatch(setLoggedUserEmail(null));
        dispatch(setAccountMode("login"));
        dispatch(
          openModal({
            message: { key: "modal.logout.message.success" },
            type: "info",
          })
        );
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
          checkIntervalRef.current = null;
        }
      }
    };

    // Sprawdź natychmiast przy montowaniu
    checkTokenValidity();

    // Pobierz pozostały czas do wygaśnięcia tokena
    const user = auth.currentUser();
    if (user) {
      const expiresIn = getTokenExpiresIn(user);

      // Ustaw interwał do sprawdzenia ważności tokena
      // Sprawdzaj co minutę lub gdy token jest blisko wygaśnięcia (co będzie wcześniejsze)
      const checkInterval = Math.min(60000, Math.max(5000, expiresIn - 120000));
      checkIntervalRef.current = setInterval(checkTokenValidity, checkInterval);

      if (process.env.NODE_ENV === "development") {
        console.log(
          `Walidacja tokena będzie uruchamiana co ${checkInterval}ms`
        );
        console.log(`Token wygaśnie za ${expiresIn}ms`);
      }
    }

    // Czyszczenie
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
    };
  }, [loggedUserEmail, dispatch]);
};
