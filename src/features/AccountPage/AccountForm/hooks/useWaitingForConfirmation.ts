import { useAppDispatch } from "../../../../hooks/redux";
import { AccountState } from "../../../../types";
import {
  setAccountMode,
  setIsWaitingForConfirmation,
  setMessage,
  setLoggedUser,
} from "../../accountSlice";
import { useRef, useCallback } from "react";
import { auth } from "../../../../api/auth";
import { openModal } from "../../../../Modal/modalSlice";
import { useAblyManager } from "../../../../hooks";
import { closeAblyConnection } from "../../../../utils/ably";

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
  const dispatch = useAppDispatch();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const unsubscribeRef = useRef<(() => void) | undefined>(undefined);
  const { onConfirmation, setPendingConfirmationEmail } = useAblyManager();

  const waitingForConfirmation = useCallback(() => {
    if (!email || !password) return;

    setPendingConfirmationEmail(email);

    const handleConfirmation = async ({
      type,
      email: confirmedEmail,
    }: {
      type: string;
      email: string;
    }) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (message) dispatch(setMessage(""));
      dispatch(setIsWaitingForConfirmation(false));
      setPendingConfirmationEmail(null);

      try {
        const response = await auth.login(email, password, true);
        sessionStorage.removeItem("waitingForConfirmation");
        closeAblyConnection();
        dispatch(setAccountMode("logged"));
        dispatch(
          setLoggedUser({
            email: response.email,
            name: response.user_metadata.full_name,
            roles: response.app_metadata.roles,
          }),
        );
        dispatch(
          openModal({
            title: { key: "modal.login.title" },
            message: {
              key: "modal.login.message.success",
              values: { user: response.email },
            },
            type: "success",
          }),
        );
      } catch (err) {
        dispatch(setAccountMode("login"));
        dispatch(setMessage("Login failed after confirmation"));
      } finally {
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
          unsubscribeRef.current = undefined;
        }
        setPendingConfirmationEmail(null);
      }
    };

    onConfirmation(email, handleConfirmation)
      .then((unsubscribe) => {
        unsubscribeRef.current = unsubscribe;
      })
      .catch((err) => {
        console.error("[WaitingForConfirmation] Failed to subscribe:", err);
        dispatch(setIsWaitingForConfirmation(false));
        setPendingConfirmationEmail(null);
      });

    timeoutRef.current = setTimeout(() => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = undefined;
      }
      sessionStorage.removeItem("waitingForConfirmation");
      dispatch(setAccountMode("login"));
      if (message) dispatch(setMessage(""));
      dispatch(setIsWaitingForConfirmation(false));
      setPendingConfirmationEmail(null);
    }, 600000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = undefined;
      }
      setPendingConfirmationEmail(null);
    };
  }, [
    dispatch,
    email,
    message,
    onConfirmation,
    password,
    setPendingConfirmationEmail,
  ]);

  return { waitingForConfirmation };
};
