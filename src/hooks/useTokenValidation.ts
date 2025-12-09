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

      // Wyloguj tylko jeśli:
      // 1. Już otrzymaliśmy raz ważny token
      // 2. Token teraz wygasł (<= 0)
      if (hasReceivedValidTokenRef.current && tokenRemainingMs <= 0) {
        dispatch(setLoggedUser(null));
        dispatch(setAccountMode("login"));
        dispatch(
          openModal({
            title: { key: "modal.logout.title" },
            message: { key: "modal.logout.message.success" },
            type: "info",
          })
        );
        hasReceivedValidTokenRef.current = false;
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
