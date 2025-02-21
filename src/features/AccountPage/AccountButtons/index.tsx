import { useAppDispatch, useAppSelector } from "../../../hooks";
import { ButtonsContainer } from "../../../common/ButtonsContainer";
import { Button } from "../../../common/Button";
import {
  selectAccountMode,
  setAccountMode,
  selectLoggedUserEmail,
  deleteAccountRequest,
} from "../accountSlice";

export const AccountButtons = () => {
  const accountMode = useAppSelector(selectAccountMode);
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);
  const dispatch = useAppDispatch();

  return (
    <ButtonsContainer>
      {!loggedUserEmail ? (
        <>
          <Button
            onClick={() => dispatch(setAccountMode("registerAccount"))}
            $selected={accountMode === "registerAccount"}
          >
            Rejestracja
          </Button>
          <Button
            onClick={() => dispatch(setAccountMode("login"))}
            $selected={accountMode === "login"}
          >
            Logowanie
          </Button>
        </>
      ) : (
        <>
          <Button
            onClick={() => {
              dispatch(deleteAccountRequest());
              dispatch(setAccountMode("logged"));
            }}
          >
            Usuń konto
          </Button>
          <Button
            onClick={() => dispatch(setAccountMode("changePassword"))}
            $selected={accountMode === "changePassword"}
          >
            Zmień hasło
          </Button>
        </>
      )}
    </ButtonsContainer>
  );
};
