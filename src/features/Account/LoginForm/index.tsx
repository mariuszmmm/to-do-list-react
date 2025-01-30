import { FormEventHandler, useEffect, useState } from "react";
import { useRef } from "react";
import { Button, StyledForm } from "./styled";
import ExtraButton from "../../../common/Button";
import { Input } from "../../../common/Input";
import Text from "../../../common/Text";
import {
  fetchSuccess,
  loading,
  logout,
  selectAuthMode,
  selectFetchStatus,
  setUser,
  selectErrorMessage,
  setErrorMessage,
  fetchError,
} from "../loginSlice";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../hooks";
import { User } from "../../../types";
import { auth } from "../auth";
import { emailPattern, passwordPattern } from "../patterns";
import {
  // clearTokenFromLocalStorage,
  getTokenFromLocalStorage,
} from "../../../utils/localStorage";

const LoginForm = () => {
  const [email, setEmail] = useState("mariuszmmm@op.pl");
  const [password, setPassword] = useState("test");
  const loginInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const authMode = useSelector(selectAuthMode);
  const fetchStatus = useSelector(selectFetchStatus);
  const errorMessage = useSelector(selectErrorMessage);
  const dispatch = useAppDispatch();
  const user = auth.currentUser();

  // const [userConfirmed, setUserConfirmed] = useState<boolean | "waiting">(
  //   false
  // );

  // useEffect(() => {
  //   if (userConfirmed === "waiting") {
  //     const savedToken = getTokenFromLocalStorage();
  //     console.log("register token:", savedToken);

  //     if (savedToken) {
  //       const confirmation = async () => {
  //         const confirmed = await auth.confirm(savedToken, true);
  //         console.log("Confirmed:", confirmed);
  //         if (confirmed) {
  //           login();
  //         }
  //         // clearTokenFromLocalStorage();
  //       };

  //       confirmation();
  //     }
  //   }
  //   // eslint-disable-next-line
  // }, []);

  useEffect(() => {
    window.addEventListener("storage", (event) => {
      if (event.key === "userConfirmed" && event.newValue) {
        const userConfirmed = event.newValue;
        console.log("userConfirmed", userConfirmed);
        if (userConfirmed === "true") {
          login();
        }
      }
    });

    // eslint-disable-next-line
  }, []);

  const login = async () => {
    try {
      console.log("email, password", email, password);
      const loggedInUser = await auth.login(email, password, true);
      console.log("Logged in user:", loggedInUser);
      console.log(
        "loggedInUser.token.access_token",
        loggedInUser.token.access_token
      );
      console.log("getTokenFromLocalStorage", getTokenFromLocalStorage());
      console.log("user:", user);
      const token = loggedInUser.token.access_token;
      if (token) {
        const response = await fetch("/.netlify/functions/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("login response:", response);

        if (response.ok) {
          const data = await response.json();
          console.log("response data:", data);
          console.log("user:", user);
          const userData: User = {
            id: data.user.id,
            email: data.user.email,
            lists: data.user.lists,
          };
          dispatch(setUser(userData));
        }
      }

      dispatch(fetchSuccess());
    } catch (error) {
      console.error("Failed to log in:", error);
      dispatch(fetchError());
      dispatch(setErrorMessage("Nieprawidłowy adres e-mail lub hasło."));
    }
  };

  // useEffect(() => {
  //   if (userConfirmed === "waiting") {
  //     const intervalId = setInterval(() => {
  //       const user = auth.currentUser();
  //       console.log("user:", user);

  //       // login();
  //       // setUserConfirmed(true);
  //       console.log("waiting for confirmation");
  //     }, 3000);

  //     return () => clearInterval(intervalId);
  //   }
  // }, [userConfirmed]);

  const onFormSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    dispatch(setErrorMessage(""));

    console.log("currentUser", user);
    if (user) {
      try {
        dispatch(loading());
        await user.logout();
        dispatch(logout());
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
        const newUser = await auth.signup(email, password);
        dispatch(setErrorMessage("Potwierdź rejestrację w wiadomości e-mail."));
        // dispatch(setAuthMode("login"));
        console.log("New user:", newUser, authMode);
        // setUserConfirmed("waiting");
      } catch (error: any) {
        console.log("error:", error.name);
        dispatch(fetchError());
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
      {errorMessage && <Text $error>{errorMessage}</Text>}
      {fetchStatus === "loading" && <Text disabled>Ładowanie...</Text>}
      {authMode === "login" && !user && fetchStatus === "idle" && (
        <ExtraButton $special>Przypomnij hasło</ExtraButton>
      )}
    </>
  );
};

export default LoginForm;
