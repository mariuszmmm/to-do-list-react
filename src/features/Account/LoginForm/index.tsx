import { FormEventHandler, useEffect, useState } from "react";
import { useRef } from "react";
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
  // selectUserData,
} from "../loginSlice";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../hooks";
import { auth } from "../auth";
import { emailPattern, passwordPattern } from "../patterns";
import { useFetch } from "./useFetch";

const LoginForm = () => {
  const [email, setEmail] = useState("mariuszmmm@op.pl");
  const [password, setPassword] = useState("test");
  const loginInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  // const userData = useSelector(selectUserData);
  const authMode = useSelector(selectAuthMode);
  const fetchStatus = useSelector(selectFetchStatus);
  const errorMessage = useSelector(selectErrorMessage);
  const dispatch = useAppDispatch();
  const user = auth.currentUser();

  const { getUserDataApi, userConfirmation } = useFetch();

  const getUserData = async (token: string) => {
    try {
      const usersData = await getUserDataApi(token);
      dispatch(setUserData(usersData));
      dispatch(fetchSuccess());
    } catch (error) {
      dispatch(setErrorMessage("Błąd serwera"));
      dispatch(fetchError());
    }
  };

  const waitingForConfirmation = () => {
    const interval = setInterval(async () => {
      // const email_ = "test@poczta.pl";
      const confirmedUser = await userConfirmation(email);
      console.log("confirmedUser", confirmedUser);
      if (confirmedUser.email === email) {
        clearInterval(interval);
        return;
      }

      // const response = await auth.login(email, password, true);
      // console.log("response", response);
      // const token = response.token.access_token;
      // getUserData(token);
      // if (response) {
      //   clearInterval(interval);
      //   return;
      // }
    }, 3000);

    setTimeout(() => {
      clearInterval(interval);
    }, 60000);

    return interval;
  };

  useEffect(() => {
    const token = user?.token.access_token;
    token && getUserData(token);

    // window.addEventListener("storage", (event) => {
    //   if (event.key === "userConfirmed" && event.newValue) {
    //     const userConfirmed = event.newValue;
    //     console.log("userConfirmed", userConfirmed);
    //     if (userConfirmed === "true") {
    //       login();
    //     }
    //   }
    // });

    // eslint-disable-next-line
  }, []);

  const login = async () => {
    try {
      const response = await auth.login(email, password, true);
      console.log("response", response);
      const token = response.token.access_token;

      getUserData(token);
    } catch (error: any) {
      dispatch(fetchError());
      if (error.message === "Failed to fetch") {
        dispatch(setErrorMessage("Brak połączenia z internetem."));
        return;
      }
      dispatch(setErrorMessage("Nieprawidłowy adres e-mail lub hasło."));
    }
  };

  const onFormSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    dispatch(setErrorMessage(""));

    if (user) {
      try {
        dispatch(loading());
        const response = await user.logout();
        console.log("response", response); //tymczasowo
        dispatch(setUserData(null));
        dispatch(fetchSuccess());
      } catch (error) {
        dispatch(setErrorMessage("Błąd wylogowania"));
      }
      return;
    }

    if (!email) {
      dispatch(setErrorMessage("Wpisz adres e-mail."));
      loginInputRef.current!.focus();
      return;
    }

    if (!emailPattern.test(email)) {
      dispatch(setErrorMessage("Nieprawidłowy adres e-mail."));
      loginInputRef.current!.focus();
      return;
    }

    if (!password) {
      dispatch(setErrorMessage("Wpisz hasło."));
      passwordInputRef.current!.focus();
      return;
    }

    if (!passwordPattern.test(password)) {
      dispatch(setErrorMessage("Hasło musi mieć co najmniej 4 znaki."));
      passwordInputRef.current!.focus();
      return;
    }

    dispatch(loading());

    if (authMode === "register") {
      try {
        const response = await auth.signup(email, password);
        console.log("response", response);

        dispatch(setErrorMessage("Potwierdź rejestrację w wiadomości e-mail."));
        waitingForConfirmation();
      } catch (error: any) {
        dispatch(fetchError());

        if (error.message === "Failed to fetch") {
          dispatch(setErrorMessage("Brak połączenia z internetem."));
          return;
        }
        console.log("error:", error.name);
        switch (error.name) {
          case "JSONHTTPError":
            dispatch(
              setErrorMessage(
                "Użytkownik z tym adresem e-mail jest już zarejestrowany."
              )
            );
            break;
          case "invalid_grant":
            dispatch(setErrorMessage("Nieprawidłowy adres e-mail lub hasło."));
            break;
          default:
            dispatch(setErrorMessage("Błąd rejestracji"));
            break;
        }
        return;
      }
    }

    if (authMode === "login") {
      login();
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
          hidden={!!user}
          disabled={fetchStatus === "loading"}
        />
        <Input
          value={password}
          name="password"
          placeholder="hasło"
          onChange={({ target }) => setPassword(target.value)}
          ref={passwordInputRef}
          hidden={!!user}
          disabled={fetchStatus === "loading"}
        />
        <Button
          type="submit"
          disabled={fetchStatus === "loading"}
          $register={authMode === "register"}
        >
          {user ? "Wyloguj" : authMode === "login" ? "Zaloguj" : "Zarejestruj"}
        </Button>
      </StyledForm>
      {!user && authMode === "login" && (
        <ExtraButton $special disabled={fetchStatus === "loading"}>
          Przypomnij hasło
        </ExtraButton>
      )}
      {fetchStatus === "loading" && <Text disabled>Ładowanie...</Text>}
      {errorMessage && <Text $error>{errorMessage}</Text>}
    </>
  );
};

export default LoginForm;
