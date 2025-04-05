import { RefObject, useEffect } from "react";
import { emailPattern, passwordPattern } from "../utils/patterns";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation("translation", {
    keyPrefix: "accountPage",
  });

  useEffect(() => {
    setMessage("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

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

    setMessage("");
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

    setMessage("");
    return true;
  };

  return { emailValidation, passwordValidation };
};
