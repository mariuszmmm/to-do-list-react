import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux/redux";
import { useTranslation } from "react-i18next";
import { openModal } from "../../../Modal/modalSlice";
import {
  selectAccountMode,
  setAccountMode,
  selectLoggedUserEmail,
} from "../accountSlice";
import { ButtonsContainer } from "../../../common/ButtonsContainer";
import { Button } from "../../../common/Button";
import { getSavedAccounts } from "../../../utils/auth/multiAccount";

export const AccountActions = () => {
  const accountMode = useAppSelector(selectAccountMode);
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);
  const dispatch = useAppDispatch();
  const { t } = useTranslation("translation", {
    keyPrefix: "accountPage",
  });

  const [hasSavedAccounts, setHasSavedAccounts] = useState(false);

  useEffect(() => {
    setHasSavedAccounts(getSavedAccounts().length > 0);
  }, [loggedUserEmail]);

  const handleLogin = () => dispatch(setAccountMode("login"));
  const handleRegister = () => dispatch(setAccountMode("accountRegister"));
  const handleAccountDelete = () => {
    dispatch(setAccountMode("accountDelete"));
    dispatch(
      openModal({
        title: { key: "modal.accountDelete.title" },
        message: { key: "modal.accountDelete.message.confirm" },
        confirmButton: { key: "modal.buttons.deleteButton" },
        type: "confirm",
      }),
    );
  };
  const handlePasswordChange = () =>
    dispatch(
      setAccountMode(
        accountMode === "passwordChange" ? "logged" : "passwordChange",
      ),
    );
  const handleAccountSwitch = () =>
    dispatch(
      setAccountMode(
        accountMode === "accountSwitch"
          ? loggedUserEmail
            ? "logged"
            : "login"
          : "accountSwitch",
      ),
    );

  return (
    <ButtonsContainer>
      {!loggedUserEmail ? (
        <>
          {hasSavedAccounts && (
            <Button
              onClick={handleAccountSwitch}
              $selected={accountMode === "accountSwitch"}
            >
              {t("switcher.title")}
            </Button>
          )}
          <Button onClick={handleLogin} $selected={accountMode === "login"}>
            {t("buttons.login")}
          </Button>
          <Button
            onClick={handleRegister}
            $selected={accountMode === "accountRegister"}
          >
            {t("buttons.register")}
          </Button>
        </>
      ) : (
        <>
          <Button
            onClick={handleAccountSwitch}
            $selected={accountMode === "accountSwitch"}
          >
            {t("switcher.switchListTitle", "Przełącz konto")}
          </Button>
          <Button
            onClick={handlePasswordChange}
            $selected={accountMode === "passwordChange"}
          >
            {t("buttons.passwordChange")}
          </Button>
          <Button onClick={handleAccountDelete} $danger>
            {t("buttons.accountDelete")}
          </Button>
        </>
      )}
    </ButtonsContainer>
  );
};
