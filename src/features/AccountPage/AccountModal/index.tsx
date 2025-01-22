import { useAppDispatch, useAppSelector } from "../../../hooks";
import { useAuthActions } from "../../../hooks/useAuthActions";
import { Modal } from "../../../common/Modal";
import {
  fetchSuccess,
  selectAccountMode,
  selectFetchStatus,
  selectLoggedUser,
  setAccountMode,
} from "../accountSlice";

export const AccountModal = () => {
  const fetchStatus = useAppSelector(selectFetchStatus);
  const accountMode = useAppSelector(selectAccountMode);
  const userLogged = useAppSelector(selectLoggedUser);
  const dispatch = useAppDispatch();
  const { deleteUser } = useAuthActions({});

  return (
    <>
      {accountMode === "deleteUser" && (
        <Modal
          title="Usuwanie konta"
          description={
            fetchStatus === "loading"
              ? "Trwa usuwanie konta..."
              : fetchStatus === "error"
              ? "Błąd podczas usuwania konta."
              : !userLogged
              ? "Konto zostało usunięte."
              : "Czy na pewno chcesz usunąć swoje konto?"
          }
          status={
            fetchStatus === "loading"
              ? "loading"
              : fetchStatus === "error"
              ? "warning"
              : userLogged
              ? "warning"
              : "check"
          }
          remove={
            !!userLogged && fetchStatus !== "error"
              ? () => deleteUser()
              : undefined
          }
          cancel={
            !!userLogged && fetchStatus !== "error"
              ? () => dispatch(setAccountMode("logged"))
              : undefined
          }
          close={
            !userLogged
              ? () => dispatch(setAccountMode("login"))
              : fetchStatus === "error"
              ? () => {
                  dispatch(setAccountMode("logged"));
                  dispatch(fetchSuccess());
                }
              : undefined
          }
          disabledButtons={fetchStatus === "loading"}
        />
      )}

      {accountMode === "savePassword" && (
        <Modal
          title="Zmiana hasła"
          description={
            fetchStatus === "loading"
              ? "Trwa zmiana hasła..."
              : fetchStatus === "error"
              ? "Błąd podczas zmiany hasła."
              : " Nowe hasło zostało zapisane."
          }
          status={
            fetchStatus === "loading"
              ? "loading"
              : fetchStatus === "error"
              ? "warning"
              : "check"
          }
          close={() => dispatch(setAccountMode("logged"))}
          disabledButtons={fetchStatus === "loading"}
        />
      )}

      {accountMode === "sendRecoveryEmail" && (
        <Modal
          title="Odzyskiwanie konta"
          description="Na podany adres e-mail został wysłany link do zresetowania hasła."
          status="info"
          close={() => dispatch(setAccountMode("login"))}
        />
      )}

      {accountMode === "sendRegisterEmail" && (
        <Modal
          title="Rejestracja konta"
          description="Na podany adres e-mail został wysłany link do rejestracji konta."
          status="info"
          close={() => dispatch(setAccountMode("login"))}
        />
      )}
    </>
  );
};
