import { FormEventHandler, useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { useValidation } from "../../../hooks/useValidation";
import { useWaitingForConfirmation } from "./useWaitingForConfirmation";
import { Form } from "../../../common/Form";
import { FormButton } from "../../../common/FormButton";
import { Input } from "../../../common/Input";
import { InputContainer } from "../../../common/InputContainer";
import { EyeIconContainer } from "../../../common/EyeIconContainer";
import { EyeIcon, EyeSlashIcon } from "../../../common/icons";
import {
  accountRecoveryRequest,
  loginRequest,
  logoutRequest,
  registerRequest,
  changePasswordRequest,
  selectAccountMode,
  selectIsWaitingForConfirmation,
  selectLoggedUserEmail,
  selectMessage,
  setMessage,
} from "../accountSlice";
import { useTranslation } from "react-i18next";

export const AccountForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const accountMode = useAppSelector(selectAccountMode);
  const message = useAppSelector(selectMessage);
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);
  const isWaitingForConfirmation = useAppSelector(
    selectIsWaitingForConfirmation
  );
  const { t } = useTranslation("translation", {
    keyPrefix: "accountPage",
  });
  const dispatch = useAppDispatch();
  const { waitingForConfirmation } = useWaitingForConfirmation({
    email,
    password,
    message,
  });

  const { emailValidation, passwordValidation } = useValidation({
    email,
    password,
    emailInputRef,
    passwordInputRef,
    message,
    setMessage: (text) => dispatch(setMessage(text)),
  });

  useEffect(() => {
    if (isWaitingForConfirmation) {
      waitingForConfirmation();
    }
  }, [isWaitingForConfirmation, waitingForConfirmation]);

  const onFormSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    switch (accountMode) {
      case "login":
        if (!(emailValidation() && passwordValidation())) break;
        dispatch(loginRequest({ email, password }));
        setPassword("");
        break;
      case "accountRegister":
        if (!emailValidation() || !passwordValidation()) break;
        dispatch(registerRequest({ email, password }));
        break;
      case "accountRecovery":
        if (!emailValidation()) break;
        dispatch(accountRecoveryRequest({ email }));
        break;
      case "passwordChange":
        if (!passwordValidation()) {
          break;
        }
        dispatch(changePasswordRequest({ password }));
        setPassword("");
        break;
      case "logged":
        dispatch(logoutRequest());
        setPassword("");
        break;
    }
  };

  useEffect(() => {
    if (accountMode === "passwordChange") {
      setPassword("");
    }
  }, [accountMode]);

  return (
    <>
      <Form
        onSubmit={onFormSubmit}
        $singleInput={
          accountMode === "accountRecovery" || accountMode === "passwordChange"
        }
        $noInputs={!!loggedUserEmail && accountMode !== "passwordChange"}
      >
        <Input
          autoFocus
          value={email}
          type="email"
          name="login"
          placeholder={t("form.inputPlaceholders.email")}
          onChange={({ target }) => setEmail(target.value)}
          ref={emailInputRef}
          hidden={!!loggedUserEmail}
        />
        <InputContainer
          hidden={
            (!!loggedUserEmail || accountMode === "accountRecovery") &&
            accountMode !== "passwordChange"
          }
        >
          <Input
            value={password}
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder={
              accountMode === "passwordChange"
                ? t("form.inputPlaceholders.newPassword")
                : t("form.inputPlaceholders.password")
            }
            autoComplete={
              accountMode === "passwordChange" ? "new-password" : ""
            }
            onChange={({ target }) => setPassword(target.value)}
            ref={passwordInputRef}
          />
          <EyeIconContainer
            onMouseUp={() => setShowPassword(false)}
            onMouseDown={() => setShowPassword(true)}
            onTouchStart={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
          </EyeIconContainer>
        </InputContainer>
        <FormButton
          type="submit"
          $singleInput={
            accountMode === "accountRecovery" ||
            accountMode === "passwordChange"
          }
          $noInputs={!!loggedUserEmail && accountMode !== "passwordChange"}
        >
          {accountMode === "accountRegister"
            ? t("form.buttons.register")
            : accountMode === "accountRecovery"
            ? t("form.buttons.reset")
            : accountMode === "passwordChange"
            ? t("form.buttons.save")
            : loggedUserEmail
            ? t("form.buttons.logout")
            : t("form.buttons.login")}
        </FormButton>
      </Form>
    </>
  );
};
