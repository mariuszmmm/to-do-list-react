import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "./redux";
import {
  selectLoggedUserEmail,
  setLoggedUserEmail,
  setAccountMode,
  selectTokenRemainingMs,
} from "../features/AccountPage/accountSlice";
import { openModal } from "../Modal/modalSlice";

/**
 * Hook który monitoruje ważność tokena (czyta z Reduxu) i wylogowuje użytkownika gdy token wygaśnie
 * Nie ma już interwałów - countdown pochodzi z useTokenCountdown
 */
export const useTokenValidation = () => {
  const dispatch = useAppDispatch();
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);
  const tokenRemainingMs = useAppSelector(selectTokenRemainingMs);
  const hasReceivedValidTokenRef = useRef(false);

  useEffect(() => {
    if (!loggedUserEmail) {
      // Użytkownik się wylogował, resetuj flag
      hasReceivedValidTokenRef.current = false;
      return;
    }

    // Poczekaj na pierwszy ważny token (> 0)
    if (tokenRemainingMs > 0) {
      hasReceivedValidTokenRef.current = true;
    }

    // Wyloguj tylko jeśli:
    // 1. Już otrzymaliśmy raz ważny token
    // 2. Token teraz wygasł (= 0)
    if (hasReceivedValidTokenRef.current && tokenRemainingMs <= 0) {
      console.warn("Token wygasł, wylogowywanie użytkownika");
      dispatch(setLoggedUserEmail(null));
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
  }, [loggedUserEmail, tokenRemainingMs, dispatch]);
};
