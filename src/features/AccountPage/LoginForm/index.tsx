import { FormEventHandler, useState, useRef, useEffect } from "react";
import { Button, StyledForm } from "./styled";
import ExtraButton from "../../../common/Button";
import { Input } from "../../../common/Input";
import Text from "../../../common/Text";
import {
  fetchSuccess,
  loading,
  selectAuthMode,
  selectFetchStatus,
  selectErrorMessage,
  setErrorMessage,
  fetchError,
  setUserData,
  setLogged,
  setLogout,
  selectLogged,
  setAuthMode,
} from "../loginSlice";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../hooks";
import { auth } from "../../../utils/auth";
import { emailPattern, passwordPattern } from "../patterns";
import { useFetch } from "../../../hooks/useFetch";

const LoginForm = () => {
  const [email, setEmail] = useState("mariuszmmm@op.pl");
  const [password, setPassword] = useState("test");
  const [isWaitingForConfirmation, setIsWaitingForConfirmation] =
    useState(false);
  const loginInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const logged = useSelector(selectLogged);
  const authMode = useSelector(selectAuthMode);
  const fetchStatus = useSelector(selectFetchStatus);
  const errorMessage = useSelector(selectErrorMessage);
  const dispatch = useAppDispatch();
  const user = auth.currentUser();
  const { getUserDataApi, setUserApi } = useFetch();

  const waitingForConfirmation = () => {
    const interval = setInterval(async () => {
      try {
        const confirmationResponse = await setUserApi(email);
        const confirmedEmail = confirmationResponse?.email;

        console.log("confirmationResponse", confirmationResponse);

        if (confirmedEmail) {
          clearInterval(interval);
          dispatch(setErrorMessage(""));
          await login();
        }
      } catch (error) {
        console.error("error", error);
      }
    }, 3000);

    const timeout = setTimeout(() => {
      dispatch(setAuthMode("login"));
      dispatch(setErrorMessage(""));
      dispatch(fetchError());
      clearInterval(interval);
    }, 60000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  };

  useEffect(() => {
    if (isWaitingForConfirmation) {
      setIsWaitingForConfirmation(false);
      waitingForConfirmation();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWaitingForConfirmation]);

  const logout = async () => {
    try {
      dispatch(loading());
      if (user) {
        await user.logout();
      }
      dispatch(setLogout());
      dispatch(fetchSuccess());
    } catch (error) {
      dispatch(setErrorMessage("Błąd wylogowania"));
    }
  };
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

  const getUserData = async (token: string) => {
    try {
      const userData = await getUserDataApi(token);
      console.log("userData", userData);
      if (!userData) throw new Error();
      dispatch(setUserData(userData));
      dispatch(fetchSuccess());
    } catch (error) {
      dispatch(setErrorMessage("Błąd pobierania danych"));
      dispatch(fetchError());
    }
  };

  const login = async () => {
    try {
      const response = await auth.login(email, password, true);
      console.log("login response", response);
      dispatch(setLogged(response.email));
      const token = response.token.access_token;
      await getUserData(token);
    } catch (error: any) {
      dispatch(fetchError());
      switch (error.message) {
        case "Failed to fetch":
          dispatch(setErrorMessage("Brak połączenia z internetem."));
          break;
        case "invalid_grant: Email not confirmed":
          dispatch(setErrorMessage("E-mail nie został potwierdzony."));
          break;
        case "invalid_grant: No user found with that email, or password invalid.":
          dispatch(setErrorMessage("Nieprawidłowy adres e-mail lub hasło."));
          break;
        default:
          dispatch(setErrorMessage("Błąd logowania."));
          break;
      }
    }
  };

  const registration = async () => {
    try {
      const response = await auth.signup(email, password);
      console.log("registration response", response);
      dispatch(setErrorMessage("Potwierdź rejestrację w wiadomości e-mail."));
      setIsWaitingForConfirmation(true);
    } catch (error: any) {
      dispatch(fetchError());

      switch (error.message) {
        case "Failed to fetch":
          dispatch(setErrorMessage("Brak połączenia z internetem."));
          break;
        case "Unable to validate email address: invalid format":
          dispatch(setErrorMessage("Wpisz poprawny adres e-mail."));
          break;
        case "Signup requires a valid password":
          dispatch(setErrorMessage("Hasło musi mieć co najmniej 4 znaki."));
          break;
        case "A user with this email address has already been registered":
          dispatch(
            setErrorMessage("Użytkownik z tym adresem e-mail już istnieje.")
          );
          break;
        default:
          dispatch(setErrorMessage("Błąd rejestracji."));
          break;
      }
      return;
    }
  };

  const onFormSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    dispatch(setErrorMessage(""));

    if (user) {
      await logout();
      return;
    }

    if (!validation()) {
      return;
    }

    dispatch(loading());

    if (authMode === "register") {
      await registration();
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
          hidden={!!logged}
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
            ? "Zaloguj"
            : "Zarejestruj"}
        </Button>
      </StyledForm>
      {!logged && authMode === "login" && fetchStatus !== "loading" && (
        <ExtraButton $special>Przypomnij hasło</ExtraButton>
      )}
      {fetchStatus === "loading" && <Text $loading>Ładowanie...</Text>}
      {errorMessage && <Text $error>{errorMessage}</Text>}
    </>
  );
};

export default LoginForm;
