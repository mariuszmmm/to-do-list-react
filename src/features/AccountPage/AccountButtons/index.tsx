import { useAppDispatch, useAppSelector } from "../../../hooks";
import { ButtonsContainer } from "../../../common/ButtonsContainer";
import { Button } from "../../../common/Button";
import {
  selectAccountMode,
  setAccountMode,
  selectFetchStatus,
  selectLoggedUser,
} from "../accountSlice";

export const AccountButtons = () => {
  const accountMode = useAppSelector(selectAccountMode);
  const fetchStatus = useAppSelector(selectFetchStatus);
  const userLogged = useAppSelector(selectLoggedUser);
  const dispatch = useAppDispatch();

  return (
    <ButtonsContainer>
      {!userLogged ? (
        <>
          <Button
            onClick={() => dispatch(setAccountMode("registerAccount"))}
            $selected={accountMode === "registerAccount"}
            disabled={
              fetchStatus === "loading" && accountMode !== "registerAccount"
            }
          >
            Rejestracja
          </Button>
          <Button
            onClick={() => dispatch(setAccountMode("login"))}
            $selected={accountMode === "login"}
            disabled={
              fetchStatus === "loading" && accountMode !== "registerAccount"
            }
          >
            Logowanie
          </Button>
        </>
      ) : (
        <>
          <Button
            onClick={() => dispatch(setAccountMode("deleteUser"))}
            disabled={fetchStatus === "loading"}
            $selected={accountMode === "deleteUser"}
          >
            Usuń konto
          </Button>
          <Button
            onClick={() => dispatch(setAccountMode("changePassword"))}
            disabled={fetchStatus === "loading"}
            $selected={accountMode === "changePassword"}
          >
            Zmień hasło
          </Button>
        </>
      )}
    </ButtonsContainer>
  );
};
