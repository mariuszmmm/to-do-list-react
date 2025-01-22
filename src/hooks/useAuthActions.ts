import { useAppDispatch, useAppSelector } from "../hooks";
import { AccountState } from "../types";
import { confirmUserApi, deleteUserApi } from "../utils/fetchApi";
import { auth } from "../utils/auth";
import {
  fetchSuccess,
  loading,
  fetchError,
  selectFetchStatus,
  setAccountMode,
  setMessage,
  setLoggedUser,
} from "../features/AccountPage/accountSlice";

interface AuthActionsProps {
  email?: string;
  password?: string;
  setPassword?: (value: string) => void;
  isWaitingForConfirmation?: boolean;
  setIsWaitingForConfirmation?: (value: boolean) => void;
  message?: AccountState["message"];
  passwordInputRef?: React.RefObject<HTMLInputElement | null>;
}

//  Wprowadzić poprawki  //
export const useAuthActions = ({
  email,
  password,
  message,
  isWaitingForConfirmation,
  setIsWaitingForConfirmation,
}: AuthActionsProps) => {
  const dispatch = useAppDispatch();
  const fetchStatus = useAppSelector(selectFetchStatus);
  const user = auth.currentUser();

  const register = async () => {
    if (!email || !password || !setIsWaitingForConfirmation) return;
    try {
      dispatch(loading());
      const response = await auth.signup(email, password);
      console.log("register response", response);
      dispatch(setAccountMode("sendRegisterEmail"));
      console.log("isWaitingForConfirmation", isWaitingForConfirmation);
      if (!isWaitingForConfirmation) setIsWaitingForConfirmation(true);
    } catch (error: any) {
      dispatch(fetchError());
      switch (error.status) {
        case undefined:
          dispatch(
            setMessage({
              text: "Brak połączenia z internetem",
              type: "warning",
            })
          );
          break;
        case "Unable to validate email address: invalid format":
          dispatch(
            setMessage({ text: "Wpisz poprawny adres e-mail", type: "warning" })
          );
          break;
        case 422:
          dispatch(
            setMessage({
              text: "Nie można zweryfikować adresu e-mail: nieprawidłowy format.",
              type: "warning",
            })
          );
          break;
        case 400:
          dispatch(
            setMessage({
              text: "Użytkownik z tym adresem e-mail jest już zarejestrowany.",
              type: "warning",
            })
          );
          break;
        default:
          dispatch(setMessage({ text: "Błąd rejestracji", type: "warning" }));
          break;
      }
      return;
    }
  };

  const waitingForConfirmation = () => {
    if (!email || !setIsWaitingForConfirmation) return;

    const interval = setInterval(async () => {
      try {
        const confirmationResponse = await confirmUserApi(email);
        const confirmedEmail = confirmationResponse?.email;

        console.log("confirmationResponse", confirmationResponse);

        if (confirmedEmail) {
          clearTimeout(timeout);
          clearInterval(interval);
          if (message) dispatch(setMessage());
          setIsWaitingForConfirmation(false);
          await login();
        }
      } catch (error) {
        console.error("error", error);
      }
    }, 2000);

    const timeout = setTimeout(() => {
      dispatch(setAccountMode("login"));
      if (message) dispatch(setMessage());
      setIsWaitingForConfirmation(false);
      dispatch(fetchError());
      clearInterval(interval);
    }, 60000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  };

  const login = async () => {
    console.log("login email", email);
    if (!email || !password) return;
    try {
      if (fetchStatus !== "loading") dispatch(loading());
      const response = await auth.login(email, password, true);
      dispatch(setLoggedUser(response.email));
      dispatch(setAccountMode("logged"));
      dispatch(fetchSuccess());
    } catch (error: any) {
      dispatch(fetchError());
      switch (error.status) {
        case undefined:
          dispatch(
            setMessage({
              text: "Brak połączenia z internetem.",
              type: "warning",
            })
          );
          break;
        case 400:
          dispatch(
            setMessage({
              text: "Nie znaleziono użytkownika z tym adresem e-mail lub hasło jest nieprawidłowe.",
              type: "warning",
            })
          );
          break;
        default:
          dispatch(setMessage({ text: "Błąd logowania", type: "warning" }));
          break;
      }
    }
  };

  const logout = async () => {
    try {
      dispatch(loading());
      if (!user) throw new Error("Brak użytkownika");
      await user.logout();
      dispatch(setLoggedUser(null));
      dispatch(setAccountMode("login"));
      dispatch(fetchSuccess());
    } catch (error) {
      dispatch(setMessage({ text: "Błąd wylogowania", type: "warning" }));
      dispatch(fetchError());
    }
  };

  const accountRecovery = async () => {
    if (!email) return;
    try {
      dispatch(loading());
      const response = await auth.requestPasswordRecovery(email);
      console.log("accountRecovery response", response);
      dispatch(setAccountMode("sendRecoveryEmail"));
      dispatch(fetchSuccess());
    } catch (error: any) {
      dispatch(fetchError());

      switch (error.status) {
        case undefined:
          dispatch(
            setMessage({
              text: "Brak połączenia z internetem.",
              type: "warning",
            })
          );
          break;
        case 404:
          dispatch(
            setMessage({
              text: "Nie znaleziono użytkownika z tym adresem e-mail.",
              type: "warning",
            })
          );
          break;
        default:
          dispatch(
            setMessage({ text: "Błąd odzyskiwania hasła", type: "warning" })
          );
          break;
      }
    }
  };

  const changePassword = async () => {
    try {
      dispatch(loading());
      if (!password || !user) throw new Error("Brak hasła lub użytkownika");
      const response = await user.update({ password });
      console.log("changePassword response", response);
      dispatch(fetchSuccess());
    } catch (error: any) {
      dispatch(fetchError());
      console.error("error", error);
    }
  };

  const deleteUser = async () => {
    try {
      dispatch(loading());
      if (!user) throw new Error("Brak użytkownika");
      const response = await deleteUserApi(user.token.access_token);
      console.log("deleteUser response", response);
      if (response.statusCode !== 204) throw new Error();
      dispatch(setLoggedUser(null));
      dispatch(fetchSuccess());
    } catch (error) {
      console.error("error", error);
      dispatch(fetchError());
    }
  };

  return {
    register,
    waitingForConfirmation,
    login,
    logout,
    accountRecovery,
    changePassword,
    deleteUser,
  };
};
