import { FormEventHandler, useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks";
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
  savePasswordRequest,
  selectAccountMode,
  selectIsWaitingForConfirmation,
  selectLoggedUserEmail,
  selectMessage,
  setMessage,
} from "../accountSlice";

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
      case "registerAccount":
        if (!emailValidation() || !passwordValidation()) break;
        dispatch(registerRequest({ email, password }));
        break;
      case "accountRecovery":
        if (!emailValidation()) break;
        dispatch(accountRecoveryRequest({ email }));
        break;
      case "changePassword":
        if (!passwordValidation()) {
          break;
        }
        dispatch(savePasswordRequest({ password }));
        setPassword("");
        break;
      case "logged":
        dispatch(logoutRequest());
        setPassword("");
        break;
    }
  };

  useEffect(() => {
    if (accountMode === "changePassword") {
      setPassword("");
    }
  }, [accountMode]);

  return (
    <>
      <Form
        onSubmit={onFormSubmit}
        $singleInput={
          accountMode === "accountRecovery" || accountMode === "changePassword"
        }
        $noInputs={!!loggedUserEmail && accountMode !== "changePassword"}
      >
        <Input
          autoFocus
          value={email}
          type="email"
          name="login"
          placeholder="name@poczta.pl"
          onChange={({ target }) => setEmail(target.value)}
          ref={emailInputRef}
          hidden={!!loggedUserEmail}
        />
        <InputContainer
          hidden={
            (!!loggedUserEmail || accountMode === "accountRecovery") &&
            accountMode !== "changePassword"
          }
        >
          <Input
            value={password}
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder={
              accountMode === "changePassword" ? "nowe hasło" : "hasło"
            }
            autoComplete={
              accountMode === "changePassword" ? "new-password" : ""
            }
            onChange={({ target }) => setPassword(target.value)}
            ref={passwordInputRef}
          />
          <EyeIconContainer
            onMouseUp={() => setShowPassword(false)}
            onMouseDown={() => setShowPassword(true)}
            onTouchStart={() => setShowPassword(true)}
            onTouchEnd={() => setShowPassword(false)}
            hidden={!password}
          >
            {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
          </EyeIconContainer>
        </InputContainer>
        <FormButton
          type="submit"
          $singleInput={
            accountMode === "accountRecovery" ||
            accountMode === "changePassword"
          }
          $noInputs={!!loggedUserEmail && accountMode !== "changePassword"}
        >
          {accountMode === "registerAccount"
            ? "Zarejestruj"
            : accountMode === "accountRecovery"
            ? "Zresetuj hasło"
            : accountMode === "changePassword"
            ? "Zapisz"
            : loggedUserEmail
            ? "Wyloguj"
            : "Zaloguj"}
        </FormButton>
      </Form>
    </>
  );
};
