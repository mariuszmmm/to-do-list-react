import { FormEventHandler, useState, useRef, useEffect } from "react";
import { Button, StyledForm } from "./styled";
import ExtraButton from "../../../common/Button";
import { Input } from "../../../common/Input";
import Text from "../../../common/Text";
import {
  loading,
  selectAuthMode,
  selectFetchStatus,
  selectErrorMessage,
  setErrorMessage,
  selectLogged,
  selectRecoverPassword,
  setRecoverPassword,
} from "../loginSlice";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../hooks/hooks";
import { auth } from "../../../utils/auth";
import { useAuthActions } from "../../../hooks/useAuthActions";
import { useValidation } from "../../../hooks/useValidation";

const LoginForm = () => {
  const [email, setEmail] = useState("mariuszmmm@op.pl");
  const [password, setPassword] = useState("test");
  const [isWaitingForConfirmation, setIsWaitingForConfirmation] =
    useState(false);
  const loginInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const logged = useSelector(selectLogged);
  const recoverPassword = useSelector(selectRecoverPassword);
  const authMode = useSelector(selectAuthMode);
  const fetchStatus = useSelector(selectFetchStatus);
  const errorMessage = useSelector(selectErrorMessage);
  const dispatch = useAppDispatch();
  const { register, waitingForConfirmation, login, logout } = useAuthActions(
    email,
    password,
    setIsWaitingForConfirmation,
    errorMessage,
    auth.currentUser()
  );
  const { validation } = useValidation(
    email,
    password,
    loginInputRef,
    passwordInputRef
  );
  const user = auth.currentUser();

  useEffect(() => {
    if (isWaitingForConfirmation) {
      setIsWaitingForConfirmation(false);
      waitingForConfirmation();
    }

    // eslint-disable-next-line
  }, [isWaitingForConfirmation]);

  const onFormSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (errorMessage) dispatch(setErrorMessage(""));

    if (user) {
      await logout();
      return;
    }

    if (!validation()) return;

    dispatch(loading());

    if (authMode === "register") {
      await register();
      return;
    }

    if (authMode === "login") {
      await login();
      return;
    }
  };

  return (
    <>
      <StyledForm onSubmit={onFormSubmit}>
        <Input
          autoFocus
          value={email}
          name="login"
          placeholder="name@poczta.pl"
          onChange={({ target }) => setEmail(target.value)}
          ref={loginInputRef}
          hidden={!!logged}
          disabled={fetchStatus === "loading"}
        />
        <Input
          value={password}
          name="password"
          placeholder="hasło"
          onChange={({ target }) => setPassword(target.value)}
          ref={passwordInputRef}
          hidden={!!logged || (authMode === "login" && recoverPassword)}
          disabled={fetchStatus === "loading"}
        />
        <Button
          type="submit"
          disabled={fetchStatus === "loading"}
          $register={authMode === "register"}
        >
          {logged
            ? "Wyloguj"
            : authMode === "login"
            ? recoverPassword
              ? "Przypomnij hasło"
              : "Zaloguj"
            : "Zarejestruj"}
        </Button>
      </StyledForm>
      {!logged && authMode === "login" && fetchStatus !== "loading" && (
        <ExtraButton
          $special
          onClick={() => dispatch(setRecoverPassword(!recoverPassword))}
        >
          {recoverPassword ? "Anuluj" : "Przypomnij hasło"}
        </ExtraButton>
      )}
      {fetchStatus === "loading" && <Text $loading>Ładowanie...</Text>}
      {errorMessage && <Text $error>{errorMessage}</Text>}
    </>
  );
};

export default LoginForm;
