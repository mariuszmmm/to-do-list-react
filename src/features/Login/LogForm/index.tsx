import {
  FormEventHandler,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";
import { useRef } from "react";
import { Button, StyledForm } from "./styled";
import { Input } from "../../../common/Input";
import netlifyIdentity from "netlify-identity-widget";
// import GoTrue from "gotrue-js";

// const auth: any = new GoTrue({
//   APIUrl: "https://to-do-list-typescript-react.netlify.app/.netlify/identity", // Zamień na URL swojej aplikacji
//   audience: "",
//   setCookie: true, // Zachowuje sesję użytkownika w ciasteczku
// });

const LogForm = () => {
  useEffect(() => {
    netlifyIdentity.init(); // Inicjalizacja widgetu
  }, []);

  const handleLogin = () => {
    netlifyIdentity.open(); // Otwiera panel logowania
  };
  // const [email, setEmail] = useState("mariusz.001test@gmail.com");
  // const [password, setPassword] = useState("aaaa&4444");
  // const [error, setError] = useState<string>("");
  // const [user, setUser] = useState(null);

  // const loginInputRef = useRef<HTMLInputElement>(null);
  // const passwordInputRef = useRef<HTMLInputElement>(null);

  // // useEffect(() => {
  // //   netlifyIdentity.init();
  // // }, []);

  // const handleLogin: MouseEventHandler<HTMLButtonElement> = async (event) => {
  //   event.preventDefault();

  //   const emailPattern: RegExp =
  //     /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  //   const passwordPattern: RegExp =
  //     /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  //   setError("");

  //   if (!email) {
  //     setError("Wpisz adres e-mail.");
  //     loginInputRef.current!.focus();
  //     return;
  //   }

  //   if (!emailPattern.test(email)) {
  //     setError("Nieprawidłowy adres e-mail.");
  //     loginInputRef.current!.focus();
  //     return;
  //   }

  //   if (!password) {
  //     setError("Wpisz hasło.");
  //     passwordInputRef.current!.focus();
  //     return;
  //   }

  //   if (!passwordPattern.test(password)) {
  //     setError(
  //       "Hasło musi mieć co najmniej 8 znaków, zawierać co najmniej jedną literę, jedną cyfrę i jeden znak specjalny (@$!%*?&)."
  //     );
  //     passwordInputRef.current!.focus();
  //     return;
  //   }

  //   setError("");

  //   try {
  //     console.log(email, password);

  //     const loggedInUser: any = await auth.login(email, password);
  //     console.log("Logged in user:", loggedInUser);
  //     setUser(loggedInUser);
  //     setError("");
  //   } catch (err) {
  //     console.error("Failed to log in:", err);
  //     setError("Failed to log in");
  //   }
  // };

  // const handleSignup: MouseEventHandler<HTMLButtonElement> = async (event) => {
  //   event.preventDefault();

  //   const emailPattern: RegExp =
  //     /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  //   const passwordPattern: RegExp =
  //     /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  //   setError("");

  //   if (!email) {
  //     setError("Wpisz adres e-mail.");
  //     loginInputRef.current!.focus();
  //     return;
  //   }

  //   if (!emailPattern.test(email)) {
  //     setError("Nieprawidłowy adres e-mail.");
  //     loginInputRef.current!.focus();
  //     return;
  //   }

  //   if (!password) {
  //     setError("Wpisz hasło.");
  //     passwordInputRef.current!.focus();
  //     return;
  //   }

  //   if (!passwordPattern.test(password)) {
  //     setError(
  //       "Hasło musi mieć co najmniej 8 znaków, zawierać co najmniej jedną literę, jedną cyfrę i jeden znak specjalny (@$!%*?&)."
  //     );
  //     passwordInputRef.current!.focus();
  //     return;
  //   }

  //   setError("");

  //   try {
  //     console.log(email, password);
  //     const newUser: any = await auth.signup(email, password);
  //     console.log("Signed up user:", newUser);
  //     setUser(newUser);
  //     setError("");
  //   } catch (err) {
  //     console.error("Failed to sign up:", err);
  //     setError("Failed to sign up");
  //   }
  // };

  // const handleLogout: MouseEventHandler<HTMLButtonElement> = () => {
  //   auth
  //     .currentUser()
  //     .logout()
  //     .then(() => {
  //       console.log("Logged out");
  //       setUser(null);
  //     });
  // };

  return (
    <>
      <StyledForm
      // onSubmit={onFormSubmit}
      >
        {/* <Input
          autoFocus
          value={email}
          name="login"
          placeholder="name@poczta.pl"
          onChange={({ target }) => setEmail(target.value)}
          ref={loginInputRef}
        />
        <Input
          value={password}
          name="password"
          placeholder="hasło"
          onChange={({ target }) => setPassword(target.value)}
          ref={passwordInputRef}
        /> */}
        {/* <Button>Zaloguj</Button> */}
        <Button onClick={handleLogin}>Log In</Button>
        {/* <Button onClick={handleSignup}>Sign Up</Button>
        <Button onClick={handleLogout}>Log Out</Button> */}
      </StyledForm>
      {/* {error && <p style={{ color: "red" }}>{error}</p>} */}
    </>
  );
};

export default LogForm;

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

// const LogForm = () => {
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

// export default LogForm;
