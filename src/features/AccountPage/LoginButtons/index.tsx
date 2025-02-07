import Button from "../../../common/Button";
import ButtonsContainer from "../../../common/ButtonsContainer";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import {
  selectAuthMode,
  setAuthMode,
  selectFetchStatus,
  setErrorMessage,
  selectLogged,
  selectRecoverPassword,
  setRecoverPassword,
  selectErrorMessage,
} from "../loginSlice";

const LoginButtons = () => {
  const dispatch = useAppDispatch();
  const logged = useAppSelector(selectLogged);
  const recoverPassword = useAppSelector(selectRecoverPassword);
  const authMode = useAppSelector(selectAuthMode);
  const fetchStatus = useAppSelector(selectFetchStatus);
  const errorMessage = useAppSelector(selectErrorMessage);

  const handleRegister = () => {
    if (recoverPassword) dispatch(setRecoverPassword(false));
    dispatch(setAuthMode("register"));
    if (errorMessage) dispatch(setErrorMessage(""));
  };
  const handleLogin = () => {
    dispatch(setAuthMode("login"));
    if (errorMessage) dispatch(setErrorMessage(""));
  };

  return (
    <>
      {!logged && (
        <>
          <ButtonsContainer>
            <Button
              onClick={handleRegister}
              $selected={authMode === "register"}
              disabled={fetchStatus === "loading"}
            >
              Rejestracja
            </Button>
            <Button
              onClick={handleLogin}
              $selected={authMode === "login"}
              disabled={fetchStatus === "loading"}
            >
              Logowanie
            </Button>
          </ButtonsContainer>
        </>
      )}
    </>
  );
};

export default LoginButtons;
