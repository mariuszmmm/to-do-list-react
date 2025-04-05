import { RefObject, useEffect } from "react";
import { emailPattern, passwordPattern } from "../utils/patterns";
import { useTranslation } from "react-i18next";

interface UseValidationProps {
  email?: string;
  password?: string;
  emailInputRef?: RefObject<HTMLInputElement | null>;
  passwordInputRef?: RefObject<HTMLInputElement | null>;
  message: string;
  setMessage: (text: string) => void;
}

export const useValidation = ({
  email,
  password,
  emailInputRef,
  passwordInputRef,
  message,
  setMessage,
}: UseValidationProps) => {
  const { t } = useTranslation("translation", {
    keyPrefix: "accountPage",
  });

  useEffect(() => {
    if (message) setMessage("");

    // eslint-disable-next-line
  }, [email, password]);

  const emailValidation = () => {
    if (!email) {
      setMessage(t("form.message.email"));
      emailInputRef?.current?.focus();
      return false;
    }

    if (!emailPattern.test(email)) {
      setMessage(t("form.message.emailMessage"));
      emailInputRef?.current?.focus();
      return false;
    }

    if (message) setMessage("");
    return true;
  };

  const passwordValidation = () => {
    if (!password) {
      setMessage(t("form.message.password"));
      passwordInputRef?.current?.focus();
      return false;
    }

    if (!passwordPattern.test(password)) {
      setMessage(t("form.message.passwordMessage"));
      passwordInputRef?.current?.focus();
      return false;
    }

    if (message) setMessage("");
    return true;
  };

  return { emailValidation, passwordValidation };
};
