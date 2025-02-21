import { useAppDispatch, useAppSelector } from "../../../hooks";
import { ButtonsContainer } from "../../../common/ButtonsContainer";
import { Button } from "../../../common/Button";
import { Info } from "../../../common/Info";
import {
  selectAccountMode,
  selectLoggedUserEmail,
  selectMessage,
  setAccountMode,
} from "../accountSlice";

export const AccountExtraButtons = () => {
  const accountMode = useAppSelector(selectAccountMode);
  const message = useAppSelector(selectMessage);
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);
  const dispatch = useAppDispatch();

  return (
    <ButtonsContainer $extra>
      {!loggedUserEmail
        ? (accountMode === "login" || accountMode === "accountRecovery") && (
            <Button
              $special
              onClick={() =>
                dispatch(
                  setAccountMode(
                    accountMode === "login" ? "accountRecovery" : "login"
                  )
                )
              }
            >
              {accountMode === "login" ? "Zresetuj hasło" : "Anuluj"}
            </Button>
          )
        : accountMode === "changePassword" && (
            <Button $special onClick={() => dispatch(setAccountMode("logged"))}>
              Anuluj
            </Button>
          )}

      {!!message && <Info $warning>{message}</Info>}
    </ButtonsContainer>
  );
};
