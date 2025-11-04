import { useAppDispatch } from "../../../hooks/redux";
import { AccountState } from "../../../types";
import { confirmUserApi } from "../../../api/fetchUserApi";
import {
  setAccountMode,
  setIsWaitingForConfirmation,
  setMessage,
} from "../accountSlice";
import { useLogin } from "./useLogin";

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

  const waitingForConfirmation = () => {
    if (!email || !password) return;
    const interval = setInterval(async () => {
      try {
        const confirmationResponse = await confirmUserApi(email);
        const confirmedEmail = confirmationResponse?.email;

        if (confirmedEmail) {
          clearTimeout(timeout);
          clearInterval(interval);
          if (message) dispatch(setMessage(""));
          dispatch(setIsWaitingForConfirmation(false));
          login.mutate({ email, password });
        }
      } catch (error) {
        clearInterval(interval);
        clearTimeout(timeout);
        dispatch(setIsWaitingForConfirmation(false));
        console.error("Error confirming user", error);
      }
    }, 2000);

    const timeout = setTimeout(() => {
      dispatch(setAccountMode("login"));
      if (message) dispatch(setMessage(""));
      dispatch(setIsWaitingForConfirmation(false));
      clearInterval(interval);
    }, 60000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  };

  return { waitingForConfirmation };
};
