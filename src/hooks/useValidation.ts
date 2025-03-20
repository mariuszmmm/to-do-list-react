import { RefObject } from "react";
import { emailPattern, passwordPattern } from "../utils/patterns";

interface UseValidationProps {
  email?: string;
  password?: string;
  emailInputRef?: RefObject<HTMLInputElement | null>;
  passwordInputRef?: RefObject<HTMLInputElement | null>;
  setMessage: (text: string) => void;
}

export const useValidation = ({
  email,
  password,
  emailInputRef,
  passwordInputRef,
  setMessage,
}: UseValidationProps) => {
  const emailValidation = () => {
    if (!email) {
      setMessage("Wpisz adres e-mail.");
      emailInputRef?.current?.focus();
      return false;
    }

    if (!emailPattern.test(email)) {
      setMessage("Nieprawidłowy adres e-mail.");
      emailInputRef?.current?.focus();
      return false;
    }

    setMessage("");
    return true;
  };

  const passwordValidation = () => {
    if (!password) {
      setMessage("Wpisz hasło.");
      passwordInputRef?.current?.focus();
      return false;
    }

    if (!passwordPattern.test(password)) {
      setMessage("Hasło musi mieć co najmniej 4 znaki.");
      passwordInputRef?.current?.focus();
      return false;
    }

    setMessage("");
    return true;
  };

  return { emailValidation, passwordValidation };
};
