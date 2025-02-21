import { useAppDispatch } from "../../../hooks";
import { AccountState } from "../../../types";
import { confirmUserApi } from "../../../api/fetchUserApi";
import {
  setAccountMode,
  setVersion,
  setIsWaitingForConfirmation,
  loginRequest,
  setMessage,
} from "../accountSlice";

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

  const waitingForConfirmation = () => {
    if (!email || !password) return;
    const interval = setInterval(async () => {
      try {
        const confirmationResponse = await confirmUserApi(email);
        const confirmedEmail = confirmationResponse?.email;

        if (confirmedEmail) {
          const version = confirmationResponse?.version;
          if (!version) throw new Error("No version");
          dispatch(setVersion(version));
          clearTimeout(timeout);
          clearInterval(interval);
          if (message) dispatch(setMessage(""));
          dispatch(setIsWaitingForConfirmation(false));
          dispatch(loginRequest({ email, password }));
        }
      } catch (error) {
        clearInterval(interval);
        clearTimeout(timeout);
        dispatch(setIsWaitingForConfirmation(false));
        console.error("error", error);
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
