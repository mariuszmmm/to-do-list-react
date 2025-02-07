import { useDispatch } from "react-redux";
import { setErrorMessage } from "../features/AccountPage/loginSlice";
import {
  emailPattern,
  passwordPattern,
} from "../features/AccountPage/patterns";
import { RefObject } from "react";

export const useValidation = (
  email: string,
  password: string,
  loginInputRef: RefObject<HTMLInputElement | null>,
  passwordInputRef: RefObject<HTMLInputElement | null>
) => {
  const dispatch = useDispatch();

  const validation = () => {
    if (!email) {
      dispatch(setErrorMessage("Wpisz adres e-mail."));
      loginInputRef.current?.focus();
      return;
    }

    if (!emailPattern.test(email)) {
      dispatch(setErrorMessage("Nieprawidłowy adres e-mail."));
      loginInputRef.current?.focus();
      return;
    }

    if (!password) {
      dispatch(setErrorMessage("Wpisz hasło."));
      passwordInputRef.current?.focus();
      return;
    }

    if (!passwordPattern.test(password)) {
      dispatch(setErrorMessage("Hasło musi mieć co najmniej 4 znaki."));
      passwordInputRef.current?.focus();
      return;
    }

    return true;
  };

  return { validation };
};
