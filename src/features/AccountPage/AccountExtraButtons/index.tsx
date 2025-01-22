import { useAppDispatch, useAppSelector } from "../../../hooks";
import { ButtonsContainer } from "../../../common/ButtonsContainer";
import { Button } from "../../../common/Button";
import { Info } from "../../../common/Info";
import {
  selectAccountMode,
  selectFetchStatus,
  selectLoggedUser,
  selectMessage,
  setAccountMode,
} from "../accountSlice";

export const AccountExtraButtons = () => {
  const accountMode = useAppSelector(selectAccountMode);
  const fetchStatus = useAppSelector(selectFetchStatus);
  const message = useAppSelector(selectMessage);
  const loggedUser = useAppSelector(selectLoggedUser);
  const dispatch = useAppDispatch();

  return (
    <ButtonsContainer $extra>
      {!!loggedUser && accountMode === "changePassword" ? (
        <Button $special onClick={() => dispatch(setAccountMode("logged"))}>
          Anuluj
        </Button>
      ) : fetchStatus === "loading" ? (
        <Info $loading>Ładowanie...</Info>
      ) : !loggedUser &&
        (accountMode === "login" || accountMode === "accountRecovery") ? (
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
          {accountMode === "accountRecovery" ? "Anuluj" : "Zresetuj hasło"}
        </Button>
      ) : (
        !message && <Info />
      )}
      {!!message && (
        <Info $warning={message.type === "warning"}>{message.text}</Info>
      )}
    </ButtonsContainer>
  );
};
