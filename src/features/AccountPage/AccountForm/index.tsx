import { FormEventHandler, useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { useAuthActions } from "../../../hooks/useAuthActions";
import { useValidation } from "../../../hooks/useValidation";
import { Form } from "../../../common/Form";
import { FormButton } from "../../../common/FormButton";
import { Input } from "../../../common/Input";
import { AccountModal } from "../AccountModal";
import {
  selectAccountMode,
  selectFetchStatus,
  selectLoggedUser,
  selectMessage,
  setAccountMode,
  setMessage,
} from "../accountSlice";

export const AccountForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isWaitingForConfirmation, setIsWaitingForConfirmation] =
    useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const accountMode = useAppSelector(selectAccountMode);
  const fetchStatus = useAppSelector(selectFetchStatus);
  const message = useAppSelector(selectMessage);
  const userLogged = useAppSelector(selectLoggedUser);
  const dispatch = useAppDispatch();

  const {
    register,
    waitingForConfirmation,
    login,
    accountRecovery,
    logout,
    changePassword,
  } = useAuthActions({
    email,
    password,
    message,
    isWaitingForConfirmation,
    setIsWaitingForConfirmation,
  });
  const { emailValidation, passwordValidation } = useValidation({
    email,
    password,
    emailInputRef,
    passwordInputRef,
    setMessage: (text) => dispatch(setMessage({ text, type: "warning" })),
  });

  useEffect(() => {
    if (isWaitingForConfirmation) {
      waitingForConfirmation();
    }
  }, [isWaitingForConfirmation, waitingForConfirmation]);

  const onFormSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (message) dispatch(setMessage());

    switch (accountMode) {
      case "login":
        if (!emailValidation() || !passwordValidation()) return;
        await login();
        setPassword("");
        return;
      case "registerAccount":
        if (!emailValidation() || !passwordValidation()) return;
        await register();
        return;
      case "accountRecovery":
        if (!emailValidation()) return;
        await accountRecovery();
        return;
      case "changePassword":
        if (!passwordValidation()) return;
        dispatch(setAccountMode("savePassword"));
        changePassword();
        setPassword("");
        return;
      case "logged":
        await logout();
        setPassword("");
        return;
      default:
        break;
    }
  };

  return (
    <>
      {(accountMode === "deleteUser" ||
        accountMode === "savePassword" ||
        accountMode === "sendRecoveryEmail" ||
        accountMode === "sendRegisterEmail") && <AccountModal />}
      <Form
        onSubmit={onFormSubmit}
        $singleInput={
          accountMode === "accountRecovery" || accountMode === "changePassword"
        }
        $noInputs={!!userLogged && accountMode !== "changePassword"}
      >
        <Input
          autoFocus
          value={email}
          type="email"
          name="login"
          placeholder="name@poczta.pl"
          onChange={({ target }) => setEmail(target.value)}
          ref={emailInputRef}
          hidden={!!userLogged}
          disabled={fetchStatus === "loading"}
        />
        <Input
          value={password}
          name="password"
          type="password"
          placeholder="hasło"
          onChange={({ target }) => setPassword(target.value)}
          ref={passwordInputRef}
          hidden={
            (!!userLogged || accountMode === "accountRecovery") &&
            accountMode !== "changePassword"
          }
          disabled={fetchStatus === "loading"}
        />
        <FormButton
          type="submit"
          disabled={fetchStatus === "loading"}
          $singleInput={
            accountMode === "accountRecovery" ||
            accountMode === "changePassword"
          }
          $noInputs={!!userLogged && accountMode !== "changePassword"}
        >
          {accountMode === "registerAccount"
            ? "Zarejestruj"
            : accountMode === "accountRecovery"
            ? "Zresetuj"
            : accountMode === "changePassword"
            ? "Zapisz"
            : !userLogged
            ? "Zaloguj"
            : "Wyloguj"}
        </FormButton>
      </Form>
    </>
  );
};
