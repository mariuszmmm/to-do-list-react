import { useEffect, useRef } from "react";
import { useAppDispatch } from "../../../../hooks/redux";
import { setIsWaitingForConfirmation } from "../../accountSlice";

interface UseRestoreWaitingStateProps {
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
}

/**
 * Hook for restoring waiting for confirmation state from sessionStorage after page reload.
 * Checks if user was waiting for confirmation and restores email/password if timeout hasn't expired.
 */
export const useRestoreWaitingState = ({
  setEmail,
  setPassword,
}: UseRestoreWaitingStateProps) => {
  const dispatch = useAppDispatch();
  const hasRestoredRef = useRef(false);

  useEffect(() => {
    if (hasRestoredRef.current) return;

    const waitingData = sessionStorage.getItem("waitingForConfirmation");
    if (waitingData) {
      try {
        const {
          email: savedEmail,
          password: savedPassword,
          timestamp,
        } = JSON.parse(waitingData);
        if (Date.now() - timestamp < 600000) {
          setEmail(savedEmail);
          setPassword(savedPassword);
          dispatch(setIsWaitingForConfirmation(true));
          hasRestoredRef.current = true;
        } else {
          sessionStorage.removeItem("waitingForConfirmation");
        }
      } catch (err) {
        console.error(
          "[RestoreWaitingState] Failed to parse waitingForConfirmation:",
          err
        );
        sessionStorage.removeItem("waitingForConfirmation");
      }
    }
  }, [dispatch, setEmail, setPassword]);
};
