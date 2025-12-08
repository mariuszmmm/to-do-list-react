import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "./redux";
import {
  selectLoggedUserEmail,
  setTokenRemainingMs,
} from "../features/AccountPage/accountSlice";
import { getTokenExpiresIn } from "../utils/tokenUtils";
import { auth } from "../api/auth";

/**
 * Hook który co 1 sekundę aktualizuje pozostały czas tokena w reduxie
 * Pozostałe komponenty czytają tę wartość za pomocą selectora
 */
export const useTokenCountdown = () => {
  const dispatch = useAppDispatch();
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!loggedUserEmail) {
      // Użytkownik nie jest zalogowany, wyczyść interwał
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
      dispatch(setTokenRemainingMs(0));
      return;
    }

    // Funkcja do aktualizacji countdownu
    const updateCountdown = () => {
      const user = auth.currentUser();
      if (!user) {
        dispatch(setTokenRemainingMs(0));
        return;
      }

      const remainingMs = getTokenExpiresIn(user);
      dispatch(setTokenRemainingMs(remainingMs));
    };

    // Aktualizuj natychmiast
    updateCountdown();

    // Aktualizuj co 1 sekundę
    countdownIntervalRef.current = setInterval(updateCountdown, 1000);

    // Czyszczenie
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    };
  }, [loggedUserEmail, dispatch]);
};
