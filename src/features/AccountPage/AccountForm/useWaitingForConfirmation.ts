import { useAppDispatch } from "../../../hooks/redux";
import { AccountState } from "../../../types";
import {
  setAccountMode,
  setIsWaitingForConfirmation,
  setMessage,
} from "../accountSlice";
import { useLogin } from "./useLogin";
import { useRef } from "react";
import { useAblyManager } from "../../../hooks/useAblyManager";

interface WaitingForConfirmationProps {
  email?: string;
  password?: string;
  message?: AccountState["message"];
}

export const useWaitingForConfirmation = ({
  email,
  password,
  message,
}: WaitingForConfirmationProps) => {
  const login = useLogin();
  const dispatch = useAppDispatch();
  const { onConfirmation } = useAblyManager();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const waitingForConfirmation = () => {
    if (!email || !password) return;

    try {
      // Subskrybuj do confirmation event'u
      unsubscribeRef.current = onConfirmation(email, async () => {
        console.log(`[Confirmation] User ${email} confirmed via Ably`);

        // Wyczyść timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        if (message) dispatch(setMessage(""));
        dispatch(setIsWaitingForConfirmation(false));

        // Automatycznie zaloguj użytkownika
        login.mutate({ email, password });
      });

      // Timeout - jeśli nie potwierdzono w ciągu 10 minut, przerwij czekanie
      timeoutRef.current = setTimeout(() => {
        console.warn(
          `[Confirmation] Timeout waiting for ${email} confirmation`
        );
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
        }
        dispatch(setAccountMode("login"));
        if (message) dispatch(setMessage(""));
        dispatch(setIsWaitingForConfirmation(false));
      }, 600000); // 10 minut
    } catch (error) {
      console.error("Error setting up confirmation listener:", error);
      dispatch(setIsWaitingForConfirmation(false));
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  };

  return { waitingForConfirmation };
};
