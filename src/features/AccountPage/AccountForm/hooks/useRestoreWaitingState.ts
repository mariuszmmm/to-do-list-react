import { useEffect, useRef } from "react";
import { useAppDispatch } from "../../../../hooks/redux/redux";
import { setIsWaitingForConfirmation } from "../../accountSlice";

interface UseRestoreWaitingStateProps {
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
}

export const useRestoreWaitingState = ({ setEmail, setPassword }: UseRestoreWaitingStateProps) => {
  const dispatch = useAppDispatch();
  const hasRestoredRef = useRef(false);

  useEffect(() => {
    if (hasRestoredRef.current) return;

    const waitingData = sessionStorage.getItem("waitingForConfirmation");
    if (!waitingData) return;

    try {
      const { email: savedEmail, password: savedPassword, timestamp } = JSON.parse(waitingData);

      if (Date.now() - timestamp < 600_000) {
        setEmail(savedEmail);
        setPassword(savedPassword);
        dispatch(setIsWaitingForConfirmation(true));
        hasRestoredRef.current = true;
      } else {
        sessionStorage.removeItem("waitingForConfirmation");
      }
    } catch (err) {
      console.error("[RestoreWaitingState] Failed to parse waitingForConfirmation:", err);
      sessionStorage.removeItem("waitingForConfirmation");
    }
  }, [dispatch, setEmail, setPassword]);
};
