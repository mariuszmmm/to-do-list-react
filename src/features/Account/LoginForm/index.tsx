import { FormEventHandler, useState } from "react";
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
  setAuthMode,
  selectErrorMessage,
  setErrorMessage,
  fetchError,
} from "../loginSlice";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../hooks";
import { User } from "../../../types";
import { auth } from "../auth";
import { emailPattern, passwordPattern } from "../patterns";
import { getTokenFromLocalStorage } from "../../../utils/localStorage";

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
        dispatch(setAuthMode("login"));
        console.log("New user:", newUser);
        const token = getTokenFromLocalStorage();
        const confirmed = await auth.confirm(token, true);
        console.log("Confirmed:", confirmed);
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
      try {
        const loggedInUser = await auth.login(email, password, true);
        console.log("Logged in user:", loggedInUser);
        const token = loggedInUser.token.access_token;

        if (token) {
          const response = await fetch("/konto", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            console.log("response data:", data);

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

// import {
//   FormEventHandler,
//   MouseEventHandler,
//   useEffect,
//   useState,
// } from "react";
// import { useRef } from "react";
// import { Button, StyledForm } from "./styled";
// import { Input } from "../../../common/Input";
// import netlifyIdentity from "netlify-identity-widget";
// import GoTrue from "gotrue-js";

// const auth: any = new GoTrue({
//   APIUrl: "https://to-do-list-typescript-react.netlify.app/.netlify/identity", // Zamień na URL swojej aplikacji
//   audience: "",
//   setCookie: true, // Zachowuje sesję użytkownika w ciasteczku
// });

// const LoginForm = () => {
//   const [email, setEmail] = useState("mariusz.001test@gmail.com");
//   const [password, setPassword] = useState("aaaa&4444");
//   const [error, setError] = useState<string>("");
//   const [user, setUser] = useState(null);

//   const loginInputRef = useRef<HTMLInputElement>(null);
//   const passwordInputRef = useRef<HTMLInputElement>(null);

//   // useEffect(() => {
//   //   netlifyIdentity.init();
//   // }, []);

//   const handleLogin: MouseEventHandler<HTMLButtonElement> = async (event) => {
//     event.preventDefault();

//     const emailPattern: RegExp =
//       /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
//     const passwordPattern: RegExp =
//       /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

//     setError("");

//     if (!email) {
//       setError("Wpisz adres e-mail.");
//       loginInputRef.current!.focus();
//       return;
//     }

//     if (!emailPattern.test(email)) {
//       setError("Nieprawidłowy adres e-mail.");
//       loginInputRef.current!.focus();
//       return;
//     }

//     if (!password) {
//       setError("Wpisz hasło.");
//       passwordInputRef.current!.focus();
//       return;
//     }

//     if (!passwordPattern.test(password)) {
//       setError(
//         "Hasło musi mieć co najmniej 8 znaków, zawierać co najmniej jedną literę, jedną cyfrę i jeden znak specjalny (@$!%*?&)."
//       );
//       passwordInputRef.current!.focus();
//       return;
//     }

//     setError("");

//     try {
//       console.log(email, password);

//       const loggedInUser: any = await auth.login(email, password);
//       console.log("Logged in user:", loggedInUser);
//       setUser(loggedInUser);
//       setError("");
//     } catch (err) {
//       console.error("Failed to log in:", err);
//       setError("Failed to log in");
//     }
//   };

//   const handleSignup: MouseEventHandler<HTMLButtonElement> = async (event) => {
//     event.preventDefault();

//     const emailPattern: RegExp =
//       /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
//     const passwordPattern: RegExp =
//       /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

//     setError("");

//     if (!email) {
//       setError("Wpisz adres e-mail.");
//       loginInputRef.current!.focus();
//       return;
//     }

//     if (!emailPattern.test(email)) {
//       setError("Nieprawidłowy adres e-mail.");
//       loginInputRef.current!.focus();
//       return;
//     }

//     if (!password) {
//       setError("Wpisz hasło.");
//       passwordInputRef.current!.focus();
//       return;
//     }

//     if (!passwordPattern.test(password)) {
//       setError(
//         "Hasło musi mieć co najmniej 8 znaków, zawierać co najmniej jedną literę, jedną cyfrę i jeden znak specjalny (@$!%*?&)."
//       );
//       passwordInputRef.current!.focus();
//       return;
//     }

//     setError("");

//     try {
//       console.log(email, password);
//       const newUser: any = await auth.signup(email, password);
//       console.log("Signed up user:", newUser);
//       setUser(newUser);
//       setError("");
//     } catch (err) {
//       console.error("Failed to sign up:", err);
//       setError("Failed to sign up");
//     }
//   };

//   const handleLogout: MouseEventHandler<HTMLButtonElement> = () => {
//     auth
//       .currentUser()
//       .logout()
//       .then(() => {
//         console.log("Logged out");
//         setUser(null);
//       });
//   };

//   return (
//     <>
//       <StyledForm
//       // onSubmit={onFormSubmit}
//       >
//         <Input
//           autoFocus
//           value={email}
//           name="login"
//           placeholder="name@poczta.pl"
//           onChange={({ target }) => setEmail(target.value)}
//           ref={loginInputRef}
//         />
//         <Input
//           value={password}
//           name="password"
//           placeholder="hasło"
//           onChange={({ target }) => setPassword(target.value)}
//           ref={passwordInputRef}
//         />
//         {/* <Button>Zaloguj</Button> */}
//         <Button onClick={handleLogin}>Log In</Button>
//         <Button onClick={handleSignup}>Sign Up</Button>
//         <Button onClick={handleLogout}>Log Out</Button>
//       </StyledForm>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//     </>
//   );
// };

// export default LoginForm;
