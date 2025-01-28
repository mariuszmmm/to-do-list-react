import Button from "../../../common/Button";
import ButtonsContainer from "../../../common/ButtonsContainer";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import {
  selectUser,
  selectAuthMode,
  setAuthMode,
  selectFetchStatus,
  setErrorMessage,
} from "../loginSlice";

const LoginButtons = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const authMode = useAppSelector(selectAuthMode);
  const fetchStatus = useAppSelector(selectFetchStatus);

  const handleRegister = () => {
    dispatch(setAuthMode("register"));
    dispatch(setErrorMessage(""));
  };
  const handleLogin = () => {
    dispatch(setAuthMode("login"));
    dispatch(setErrorMessage(""));
  };

  return (
    <>
      {!user && (
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
