import { useAppDispatch } from "./hooks";
import { auth } from "../utils/auth";
import { useFetch } from "./useFetch";
import {
  fetchSuccess,
  loading,
  setAuthMode,
  setErrorMessage,
  setLogged,
  setLogout,
  setUserData,
} from "../features/AccountPage/loginSlice";
import { fetchError } from "../features/tasks/tasksSlice";
import { User } from "gotrue-js";

export const useAuthActions = (
  email: string,
  password: string,
  setIsWaitingForConfirmation: (value: boolean) => void,
  errorMessage: string,
  user: User | null
) => {
  const { getUserDataApi, setUserApi } = useFetch();
  const dispatch = useAppDispatch();

  const register = async () => {
    try {
      const response = await auth.signup(email, password);
      console.log("register response", response);
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

  const waitingForConfirmation = () => {
    const interval = setInterval(async () => {
      try {
        const confirmationResponse = await setUserApi(email);
        const confirmedEmail = confirmationResponse?.email;

        console.log("confirmationResponse", confirmationResponse);

        if (confirmedEmail) {
          clearInterval(interval);
          if (errorMessage) dispatch(setErrorMessage(""));
          await login();
        }
      } catch (error) {
        console.error("error", error);
      }
    }, 3000);

    const timeout = setTimeout(() => {
      dispatch(setAuthMode("login"));
      if (errorMessage) dispatch(setErrorMessage(""));
      dispatch(fetchError());
      clearInterval(interval);
    }, 60000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
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
      const userData = await getUserData(token);
      console.log("userData", userData);
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

  return { register, waitingForConfirmation, login, logout };
};
